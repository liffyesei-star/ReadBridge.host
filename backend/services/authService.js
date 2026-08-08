const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'readbridge_jwt_secret_key_production_2026';

const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class AuthService {
  async generateUniqueUserData(nama) {
    let baseName = (nama || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!baseName) baseName = 'user';

    let hash = 0;
    for (let i = 0; i < baseName.length; i++) {
      hash = baseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash).toString().padStart(6, '0').substring(0, 6);
    const rb_id = `RB-${absHash}`;

    let finalUsername = '@' + baseName;
    let check = await userRepository.findByUsername(finalUsername);
    let counter = 1;
    while (check) {
      finalUsername = '@' + baseName + counter;
      check = await userRepository.findByUsername(finalUsername);
      counter++;
    }
    return { username: finalUsername, rb_id };
  }

  async register({ nama, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email sudah terdaftar');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { username, rb_id } = await this.generateUniqueUserData(nama);

    const insertId = await userRepository.createUser({
      nama,
      email,
      password: hashedPassword,
      username,
      rb_id
    });

    const token = jwt.sign({ id: insertId, email }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: { id: insertId, nama, email, username, rb_id }
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Email atau password salah');
    if (!user.password) throw new Error('Akun ini menggunakan login Google');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email atau password salah');

    await userRepository.updateLastLogin(user.id);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        poin: user.poin,
        level: user.level,
        username: user.username,
        rb_id: user.rb_id
      }
    };
  }

  async syncGoogle(firebaseUser) {
    let user = await userRepository.findByEmail(firebaseUser.email);
    let isNewUser = false;

    if (!user) {
      const { username, rb_id } = await this.generateUniqueUserData(firebaseUser.name);
      const insertId = await userRepository.createUser({
        nama: firebaseUser.name || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        password: null, // No local password
        username,
        rb_id,
        photo_url: firebaseUser.picture || null
      });
      user = await userRepository.findByEmail(firebaseUser.email);
      isNewUser = true;
    } else {
      await userRepository.updateLastLogin(user.id);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user, isNewUser };
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // Security: do not reveal if email exists

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.saveResetToken(user.id, hashedToken, expiresAt);

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Kata Sandi ReadBridge',
      html: `<p>Klik tautan ini untuk reset password: <a href="${resetLink}">Reset</a></p>`
    };

    emailTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("\\n❌ [ERROR] Gagal mengirim email reset password.");
        console.log("🔑 [DEV MODE] URL RESET:", resetLink);
      }
    });
    // Selalu log di console untuk dev
    console.log("\\n=======================================================");
    console.log("🔑 URL RESET PASSWORD UNTUK: " + email);
    console.log(resetLink);
    console.log("=======================================================\\n");
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByValidResetToken(hashedToken);
    
    if (!user) throw new Error("Token tidak valid atau sudah kedaluwarsa.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userRepository.updatePassword(user.id, hashedPassword);
  }
}

module.exports = new AuthService();

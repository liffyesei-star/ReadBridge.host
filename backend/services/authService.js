const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'readbridge_jwt_secret_key_production_2026';

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
      rb_id,
      foto_profil: null
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
    if (!user.password) throw new Error('Password belum diset, akun ini sebelumnya menggunakan Google Login.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email atau password salah');

    if(userRepository.updateLastLogin) {
        try { await userRepository.updateLastLogin(user.id); } catch(e) {}
    }
    
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
}

module.exports = new AuthService();

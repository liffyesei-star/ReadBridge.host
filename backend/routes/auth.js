/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const admin = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { addNotification } = require("../utils/notification");

async function generateUniqueUserData(nama) {
  let baseName = (nama || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!baseName) baseName = 'user';

  // Generate RB-ID
  let hash = 0;
  for (let i = 0; i < baseName.length; i++) {
    hash = baseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash).toString().padStart(6, '0').substring(0, 6);
  const rb_id = `RB-${absHash}`;

  // Generate Unique Username
  let finalUsername = '@' + baseName;
  let [check] = await db.execute("SELECT id FROM users WHERE username = ?", [finalUsername]);
  let counter = 1;
  while (check.length > 0) {
    finalUsername = '@' + baseName + counter;
    [check] = await db.execute("SELECT id FROM users WHERE username = ?", [finalUsername]);
    counter++;
  }
  return { username: finalUsername, rb_id };
}

const JWT_SECRET = process.env.JWT_SECRET || 'readbridge_jwt_secret_key_production_2026';
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET environment variable is not set. Using default secret.");
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Terlalu banyak percobaan login." },
});

// Email transporter configuration (menggunakan environment variables)
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Rate limiter khusus untuk forgot-password (lebih ketat)
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3,
  message: { success: false, message: "Terlalu banyak percobaan reset password. Coba lagi 1 jam lagi." },
});

/**
 * POST /api/auth/register
 * Registrasi user baru secara lokal
 */
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password) {
      return res.status(400).json({ success: false, message: "Semua field harus diisi" });
    }

    // Security: Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Format email tidak valid" });
    }

    // Security: Validasi kekuatan password
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password minimal 8 karakter" });
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: "Password harus mengandung huruf dan angka" });
    }

    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { username, rb_id } = await generateUniqueUserData(nama);

    const [result] = await db.execute(
      `INSERT INTO users (nama, email, password, role, poin, level, username, rb_id)
       VALUES (?, ?, ?, 'user', 0, 'Pembaca Pemula', ?, ?)`,
      [nama, email, hashedPassword, username, rb_id]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      token,
      data: { id: result.insertId, nama, email, username, rb_id }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Gagal registrasi akun" });
  }
});

/**
 * POST /api/auth/login
 * Login user secara lokal
 */
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password harus diisi" });
    }

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const user = users[0];
    if (!user.password) {
      return res.status(401).json({ success: false, message: "Akun ini menggunakan login Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    let finalUsername = user.username;
    let finalRbId = user.rb_id;

    // Backward compatibility for old users
    if (!finalUsername || !finalRbId) {
      const generated = await generateUniqueUserData(user.nama);
      finalUsername = generated.username;
      finalRbId = generated.rb_id;
      await db.execute("UPDATE users SET username = ?, rb_id = ? WHERE id = ?", [finalUsername, finalRbId, user.id]);
    }

    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      data: { id: user.id, nama: user.nama, email: user.email, role: user.role, username: finalUsername, rb_id: finalRbId }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Gagal login" });
  }
});

/**
 * POST /api/auth/sync
 * Sinkronisasi akun Firebase Google ke database MySQL
 */
router.post("/sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decoded;
    const nama = name || email?.split("@")[0] || "User";

    if (!email) {
      return res.status(400).json({ success: false, message: "Email Google tidak ditemukan" });
    }

    // Cek apakah user sudah ada, baik dari login Google sebelumnya
    // maupun akun lokal lama dengan email yang sama.
    const [existing] = await db.execute(
      "SELECT id, firebase_uid, nama, email, foto_profil, username, rb_id FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1",
      [uid, email]
    );

    if (existing.length > 0) {
      const user = existing[0];

      if (user.firebase_uid && user.firebase_uid !== uid) {
        return res.status(409).json({
          success: false,
          message: "Email sudah terhubung dengan akun Google lain",
        });
      }

      // Update last login & foto jika berubah
      await db.execute(
        `UPDATE users
         SET firebase_uid = COALESCE(firebase_uid, ?),
             foto_profil = COALESCE(foto_profil, ?),
             updated_at = NOW()
         WHERE id = ?`,
        [uid, picture || null, user.id]
      );
      let finalUsername = user.username;
      let finalRbId = user.rb_id;

      if (!finalUsername || !finalRbId) {
         const generated = await generateUniqueUserData(user.nama);
         finalUsername = generated.username;
         finalRbId = generated.rb_id;
         await db.execute("UPDATE users SET username = ?, rb_id = ? WHERE id = ?", [finalUsername, finalRbId, user.id]);
      }

      return res.json({
        success: true,
        message: "Login berhasil",
        data: { ...user, email, firebase_uid: uid, username: finalUsername, rb_id: finalRbId },
      });
    }

    // Buat user baru
    const { username, rb_id } = await generateUniqueUserData(nama);
    const [result] = await db.execute(
      `INSERT INTO users (firebase_uid, nama, email, foto_profil, role, poin, level, username, rb_id)
       VALUES (?, ?, ?, ?, 'user', 0, 'Pembaca Pemula', ?, ?)`,
      [uid, nama, email, picture || null, username, rb_id]
    );

    // Kirim notifikasi selamat datang
    await db.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan) VALUES (?, 'sistem', ?, ?)`,
      [result.insertId, "Selamat Datang di ReadBridge! 📚", `Halo ${nama}, mulai jelajahi ribuan buku dan jurnal pilihan.`]
    );

    return res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat",
      data: { id: result.insertId, firebase_uid: uid, nama, email, username, rb_id },
    });
  } catch (error) {
    console.error("Auth sync error:", error);
    return res.status(500).json({ success: false, message: "Gagal sinkronisasi akun" });
  }
});

/**
 * GET /api/auth/me
 * Mengambil data user yang sedang login
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, rb_id, firebase_uid, nama, username, email, foto_profil, bio, role, poin, level, minat, created_at, last_name_change
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data user" });
  }
});

/**
 * POST /api/auth/logout
 * Revoke refresh token Firebase (opsional - untuk keamanan ekstra)
 */
router.post("/logout", verifyToken, async (req, res) => {
  try {
    if (req.firebaseUser && req.firebaseUser.uid) {
      await admin.auth().revokeRefreshTokens(req.firebaseUser.uid);
    }
    res.json({ success: true, message: "Logout berhasil" });
  } catch (error) {
    // Tidak perlu error jika revoke gagal, frontend tetap hapus token lokal
    res.json({ success: true, message: "Logout berhasil" });
  }
});

/**
 * POST /api/auth/forgot-password
 * Kirim link reset password ke email yang terdaftar di MySQL
 */
router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email harus diisi" });
    }

    // Cek apakah email terdaftar di database MySQL
    const [users] = await db.execute(
      "SELECT id, nama, email FROM users WHERE email = ? AND password IS NOT NULL LIMIT 1",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // Security: Jangan ungkapkan apakah email terdaftar atau tidak
      return res.json({ success: true, message: "Jika email terdaftar, tautan reset password akan dikirim. Periksa kotak masuk Anda." });
    }

    const user = users[0];

    // Generate reset token (random 32 byte hex)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Token expired dalam 1 jam
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Simpan token ke database
    await db.execute(
      "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?",
      [hashedToken, expiresAt, user.id]
    );

    // Kirim email dengan link reset
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Kata Sandi ReadBridge - Tautan berlaku 1 jam',
      html: `
        <h2>Halo ${user.nama},</h2>
        <p>Anda telah meminta untuk mengatur ulang kata sandi akun ReadBridge Anda.</p>
        <p>Klik tombol di bawah untuk mengatur ulang kata sandi Anda:</p>
        <p>
          <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
            Atur Ulang Kata Sandi
          </a>
        </p>
        <p>Atau salin tautan ini ke browser: <br/> ${resetLink}</p>
        <p><strong>⏰ Tautan ini hanya berlaku selama 1 jam.</strong></p>
        <p style="color: #666; font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda aman.</p>
        <hr/>
        <p style="color: #999; font-size: 12px;">© 2024 ReadBridge. Semua hak dilindungi.</p>
      `
    };

    // Kirim email (async, jangan tunggu)
    emailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email send error:", err);
      } else {
        console.log("Reset password email sent to:", email);
      }
    });

    return res.json({
      success: true,
      message: "Jika email terdaftar, tautan reset password akan dikirim. Periksa kotak masuk Anda."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Gagal memproses permintaan reset password" });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password menggunakan token yang dikirim via email
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token dan password baru harus diisi" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });
    }

    // Hash token untuk mencari di database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Cari user dengan token yang belum expired
    const [users] = await db.execute(
      `SELECT id, firebase_uid, email FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expires > NOW()
       LIMIT 1`,
      [hashedToken]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Token tidak valid atau sudah expired. Coba request reset password lagi." 
      });
    }

    const user = users[0];

    // Hash password baru untuk MySQL database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password dan clear token di MySQL database
    await db.execute(
      `UPDATE users 
       SET password = ?, 
           reset_password_token = NULL, 
           reset_password_expires = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    // Synchronize password ke Firebase jika akun terhubung via Firebase/Google
    if (user.firebase_uid) {
      try {
        await admin.auth().updateUser(user.firebase_uid, { password: newPassword });
      } catch (fbErr) {
        console.warn("Firebase password sync notice:", fbErr.message);
      }
    }

    // Trigger Notifikasi Keamanan Sistem
    await addNotification(
      user.id,
      'sistem',
      'Kata Sandi Berhasil Diperbarui 🔒',
      'Kata sandi akun ReadBridge Anda berhasil diatur ulang. Jika ini bukan Anda, segera hubungi bantuan.',
      'pengaturan.html'
    );

    // Opsional: Kirim email konfirmasi bahwa password sudah direset
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Kata Sandi ReadBridge Berhasil Diatur Ulang',
      html: `
        <h2>Halo,</h2>
        <p>Kata sandi akun ReadBridge Anda berhasil diatur ulang.</p>
        <p>Anda sekarang dapat login menggunakan kata sandi baru Anda.</p>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login.html" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
          Login ke ReadBridge
        </a></p>
        <p style="color: #999; font-size: 12px;">© 2024 ReadBridge. Semua hak dilindungi.</p>
      `
    };

    emailTransporter.sendMail(mailOptions, (err) => {
      if (err) console.error("Confirmation email error:", err);
    });

    return res.json({
      success: true,
      message: "Kata sandi berhasil diatur ulang. Silakan login dengan kata sandi baru Anda."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengatur ulang kata sandi" });
  }
});

module.exports = router;

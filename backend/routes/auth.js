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

    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      `INSERT INTO users (nama, email, password, role, poin, level)
       VALUES (?, ?, ?, 'user', 0, 'Pembaca Pemula')`,
      [nama, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET || 'readbridge_secret_key', { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      token,
      data: { id: result.insertId, nama, email }
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

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Email tidak ditemukan" });
    }

    const user = users[0];
    if (!user.password) {
      return res.status(401).json({ success: false, message: "Gunakan fitur login dengan Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password salah" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'readbridge_secret_key', { expiresIn: '7d' });

    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      data: { id: user.id, nama: user.nama, email: user.email, role: user.role }
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
      "SELECT id, firebase_uid, nama, email, foto_profil FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1",
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
      return res.json({
        success: true,
        message: "Login berhasil",
        data: { ...user, email, firebase_uid: uid },
      });
    }

    // Buat user baru
    const [result] = await db.execute(
      `INSERT INTO users (firebase_uid, nama, email, foto_profil, role, poin, level)
       VALUES (?, ?, ?, ?, 'user', 0, 'Pembaca Pemula')`,
      [uid, nama, email, picture || null]
    );

    // Kirim notifikasi selamat datang
    await db.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan) VALUES (?, 'sistem', ?, ?)`,
      [result.insertId, "Selamat Datang di ReadBridge! 📚", `Halo ${nama}, mulai jelajahi ribuan buku dan jurnal pilihan.`]
    );

    return res.status(201).json({
      success: true,
      message: "Akun berhasil dibuat",
      data: { id: result.insertId, firebase_uid: uid, nama, email },
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
      `SELECT id, firebase_uid, nama, email, foto_profil, bio, role, poin, level, minat, created_at
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
      // Untuk keamanan, jangan beritahu apakah email terdaftar atau tidak
      // Tapi untuk testing, kita lihat saja
      return res.status(404).json({ success: false, message: "Email tidak terdaftar atau akun ini login via Google" });
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
      `SELECT id, email FROM users 
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

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password dan clear token
    await db.execute(
      `UPDATE users 
       SET password = ?, 
           reset_password_token = NULL, 
           reset_password_expires = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id]
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

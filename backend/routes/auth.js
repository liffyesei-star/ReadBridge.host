const express = require("express");
const router = express.Router();
const db = require("../config/db");
const admin = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * POST /api/auth/register
 * Registrasi user baru secara lokal
 */
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

    // Cek apakah user sudah ada
    const [existing] = await db.execute(
      "SELECT id, nama, foto_profil FROM users WHERE firebase_uid = ?",
      [uid]
    );

    if (existing.length > 0) {
      // Update last login & foto jika berubah
      await db.execute(
        "UPDATE users SET foto_profil = COALESCE(foto_profil, ?), updated_at = NOW() WHERE firebase_uid = ?",
        [picture || null, uid]
      );
      return res.json({
        success: true,
        message: "Login berhasil",
        data: { ...existing[0], email, firebase_uid: uid },
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
    await admin.auth().revokeRefreshTokens(req.firebaseUser.uid);
    res.json({ success: true, message: "Logout berhasil" });
  } catch (error) {
    // Tidak perlu error jika revoke gagal, frontend tetap hapus token lokal
    res.json({ success: true, message: "Logout berhasil" });
  }
});

module.exports = router;

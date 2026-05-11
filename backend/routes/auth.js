const express = require("express");
const router = express.Router();
const db = require("../config/db");
const admin = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

/**
 * POST /api/auth/sync
 * Dipanggil setelah login Firebase berhasil di frontend.
 * Membuat atau memperbarui data user di MySQL.
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

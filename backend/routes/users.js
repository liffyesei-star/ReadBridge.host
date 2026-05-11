const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// ============================================================
// PROFILE
// ============================================================

/**
 * PUT /api/users/profile
 * Update profil user
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { nama, bio, foto_profil, minat } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: "Nama tidak boleh kosong" });

    await db.execute(
      "UPDATE users SET nama = ?, bio = ?, foto_profil = ?, minat = ? WHERE id = ?",
      [nama, bio || null, foto_profil || null, minat ? JSON.stringify(minat) : null, req.user.id]
    );

    res.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal memperbarui profil" });
  }
});

/**
 * GET /api/users/perpustakaan
 * Buku koleksi user (yang dimiliki/disewa)
 */
router.get("/perpustakaan", verifyToken, async (req, res) => {
  try {
    const { status = "aktif", tipe } = req.query;

    let where = ["p.user_id = ?", "p.status = ?"];
    let params = [req.user.id, status];
    if (tipe) { where.push("p.tipe = ?"); params.push(tipe); }

    const [rows] = await db.execute(
      `SELECT p.id, p.tipe, p.status, p.tanggal_mulai, p.tanggal_expired, p.progress_halaman, p.selesai,
              b.id AS buku_id, b.judul, b.penulis_nama, b.cover_url, b.halaman, b.rating,
              k.nama AS kategori
       FROM perpustakaan p
       JOIN buku b ON p.buku_id = b.id
       LEFT JOIN kategori k ON b.kategori_id = k.id
       WHERE ${where.join(" AND ")}
       ORDER BY p.created_at DESC`,
      params
    );

    // Hitung persentase progress
    const data = rows.map(r => ({
      ...r,
      progress_persen: r.halaman > 0 ? Math.round((r.progress_halaman / r.halaman) * 100) : 0,
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil perpustakaan" });
  }
});

/**
 * GET /api/users/wishlist
 */
router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.id, b.judul, b.penulis_nama, b.cover_url, b.harga_beli, b.harga_sewa, b.rating,
              k.nama AS kategori, w.created_at AS ditambahkan
       FROM wishlist w
       JOIN buku b ON w.buku_id = b.id
       LEFT JOIN kategori k ON b.kategori_id = k.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil wishlist" });
  }
});

/**
 * GET /api/users/poin-history
 */
router.get("/poin-history", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM poin_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil riwayat poin" });
  }
});

/**
 * PUT /api/users/level
 * Update level berdasarkan poin (dipanggil otomatis atau manual)
 */
router.put("/level", verifyToken, async (req, res) => {
  try {
    const [[user]] = await db.execute("SELECT poin FROM users WHERE id = ?", [req.user.id]);
    const poin = user.poin;

    let level = "Pembaca Pemula";
    if (poin >= 5000) level = "Maestro Literasi";
    else if (poin >= 2000) level = "Penjelajah Buku";
    else if (poin >= 500) level = "Pembaca Aktif";
    else if (poin >= 100) level = "Kutu Buku";

    await db.execute("UPDATE users SET level = ? WHERE id = ?", [level, req.user.id]);
    res.json({ success: true, data: { poin, level } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update level" });
  }
});

// ============================================================
// LEADERBOARD
// ============================================================

/**
 * GET /api/users/leaderboard
 * ?periode=semua|bulan|minggu&limit=10
 */
router.get("/leaderboard", async (req, res) => {
  try {
    const { periode = "semua", limit = 10 } = req.query;

    let dateFilter = "";
    if (periode === "bulan") dateFilter = "WHERE ph.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
    else if (periode === "minggu") dateFilter = "WHERE ph.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";

    let query;
    if (periode === "semua") {
      query = `SELECT u.id, u.nama, u.foto_profil, u.poin, u.level,
                      (SELECT COUNT(*) FROM perpustakaan WHERE user_id = u.id AND selesai = 1) AS buku_selesai,
                      (SELECT COUNT(*) FROM diskusi WHERE user_id = u.id) AS total_diskusi
               FROM users u
               WHERE u.aktif = 1
               ORDER BY u.poin DESC
               LIMIT ?`;
    } else {
      query = `SELECT u.id, u.nama, u.foto_profil, u.level,
                      SUM(ph.poin) AS poin_periode,
                      u.poin AS total_poin
               FROM users u
               JOIN poin_history ph ON ph.user_id = u.id
               ${dateFilter}
               GROUP BY u.id
               ORDER BY poin_periode DESC
               LIMIT ?`;
    }

    const [rows] = await db.execute(query, [parseInt(limit)]);
    const data = rows.map((r, i) => ({ ...r, rank: i + 1 }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil leaderboard" });
  }
});

// ============================================================
// NOTIFIKASI
// ============================================================

/**
 * GET /api/users/notifikasi
 */
router.get("/notifikasi", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [rows] = await db.execute(
      "SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [req.user.id, parseInt(limit), offset]
    );

    const [[{ belum_dibaca }]] = await db.execute(
      "SELECT COUNT(*) AS belum_dibaca FROM notifikasi WHERE user_id = ? AND sudah_dibaca = 0",
      [req.user.id]
    );

    res.json({ success: true, data: rows, belum_dibaca });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil notifikasi" });
  }
});

/**
 * PUT /api/users/notifikasi/baca-semua
 */
router.put("/notifikasi/baca-semua", verifyToken, async (req, res) => {
  try {
    await db.execute(
      "UPDATE notifikasi SET sudah_dibaca = 1 WHERE user_id = ?",
      [req.user.id]
    );
    res.json({ success: true, message: "Semua notifikasi ditandai dibaca" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update notifikasi" });
  }
});

/**
 * PUT /api/users/notifikasi/:id/baca
 */
router.put("/notifikasi/:id/baca", verifyToken, async (req, res) => {
  try {
    await db.execute(
      "UPDATE notifikasi SET sudah_dibaca = 1 WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: "Notifikasi ditandai dibaca" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update notifikasi" });
  }
});

module.exports = router;

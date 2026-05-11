const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, optionalAuth } = require("../middleware/auth");

/**
 * GET /api/journals
 * ?search=&kategori=&access=open|exclusive&tahun=&sort=terbaru|terpopuler&page=1&limit=8
 */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { search, kategori, access, tahun, sort = "terbaru", page = 1, limit = 8 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["j.aktif = 1"];
    let params = [];

    if (search) {
      where.push("(j.judul LIKE ? OR j.penulis_nama LIKE ? OR j.universitas LIKE ? OR j.abstrak LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (kategori) { where.push("j.kategori = ?"); params.push(kategori); }
    if (access) { where.push("j.akses = ?"); params.push(access); }
    if (tahun) {
      const [tahunAwal, tahunAkhir] = tahun.split("-").map(Number);
      if (tahunAkhir) { where.push("j.tahun_terbit BETWEEN ? AND ?"); params.push(tahunAwal, tahunAkhir); }
      else { where.push("j.tahun_terbit = ?"); params.push(tahunAwal); }
    }

    const orderMap = { terbaru: "j.tahun_terbit DESC", terpopuler: "j.total_unduhan DESC", rating: "j.rating DESC" };
    const whereClause = `WHERE ${where.join(" AND ")}`;

    const [journals] = await db.execute(
      `SELECT j.id, j.judul, j.penulis_nama, j.universitas, j.tahun_terbit,
              j.total_unduhan, j.rating, j.total_ulasan, j.kategori, j.akses, j.abstrak
       FROM jurnal j ${whereClause}
       ORDER BY ${orderMap[sort] || "j.tahun_terbit DESC"}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM jurnal j ${whereClause}`, params
    );

    res.json({ success: true, data: journals, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data jurnal" });
  }
});

/**
 * GET /api/journals/:id
 * Detail jurnal lengkap
 */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM jurnal WHERE id = ? AND aktif = 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Jurnal tidak ditemukan" });

    // Increment view count
    await db.execute("UPDATE jurnal SET total_dilihat = total_dilihat + 1 WHERE id = ?", [req.params.id]);

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil detail jurnal" });
  }
});

/**
 * POST /api/journals/:id/unduh
 * Catat unduhan jurnal + tambah poin
 */
router.post("/:id/unduh", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, file_url, akses FROM jurnal WHERE id = ? AND aktif = 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Jurnal tidak ditemukan" });

    // Increment download count
    await db.execute("UPDATE jurnal SET total_unduhan = total_unduhan + 1 WHERE id = ?", [req.params.id]);

    // Tambah poin
    await db.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 5, 'Mengunduh jurnal', 'baca')",
      [req.user.id]
    );
    await db.execute("UPDATE users SET poin = poin + 5 WHERE id = ?", [req.user.id]);

    res.json({ success: true, message: "Unduhan dicatat. +5 poin!", data: { file_url: rows[0].file_url } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mencatat unduhan" });
  }
});

module.exports = router;

/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Role: Lead Developer
*/
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");

/**
 * GET /api/toko
 * Cek apakah user memiliki toko dan dapatkan detailnya
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const [toko] = await db.execute("SELECT * FROM toko WHERE user_id = ?", [req.user.id]);
    if (!toko.length) {
      return res.json({ success: true, has_toko: false });
    }
    res.json({ success: true, has_toko: true, data: toko[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data toko" });
  }
});

/**
 * POST /api/toko
 * Daftarkan toko/akun seller baru
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { nama_toko, deskripsi, lokasi, foto_toko, no_wa } = req.body;
    if (!nama_toko || !lokasi) {
      return res.status(400).json({ success: false, message: "Nama toko dan lokasi wajib diisi" });
    }

    // Cek apakah user sudah punya toko
    const [existing] = await db.execute("SELECT id FROM toko WHERE user_id = ?", [req.user.id]);
    if (existing.length) {
      return res.status(400).json({ success: false, message: "Anda sudah terdaftar sebagai seller (memiliki toko)" });
    }

    const [result] = await db.execute(
      "INSERT INTO toko (user_id, nama_toko, deskripsi, lokasi, no_wa, foto_toko) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, nama_toko, deskripsi || null, lokasi, no_wa || null, foto_toko || null]
    );

    res.status(201).json({
      success: true,
      message: "Toko berhasil dibuat! Selamat berjualan.",
      data: {
        id: result.insertId,
        user_id: req.user.id,
        nama_toko,
        deskripsi,
        lokasi,
        no_wa: no_wa || null,
        foto_toko
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat toko" });
  }
});

/**
 * PUT /api/toko
 * Update data toko & nomor WhatsApp
 */
router.put("/", verifyToken, async (req, res) => {
  try {
    const { nama_toko, deskripsi, lokasi, no_wa, foto_toko } = req.body;
    const [toko] = await db.execute("SELECT id FROM toko WHERE user_id = ?", [req.user.id]);
    if (!toko.length) {
      return res.status(404).json({ success: false, message: "Toko tidak ditemukan. Silakan buat toko terlebih dahulu." });
    }

    await db.execute(
      `UPDATE toko SET 
        nama_toko = COALESCE(?, nama_toko),
        deskripsi = COALESCE(?, deskripsi),
        lokasi = COALESCE(?, lokasi),
        no_wa = ?,
        foto_toko = COALESCE(?, foto_toko),
        updated_at = NOW()
       WHERE id = ?`,
      [
        nama_toko || null,
        deskripsi !== undefined ? deskripsi : null,
        lokasi || null,
        no_wa !== undefined ? (no_wa || null) : null,
        foto_toko || null,
        toko[0].id
      ]
    );

    const [updated] = await db.execute("SELECT * FROM toko WHERE id = ?", [toko[0].id]);
    res.json({
      success: true,
      message: "Data toko dan WhatsApp berhasil diperbarui",
      data: updated[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui toko" });
  }
});

/**
 * GET /api/toko/books
 * Dapatkan semua buku milik toko user saat ini
 */
router.get("/books", verifyToken, async (req, res) => {
  try {
    const [toko] = await db.execute("SELECT id FROM toko WHERE user_id = ?", [req.user.id]);
    if (!toko.length) {
      return res.status(404).json({ success: false, message: "Toko tidak ditemukan. Silakan buat toko terlebih dahulu." });
    }

    const [books] = await db.execute(
      `SELECT b.*, k.nama AS kategori, k.slug AS kategori_slug
       FROM buku b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       WHERE b.toko_id = ? AND b.aktif = 1
       ORDER BY b.created_at DESC`,
      [toko[0].id]
    );

    res.json({ success: true, data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil daftar buku toko" });
  }
});

module.exports = router;

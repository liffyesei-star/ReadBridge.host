const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

// Generate kode transaksi unik
function generateKodeTransaksi() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RB-${date}-${random}`;
}

/**
 * GET /api/transactions
 * Riwayat transaksi user
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["t.user_id = ?"];
    let params = [req.user.id];
    if (status) { where.push("t.status = ?"); params.push(status); }

    const [rows] = await db.execute(
      `SELECT t.id, t.kode_transaksi, t.tipe, t.harga, t.durasi_sewa_hari,
              t.status, t.metode_bayar, t.dibayar_at, t.created_at,
              b.judul AS buku_judul, b.cover_url AS buku_cover, b.penulis_nama
       FROM transaksi t
       JOIN buku b ON t.buku_id = b.id
       WHERE ${where.join(" AND ")}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil riwayat transaksi" });
  }
});

/**
 * GET /api/transactions/:kode
 * Detail transaksi (untuk invoice)
 */
router.get("/:kode", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.*, b.judul AS buku_judul, b.cover_url AS buku_cover, b.penulis_nama,
              u.nama AS nama_user, u.email AS email_user
       FROM transaksi t
       JOIN buku b ON t.buku_id = b.id
       JOIN users u ON t.user_id = u.id
       WHERE t.kode_transaksi = ? AND t.user_id = ?`,
      [req.params.kode, req.user.id]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil detail transaksi" });
  }
});

/**
 * POST /api/transactions/beli
 * Membeli buku (langsung bayar simulasi)
 */
router.post("/beli", verifyToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { buku_id, metode_bayar = "transfer" } = req.body;
    if (!buku_id) return res.status(400).json({ success: false, message: "buku_id wajib diisi" });

    // Cek buku
    const [[buku]] = await conn.execute(
      "SELECT id, judul, harga_beli, bisa_beli FROM buku WHERE id = ? AND aktif = 1",
      [buku_id]
    );
    if (!buku) return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    if (!buku.bisa_beli) return res.status(400).json({ success: false, message: "Buku ini tidak tersedia untuk dibeli" });

    // Cek sudah punya belum
    const [[sudahPunya]] = await conn.execute(
      "SELECT id FROM perpustakaan WHERE user_id = ? AND buku_id = ? AND tipe = 'beli'",
      [req.user.id, buku_id]
    );
    if (sudahPunya) return res.status(400).json({ success: false, message: "Anda sudah memiliki buku ini" });

    const kode = generateKodeTransaksi();

    // Buat transaksi
    const [trx] = await conn.execute(
      `INSERT INTO transaksi (kode_transaksi, user_id, buku_id, tipe, harga, status, metode_bayar, dibayar_at)
       VALUES (?, ?, ?, 'beli', ?, 'berhasil', ?, NOW())`,
      [kode, req.user.id, buku_id, buku.harga_beli, metode_bayar]
    );

    // Tambahkan ke perpustakaan
    await conn.execute(
      "INSERT INTO perpustakaan (user_id, buku_id, tipe, status, transaksi_id) VALUES (?, ?, 'beli', 'aktif', ?)",
      [req.user.id, buku_id, trx.insertId]
    );

    // Update total terjual
    await conn.execute("UPDATE buku SET total_terjual = total_terjual + 1 WHERE id = ?", [buku_id]);

    // Poin pembelian
    await conn.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 20, 'Pembelian buku', 'pembelian')",
      [req.user.id]
    );
    await conn.execute("UPDATE users SET poin = poin + 20 WHERE id = ?", [req.user.id]);

    // Notifikasi
    await conn.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan, link_url)
       VALUES (?, 'transaksi', 'Pembelian Berhasil!', ?, ?)`,
      [req.user.id, `"${buku.judul}" berhasil dibeli. +20 poin!`, `/invoice.html?kode=${kode}`]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Pembelian berhasil!",
      data: { kode_transaksi: kode, judul: buku.judul, harga: buku.harga_beli }
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memproses pembelian" });
  } finally {
    conn.release();
  }
});

/**
 * POST /api/transactions/sewa
 * Menyewa buku
 */
router.post("/sewa", verifyToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { buku_id, durasi = 30, metode_bayar = "transfer" } = req.body;
    if (!buku_id) return res.status(400).json({ success: false, message: "buku_id wajib diisi" });

    const [[buku]] = await conn.execute(
      "SELECT id, judul, harga_sewa, bisa_sewa FROM buku WHERE id = ? AND aktif = 1",
      [buku_id]
    );
    if (!buku) return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    if (!buku.bisa_sewa) return res.status(400).json({ success: false, message: "Buku ini tidak tersedia untuk disewa" });

    // Cek sewa aktif
    const [[sewaAktif]] = await conn.execute(
      "SELECT id, tanggal_expired FROM perpustakaan WHERE user_id = ? AND buku_id = ? AND tipe = 'sewa' AND status = 'aktif'",
      [req.user.id, buku_id]
    );
    if (sewaAktif) {
      return res.status(400).json({
        success: false,
        message: `Anda masih menyewa buku ini hingga ${new Date(sewaAktif.tanggal_expired).toLocaleDateString("id-ID")}`
      });
    }

    const durasiHari = parseInt(durasi);
    const hargaTotal = Math.ceil(buku.harga_sewa * (durasiHari / 30));
    const kode = generateKodeTransaksi();
    const tanggalExpired = new Date(Date.now() + durasiHari * 24 * 60 * 60 * 1000);

    const [trx] = await conn.execute(
      `INSERT INTO transaksi (kode_transaksi, user_id, buku_id, tipe, harga, durasi_sewa_hari, status, metode_bayar, dibayar_at)
       VALUES (?, ?, ?, 'sewa', ?, ?, 'berhasil', ?, NOW())`,
      [kode, req.user.id, buku_id, hargaTotal, durasiHari, metode_bayar]
    );

    await conn.execute(
      `INSERT INTO perpustakaan (user_id, buku_id, tipe, status, tanggal_expired, transaksi_id)
       VALUES (?, ?, 'sewa', 'aktif', ?, ?)
       ON DUPLICATE KEY UPDATE tipe='sewa', status='aktif', tanggal_expired=VALUES(tanggal_expired), transaksi_id=VALUES(transaksi_id)`,
      [req.user.id, buku_id, tanggalExpired, trx.insertId]
    );

    await conn.execute("UPDATE buku SET total_disewa = total_disewa + 1 WHERE id = ?", [buku_id]);

    await conn.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan, link_url)
       VALUES (?, 'transaksi', 'Sewa Buku Berhasil!', ?, ?)`,
      [
        req.user.id,
        `"${buku.judul}" disewa ${durasiHari} hari hingga ${tanggalExpired.toLocaleDateString("id-ID")}`,
        `/invoice.html?kode=${kode}`
      ]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Sewa buku berhasil!",
      data: { kode_transaksi: kode, judul: buku.judul, harga: hargaTotal, durasi_hari: durasiHari, expired: tanggalExpired }
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memproses sewa" });
  } finally {
    conn.release();
  }
});

module.exports = router;

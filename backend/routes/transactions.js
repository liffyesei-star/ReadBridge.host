/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const express = require("express");
const midtransClient = require("midtrans-client");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5500";

const snap = new midtransClient.Snap({
  isProduction: MIDTRANS_IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY || "MIDTRANS_SERVER_KEY_BELUM_DIISI",
  clientKey: MIDTRANS_CLIENT_KEY || "MIDTRANS_CLIENT_KEY_BELUM_DIISI",
});

// Generate kode transaksi unik
function generateKodeTransaksi() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RB-${date}-${random}`;
}

function requireMidtransConfig() {
  if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
    const err = new Error("Konfigurasi Midtrans belum lengkap. Isi MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY di .env");
    err.status = 500;
    throw err;
  }
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function toRupiahAmount(value) {
  const amount = Math.round(Number(value || 0));
  if (!Number.isFinite(amount) || amount < 1) {
    throw httpError(400, "Nominal pembayaran tidak valid");
  }
  return amount;
}

async function createMidtransPayment({ kode, hargaTotal, buku, user, ongkir = 0, asuransi = 0, diskon = 0, deposit = 0, tipe = 'beli', hargaSewaTotal = 0 }) {
  requireMidtransConfig();

  const totalAmount = toRupiahAmount(hargaTotal);
  
  // Base price for item details
  const item_details = [];
  if (tipe === 'sewa') {
    item_details.push({
      id: String(buku.id),
      price: toRupiahAmount(hargaSewaTotal),
      quantity: 1,
      name: `${buku.judul.slice(0, 40)} (Sewa)`,
    });
  } else {
    item_details.push({
      id: String(buku.id),
      price: toRupiahAmount(buku.harga_beli),
      quantity: 1,
      name: buku.judul.slice(0, 50),
    });
  }

  if (Number(ongkir) > 0) {
    item_details.push({
      id: 'SHIPPING',
      price: toRupiahAmount(ongkir),
      quantity: 1,
      name: 'Biaya Pengiriman',
    });
  }

  if (Number(asuransi) > 0) {
    item_details.push({
      id: 'INSURANCE',
      price: toRupiahAmount(asuransi),
      quantity: 1,
      name: 'Biaya Asuransi',
    });
  }

  if (Number(deposit) > 0) {
    item_details.push({
      id: 'DEPOSIT',
      price: toRupiahAmount(deposit),
      quantity: 1,
      name: 'Uang Jaminan (Deposit)',
    });
  }

  if (Number(diskon) > 0) {
    item_details.push({
      id: 'DISCOUNT',
      price: -toRupiahAmount(diskon),
      quantity: 1,
      name: 'Diskon Voucher',
    });
  }

  const parameter = {
    transaction_details: {
      order_id: kode,
      gross_amount: totalAmount,
    },
    item_details: item_details,
    customer_details: {
      first_name: user.nama,
      email: user.email,
    },
    callbacks: {
      finish: `${FRONTEND_URL}/invoice.html?kode=${kode}`,
    },
  };

  return snap.createTransaction(parameter);
}

function isSuccessfulMidtransStatus(transactionStatus, fraudStatus) {
  if (transactionStatus === "settlement") return true;
  return transactionStatus === "capture" && fraudStatus === "accept";
}

function mapMidtransStatus(transactionStatus, fraudStatus) {
  if (isSuccessfulMidtransStatus(transactionStatus, fraudStatus)) return "berhasil";
  if (["deny", "cancel", "expire", "failure"].includes(transactionStatus)) return "gagal";
  if (["refund", "partial_refund"].includes(transactionStatus)) return "refund";
  return "pending";
}

async function activatePaidTransaction(conn, transaksi) {
  if (transaksi.status === "berhasil") return;

  const tanggalExpired = transaksi.tipe === "sewa" && transaksi.durasi_sewa_hari
    ? new Date(Date.now() + Number(transaksi.durasi_sewa_hari) * 24 * 60 * 60 * 1000)
    : null;

  await conn.execute(
    "UPDATE transaksi SET status = 'berhasil', dibayar_at = NOW() WHERE id = ?",
    [transaksi.id]
  );

  if (transaksi.tipe === "beli") {
    await conn.execute(
      `INSERT INTO perpustakaan (user_id, buku_id, tipe, status, transaksi_id)
       VALUES (?, ?, 'beli', 'aktif', ?)
       ON DUPLICATE KEY UPDATE tipe = 'beli', status = 'aktif', tanggal_expired = NULL, transaksi_id = VALUES(transaksi_id)`,
      [transaksi.user_id, transaksi.buku_id, transaksi.id]
    );
    await conn.execute("UPDATE buku SET total_terjual = total_terjual + 1 WHERE id = ?", [transaksi.buku_id]);
    await conn.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 20, 'Pembelian buku', 'pembelian')",
      [transaksi.user_id]
    );
    await conn.execute("UPDATE users SET poin = poin + 20 WHERE id = ?", [transaksi.user_id]);
    await conn.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan, link_url)
       VALUES (?, 'transaksi', 'Pembelian Berhasil!', ?, ?)`,
      [transaksi.user_id, `"${transaksi.buku_judul}" berhasil dibeli. +20 poin!`, `/invoice.html?kode=${transaksi.kode_transaksi}`]
    );
    return;
  }

  await conn.execute(
    `INSERT INTO perpustakaan (user_id, buku_id, tipe, status, tanggal_expired, transaksi_id)
     VALUES (?, ?, 'sewa', 'aktif', ?, ?)
     ON DUPLICATE KEY UPDATE tipe = 'sewa', status = 'aktif', tanggal_expired = VALUES(tanggal_expired), transaksi_id = VALUES(transaksi_id)`,
    [transaksi.user_id, transaksi.buku_id, tanggalExpired, transaksi.id]
  );
  await conn.execute("UPDATE buku SET total_disewa = total_disewa + 1 WHERE id = ?", [transaksi.buku_id]);
  await conn.execute(
    `INSERT INTO notifikasi (user_id, tipe, judul, pesan, link_url)
     VALUES (?, 'transaksi', 'Sewa Buku Berhasil!', ?, ?)`,
    [
      transaksi.user_id,
      `"${transaksi.buku_judul}" disewa ${transaksi.durasi_sewa_hari} hari hingga ${tanggalExpired.toLocaleDateString("id-ID")}`,
      `/invoice.html?kode=${transaksi.kode_transaksi}`,
    ]
  );
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
 * Membeli buku via Midtrans Snap
 */
router.post("/beli", verifyToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { buku_id, ongkir = 0, asuransi = 0, diskon = 0 } = req.body;
    if (!buku_id) return res.status(400).json({ success: false, message: "buku_id wajib diisi" });
    requireMidtransConfig();
    await conn.beginTransaction();

    // Cek buku
    const [[buku]] = await conn.execute(
      "SELECT id, judul, harga_beli, bisa_beli FROM buku WHERE id = ? AND aktif = 1",
      [buku_id]
    );
    if (!buku) throw httpError(404, "Buku tidak ditemukan");
    if (!buku.bisa_beli) throw httpError(400, "Buku ini tidak tersedia untuk dibeli");

    // Cek sudah punya belum
    const [[sudahPunya]] = await conn.execute(
      "SELECT id FROM perpustakaan WHERE user_id = ? AND buku_id = ? AND tipe = 'beli'",
      [req.user.id, buku_id]
    );
    if (sudahPunya) throw httpError(400, "Anda sudah memiliki buku ini");

    const kode = generateKodeTransaksi();
    
    // Hitung total harga sebenarnya
    const hargaTotal = Number(buku.harga_beli) + Number(ongkir) + Number(asuransi) - Number(diskon);

    // Buat transaksi pending. Akses buku diberikan setelah webhook Midtrans sukses.
    const [trx] = await conn.execute(
      `INSERT INTO transaksi (kode_transaksi, user_id, buku_id, tipe, harga, status, metode_bayar)
       VALUES (?, ?, ?, 'beli', ?, 'pending', 'midtrans')`,
      [kode, req.user.id, buku_id, hargaTotal]
    );

    const payment = await createMidtransPayment({
      kode,
      hargaTotal,
      buku,
      user: req.user,
      ongkir,
      asuransi,
      diskon,
      tipe: 'beli'
    });
    await conn.execute(
      "UPDATE transaksi SET payment_token = ?, payment_url = ? WHERE id = ?",
      [payment.token, payment.redirect_url, trx.insertId]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Transaksi Midtrans berhasil dibuat",
      data: {
        kode_transaksi: kode,
        judul: buku.judul,
        harga: buku.harga_beli,
        payment_token: payment.token,
        payment_url: payment.redirect_url,
      }
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message || "Gagal memproses pembelian" });
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
    const { buku_id, durasi = 30, ongkir = 0, deposit = 0 } = req.body;
    if (!buku_id) return res.status(400).json({ success: false, message: "buku_id wajib diisi" });
    requireMidtransConfig();
    await conn.beginTransaction();

    const [[buku]] = await conn.execute(
      "SELECT id, judul, harga_sewa, bisa_sewa FROM buku WHERE id = ? AND aktif = 1",
      [buku_id]
    );
    if (!buku) throw httpError(404, "Buku tidak ditemukan");
    if (!buku.bisa_sewa) throw httpError(400, "Buku ini tidak tersedia untuk disewa");

    // Cek sewa aktif
    const [[sewaAktif]] = await conn.execute(
      "SELECT id, tanggal_expired FROM perpustakaan WHERE user_id = ? AND buku_id = ? AND tipe = 'sewa' AND status = 'aktif'",
      [req.user.id, buku_id]
    );
    if (sewaAktif) {
      throw httpError(400, `Anda masih menyewa buku ini hingga ${new Date(sewaAktif.tanggal_expired).toLocaleDateString("id-ID")}`);
    }

    const durasiHari = parseInt(durasi);
    if (!Number.isFinite(durasiHari) || durasiHari < 1) {
      throw httpError(400, "Durasi sewa tidak valid");
    }
    const hargaSewaTotal = Math.ceil(buku.harga_sewa * (durasiHari / 30));
    const hargaTotal = hargaSewaTotal + Number(ongkir) + Number(deposit);

    const kode = generateKodeTransaksi();
    const [trx] = await conn.execute(
      `INSERT INTO transaksi (kode_transaksi, user_id, buku_id, tipe, harga, durasi_sewa_hari, status, metode_bayar)
       VALUES (?, ?, ?, 'sewa', ?, ?, 'pending', 'midtrans')`,
      [kode, req.user.id, buku_id, hargaTotal, durasiHari]
    );

    const payment = await createMidtransPayment({
      kode,
      hargaTotal,
      buku,
      user: req.user,
      ongkir,
      deposit,
      tipe: 'sewa',
      hargaSewaTotal
    });
    await conn.execute(
      "UPDATE transaksi SET payment_token = ?, payment_url = ? WHERE id = ?",
      [payment.token, payment.redirect_url, trx.insertId]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Transaksi Midtrans berhasil dibuat",
      data: {
        kode_transaksi: kode,
        judul: buku.judul,
        harga: hargaTotal,
        durasi_hari: durasiHari,
        payment_token: payment.token,
        payment_url: payment.redirect_url,
      }
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message || "Gagal memproses sewa" });
  } finally {
    conn.release();
  }
});

/**
 * POST /api/transactions/midtrans/notification
 * Webhook Midtrans. Set URL ini di dashboard Midtrans.
 */
router.post("/midtrans/notification", async (req, res) => {
  const conn = await db.getConnection();
  try {
    requireMidtransConfig();
    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const nextStatus = mapMidtransStatus(transactionStatus, fraudStatus);

    await conn.beginTransaction();

    const [[transaksi]] = await conn.execute(
      `SELECT t.*, b.judul AS buku_judul
       FROM transaksi t
       JOIN buku b ON t.buku_id = b.id
       WHERE t.kode_transaksi = ?
       FOR UPDATE`,
      [orderId]
    );

    if (!transaksi) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
    }

    if (nextStatus === "berhasil") {
      await activatePaidTransaction(conn, transaksi);
    } else if (transaksi.status !== "berhasil") {
      await conn.execute("UPDATE transaksi SET status = ? WHERE id = ?", [nextStatus, transaksi.id]);
    }

    await conn.commit();
    res.json({ success: true, order_id: orderId, status: nextStatus });
  } catch (error) {
    await conn.rollback();
    console.error("Midtrans notification error:", error);
    res.status(error.status || 500).json({ success: false, message: error.message || "Gagal memproses notifikasi Midtrans" });
  } finally {
    conn.release();
  }
});

module.exports = router;

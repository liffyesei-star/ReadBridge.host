/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const admin = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const { addNotification } = require("../utils/notification");

// ============================================================
// PROFILE
// ============================================================

/**
 * PUT /api/users/profile
 * Update profil user (Nama, Foto Profil, Bio, Minat)
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { nama, bio, foto_profil, minat, email } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: "Nama tidak boleh kosong" });

    // Dapatkan data user saat ini
    const [rows] = await db.execute("SELECT nama, email, last_name_change FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    const user = rows[0];

    let isNameChanged = false;
    let isEmailChanged = false;

    let queryUpdates = "bio = ?, foto_profil = ?, minat = ?";
    let queryParams = [bio || null, foto_profil || null, minat ? JSON.stringify(minat) : null];

    // Jika mencoba mengubah email
    if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const cleanEmail = email.trim().toLowerCase();
      const [existingEmail] = await db.execute("SELECT id FROM users WHERE email = ? AND id != ?", [cleanEmail, req.user.id]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ success: false, message: "Email sudah digunakan oleh akun lain" });
      }
      queryUpdates = "email = ?, " + queryUpdates;
      queryParams.unshift(cleanEmail);
      isEmailChanged = true;
    }

    // Jika mencoba mengubah nama
    if (nama.trim() !== user.nama) {
      if (user.last_name_change) {
        const lastChange = new Date(user.last_name_change);
        const now = new Date();
        const diffTime = Math.abs(now - lastChange);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 30) {
          const sisaHari = 30 - diffDays + 1;
          return res.status(400).json({ 
            success: false, 
            message: `Nama hanya bisa diganti 1x dalam 30 hari. Anda harus menunggu ${sisaHari} hari lagi.` 
          });
        }
      }
      // Boleh ganti nama
      queryUpdates = "nama = ?, last_name_change = NOW(), " + queryUpdates;
      queryParams.unshift(nama.trim());
      isNameChanged = true;
    }

    queryParams.push(req.user.id);

    await db.execute(
      `UPDATE users SET ${queryUpdates} WHERE id = ?`,
      queryParams
    );

    // Trigger Notifikasi Real-Time
    if (isNameChanged) {
      await addNotification(
        req.user.id,
        'sistem',
        'Nama Tampilan Diperbarui 👤',
        `Nama tampilan Anda berhasil diubah menjadi "${nama.trim()}".`,
        'pengaturan.html'
      );
    }

    if (isEmailChanged) {
      await addNotification(
        req.user.id,
        'sistem',
        'Alamat Email Diperbarui ✉️',
        `Email akun ReadBridge Anda berhasil diperbarui menjadi ${email.trim().toLowerCase()}.`,
        'pengaturan.html'
      );
    }

    res.json({ success: true, message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui profil" });
  }
});

/**
 * PUT /api/users/change-password
 * Mengubah atau membuat kata sandi lokal user
 */
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Kata sandi baru minimal 8 karakter."
      });
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Kata sandi baru harus mengombinasikan huruf dan angka."
      });
    }

    const [[user]] = await db.execute(
      "SELECT id, firebase_uid, password, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // Jika user sudah memiliki password lokal sebelumnya, wajib verifikasi password lama
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Kata sandi saat ini harus diisi."
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Kata sandi saat ini salah."
        });
      }
    }

    // Hash password baru untuk MySQL database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    // Synchronize password ke Firebase jika akun terhubung via Firebase/Google
    if (user.firebase_uid) {
      try {
        await admin.auth().updateUser(user.firebase_uid, { password: newPassword });
      } catch (fbErr) {
        console.warn("Firebase password sync notice:", fbErr.message);
      }
    }

    // Trigger Notifikasi Real-Time Keamanan Sistem
    await addNotification(
      req.user.id,
      'sistem',
      'Kata Sandi Berhasil Diubah 🔒',
      'Kata sandi akun ReadBridge Anda berhasil diperbarui secara aman.',
      'pengaturan.html'
    );

    res.json({
      success: true,
      has_password: true,
      message: user.password ? "Kata sandi berhasil diubah." : "Kata sandi lokal berhasil dibuat! Anda kini dapat login dengan Email & Password."
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Gagal mengubah kata sandi." });
  }
});

/**
 * PUT /api/users/minat
 * Update minat / personalisasi user ke database
 */
router.put("/minat", verifyToken, async (req, res) => {
  try {
    const { minat } = req.body;
    const minatArr = Array.isArray(minat) ? minat : [];

    await db.execute(
      "UPDATE users SET minat = ? WHERE id = ?",
      [JSON.stringify(minatArr), req.user.id]
    );

    res.json({ success: true, message: "Minat & personalisasi berhasil disimpan ke database.", minat: minatArr });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menyimpan minat user" });
  }
});

/**
 * GET /api/users/minat
 * Dapatkan minat / personalisasi user dari database
 */
router.get("/minat", verifyToken, async (req, res) => {
  try {
    const [[user]] = await db.execute("SELECT minat FROM users WHERE id = ?", [req.user.id]);
    let minat = [];
    if (user && user.minat) {
      minat = typeof user.minat === 'string' ? JSON.parse(user.minat) : user.minat;
    }
    res.json({ success: true, minat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil minat user" });
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
 * Mengambil daftar seluruh user terdaftar (Real Database Leaderboard - Person vs Person)
 */
router.get("/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const query = `
      SELECT 
        u.id, 
        u.nama, 
        u.email, 
        u.foto_profil, 
        u.poin, 
        u.level,
        u.created_at,
        (SELECT COUNT(*) FROM perpustakaan WHERE user_id = u.id AND selesai = 1) AS buku_selesai,
        (SELECT COUNT(*) FROM diskusi WHERE user_id = u.id) AS total_diskusi,
        (SELECT COUNT(*) FROM diskusi_balasan WHERE user_id = u.id) AS total_balasan
      FROM users u
      WHERE u.aktif = 1
      ORDER BY u.id ASC
    `;

    const [rows] = await db.execute(query);

    // Calculate total XP dynamically for each real registered user
    const usersWithXP = rows.map(u => {
      const xpPoin = u.poin || 0;
      const xpBuku = (u.buku_selesai || 0) * 150;
      const xpDiskusi = (u.total_diskusi || 0) * 50;
      const xpBalasan = (u.total_balasan || 0) * 20;
      const totalXP = xpPoin + xpBuku + xpDiskusi + xpBalasan;
      const computedLevel = Math.max(1, Math.floor(totalXP / 200) + 1);

      let levelTitle = 'Explorer';
      if (computedLevel >= 15) levelTitle = 'Scholar Legend';
      else if (computedLevel >= 10) levelTitle = 'Scholar';
      else if (computedLevel >= 5) levelTitle = 'Thinker';
      else if (computedLevel >= 2) levelTitle = 'Reader';

      return {
        id: u.id,
        nama: u.nama || u.email?.split('@')[0] || 'Member',
        email: u.email,
        foto_profil: u.foto_profil,
        xp: totalXP,
        level: computedLevel,
        level_title: levelTitle,
        total_diskusi: u.total_diskusi,
        buku_selesai: u.buku_selesai
      };
    });

    // Sort by XP descending, then by ID
    usersWithXP.sort((a, b) => b.xp - a.xp || a.id - b.id);

    // Attach rank
    const leaderboard = usersWithXP.slice(0, limit).map((u, index) => ({
      ...u,
      rank: index + 1
    }));

    res.json({ success: true, data: leaderboard, total_users: usersWithXP.length });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data leaderboard real-time." });
  }
});

// ============================================================
// NOTIFIKASI
// ============================================================

/**
 * GET /api/users/notifikasi
 * Supports ?tipe=komunitas|transaksi|prestasi|sistem&page=1&limit=20
 */
router.get("/notifikasi", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, tipe } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = "WHERE user_id = ?";
    let queryParams = [req.user.id];

    if (tipe && tipe !== 'semua') {
      whereClause += " AND tipe = ?";
      queryParams.push(tipe);
    }

    const [rows] = await db.execute(
      `SELECT * FROM notifikasi ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const [[{ belum_dibaca }]] = await db.execute(
      "SELECT COUNT(*) AS belum_dibaca FROM notifikasi WHERE user_id = ? AND sudah_dibaca = 0",
      [req.user.id]
    );

    res.json({ success: true, data: rows, belum_dibaca });
  } catch (error) {
    console.error("Fetch notifikasi error:", error);
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

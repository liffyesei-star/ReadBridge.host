const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, optionalAuth, requireAdmin } = require("../middleware/auth");

/**
 * GET /api/books
 * Ambil semua buku dengan filter & search
 * Query: ?search=&kategori=&badge=&sort=rating|terbaru|termurah|termahal&page=1&limit=12
 */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { search, kategori, badge, sort = "terbaru", page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["b.aktif = 1"];
    let params = [];

    if (search) {
      where.push("(b.judul LIKE ? OR b.penulis_nama LIKE ? OR b.deskripsi LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (kategori) {
      where.push("k.slug = ?");
      params.push(kategori);
    }
    if (badge) {
      where.push("JSON_CONTAINS(b.tags, ?)");
      params.push(JSON.stringify(badge));
    }

    const orderMap = {
      rating: "b.rating DESC",
      terbaru: "b.created_at DESC",
      termurah: "b.harga_beli ASC",
      termahal: "b.harga_beli DESC",
      terlaris: "b.total_terjual DESC",
    };
    const orderBy = orderMap[sort] || "b.created_at DESC";

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [books] = await db.execute(
      `SELECT b.id, b.judul, b.slug, b.penulis_nama, b.cover_url, b.harga_beli, b.harga_sewa,
              b.bisa_beli, b.bisa_sewa, b.bisa_gratis, b.rating, b.total_ulasan,
              b.total_terjual, b.halaman, b.bahasa, b.tahun_terbit, b.tags,
              k.nama AS kategori, k.slug AS kategori_slug
       FROM buku b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.execute(
      `SELECT COUNT(*) AS total FROM buku b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: books,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data buku" });
  }
});

/**
 * GET /api/books/:id
 * Detail buku + ulasan terbaru
 */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.*, k.nama AS kategori, k.slug AS kategori_slug
       FROM buku b
       LEFT JOIN kategori k ON b.kategori_id = k.id
       WHERE b.id = ? AND b.aktif = 1`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    }

    // Ambil ulasan terbaru
    const [ulasan] = await db.execute(
      `SELECT u.id, u.rating, u.komentar, u.likes, u.created_at,
              us.nama AS nama_user, us.foto_profil
       FROM ulasan u
       JOIN users us ON u.user_id = us.id
       WHERE u.buku_id = ?
       ORDER BY u.created_at DESC LIMIT 5`,
      [req.params.id]
    );

    // Cek apakah user sudah punya buku ini
    let sudahDimiliki = false;
    let statusSewa = null;
    if (req.user) {
      const [perp] = await db.execute(
        "SELECT tipe, status, tanggal_expired FROM perpustakaan WHERE user_id = ? AND buku_id = ?",
        [req.user.id, req.params.id]
      );
      if (perp.length) {
        sudahDimiliki = true;
        statusSewa = perp[0];
      }
    }

    res.json({
      success: true,
      data: { ...rows[0], ulasan, sudahDimiliki, statusSewa },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil detail buku" });
  }
});

/**
 * POST /api/books
 * Tambah buku baru (admin/penulis)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      judul, penulis_nama, kategori_id, deskripsi, cover_url, file_url,
      harga_beli, harga_sewa, bisa_beli, bisa_sewa, bisa_gratis,
      halaman, bahasa, tahun_terbit, isbn, tags
    } = req.body;

    if (!judul || !penulis_nama) {
      return res.status(400).json({ success: false, message: "Judul dan penulis wajib diisi" });
    }

    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    const [result] = await db.execute(
      `INSERT INTO buku (judul, slug, penulis_id, penulis_nama, kategori_id, deskripsi,
        cover_url, file_url, harga_beli, harga_sewa, bisa_beli, bisa_sewa, bisa_gratis,
        halaman, bahasa, tahun_terbit, isbn, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul, slug, req.user.id, penulis_nama, kategori_id || null, deskripsi || null,
        cover_url || null, file_url || null,
        harga_beli || 0, harga_sewa || 0,
        bisa_beli ?? 1, bisa_sewa ?? 1, bisa_gratis ?? 0,
        halaman || 0, bahasa || "Indonesia", tahun_terbit || null, isbn || null,
        tags ? JSON.stringify(tags) : null
      ]
    );

    res.status(201).json({ success: true, message: "Buku berhasil ditambahkan", data: { id: result.insertId, slug } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menambahkan buku" });
  }
});

/**
 * PUT /api/books/:id
 * Update buku
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const [existing] = await db.execute(
      "SELECT id, penulis_id FROM buku WHERE id = ?",
      [req.params.id]
    );

    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });
    }

    if (existing[0].penulis_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    const fields = ["judul", "penulis_nama", "kategori_id", "deskripsi", "cover_url", "file_url",
      "harga_beli", "harga_sewa", "bisa_beli", "bisa_sewa", "bisa_gratis", "halaman", "bahasa", "tahun_terbit", "isbn", "tags"];
    
    const updates = [];
    const values = [];
    
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        values.push(f === "tags" ? JSON.stringify(req.body[f]) : req.body[f]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ success: false, message: "Tidak ada data yang diupdate" });
    }

    values.push(req.params.id);
    await db.execute(`UPDATE buku SET ${updates.join(", ")} WHERE id = ?`, values);

    res.json({ success: true, message: "Buku berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui buku" });
  }
});

/**
 * DELETE /api/books/:id
 * Hapus (soft delete) buku
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const [existing] = await db.execute("SELECT penulis_id FROM buku WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });

    if (existing[0].penulis_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    await db.execute("UPDATE buku SET aktif = 0 WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus buku" });
  }
});

/**
 * POST /api/books/:id/ulasan
 * Tambah ulasan buku
 */
router.post("/:id/ulasan", verifyToken, async (req, res) => {
  try {
    const { rating, komentar } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating harus antara 1-5" });
    }

    // Cek apakah user sudah punya buku
    const [perp] = await db.execute(
      "SELECT id FROM perpustakaan WHERE user_id = ? AND buku_id = ? AND status = 'aktif'",
      [req.user.id, req.params.id]
    );
    if (!perp.length) {
      return res.status(403).json({ success: false, message: "Anda harus memiliki buku ini untuk memberikan ulasan" });
    }

    await db.execute(
      `INSERT INTO ulasan (buku_id, user_id, rating, komentar)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), komentar = VALUES(komentar)`,
      [req.params.id, req.user.id, rating, komentar || null]
    );

    // Update rata-rata rating buku
    await db.execute(
      `UPDATE buku SET
        rating = (SELECT AVG(rating) FROM ulasan WHERE buku_id = ?),
        total_ulasan = (SELECT COUNT(*) FROM ulasan WHERE buku_id = ?)
       WHERE id = ?`,
      [req.params.id, req.params.id, req.params.id]
    );

    // Tambah poin user
    await db.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 10, 'Menulis ulasan buku', 'ulasan')",
      [req.user.id]
    );
    await db.execute("UPDATE users SET poin = poin + 10 WHERE id = ?", [req.user.id]);

    res.status(201).json({ success: true, message: "Ulasan berhasil ditambahkan. +10 poin!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal menambahkan ulasan" });
  }
});

/**
 * POST /api/books/:id/wishlist
 * Toggle wishlist buku
 */
router.post("/:id/wishlist", verifyToken, async (req, res) => {
  try {
    const [existing] = await db.execute(
      "SELECT 1 FROM wishlist WHERE user_id = ? AND buku_id = ?",
      [req.user.id, req.params.id]
    );

    if (existing.length) {
      await db.execute("DELETE FROM wishlist WHERE user_id = ? AND buku_id = ?", [req.user.id, req.params.id]);
      return res.json({ success: true, message: "Dihapus dari wishlist", inWishlist: false });
    }

    await db.execute("INSERT INTO wishlist (user_id, buku_id) VALUES (?, ?)", [req.user.id, req.params.id]);
    res.json({ success: true, message: "Ditambahkan ke wishlist", inWishlist: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update wishlist" });
  }
});

/**
 * PUT /api/books/:id/progress
 * Update progress baca
 */
router.put("/:id/progress", verifyToken, async (req, res) => {
  try {
    const { halaman } = req.body;
    const [buku] = await db.execute("SELECT halaman FROM buku WHERE id = ?", [req.params.id]);
    if (!buku.length) return res.status(404).json({ success: false, message: "Buku tidak ditemukan" });

    const selesai = buku[0].halaman > 0 && halaman >= buku[0].halaman ? 1 : 0;

    await db.execute(
      "UPDATE perpustakaan SET progress_halaman = ?, selesai = ? WHERE user_id = ? AND buku_id = ?",
      [halaman, selesai, req.user.id, req.params.id]
    );

    // Tambah poin jika baru selesai
    if (selesai) {
      const [[perp]] = await db.execute(
        "SELECT selesai FROM perpustakaan WHERE user_id = ? AND buku_id = ?",
        [req.user.id, req.params.id]
      );
      if (!perp?.selesai) {
        await db.execute(
          "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 50, 'Menyelesaikan buku', 'baca')",
          [req.user.id]
        );
        await db.execute("UPDATE users SET poin = poin + 50 WHERE id = ?", [req.user.id]);
      }
    }

    res.json({ success: true, message: "Progress tersimpan", selesai: !!selesai });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update progress" });
  }
});

module.exports = router;

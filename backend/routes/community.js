/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, optionalAuth } = require("../middleware/auth");

const CLUB_DESTINATIONS = ["Pejuang SNBT", "Pecinta Fiksi"];

async function resolveClubId({ club_id, destination }) {
  if (club_id) return parseInt(club_id, 10) || null;
  if (!destination || destination === "Public Feed") return null;
  if (!CLUB_DESTINATIONS.includes(destination)) return null;

  const [[existing]] = await db.execute(
    "SELECT id FROM club WHERE nama = ? AND aktif = 1 LIMIT 1",
    [destination]
  );
  if (existing) return existing.id;

  const slug = destination.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const [result] = await db.execute(
    "INSERT INTO club (nama, slug, deskripsi, total_anggota) VALUES (?, ?, ?, 0)",
    [destination, slug, `Komunitas ${destination}`]
  );
  return result.insertId;
}

async function getOrCreateBotUser(botNama) {
  const slug = botNama.replace(/^@/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const email = `bot.${slug}@readbridge.local`;
  const [[existing]] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) return existing.id;

  const [result] = await db.execute(
    "INSERT INTO users (nama, email, role, poin, level, bio) VALUES (?, ?, 'user', 0, 'Asisten Komunitas', ?)",
    [botNama.startsWith("@") ? botNama : `@${botNama}`, email, "Bot AI ReadBridge — membuat diskusi lebih hidup dan interaktif."]
  );
  return result.insertId;
}

async function insertBotBalasan(diskusiId, konten, botNama = "@ReadBridgeAI") {
  const userId = await getOrCreateBotUser(botNama);
  await db.execute(
    "INSERT INTO diskusi_balasan (diskusi_id, user_id, konten) VALUES (?, ?, ?)",
    [diskusiId, userId, konten]
  );
  await db.execute("UPDATE diskusi SET total_balasan = total_balasan + 1 WHERE id = ?", [diskusiId]);
}

function buildWelcomeComment(judul, destination) {
  const short = (judul || "diskusi ini").slice(0, 55);
  if (destination === "Pejuang SNBT") {
    return `Halo! Untuk "${short}...", coba pecah materinya per subtopik, kerjakan 5–10 soal latihan, lalu share hasilnya di sini. Kalau stuck, sebut nomor soalnya — nanti kita bedah bareng. Semangat pejuang PTN! 🎯`;
  }
  if (destination === "Pecinta Fiksi") {
    return `Diskusi seru tentang "${short}"! Kalau mau deeper, coba bandingkan temanya dengan buku lain sejenis — biasanya perspektif baru muncul dari situ. Ada rekomendasi bacaan lanjutan? 📖`;
  }
  return `Selamat datang di diskusi "${short}"! Terima kasih sudah berbagi — mari kita jaga thread ini informatif dan saling support. Ada pertanyaan lanjutan? Tulis saja di sini 👋`;
}

// ============================================================
// DISKUSI
// ============================================================

/**
 * GET /api/community/diskusi
 * ?search=&tag=&club_id=&destination=&sort=terbaru|terpopuler&page=1&limit=10
 */
router.get("/diskusi", optionalAuth, async (req, res) => {
  try {
    const { search, tag, club_id, destination, sort = "terbaru", page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["1=1"];
    let params = [];

    if (search) { where.push("(d.judul LIKE ? OR d.konten LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (club_id) {
      where.push("d.club_id = ?");
      params.push(club_id);
    } else if (destination && destination !== "Public Feed") {
      where.push("c.nama = ?");
      params.push(destination);
    } else {
      where.push("d.club_id IS NULL");
    }

    const orderMap = {
      terbaru: "d.created_at DESC",
      terpopuler: "d.total_likes DESC",
      ramai: "d.total_balasan DESC",
    };

    const fromClause = `FROM diskusi d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN buku b ON d.buku_id = b.id
       LEFT JOIN club c ON d.club_id = c.id`;

    const [rows] = await db.query(
      `SELECT d.id, d.club_id, d.judul, d.konten, d.total_balasan, d.total_likes, d.pinned, d.created_at,
              u.id AS user_id, u.nama AS nama_user, u.foto_profil,
              b.judul AS buku_judul, c.nama AS club_nama
       ${fromClause}
       WHERE ${where.join(" AND ")}
       ORDER BY d.pinned DESC, ${orderMap[sort] || "d.created_at DESC"}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total ${fromClause} WHERE ${where.join(" AND ")}`, params
    );

    res.json({ success: true, data: rows, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil diskusi" });
  }
});

/**
 * GET /api/community/diskusi/:id
 * Detail diskusi + balasan
 */
router.get("/diskusi/:id", optionalAuth, async (req, res) => {
  try {
    const [[diskusi]] = await db.execute(
      `SELECT d.*, u.nama AS nama_user, u.foto_profil, b.judul AS buku_judul
       FROM diskusi d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN buku b ON d.buku_id = b.id
       WHERE d.id = ?`,
      [req.params.id]
    );
    if (!diskusi) return res.status(404).json({ success: false, message: "Diskusi tidak ditemukan" });

    const [balasan] = await db.execute(
      `SELECT db.id, db.konten, db.likes, db.parent_id, db.created_at,
              u.id AS user_id, u.nama AS nama_user, u.foto_profil
       FROM diskusi_balasan db
       JOIN users u ON db.user_id = u.id
       WHERE db.diskusi_id = ?
       ORDER BY db.created_at ASC`,
      [req.params.id]
    );

    // Cek apakah user sudah like
    let sudahLike = false;
    if (req.user) {
      const [[like]] = await db.execute(
        "SELECT 1 FROM diskusi_likes WHERE user_id = ? AND diskusi_id = ?",
        [req.user.id, req.params.id]
      );
      sudahLike = !!like;
    }

    res.json({ success: true, data: { ...diskusi, balasan, sudahLike } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil detail diskusi" });
  }
});

/**
 * POST /api/community/diskusi
 * Buat diskusi baru
 */
router.post("/diskusi", verifyToken, async (req, res) => {
  try {
    const { judul, konten, buku_id, club_id, destination } = req.body;
    if (!judul || !konten) return res.status(400).json({ success: false, message: "Judul dan konten wajib diisi" });

    const resolvedClubId = await resolveClubId({ club_id, destination });

    const [result] = await db.execute(
      "INSERT INTO diskusi (club_id, user_id, judul, konten, buku_id) VALUES (?, ?, ?, ?, ?)",
      [resolvedClubId, req.user.id, judul, konten, buku_id || null]
    );

    // Tambah poin
    await db.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 15, 'Membuat diskusi', 'diskusi')",
      [req.user.id]
    );
    await db.execute("UPDATE users SET poin = poin + 15 WHERE id = ?", [req.user.id]);

    insertBotBalasan(
      result.insertId,
      buildWelcomeComment(judul, destination || "Public Feed"),
      "@ReadBridgeAI"
    ).catch((err) => console.error("Bot welcome error:", err.message));

    res.status(201).json({ success: true, message: "Diskusi berhasil dibuat. +15 poin!", data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal membuat diskusi" });
  }
});

/**
 * POST /api/community/diskusi/:id/bot-balasan
 * Komentar otomatis dari bot AI komunitas (untuk simulasi & engagement)
 */
router.post("/diskusi/:id/bot-balasan", async (req, res) => {
  try {
    const { konten, bot_nama = "@ReadBridgeAI" } = req.body;
    if (!konten?.trim()) {
      return res.status(400).json({ success: false, message: "Konten bot tidak boleh kosong" });
    }

    const [[diskusi]] = await db.execute("SELECT id FROM diskusi WHERE id = ?", [req.params.id]);
    if (!diskusi) return res.status(404).json({ success: false, message: "Diskusi tidak ditemukan" });

    await insertBotBalasan(req.params.id, konten.trim(), bot_nama);

    res.status(201).json({
      success: true,
      message: "Balasan bot berhasil ditambahkan",
      data: { bot_nama, konten: konten.trim() },
    });
  } catch (error) {
    console.error("Bot balasan error:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan balasan bot" });
  }
});

/**
 * POST /api/community/diskusi/:id/balasan
 * Balas diskusi
 */
router.post("/diskusi/:id/balasan", verifyToken, async (req, res) => {
  try {
    const { konten, parent_id } = req.body;
    if (!konten) return res.status(400).json({ success: false, message: "Konten balasan tidak boleh kosong" });

    await db.execute(
      "INSERT INTO diskusi_balasan (diskusi_id, user_id, konten, parent_id) VALUES (?, ?, ?, ?)",
      [req.params.id, req.user.id, konten, parent_id || null]
    );

    await db.execute(
      "UPDATE diskusi SET total_balasan = total_balasan + 1 WHERE id = ?",
      [req.params.id]
    );

    // Poin
    await db.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 5, 'Membalas diskusi', 'diskusi')",
      [req.user.id]
    );
    await db.execute("UPDATE users SET poin = poin + 5 WHERE id = ?", [req.user.id]);

    res.status(201).json({ success: true, message: "Balasan berhasil ditambahkan. +5 poin!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambahkan balasan" });
  }
});

/**
 * POST /api/community/diskusi/:id/like
 * Toggle like diskusi
 */
router.post("/diskusi/:id/like", verifyToken, async (req, res) => {
  try {
    const [[existing]] = await db.execute(
      "SELECT 1 FROM diskusi_likes WHERE user_id = ? AND diskusi_id = ?",
      [req.user.id, req.params.id]
    );

    if (existing) {
      await db.execute("DELETE FROM diskusi_likes WHERE user_id = ? AND diskusi_id = ?", [req.user.id, req.params.id]);
      await db.execute("UPDATE diskusi SET total_likes = total_likes - 1 WHERE id = ?", [req.params.id]);
      return res.json({ success: true, liked: false });
    }

    await db.execute("INSERT INTO diskusi_likes (user_id, diskusi_id) VALUES (?, ?)", [req.user.id, req.params.id]);
    await db.execute("UPDATE diskusi SET total_likes = total_likes + 1 WHERE id = ?", [req.params.id]);
    res.json({ success: true, liked: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update like" });
  }
});

// ============================================================
// CLUB
// ============================================================

/**
 * GET /api/community/clubs
 */
router.get("/clubs", optionalAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 9 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["c.aktif = 1"];
    let params = [];
    if (search) { where.push("(c.nama LIKE ? OR c.deskripsi LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }

    const [rows] = await db.query(
      `SELECT c.id, c.nama, c.slug, c.deskripsi, c.foto_cover, c.kategori, c.total_anggota, c.privat,
              u.nama AS nama_kreator
       FROM club c
       LEFT JOIN users u ON c.kreator_id = u.id
       WHERE ${where.join(" AND ")}
       ORDER BY c.total_anggota DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data club" });
  }
});

/**
 * GET /api/community/clubs/:id
 */
router.get("/clubs/:id", optionalAuth, async (req, res) => {
  try {
    const [[club]] = await db.execute(
      `SELECT c.*, u.nama AS nama_kreator FROM club c
       LEFT JOIN users u ON c.kreator_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!club) return res.status(404).json({ success: false, message: "Club tidak ditemukan" });

    // Cek apakah sudah bergabung
    let sudahGabung = false;
    let roleAnggota = null;
    if (req.user) {
      const [[anggota]] = await db.execute(
        "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      sudahGabung = !!anggota;
      roleAnggota = anggota?.role || null;
    }

    res.json({ success: true, data: { ...club, sudahGabung, roleAnggota } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil detail club" });
  }
});

/**
 * POST /api/community/clubs
 */
router.post("/clubs", verifyToken, async (req, res) => {
  try {
    const { nama, deskripsi, kategori, foto_cover, privat } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: "Nama club wajib diisi" });

    const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const [result] = await db.execute(
      "INSERT INTO club (nama, slug, deskripsi, foto_cover, kategori, kreator_id, total_anggota, privat) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
      [nama, slug, deskripsi || null, foto_cover || null, kategori || null, req.user.id, privat ? 1 : 0]
    );

    // Kreator otomatis jadi anggota
    await db.execute(
      "INSERT INTO club_anggota (club_id, user_id, role) VALUES (?, ?, 'kreator')",
      [result.insertId, req.user.id]
    );

    res.status(201).json({ success: true, message: "Club berhasil dibuat!", data: { id: result.insertId, slug } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal membuat club" });
  }
});

/**
 * POST /api/community/clubs/:id/gabung
 * Bergabung/keluar club
 */
router.post("/clubs/:id/gabung", verifyToken, async (req, res) => {
  try {
    const [[existing]] = await db.execute(
      "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (existing) {
      if (existing.role === "kreator") return res.status(400).json({ success: false, message: "Kreator tidak bisa keluar dari club" });
      await db.execute("DELETE FROM club_anggota WHERE club_id = ? AND user_id = ?", [req.params.id, req.user.id]);
      await db.execute("UPDATE club SET total_anggota = total_anggota - 1 WHERE id = ?", [req.params.id]);
      return res.json({ success: true, message: "Berhasil keluar dari club", bergabung: false });
    }

    await db.execute(
      "INSERT INTO club_anggota (club_id, user_id, role) VALUES (?, ?, 'anggota')",
      [req.params.id, req.user.id]
    );
    await db.execute("UPDATE club SET total_anggota = total_anggota + 1 WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Berhasil bergabung ke club!", bergabung: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal update status club" });
  }
});

module.exports = router;

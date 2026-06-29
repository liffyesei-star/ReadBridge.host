/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: June 2026
  Role: Lead Developer & UI/UX Designer
  Update: Club Management V2 — invite system, ban, kick, transfer ownership
*/
const express = require("express");
const crypto  = require("crypto");
const router  = express.Router();
const db      = require("../config/db");
const { verifyToken, optionalAuth } = require("../middleware/auth");

// ─── Helpers ────────────────────────────────────────────────────────────────

const CLUB_DESTINATIONS = ["Pejuang SNBT", "Pecinta Fiksi"];

function generateInviteCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase(); // 10-char e.g. "A3F8C12E91"
}

function httpErr(status, msg) {
  const e = new Error(msg); e.status = status; return e;
}

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

/**
 * Middleware: pastikan user punya minimal role tertentu di club.
 * Urutan kekuatan: kreator > moderator > anggota
 */
const ROLE_WEIGHT = { kreator: 3, moderator: 2, anggota: 1 };

function requireClubRole(minRole) {
  return async (req, res, next) => {
    try {
      const clubId = req.params.id;
      const [[row]] = await db.execute(
        "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ? AND status = 'aktif'",
        [clubId, req.user.id]
      );
      if (!row) return res.status(403).json({ success: false, message: "Anda bukan anggota club ini." });
      if ((ROLE_WEIGHT[row.role] || 0) < (ROLE_WEIGHT[minRole] || 0)) {
        return res.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk tindakan ini." });
      }
      req.clubRole = row.role;
      next();
    } catch (e) {
      res.status(500).json({ success: false, message: "Gagal memeriksa izin club." });
    }
  };
}

// ─── DISKUSI ────────────────────────────────────────────────────────────────

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
      terbaru:    "d.created_at DESC",
      terpopuler: "d.total_likes DESC",
      ramai:      "d.total_balasan DESC",
    };

    const fromClause = `FROM diskusi d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN buku b ON d.buku_id = b.id
       LEFT JOIN club c ON d.club_id = c.id`;

    const [rows] = await db.query(
      `SELECT d.id, d.club_id, d.judul, d.konten, d.media_url, d.media_type, d.total_balasan, d.total_likes, d.pinned, d.created_at,
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
      `SELECT db.id, db.konten, db.media_url, db.media_type, db.likes, db.parent_id, db.created_at,
              u.id AS user_id, u.nama AS nama_user, u.foto_profil
       FROM diskusi_balasan db
       JOIN users u ON db.user_id = u.id
       WHERE db.diskusi_id = ?
       ORDER BY db.created_at ASC`,
      [req.params.id]
    );

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
 */
router.post("/diskusi", verifyToken, async (req, res) => {
  try {
    const { judul, konten, buku_id, club_id, destination, media_url, media_type } = req.body;
    if (!judul || !konten) return res.status(400).json({ success: false, message: "Judul dan konten wajib diisi" });

    const validMediaType = ['image','video'].includes(media_type) ? media_type : null;
    const safeMediaUrl = media_url && validMediaType ? media_url : null;

    const resolvedClubId = await resolveClubId({ club_id, destination });

    const [result] = await db.execute(
      "INSERT INTO diskusi (club_id, user_id, judul, konten, buku_id, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [resolvedClubId, req.user.id, judul, konten, buku_id || null, safeMediaUrl, validMediaType]
    );

    await db.execute(
      "INSERT INTO poin_history (user_id, poin, keterangan, tipe) VALUES (?, 15, 'Membuat diskusi', 'diskusi')",
      [req.user.id]
    );
    await db.execute("UPDATE users SET poin = poin + 15 WHERE id = ?", [req.user.id]);

    res.status(201).json({ success: true, message: "Diskusi berhasil dibuat. +15 poin!", data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat diskusi" });
  }
});

/**
 * POST /api/community/diskusi/:id/balasan
 */
router.post("/diskusi/:id/balasan", verifyToken, async (req, res) => {
  try {
    const { konten, parent_id, media_url, media_type } = req.body;
    if (!konten) return res.status(400).json({ success: false, message: "Konten balasan tidak boleh kosong" });

    const validMediaType = ['image','video'].includes(media_type) ? media_type : null;
    const safeMediaUrl = media_url && validMediaType ? media_url : null;

    await db.execute(
      "INSERT INTO diskusi_balasan (diskusi_id, user_id, konten, parent_id, media_url, media_type) VALUES (?, ?, ?, ?, ?, ?)",
      [req.params.id, req.user.id, konten, parent_id || null, safeMediaUrl, validMediaType]
    );

    await db.execute(
      "UPDATE diskusi SET total_balasan = total_balasan + 1 WHERE id = ?",
      [req.params.id]
    );

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

// ─── CLUB ───────────────────────────────────────────────────────────────────

/**
 * GET /api/community/clubs
 * ?search=&page=&limit=&filter=public|private|semua
 */
router.get("/clubs", optionalAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 9, filter } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["c.aktif = 1"];
    let params = [];
    if (search) { where.push("(c.nama LIKE ? OR c.deskripsi LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (filter === "public")  where.push("c.privat = 0");
    if (filter === "private") where.push("c.privat = 1");

    const [rows] = await db.query(
      `SELECT c.id, c.nama, c.slug, c.deskripsi, c.foto_cover, c.icon_url, c.banner_url,
              c.kategori, c.total_anggota, c.privat, c.color_primary, c.color_scheme,
              u.nama AS nama_kreator
       FROM club c
       LEFT JOIN users u ON c.kreator_id = u.id
       WHERE ${where.join(" AND ")}
       ORDER BY c.total_anggota DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Sertakan apakah user sudah bergabung
    let clubIds = rows.map(r => r.id);
    let userMemberships = {};
    if (req.user && clubIds.length > 0) {
      const [memberRows] = await db.query(
        `SELECT club_id, role FROM club_anggota WHERE user_id = ? AND club_id IN (${clubIds.map(() => '?').join(',')}) AND status = 'aktif'`,
        [req.user.id, ...clubIds]
      );
      memberRows.forEach(m => { userMemberships[m.club_id] = m.role; });
    }

    const data = rows.map(r => ({
      ...r,
      sudahGabung: !!userMemberships[r.id],
      roleAnggota: userMemberships[r.id] || null
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data club" });
  }
});

/**
 * GET /api/community/clubs/:id
 */
router.get("/clubs/:id", optionalAuth, async (req, res) => {
  try {
    const [[club]] = await db.execute(
      `SELECT c.*, u.nama AS nama_kreator, u.foto_profil AS foto_kreator
       FROM club c
       LEFT JOIN users u ON c.kreator_id = u.id
       WHERE c.id = ? AND c.aktif = 1`,
      [req.params.id]
    );
    if (!club) return res.status(404).json({ success: false, message: "Club tidak ditemukan" });

    let sudahGabung = false;
    let roleAnggota = null;
    let isBanned    = false;

    if (req.user) {
      const [[anggota]] = await db.execute(
        "SELECT role, status FROM club_anggota WHERE club_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
      if (anggota) {
        sudahGabung = anggota.status === 'aktif';
        roleAnggota = anggota.status === 'aktif' ? anggota.role : null;
        isBanned    = anggota.status === 'banned';
      }
    }

    // Sembunyikan invite_code jika bukan anggota/admin
    const isPrivileged = ['kreator','moderator'].includes(roleAnggota);
    const clubData = { ...club };
    if (!isPrivileged) delete clubData.invite_code;

    res.json({ success: true, data: { ...clubData, sudahGabung, roleAnggota, isBanned } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil detail club" });
  }
});

/**
 * POST /api/community/clubs
 * Buat club baru
 */
router.post("/clubs", verifyToken, async (req, res) => {
  try {
    const { nama, deskripsi, kategori, foto_cover, icon_url, banner_url, privat, color_primary, color_scheme, aturan } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: "Nama club wajib diisi" });

    const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const inviteCode = privat ? generateInviteCode() : null;

    const [result] = await db.execute(
      `INSERT INTO club (nama, slug, deskripsi, foto_cover, icon_url, banner_url, kategori,
        kreator_id, total_anggota, privat, invite_code, color_primary, color_scheme, aturan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`,
      [nama, slug, deskripsi || null, foto_cover || banner_url || null,
       icon_url || null, banner_url || null, kategori || null,
       req.user.id, privat ? 1 : 0, inviteCode,
       color_primary || '#0284c7', color_scheme || '#e0f2fe', aturan || null]
    );

    await db.execute(
      "INSERT INTO club_anggota (club_id, user_id, role) VALUES (?, ?, 'kreator')",
      [result.insertId, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: "Club berhasil dibuat!",
      data: { id: result.insertId, slug, invite_code: inviteCode }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal membuat club" });
  }
});

/**
 * PUT /api/community/clubs/:id
 * Update info club (hanya kreator)
 */
router.put("/clubs/:id", verifyToken, requireClubRole("kreator"), async (req, res) => {
  try {
    const { nama, deskripsi, kategori, foto_cover, icon_url, banner_url, privat, color_primary, color_scheme, aturan } = req.body;

    // Jika diubah jadi privat dan belum ada invite_code, generate baru
    let extraSet = "";
    const params = [];

    if (nama !== undefined)          { extraSet += "nama = ?,";          params.push(nama); }
    if (deskripsi !== undefined)     { extraSet += "deskripsi = ?,";     params.push(deskripsi); }
    if (kategori !== undefined)      { extraSet += "kategori = ?,";      params.push(kategori); }
    if (foto_cover !== undefined)    { extraSet += "foto_cover = ?,";    params.push(foto_cover); }
    if (icon_url !== undefined)      { extraSet += "icon_url = ?,";      params.push(icon_url); }
    if (banner_url !== undefined)    { extraSet += "banner_url = ?,";    params.push(banner_url); }
    if (color_primary !== undefined) { extraSet += "color_primary = ?,"; params.push(color_primary); }
    if (color_scheme !== undefined)  { extraSet += "color_scheme = ?,";  params.push(color_scheme); }
    if (aturan !== undefined)        { extraSet += "aturan = ?,";        params.push(aturan); }
    if (privat !== undefined) {
      extraSet += "privat = ?,";
      params.push(privat ? 1 : 0);
      if (privat) {
        const [[club]] = await db.execute("SELECT invite_code FROM club WHERE id = ?", [req.params.id]);
        if (!club.invite_code) {
          extraSet += "invite_code = ?,";
          params.push(generateInviteCode());
        }
      }
    }

    if (!extraSet) return res.status(400).json({ success: false, message: "Tidak ada data yang diubah." });

    params.push(req.params.id);
    await db.execute(`UPDATE club SET ${extraSet.slice(0, -1)} WHERE id = ?`, params);

    const [[updated]] = await db.execute("SELECT * FROM club WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Club berhasil diperbarui.", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui club" });
  }
});

/**
 * DELETE /api/community/clubs/:id
 * Hapus club (hanya kreator)
 */
router.delete("/clubs/:id", verifyToken, requireClubRole("kreator"), async (req, res) => {
  try {
    await db.execute("UPDATE club SET aktif = 0 WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Club berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus club" });
  }
});

// ─── GABUNG / KELUAR ────────────────────────────────────────────────────────

/**
 * POST /api/community/clubs/:id/gabung
 * Bergabung ke club (public langsung, private butuh invite_code)
 */
router.post("/clubs/:id/gabung", verifyToken, async (req, res) => {
  try {
    const { invite_code } = req.body;

    const [[club]] = await db.execute(
      "SELECT id, privat, invite_code, aktif FROM club WHERE id = ?",
      [req.params.id]
    );
    if (!club || !club.aktif) return res.status(404).json({ success: false, message: "Club tidak ditemukan." });

    // Cek ban
    const [[banned]] = await db.execute(
      "SELECT 1 FROM club_banned WHERE club_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (banned) return res.status(403).json({ success: false, message: "Anda telah di-ban dari club ini." });

    const [[existing]] = await db.execute(
      "SELECT role, status FROM club_anggota WHERE club_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    // Toggle keluar jika sudah aktif (bukan kreator)
    if (existing && existing.status === 'aktif') {
      if (existing.role === "kreator") return res.status(400).json({ success: false, message: "Kreator tidak bisa keluar dari club." });
      await db.execute("DELETE FROM club_anggota WHERE club_id = ? AND user_id = ?", [req.params.id, req.user.id]);
      await db.execute("UPDATE club SET total_anggota = GREATEST(total_anggota - 1, 0) WHERE id = ?", [req.params.id]);
      return res.json({ success: true, message: "Berhasil keluar dari club.", bergabung: false });
    }

    // Validasi invite code jika club privat
    if (club.privat) {
      if (!invite_code) return res.status(403).json({ success: false, message: "Club ini privat. Masukkan kode undangan." });
      if (invite_code.trim().toUpperCase() !== (club.invite_code || "").toUpperCase()) {
        return res.status(403).json({ success: false, message: "Kode undangan tidak valid." });
      }
    }

    // Gabung / pulihkan dari status lama
    if (existing) {
      await db.execute(
        "UPDATE club_anggota SET role = 'anggota', status = 'aktif' WHERE club_id = ? AND user_id = ?",
        [req.params.id, req.user.id]
      );
    } else {
      await db.execute(
        "INSERT INTO club_anggota (club_id, user_id, role, status) VALUES (?, ?, 'anggota', 'aktif')",
        [req.params.id, req.user.id]
      );
    }
    await db.execute("UPDATE club SET total_anggota = total_anggota + 1 WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Berhasil bergabung ke club!", bergabung: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal update status club" });
  }
});

// ─── INVITE CODE ────────────────────────────────────────────────────────────

/**
 * GET /api/community/clubs/:id/invite-code
 * Dapatkan kode invite (hanya owner/mod)
 */
router.get("/clubs/:id/invite-code", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    const [[club]] = await db.execute("SELECT invite_code, privat FROM club WHERE id = ?", [req.params.id]);
    if (!club) return res.status(404).json({ success: false, message: "Club tidak ditemukan." });

    // Auto-generate jika belum ada
    if (!club.invite_code) {
      const code = generateInviteCode();
      await db.execute("UPDATE club SET invite_code = ? WHERE id = ?", [code, req.params.id]);
      return res.json({ success: true, data: { invite_code: code } });
    }

    res.json({ success: true, data: { invite_code: club.invite_code } });
  } catch (e) {
    res.status(500).json({ success: false, message: "Gagal mengambil kode invite." });
  }
});

/**
 * POST /api/community/clubs/:id/regenerate-invite
 * Buat ulang kode invite (invalidate kode lama)
 */
router.post("/clubs/:id/regenerate-invite", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    const newCode = generateInviteCode();
    await db.execute("UPDATE club SET invite_code = ? WHERE id = ?", [newCode, req.params.id]);
    res.json({ success: true, message: "Kode invite baru berhasil dibuat.", data: { invite_code: newCode } });
  } catch (e) {
    res.status(500).json({ success: false, message: "Gagal regenerate kode invite." });
  }
});

// ─── ANGGOTA MANAGEMENT ─────────────────────────────────────────────────────

/**
 * GET /api/community/clubs/:id/anggota
 * Daftar anggota (hanya anggota aktif)
 */
router.get("/clubs/:id/anggota", verifyToken, requireClubRole("anggota"), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = ["ca.club_id = ?", "ca.status = 'aktif'"];
    let params = [req.params.id];
    if (search) { where.push("(u.nama LIKE ? OR u.email LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }

    const [rows] = await db.query(
      `SELECT u.id, u.nama, u.foto_profil, u.level, ca.role, ca.joined_at
       FROM club_anggota ca
       JOIN users u ON ca.user_id = u.id
       WHERE ${where.join(" AND ")}
       ORDER BY FIELD(ca.role,'kreator','moderator','anggota'), ca.joined_at ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ success: true, data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Gagal mengambil daftar anggota." });
  }
});

/**
 * PATCH /api/community/clubs/:id/anggota/:uid/role
 * Promote/demote anggota (hanya kreator)
 */
router.patch("/clubs/:id/anggota/:uid/role", verifyToken, requireClubRole("kreator"), async (req, res) => {
  try {
    const { role } = req.body; // 'moderator' atau 'anggota'
    if (!['moderator','anggota'].includes(role)) {
      return res.status(400).json({ success: false, message: "Role tidak valid. Pilih 'moderator' atau 'anggota'." });
    }

    const targetId = parseInt(req.params.uid);
    if (targetId === req.user.id) return res.status(400).json({ success: false, message: "Anda tidak bisa mengubah role diri sendiri." });

    const [[target]] = await db.execute(
      "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ? AND status = 'aktif'",
      [req.params.id, targetId]
    );
    if (!target) return res.status(404).json({ success: false, message: "Anggota tidak ditemukan." });
    if (target.role === 'kreator') return res.status(403).json({ success: false, message: "Tidak bisa mengubah role kreator." });

    await db.execute(
      "UPDATE club_anggota SET role = ? WHERE club_id = ? AND user_id = ?",
      [role, req.params.id, targetId]
    );

    const action = role === 'moderator' ? 'dijadikan Moderator' : 'dikembalikan ke Anggota';
    res.json({ success: true, message: `User berhasil ${action}.` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Gagal mengubah role." });
  }
});

/**
 * DELETE /api/community/clubs/:id/anggota/:uid
 * Kick anggota (owner bisa kick moderator & anggota; moderator hanya bisa kick anggota)
 */
router.delete("/clubs/:id/anggota/:uid", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    const targetId = parseInt(req.params.uid);
    if (targetId === req.user.id) return res.status(400).json({ success: false, message: "Anda tidak bisa mengeluarkan diri sendiri." });

    const [[target]] = await db.execute(
      "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ? AND status = 'aktif'",
      [req.params.id, targetId]
    );
    if (!target) return res.status(404).json({ success: false, message: "Anggota tidak ditemukan." });
    if (target.role === 'kreator') return res.status(403).json({ success: false, message: "Kreator tidak bisa dikick." });

    // Moderator tidak bisa kick sesama moderator
    if (req.clubRole === 'moderator' && target.role === 'moderator') {
      return res.status(403).json({ success: false, message: "Moderator tidak bisa mengeluarkan sesama moderator." });
    }

    await db.execute(
      "DELETE FROM club_anggota WHERE club_id = ? AND user_id = ?",
      [req.params.id, targetId]
    );
    await db.execute("UPDATE club SET total_anggota = GREATEST(total_anggota - 1, 0) WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Anggota berhasil dikeluarkan." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Gagal mengeluarkan anggota." });
  }
});

/**
 * POST /api/community/clubs/:id/anggota/:uid/ban
 * Ban user permanen dari club
 */
router.post("/clubs/:id/anggota/:uid/ban", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    const { alasan } = req.body;
    const targetId = parseInt(req.params.uid);
    if (targetId === req.user.id) return res.status(400).json({ success: false, message: "Anda tidak bisa mem-ban diri sendiri." });

    const [[target]] = await db.execute(
      "SELECT role FROM club_anggota WHERE club_id = ? AND user_id = ?",
      [req.params.id, targetId]
    );
    if (target?.role === 'kreator') return res.status(403).json({ success: false, message: "Kreator tidak bisa di-ban." });

    if (req.clubRole === 'moderator' && target?.role === 'moderator') {
      return res.status(403).json({ success: false, message: "Moderator tidak bisa mem-ban sesama moderator." });
    }

    // Masukkan ke tabel banned (upsert)
    await db.execute(
      `INSERT INTO club_banned (club_id, user_id, banned_by, alasan)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE banned_by = VALUES(banned_by), alasan = VALUES(alasan), banned_at = NOW()`,
      [req.params.id, targetId, req.user.id, alasan || null]
    );

    // Hapus dari club_anggota
    await db.execute("DELETE FROM club_anggota WHERE club_id = ? AND user_id = ?", [req.params.id, targetId]);
    await db.execute("UPDATE club SET total_anggota = GREATEST(total_anggota - 1, 0) WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "User berhasil di-ban dari club." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Gagal mem-ban user." });
  }
});

/**
 * DELETE /api/community/clubs/:id/anggota/:uid/unban
 * Hapus ban user
 */
router.delete("/clubs/:id/anggota/:uid/unban", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM club_banned WHERE club_id = ? AND user_id = ?",
      [req.params.id, req.params.uid]
    );
    res.json({ success: true, message: "Ban user berhasil dicabut." });
  } catch (e) {
    res.status(500).json({ success: false, message: "Gagal mencabut ban." });
  }
});

/**
 * GET /api/community/clubs/:id/banned
 * Daftar user yang di-ban (hanya owner/mod)
 */
router.get("/clubs/:id/banned", verifyToken, requireClubRole("moderator"), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT cb.id, cb.alasan, cb.banned_at,
              u.id AS user_id, u.nama, u.foto_profil,
              b.nama AS banned_by_nama
       FROM club_banned cb
       JOIN users u ON cb.user_id = u.id
       JOIN users b ON cb.banned_by = b.id
       WHERE cb.club_id = ?
       ORDER BY cb.banned_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: "Gagal mengambil daftar banned." });
  }
});

// ─── TRANSFER OWNERSHIP ─────────────────────────────────────────────────────

/**
 * POST /api/community/clubs/:id/transfer-owner
 * Transfer ownership ke anggota lain (hanya kreator)
 * Kreator lama otomatis jadi moderator setelah transfer.
 */
router.post("/clubs/:id/transfer-owner", verifyToken, requireClubRole("kreator"), async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { target_user_id } = req.body;
    if (!target_user_id) return res.status(400).json({ success: false, message: "target_user_id wajib diisi." });
    if (parseInt(target_user_id) === req.user.id) {
      return res.status(400).json({ success: false, message: "Anda tidak bisa transfer ownership ke diri sendiri." });
    }

    const [[target]] = await conn.execute(
      "SELECT role, status FROM club_anggota WHERE club_id = ? AND user_id = ? AND status = 'aktif'",
      [req.params.id, target_user_id]
    );
    if (!target) return res.status(404).json({ success: false, message: "User tujuan tidak ditemukan atau bukan anggota aktif." });

    await conn.beginTransaction();

    // Downgrade kreator lama menjadi moderator
    await conn.execute(
      "UPDATE club_anggota SET role = 'moderator' WHERE club_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    // Upgrade user baru menjadi kreator
    await conn.execute(
      "UPDATE club_anggota SET role = 'kreator' WHERE club_id = ? AND user_id = ?",
      [req.params.id, target_user_id]
    );

    // Update kreator_id di tabel club
    await conn.execute(
      "UPDATE club SET kreator_id = ? WHERE id = ?",
      [target_user_id, req.params.id]
    );

    await conn.commit();
    res.json({ success: true, message: "Ownership berhasil ditransfer. Anda kini menjadi Moderator." });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ success: false, message: "Gagal mentransfer ownership." });
  } finally {
    conn.release();
  }
});

module.exports = router;

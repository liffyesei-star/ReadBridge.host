const admin = require("../config/firebase");
const db = require("../config/db");

// Middleware wajib login
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Ambil data user dari MySQL
    const [rows] = await db.execute(
      "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE firebase_uid = ? AND aktif = 1",
      [decoded.uid]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "User tidak ditemukan atau tidak aktif" });
    }

    req.user = rows[0];
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ success: false, message: "Token expired, silakan login ulang" });
    }
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }
};

// Middleware opsional login (tidak wajib, tapi kalau ada token akan di-decode)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    const [rows] = await db.execute(
      "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE firebase_uid = ? AND aktif = 1",
      [decoded.uid]
    );

    req.user = rows.length > 0 ? rows[0] : null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

// Middleware role admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Akses ditolak: hanya admin" });
  }
  next();
};

module.exports = { verifyToken, optionalAuth, requireAdmin };

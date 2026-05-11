const admin = require("../config/firebase");
const db = require("../config/db");

const jwt = require("jsonwebtoken");

// Middleware wajib login
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    }

    const token = authHeader.split("Bearer ")[1];
    let decoded;
    
    // Coba verifikasi sebagai JWT lokal dulu
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'readbridge_secret_key');
      const [rows] = await db.execute(
        "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE id = ? AND aktif = 1",
        [decoded.id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "User tidak ditemukan atau tidak aktif" });
      }
      req.user = rows[0];
      return next();
    } catch (jwtErr) {
      // Jika bukan JWT lokal, coba Firebase
      decoded = await admin.auth().verifyIdToken(token);
      const [rows] = await db.execute(
        "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE firebase_uid = ? AND aktif = 1",
        [decoded.uid]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "User tidak ditemukan atau tidak aktif" });
      }

      req.user = rows[0];
      req.firebaseUser = decoded;
      return next();
    }
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

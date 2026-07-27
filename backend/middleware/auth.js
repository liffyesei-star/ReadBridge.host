/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const admin = require("../config/firebase");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");

const JWT_SECRET = process.env.JWT_SECRET || 'readbridge_jwt_secret_key_production_2026';

/**
 * Middleware Wajib Login (JWT Local or Firebase ID Token)
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "Token autentikasi tidak ditemukan.");
    }

    const token = authHeader.split("Bearer ")[1];
    let decoded;

    // 1. Coba Verifikasi JWT Lokal
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      const [rows] = await db.execute(
        "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE id = ? AND aktif = 1",
        [decoded.id]
      );
      if (rows.length === 0) {
        return ApiResponse.unauthorized(res, "Akun tidak ditemukan atau telah dinonaktifkan.");
      }
      req.user = rows[0];
      return next();
    } catch (jwtErr) {
      // 2. Jika bukan JWT Lokal, Coba Verifikasi Firebase Token
      try {
        decoded = await admin.auth().verifyIdToken(token);
        const [rows] = await db.execute(
          "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE firebase_uid = ? AND aktif = 1",
          [decoded.uid]
        );

        if (rows.length === 0) {
          return ApiResponse.unauthorized(res, "Akun Firebase tidak terdaftar di database.");
        }

        req.user = rows[0];
        req.firebaseUser = decoded;
        return next();
      } catch (firebaseErr) {
        return ApiResponse.unauthorized(res, "Token tidak valid atau telah kedaluwarsa.");
      }
    }
  } catch (error) {
    return ApiResponse.unauthorized(res, "Gagal memproses autentikasi.");
  }
};

/**
 * Middleware Opsional Login (Inject user jika token valid, tidak melempar 401 jika tidak ada)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split("Bearer ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
      const [rows] = await db.execute(
        "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE id = ? AND aktif = 1",
        [decoded.id]
      );
      req.user = rows.length > 0 ? rows[0] : null;
      return next();
    } catch {
      try {
        decoded = await admin.auth().verifyIdToken(token);
        const [rows] = await db.execute(
          "SELECT id, firebase_uid, nama, email, role, foto_profil, poin FROM users WHERE firebase_uid = ? AND aktif = 1",
          [decoded.uid]
        );
        req.user = rows.length > 0 ? rows[0] : null;
        return next();
      } catch {
        req.user = null;
        return next();
      }
    }
  } catch {
    req.user = null;
    return next();
  }
};

/**
 * Middleware Role Admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return ApiResponse.forbidden(res, "Akses ditolak: Fitur ini khusus untuk Administrator.");
  }
  return next();
};

module.exports = { verifyToken, optionalAuth, requireAdmin };

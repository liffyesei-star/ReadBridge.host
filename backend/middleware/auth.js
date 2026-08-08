const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");
const userRepository = require("../repositories/userRepository");

const JWT_SECRET = process.env.JWT_SECRET || 'readbridge_jwt_secret_key_production_2026';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "Token autentikasi tidak ditemukan.");
    }

    const token = authHeader.split("Bearer ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findByEmail(decoded.email); // or we could add findById
      if (!user) {
        return ApiResponse.unauthorized(res, "Akun tidak ditemukan.");
      }
      req.user = user;
      return next();
    } catch (jwtErr) {
      try {
        decoded = await admin.auth().verifyIdToken(token);
        const user = await userRepository.findByEmail(decoded.email);
        if (!user) {
          return ApiResponse.unauthorized(res, "Akun Firebase tidak terdaftar di database.");
        }
        req.user = user;
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

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "Token autentikasi Firebase tidak ditemukan.");
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, "Token Firebase tidak valid.");
  }
};

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
      req.user = await userRepository.findByEmail(decoded.email);
      return next();
    } catch {
      try {
        decoded = await admin.auth().verifyIdToken(token);
        req.user = await userRepository.findByEmail(decoded.email);
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

module.exports = {
  verifyToken,
  optionalAuth,
  verifyFirebaseToken
};

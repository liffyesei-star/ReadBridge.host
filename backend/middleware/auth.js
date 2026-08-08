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

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findByEmail(decoded.email);
      if (!user) {
        return ApiResponse.unauthorized(res, "Akun tidak ditemukan.");
      }
      req.user = user;
      return next();
    } catch (jwtErr) {
      return ApiResponse.unauthorized(res, "Token tidak valid atau telah kedaluwarsa.");
    }
  } catch (error) {
    return ApiResponse.unauthorized(res, "Gagal memproses autentikasi.");
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

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await userRepository.findByEmail(decoded.email);
      return next();
    } catch {
      req.user = null;
      return next();
    }
  } catch {
    req.user = null;
    return next();
  }
};

module.exports = {
  verifyToken,
  optionalAuth
};

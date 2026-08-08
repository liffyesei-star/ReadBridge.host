const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyFirebaseToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Terlalu banyak percobaan. Coba lagi nanti." },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 100, // Ditingkatkan untuk testing
  message: { success: false, message: "Terlalu banyak percobaan reset password. Coba lagi 1 jam lagi." },
});

// Routes
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/sync', verifyFirebaseToken, authController.sync);
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

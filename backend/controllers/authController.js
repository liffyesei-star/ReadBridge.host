const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { nama, email, password } = req.body;
      if (!nama || !email || !password) {
        return res.status(400).json({ success: false, message: "Semua field harus diisi" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim().toLowerCase())) {
        return res.status(400).json({ success: false, message: "Format email tidak valid" });
      }

      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ success: false, message: "Password minimal 8 karakter dan harus mengandung huruf serta angka" });
      }

      const result = await authService.register({ nama, email: email.trim().toLowerCase(), password });
      return res.status(201).json({ success: true, message: "Registrasi berhasil", ...result });
    } catch (error) {
      console.error("Register Error:", error.message);
      return res.status(error.message === 'Email sudah terdaftar' ? 400 : 500).json({ success: false, message: error.message || "Gagal registrasi" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password harus diisi" });
      }

      const result = await authService.login({ email, password });
      return res.json({ success: true, message: "Login berhasil", ...result });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: "Token Google tidak ditemukan" });
      }

      const result = await authService.googleLogin(token);
      return res.json({ success: true, message: "Login Google berhasil", ...result });
    } catch (error) {
      console.error("Google Login Error:", error.message);
      return res.status(401).json({ success: false, message: error.message || "Gagal login dengan Google" });
    }
  }
}

module.exports = new AuthController();

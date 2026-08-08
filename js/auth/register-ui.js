import { registerLocal } from './api.js';
import { saveSession } from './session.js';
import { startGoogleLogin } from './firebase-engine.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const googleBtn = document.getElementById("google-register-btn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Konfirmasi kata sandi tidak cocok!");
        return;
      }

      try {
        const data = await registerLocal(name, email, password);
        if (data.success) {
          saveSession({ token: data.token, user: data.user, isGoogle: false });
          alert("Pendaftaran berhasil!");
          window.location.href = "eksplor.html";
        } else {
          alert(data.message || "Gagal mendaftar.");
        }
      } catch (err) {
        console.error("Register Error:", err);
        alert("Gagal terhubung ke server.");
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const onSuccess = (user) => {
        window.location.href = "eksplor.html";
      };
      const onError = (errMsg) => {
        alert(errMsg);
      };
      // For register, it's the exact same flow as login
      startGoogleLogin(null, onSuccess, onError);
    });
  }
});

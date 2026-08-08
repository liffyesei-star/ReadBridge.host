import { loginLocal } from './api.js';
import { saveSession } from './session.js';
import { startGoogleLogin } from './firebase-engine.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const googleBtn = document.getElementById("google-login-btn");
  const statusSpan = document.getElementById("rb-auth-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const data = await loginLocal(email, password);
        if (data.success) {
          saveSession({ token: data.token, user: data.user, isGoogle: false });
          const redirectUrl = localStorage.getItem("rb_redirect_after_login");
          if (redirectUrl) {
            localStorage.removeItem("rb_redirect_after_login");
            window.location.href = redirectUrl;
          } else {
            window.location.href = "eksplor.html";
          }
        } else {
          alert(data.message || "Email atau Kata Sandi salah!");
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("Gagal terhubung ke server.");
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const originalText = statusSpan ? statusSpan.textContent : "";
      
      const onStatus = (msg) => {
        if (statusSpan) statusSpan.textContent = msg;
      };
      
      const onSuccess = (user) => {
        if (statusSpan) statusSpan.textContent = "Berhasil masuk!";
        const redirectUrl = localStorage.getItem("rb_redirect_after_login");
        if (redirectUrl) {
          localStorage.removeItem("rb_redirect_after_login");
          window.location.href = redirectUrl;
        } else {
          window.location.href = "eksplor.html";
        }
      };
      
      const onError = (errMsg) => {
        if (statusSpan) statusSpan.textContent = originalText;
        alert(errMsg);
      };

      startGoogleLogin(onStatus, onSuccess, onError);
    });
  }
});

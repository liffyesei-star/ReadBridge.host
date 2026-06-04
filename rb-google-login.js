/**
 * ReadBridge — Google login (popup, alur fluid setelah sukses).
 */
(function () {
  var API = "https://readbridge-backend-2whx.onrender.com";
  var BUSY_KEY = "rb_google_busy";
  var COOLDOWN_MS = 2500;

  function status(msg) {
    var el = document.getElementById("rb-auth-status");
    if (el) el.textContent = msg;
  }

  function destination() {
    return localStorage.getItem("rb_interests") ? "eksplor.html" : "minat.html";
  }

  function goApp() {
    window.location.replace(destination());
  }

  function goAppSoon(ms) {
    status("Login berhasil — mengalihkan...");
    setTimeout(goApp, ms || 500);
  }

  function isBusy() {
    var t = sessionStorage.getItem(BUSY_KEY);
    return t && Date.now() - parseInt(t, 10) < COOLDOWN_MS;
  }

  function saveSession(user, token) {
    localStorage.removeItem("rb_explicit_logout");
    localStorage.setItem("rb_is_logged_in", "true");
    localStorage.setItem("rb_token", token);
    localStorage.setItem("rb_username", user.displayName || "Google User");
    localStorage.setItem("rb_email", user.email || "");
    localStorage.setItem("rb_uid", user.uid);
    if (user.photoURL) localStorage.setItem("rb_profile_pic", user.photoURL);
  }

  function syncBackend(token) {
    return fetch(API + "/api/auth/sync", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    }).catch(function () {
      return null;
    });
  }

  function getAuth() {
    if (!window.firebase || !firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDUfiy2BHYhHh1wql6uM5UvsF6hpNTVvhY",
        authDomain: "readbridge-8934c.firebaseapp.com",
        projectId: "readbridge-8934c",
        storageBucket: "readbridge-8934c.firebasestorage.app",
        messagingSenderId: "900450201794",
        appId: "1:900450201794:web:8d65f989e7fefe590d8b5b",
      });
    }
    return firebase.auth();
  }

  window.rbStartGoogleLogin = function () {
    if (localStorage.getItem("rb_explicit_logout") === "true") {
      localStorage.removeItem("rb_explicit_logout");
    }

    if (
      localStorage.getItem("rb_is_logged_in") === "true" &&
      localStorage.getItem("rb_token")
    ) {
      goAppSoon(200);
      return;
    }

    if (isBusy()) {
      status("Sebentar ya...");
      return;
    }

    sessionStorage.setItem(BUSY_KEY, String(Date.now()));
    status("Membuka Google...");

    var auth = getAuth();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    auth
      .signInWithPopup(provider)
      .then(function (cred) {
        status("Menyinkronkan akun...");
        return cred.user.getIdToken().then(function (token) {
          return syncBackend(token).then(function () {
            saveSession(cred.user, token);
            sessionStorage.removeItem(BUSY_KEY);
            goAppSoon(450);
          });
        });
      })
      .catch(function (err) {
        sessionStorage.removeItem(BUSY_KEY);
        if (err.code === "auth/popup-closed-by-user") {
          status("Dibatalkan.");
          return;
        }
        if (err.code === "auth/cancelled-popup-request") {
          status("Coba klik lagi.");
          return;
        }

        // Fallback otomatis jika popup diblokir atau tidak didukung di webview standalone
        if (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment") {
          sessionStorage.removeItem(BUSY_KEY);
          
          if (checkSafariOrIOS()) {
            status("Masuk dengan Google (Popup) diblokir.");
            alert(
              "Popup Google diblokir oleh Safari/iOS.\n\n" +
              "Solusi:\n" +
              "1. Masuk menggunakan Email & Password di bawah (Sangat Direkomendasikan).\n" +
              "2. Atau aktifkan popup di Pengaturan Safari Anda.\n" +
              "3. Atau jika ingin tetap menggunakan Google login via redirect, klik tombol 'Safari/iPhone' di bawah tombol Google (Catatan: jika gagal/loop, matikan 'Cegah Pelacakan Lintas Situs' di Pengaturan Safari)."
            );
            return;
          }

          status("Popup diblokir, mengalihkan...");
          setTimeout(function () {
            window.rbUseRedirectLogin();
          }, 800);
          return;
        }

        status("Gagal login.");
        alert(
          "Login gagal: " + (err.message || err.code) +
            "\n\nCek Firebase Authorized domains: liffyesei-star.github.io"
        );
      });
  };

  function checkSafariOrIOS() {
    var userAgent = navigator.userAgent || "";
    var platform = navigator.platform || "";
    var isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(platform) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return isSafari || isIOS;
  }

  window.rbGoAfterLogin = goApp;

  window.rbUseRedirectLogin = function () {
    sessionStorage.setItem(BUSY_KEY, String(Date.now()));
    window.location.href = "auth-handler.html?go=1";
  };

  window.rbCheckExistingSession = function () {
    if (localStorage.getItem("rb_explicit_logout") === "true") {
      status("Masuk dengan Google");
      return;
    }
    if (
      localStorage.getItem("rb_is_logged_in") === "true" &&
      localStorage.getItem("rb_token")
    ) {
      status("Sudah masuk, mengalihkan...");
      goAppSoon(350);
    }
  };

  // Sync sesi secara real-time saat pengguna kembali ke PWA
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      window.rbCheckExistingSession();
    }
  });

  // Pre-initialize Firebase immediately on load to prevent popup blocking on Safari/Chrome
  try {
    getAuth();
  } catch (e) {
    console.warn("[ReadBridge Auth] Pre-initialization failed:", e);
  }
})();

/**
 * ReadBridge — Google login via POPUP (Chrome/PC/Android Chrome).
 * Tidak pakai redirect = tidak bolak-balik halaman.
 */
(function () {
  var API = "https://readbridge-backend-2whx.onrender.com";
  var BUSY_KEY = "rb_google_busy";
  var COOLDOWN_MS = 8000;

  function status(msg) {
    var el = document.getElementById("rb-auth-status");
    if (el) el.textContent = msg;
    console.log("[ReadBridge]", msg);
  }

  function showSuccess(name) {
    var box = document.getElementById("rb-login-success");
    if (box) {
      box.hidden = false;
      var nameEl = document.getElementById("rb-login-success-name");
      if (nameEl) nameEl.textContent = name || "Akun Google";
    }
    var spin = document.querySelector(".rb-google-spin");
    if (spin) spin.style.display = "none";
    status("Login berhasil.");
  }

  function isBusy() {
    var t = sessionStorage.getItem(BUSY_KEY);
    if (!t) return false;
    return Date.now() - parseInt(t, 10) < COOLDOWN_MS;
  }

  function setBusy() {
    sessionStorage.setItem(BUSY_KEY, String(Date.now()));
  }

  function clearBusy() {
    sessionStorage.removeItem(BUSY_KEY);
  }

  function destination() {
    return localStorage.getItem("rb_interests") ? "eksplor.html" : "minat.html";
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
      showSuccess(localStorage.getItem("rb_username"));
      status("Anda sudah masuk. Klik tombol di bawah untuk lanjut.");
      return;
    }

    if (isBusy()) {
      status("Tunggu beberapa detik sebelum coba lagi...");
      return;
    }

    setBusy();
    status("Membuka jendela Google...");

    var auth = getAuth();
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    auth
      .signInWithPopup(provider)
      .then(function (cred) {
        status("Menyimpan sesi...");
        return cred.user.getIdToken().then(function (token) {
          return syncBackend(token).then(function () {
            saveSession(cred.user, token);
            clearBusy();
            showSuccess(cred.user.displayName);
          });
        });
      })
      .catch(function (err) {
        clearBusy();
        console.warn("[ReadBridge] popup", err.code, err.message);
        if (err.code === "auth/popup-closed-by-user") {
          status("Dibatalkan. Klik tombol untuk coba lagi.");
          return;
        }
        if (err.code === "auth/cancelled-popup-request") {
          status("Tunggu sebentar, lalu klik lagi.");
          return;
        }
        status("Gagal: " + (err.message || err.code));
        alert(
          "Login gagal: " + (err.message || err.code) +
            "\n\nPastikan domain liffyesei-star.github.io ada di Firebase Authorized domains."
        );
      });
  };

  window.rbGoAfterLogin = function () {
    window.location.href = destination();
  };

  window.rbUseRedirectLogin = function () {
    if (isBusy()) {
      status("Tunggu beberapa detik...");
      return;
    }
    setBusy();
    window.location.href = "auth-handler.html?go=1";
  };

  window.rbCheckExistingSession = function () {
    if (localStorage.getItem("rb_explicit_logout") === "true") {
      status("Silakan masuk dengan Google");
      return;
    }
    if (
      localStorage.getItem("rb_is_logged_in") === "true" &&
      localStorage.getItem("rb_token")
    ) {
      showSuccess(localStorage.getItem("rb_username"));
      status("Sudah masuk. Klik «Lanjut ke ReadBridge» di bawah.");
    } else {
      status("Siap — klik Masuk dengan Google");
    }
  };
})();

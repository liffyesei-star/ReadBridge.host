import { getFirebaseAuth, processGoogleUser } from './firebase-engine.js';

document.addEventListener("DOMContentLoaded", () => {
  const statusSpan = document.getElementById("rb-auth-status");
  const errorSpan = document.getElementById("rb-auth-error");
  const spin = document.getElementById("spin");
  const doneDiv = document.getElementById("rb-done");

  const onStatus = (msg) => {
    if (statusSpan) statusSpan.textContent = msg;
  };

  const onSuccess = (user) => {
    if (spin) spin.style.display = "none";
    if (doneDiv) doneDiv.hidden = false;
    onStatus(`Halo, ${user.displayName || "pengguna"}! Mengalihkan...`);
    
    if (window.history.replaceState) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    const redirectUrl = localStorage.getItem("rb_redirect_after_login");
    if (redirectUrl) {
      localStorage.removeItem("rb_redirect_after_login");
      setTimeout(() => window.location.replace(redirectUrl), 400);
    } else {
      setTimeout(() => window.location.replace("eksplor.html"), 400);
    }
  };

  const onError = (msg) => {
    if (spin) spin.style.display = "none";
    if (errorSpan) {
      errorSpan.hidden = false;
      errorSpan.textContent = msg;
    }
    onStatus("Gagal masuk");
  };

  const auth = getFirebaseAuth();
  if (!auth) {
    onError("Firebase tidak dimuat.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const shouldStart = params.get("go") === "1";
  
  const blob = window.location.search + window.location.hash;
  const isOAuthReturn = /apiKey=|authType=|state=|mode=signIn/i.test(blob) || sessionStorage.getItem("rb_redirect_pending") === "true";

  if (shouldStart) {
    // Memulai alur redirect
    sessionStorage.setItem("rb_redirect_pending", "true");
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    auth.signInWithRedirect(provider).catch(err => {
      sessionStorage.removeItem("rb_redirect_pending");
      onError(err.message);
    });
  } else if (isOAuthReturn) {
    // Menangkap hasil dari Google
    onStatus("Memproses hasil login Google...");
    auth.getRedirectResult()
      .then((cred) => {
        sessionStorage.removeItem("rb_redirect_pending");
        if (cred && cred.user) {
          processGoogleUser(cred.user, onStatus, onSuccess, onError);
        } else {
          // Fallback: periksa onAuthStateChanged (kadang getRedirectResult kosong tapi user sudah login)
          const unsub = auth.onAuthStateChanged(user => {
            unsub();
            if (user) {
              processGoogleUser(user, onStatus, onSuccess, onError);
            } else {
              onError("Sesi login Google tidak ditemukan.");
            }
          });
        }
      })
      .catch((err) => {
        sessionStorage.removeItem("rb_redirect_pending");
        onError("Error saat verifikasi Google: " + err.message);
      });
  } else {
    // Tidak ada yang dilakukan, arahkan kembali ke login
    window.location.replace("login.html");
  }
});

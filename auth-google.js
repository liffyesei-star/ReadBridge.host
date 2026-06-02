/*
  ReadBridge — Google Sign-In (redirect) shared handler
  Works on Safari iOS/macOS, Chrome, Android PWA via getRedirectResult + onAuthStateChanged fallback.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUfiy2BHYhHh1wql6uM5UvsF6hpNTVvhY",
  authDomain: "readbridge-8934c.firebaseapp.com",
  projectId: "readbridge-8934c",
  storageBucket: "readbridge-8934c.firebasestorage.app",
  messagingSenderId: "900450201794",
  appId: "1:900450201794:web:8d65f989e7fefe590d8b5b",
  measurementId: "G-6HSX8L1G2R",
};

const API_BASE = "https://readbridge-backend-2whx.onrender.com";
const SYNC_RETRY_DELAYS = [0, 1500, 3000, 6000];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function isLoginPending() {
  return (
    sessionStorage.getItem("rb_google_login_pending") === "true" ||
    localStorage.getItem("rb_login_in_progress") === "true"
  );
}

function clearLoginPending() {
  sessionStorage.removeItem("rb_google_login_pending");
  localStorage.removeItem("rb_login_in_progress");
}

export function showLoginOverlay(message = "Menyiapkan login Google...", accent = "#2563EB") {
  let overlay = document.getElementById("login-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "login-overlay";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(240,244,249,0.92);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);padding:24px;text-align:center;";
    overlay.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;max-width:320px;color:#0f172a;font:500 14px/1.5 system-ui,sans-serif;">
      <div style="width:36px;height:36px;border:4px solid ${accent};border-top-color:transparent;border-radius:50%;animation:rb-spin 0.8s linear infinite;"></div>
      <div id="login-overlay-message"></div>
      <style>@keyframes rb-spin{to{transform:rotate(360deg)}}</style>
    </div>`;
    document.body.appendChild(overlay);
  }
  const el = document.getElementById("login-overlay-message");
  if (el) el.textContent = message;
  return overlay;
}

export function hideLoginOverlay() {
  document.getElementById("login-overlay")?.remove();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function syncFirebaseUser(idToken) {
  let lastError;
  for (let i = 0; i < SYNC_RETRY_DELAYS.length; i++) {
    if (SYNC_RETRY_DELAYS[i] > 0) await wait(SYNC_RETRY_DELAYS[i]);
    showLoginOverlay(
      i === 0 ? "Menyinkronkan akun ke server..." : `Server menyiapkan akun (${i + 1}/${SYNC_RETRY_DELAYS.length})...`
    );
    try {
      const response = await fetchWithTimeout(
        `${API_BASE}/api/auth/sync`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
        },
        25000
      );
      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        lastError = new Error(`Respons server tidak valid (${response.status})`);
        continue;
      }
      if (response.ok && data.success) return data;
      lastError = new Error(data.message || `Sync gagal (${response.status})`);
      if (response.status >= 400 && response.status < 500 && response.status !== 429) break;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Sinkronisasi gagal");
}

function getRedirectTarget(config) {
  if (config.redirectIfNoInterests && !localStorage.getItem("rb_interests")) {
    return config.redirectIfNoInterests;
  }
  return config.redirectAfterLogin || "index.html";
}

async function persistUserSession(user, syncOk) {
  const idToken = await user.getIdToken();
  localStorage.setItem("rb_token", idToken);
  localStorage.setItem("rb_is_logged_in", "true");
  localStorage.setItem("rb_username", user.displayName || "Google User");
  localStorage.setItem("rb_email", user.email || "");
  localStorage.setItem("rb_uid", user.uid);
  if (user.photoURL) localStorage.setItem("rb_profile_pic", user.photoURL);
  if (syncOk) localStorage.setItem("rb_is_synced", "true");
  clearLoginPending();
  return idToken;
}

/**
 * @param {{ redirectAfterLogin?: string, redirectIfNoInterests?: string, overlayAccent?: string }} config
 */
export function initGoogleAuth(config = {}) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  let loginHandled = false;

  async function completeLogin(user) {
    if (loginHandled || !user) return;
    loginHandled = true;

    showLoginOverlay("Login Google berhasil, menyelesaikan...", config.overlayAccent || "#2563EB");

    let syncOk = false;
    try {
      const idToken = await user.getIdToken();
      await syncFirebaseUser(idToken);
      syncOk = true;
    } catch (err) {
      console.warn("[Auth] Sync backend gagal, login Firebase tetap dipakai:", err.message);
    }

    await persistUserSession(user, syncOk);
    showLoginOverlay("Mengalihkan...");
    await wait(400);
    window.location.href = getRedirectTarget(config);
  }

  async function tryGetRedirectResult() {
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) return result.user;
      } catch (err) {
        console.warn(`[Auth] getRedirectResult attempt ${attempt}:`, err.message);
      }
      if (attempt < 5) await wait(400);
    }
    return null;
  }

  async function handleReturnFromGoogle() {
    if (!isLoginPending()) return;

    showLoginOverlay("Melanjutkan login Google...", config.overlayAccent || "#2563EB");
    const user = await tryGetRedirectResult();
    if (user) {
      await completeLogin(user);
      return;
    }

    // onAuthStateChanged fallback (Safari / PWA)
    await wait(800);
    if (auth.currentUser && isLoginPending()) {
      await completeLogin(auth.currentUser);
      return;
    }

    hideLoginOverlay();
    clearLoginPending();
  }

  auth.onAuthStateChanged((user) => {
    if (user && isLoginPending() && !loginHandled) {
      setTimeout(() => {
        if (!loginHandled && isLoginPending()) completeLogin(user);
      }, 1200);
    }
  });

  window.realGoogleLogin = function () {
    loginHandled = false;
    showLoginOverlay("Membuka akun Google...", config.overlayAccent || "#2563EB");
    sessionStorage.setItem("rb_google_login_pending", "true");
    localStorage.setItem("rb_login_in_progress", "true");
    signInWithRedirect(auth, provider).catch((err) => {
      hideLoginOverlay();
      clearLoginPending();
      console.error("[Auth] signInWithRedirect:", err);
      alert(
        "Gagal membuka login Google.\n\n" +
          (err.message || err.code) +
          "\n\nPastikan domain ini sudah ditambahkan di Firebase Console → Authentication → Authorized domains."
      );
    });
  };

  handleReturnFromGoogle();
}

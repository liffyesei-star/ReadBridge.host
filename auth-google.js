/*
  ReadBridge — Google Sign-In (redirect) shared handler
  Safari-safe: always calls getRedirectResult on load; uses localStorage only for pending flag.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const PENDING_KEY = "rb_login_in_progress";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function log(...args) {
  console.log("[ReadBridge Auth]", ...args);
}

function isLoginPending() {
  return localStorage.getItem(PENDING_KEY) === "true";
}

function markLoginPending() {
  localStorage.setItem(PENDING_KEY, "true");
  localStorage.setItem("rb_login_started_at", String(Date.now()));
}

function clearLoginPending() {
  localStorage.removeItem(PENDING_KEY);
  localStorage.removeItem("rb_login_started_at");
  sessionStorage.removeItem("rb_google_login_pending");
}

/** URL params/hash setelah redirect dari Firebase */
function looksLikeOAuthReturn() {
  const blob = `${window.location.search}${window.location.hash}`;
  return /apiKey=|authType=|state=|oobCode=|mode=signIn/i.test(blob);
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
export async function initGoogleAuth(config = {}) {
  log("init", window.location.href);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  try {
    await setPersistence(auth, browserLocalPersistence);
    log("persistence: browserLocal");
  } catch (e) {
    console.warn("[ReadBridge Auth] setPersistence:", e.message);
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  let loginHandled = false;

  async function completeLogin(user, source = "unknown") {
    if (loginHandled || !user) return;
    loginHandled = true;
    log("completeLogin via", source, user.email);

    showLoginOverlay("Login Google berhasil, menyelesaikan...", config.overlayAccent || "#2563EB");

    let syncOk = false;
    try {
      await syncFirebaseUser(await user.getIdToken());
      syncOk = true;
    } catch (err) {
      console.warn("[ReadBridge Auth] sync gagal, lanjut dengan token Firebase:", err.message);
    }

    await persistUserSession(user, syncOk);
    showLoginOverlay("Mengalihkan...");
    await wait(300);
    window.location.replace(getRedirectTarget(config));
  }

  async function tryGetRedirectResult() {
    for (let attempt = 1; attempt <= 8; attempt++) {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          log("getRedirectResult OK attempt", attempt);
          return result.user;
        }
      } catch (err) {
        console.warn(`[ReadBridge Auth] getRedirectResult #${attempt}:`, err.code || err.message);
        if (err.code === "auth/unauthorized-domain") {
          alert(
            "Domain tidak diizinkan Firebase.\n\nTambahkan di Firebase Console → Authentication → Authorized domains:\nliffyesei-star.github.io"
          );
          clearLoginPending();
          hideLoginOverlay();
          throw err;
        }
      }
      if (attempt < 8) await wait(350);
    }
    return null;
  }

  async function handleReturnFromGoogle() {
    const pending = isLoginPending();
    const oauthReturn = looksLikeOAuthReturn();
    const alreadyIn = localStorage.getItem("rb_is_logged_in") === "true" && localStorage.getItem("rb_token");

    if (alreadyIn && !pending && !oauthReturn) {
      log("sudah login, redirect");
      window.location.replace(getRedirectTarget(config));
      return;
    }

    if (pending || oauthReturn) {
      showLoginOverlay("Melanjutkan login Google...", config.overlayAccent || "#2563EB");
    }

    log("handleReturn pending=", pending, "oauthReturn=", oauthReturn);

    // SELALU panggil getRedirectResult (tidak bergantung flag — Safari sering hapus sessionStorage)
    const userFromRedirect = await tryGetRedirectResult();
    if (userFromRedirect) {
      await completeLogin(userFromRedirect, "getRedirectResult");
      return;
    }

    // Tunggu Firebase restore session dari IndexedDB
    for (let i = 0; i < 6; i++) {
      if (auth.currentUser) {
        log("currentUser ready attempt", i + 1);
        await completeLogin(auth.currentUser, "currentUser");
        return;
      }
      await wait(500);
    }

    if (pending || oauthReturn) {
      hideLoginOverlay();
      clearLoginPending();
      log("login pending tapi tidak ada user — kemungkinan redirect dibatalkan");
    }
  }

  auth.onAuthStateChanged((user) => {
    if (!user || loginHandled) return;
    const shouldFinish = isLoginPending() || looksLikeOAuthReturn();
    if (!shouldFinish) return;
    log("onAuthStateChanged", user.email);
    setTimeout(() => {
      if (!loginHandled) completeLogin(user, "onAuthStateChanged");
    }, 800);
  });

  window.realGoogleLogin = function () {
    loginHandled = false;
    log("realGoogleLogin click");
    showLoginOverlay("Membuka akun Google...", config.overlayAccent || "#2563EB");
    markLoginPending();
    signInWithRedirect(auth, provider).catch((err) => {
      hideLoginOverlay();
      clearLoginPending();
      console.error("[ReadBridge Auth] signInWithRedirect:", err);
      const hint =
        err.code === "auth/unauthorized-domain"
          ? "\n\nTambahkan liffyesei-star.github.io di Firebase → Authorized domains."
          : "";
      alert("Gagal membuka login Google: " + (err.message || err.code) + hint);
    });
  };

  await handleReturnFromGoogle();
}

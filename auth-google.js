/*
  ReadBridge — Google Sign-In (redirect-first, logout-aware)
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signOut,
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
const SYNC_RETRY_DELAYS = [0, 1500, 3000];
const PENDING_KEY = "rb_login_in_progress";
export const LOGOUT_KEY = "rb_explicit_logout";

const RB_AUTH_KEYS = [
  "rb_token",
  "rb_is_logged_in",
  "rb_is_synced",
  "rb_username",
  "rb_email",
  "rb_uid",
  "rb_profile_pic",
  "rb_user_email",
];

let sharedAuth = null;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function log(...args) {
  console.log("[ReadBridge Auth]", ...args);
}

function setAuthStatus(text) {
  const el = document.getElementById("rb-auth-status");
  if (el) el.textContent = text;
  log("status:", text);
}

function isLoginPending() {
  return localStorage.getItem(PENDING_KEY) === "true";
}

function markLoginPending() {
  localStorage.removeItem(LOGOUT_KEY);
  localStorage.setItem(PENDING_KEY, "true");
  localStorage.setItem("rb_login_started_at", String(Date.now()));
}

function clearLoginPending() {
  localStorage.removeItem(PENDING_KEY);
  localStorage.removeItem("rb_login_started_at");
}

function isExplicitLogout() {
  return localStorage.getItem(LOGOUT_KEY) === "true";
}

function looksLikeOAuthReturn() {
  const blob = `${window.location.search}${window.location.hash}`;
  return /apiKey=|authType=|state=|oobCode=|mode=signIn/i.test(blob);
}

function stripOAuthParamsFromUrl() {
  if (!looksLikeOAuthReturn() || !window.history.replaceState) return;
  const clean = window.location.pathname + window.location.search.replace(/[?&](apiKey|authType|state|mode)=[^&]*/g, "").replace(/^\?$/, "");
  window.history.replaceState({}, document.title, clean || window.location.pathname);
}

export function clearLocalAuthSession() {
  RB_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
  clearLoginPending();
}

export async function logoutReadBridge() {
  localStorage.setItem(LOGOUT_KEY, "true");
  clearLocalAuthSession();
  if (sharedAuth) {
    try {
      await signOut(sharedAuth);
      log("Firebase signOut OK");
    } catch (e) {
      console.warn("[ReadBridge Auth] signOut:", e.message);
    }
  }
}

async function unregisterServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    if (regs.length) log("Service Worker di-unregister:", regs.length);
  } catch (e) {
    console.warn("[ReadBridge Auth] SW unregister:", e.message);
  }
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

async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
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
      i === 0 ? "Menyinkronkan akun ke server..." : `Menyinkronkan (${i + 1}/${SYNC_RETRY_DELAYS.length})...`
    );
    try {
      const response = await fetchWithTimeout(
        `${API_BASE}/api/auth/sync`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
        },
        20000
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

function hasLocalAppSession() {
  return localStorage.getItem("rb_is_logged_in") === "true" && !!localStorage.getItem("rb_token");
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
  localStorage.removeItem(LOGOUT_KEY);
  clearLoginPending();
  return idToken;
}

/**
 * @param {{ redirectAfterLogin?: string, redirectIfNoInterests?: string, overlayAccent?: string }} config
 */
export async function initGoogleAuth(config = {}) {
  setAuthStatus("Memuat modul login...");
  await unregisterServiceWorkers();
  log("init", window.location.href);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  sharedAuth = auth;

  try {
    await setPersistence(auth, browserLocalPersistence);
    log("persistence OK");
  } catch (e) {
    console.warn("[ReadBridge Auth] setPersistence:", e.message);
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  let loginHandled = false;
  let userInitiatedLogin = false;

  async function completeLogin(user, source = "unknown") {
    if (loginHandled || !user) return;
    if (!userInitiatedLogin && !isLoginPending() && !looksLikeOAuthReturn()) {
      log("skip completeLogin — bukan login aktif:", source);
      return;
    }
    loginHandled = true;
    log("completeLogin", source, user.email);
    setAuthStatus("Login berhasil: " + user.email);

    showLoginOverlay("Login Google berhasil...", config.overlayAccent || "#2563EB");

    let syncOk = false;
    try {
      await syncFirebaseUser(await user.getIdToken());
      syncOk = true;
    } catch (err) {
      console.warn("[ReadBridge Auth] sync gagal (login tetap jalan):", err.message);
    }

    await persistUserSession(user, syncOk);
    stripOAuthParamsFromUrl();
    showLoginOverlay("Mengalihkan...");
    await wait(300);
    window.location.replace(getRedirectTarget(config));
  }

  async function tryGetRedirectResult() {
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          log("getRedirectResult OK #" + attempt);
          return result.user;
        }
        log("getRedirectResult null #" + attempt);
      } catch (err) {
        console.warn("[ReadBridge Auth] getRedirectResult:", err.code || err.message);
        if (err.code === "auth/unauthorized-domain") {
          alert(
            "Domain tidak diizinkan di Firebase.\n\nBuka Firebase Console → Authentication → Authorized domains\n→ tambahkan: liffyesei-star.github.io"
          );
          clearLoginPending();
          hideLoginOverlay();
          setAuthStatus("Error: unauthorized-domain");
          throw err;
        }
      }
      if (attempt < 10) await wait(350);
    }
    return null;
  }

  async function loginWithPopup() {
    userInitiatedLogin = true;
    loginHandled = false;
    markLoginPending();
    setAuthStatus("Membuka popup Google...");
    showLoginOverlay("Membuka popup Google...", config.overlayAccent || "#2563EB");
    try {
      const result = await signInWithPopup(auth, provider);
      clearLoginPending();
      await completeLogin(result.user, "popup");
    } catch (err) {
      hideLoginOverlay();
      clearLoginPending();
      userInitiatedLogin = false;
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        setAuthStatus("Popup ditutup");
        return;
      }
      if (err.code === "auth/popup-blocked") {
        setAuthStatus("Popup diblokir — pakai redirect");
        alert("Popup diblokir. Mencoba redirect...");
        return loginWithRedirect();
      }
      console.error("[ReadBridge Auth] popup error:", err);
      setAuthStatus("Popup gagal — pakai redirect");
      alert("Popup gagal: " + (err.message || err.code) + "\n\nMencoba redirect...");
      return loginWithRedirect();
    }
  }

  async function loginWithRedirect() {
    userInitiatedLogin = true;
    loginHandled = false;
    markLoginPending();
    setAuthStatus("Redirect ke Google...");
    showLoginOverlay("Membuka halaman Google...", config.overlayAccent || "#2563EB");
    log("signInWithRedirect");
    return signInWithRedirect(auth, provider);
  }

  async function ensureLoggedOutState() {
    if (!isExplicitLogout()) return false;
    setAuthStatus("Keluar dari akun Google...");
    if (auth.currentUser) {
      try {
        await signOut(auth);
        log("signed out after explicit logout");
      } catch (e) {
        console.warn("[ReadBridge Auth] signOut on login page:", e.message);
      }
    }
    clearLocalAuthSession();
    hideLoginOverlay();
    setAuthStatus("Silakan masuk dengan Google");
    return true;
  }

  async function handleReturnFromGoogle() {
    if (await ensureLoggedOutState()) return;

    const pending = isLoginPending();
    const oauthReturn = looksLikeOAuthReturn();
    const alreadyIn = hasLocalAppSession();

    log("handleReturn", { pending, oauthReturn, alreadyIn, currentUser: !!auth.currentUser });

    if (alreadyIn && !pending && !oauthReturn && !isExplicitLogout()) {
      setAuthStatus("Sudah login, mengalihkan...");
      window.location.replace(getRedirectTarget(config));
      return;
    }

    if (pending || oauthReturn) {
      showLoginOverlay("Melanjutkan login Google...", config.overlayAccent || "#2563EB");
      setAuthStatus("Memproses balasan dari Google...");
      userInitiatedLogin = true;
    } else {
      setAuthStatus("Siap — klik Masuk dengan Google");
      return;
    }

    const userFromRedirect = await tryGetRedirectResult();
    if (userFromRedirect) {
      await completeLogin(userFromRedirect, "redirect");
      return;
    }

    if (auth.currentUser && (pending || oauthReturn)) {
      await completeLogin(auth.currentUser, "currentUser-after-oauth");
      return;
    }

    if (pending || oauthReturn) {
      hideLoginOverlay();
      clearLoginPending();
      userInitiatedLogin = false;
      stripOAuthParamsFromUrl();
      setAuthStatus("Gagal: sesi Google tidak ditemukan setelah redirect");
      log("redirect finished without firebase user");
      alert(
        "Login Google tidak selesai.\n\n" +
          "Coba:\n" +
          "1. Domain liffyesei-star.github.io di Firebase → Authorized domains\n" +
          "2. Hapus data situs / Incognito\n" +
          "3. Tutup PWA, buka lewat Safari/Chrome biasa dulu"
      );
    }
  }

  auth.onAuthStateChanged((user) => {
    if (!user || loginHandled) return;
    if (!isLoginPending() && !looksLikeOAuthReturn()) return;
    log("onAuthStateChanged", user.email);
    setTimeout(() => {
      if (!loginHandled && (isLoginPending() || looksLikeOAuthReturn())) {
        completeLogin(user, "authState");
      }
    }, 400);
  });

  // Redirect = metode yang jalan di Safari; dipakai default untuk semua browser/PWA
  window.realGoogleLogin = function () {
    log("realGoogleLogin → redirect");
    loginWithRedirect().catch((err) => {
      hideLoginOverlay();
      clearLoginPending();
      userInitiatedLogin = false;
      console.error("[ReadBridge Auth] redirect:", err);
      alert("Gagal login Google: " + (err.message || err.code));
    });
  };

  window.realGoogleLoginPopup = function () {
    log("realGoogleLoginPopup");
    loginWithPopup();
  };

  window.realGoogleLoginRedirect = window.realGoogleLogin;

  await handleReturnFromGoogle();
}

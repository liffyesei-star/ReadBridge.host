/*
  ReadBridge — Google Sign-In
  OAuth hanya lewat auth-handler.html (halaman ringan, tanpa SW).
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  initializeAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
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
const HANDLER_PAGE = "auth-handler.html";
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
let firebaseApp = null;

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
  return (
    localStorage.getItem(PENDING_KEY) === "true" ||
    sessionStorage.getItem(PENDING_KEY) === "true"
  );
}

function markLoginPending() {
  localStorage.removeItem(LOGOUT_KEY);
  localStorage.setItem(PENDING_KEY, "true");
  sessionStorage.setItem(PENDING_KEY, "true");
  sessionStorage.setItem("rb_login_started_at", String(Date.now()));
}

function clearLoginPending() {
  localStorage.removeItem(PENDING_KEY);
  sessionStorage.removeItem(PENDING_KEY);
  sessionStorage.removeItem("rb_login_started_at");
}

function isExplicitLogout() {
  return localStorage.getItem(LOGOUT_KEY) === "true";
}

function looksLikeOAuthReturn() {
  const blob = `${window.location.search}${window.location.hash}`;
  return /apiKey=|authType=|state=|oobCode=|mode=signIn/i.test(blob);
}

function wantsToStartLogin() {
  return new URLSearchParams(window.location.search).get("go") === "1";
}

function stripOAuthParamsFromUrl() {
  if (!looksLikeOAuthReturn() || !window.history.replaceState) return;
  window.history.replaceState({}, document.title, window.location.pathname);
}

function prefersPopup() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return false;
  if (/Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg/i.test(ua)) return false;
  return true;
}

function createAuth() {
  if (sharedAuth) return sharedAuth;
  if (!firebaseApp) firebaseApp = initializeApp(firebaseConfig);
  sharedAuth = initializeAuth(firebaseApp, {
    persistence: browserLocalPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  return sharedAuth;
}

export function clearLocalAuthSession() {
  RB_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
  clearLoginPending();
}

export async function logoutReadBridge() {
  localStorage.setItem(LOGOUT_KEY, "true");
  clearLocalAuthSession();
  const auth = sharedAuth || createAuth();
  try {
    await signOut(auth);
    log("Firebase signOut OK");
  } catch (e) {
    console.warn("[ReadBridge Auth] signOut:", e.message);
  }
}

async function syncFirebaseUser(idToken) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_BASE}/api/auth/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success) return data;
    throw new Error(data.message || `Sync gagal (${response.status})`);
  } finally {
    clearTimeout(t);
  }
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
}

async function finishLogin(user, config) {
  setAuthStatus("Login berhasil, menyinkronkan...");
  let syncOk = false;
  try {
    await syncFirebaseUser(await user.getIdToken());
    syncOk = true;
  } catch (err) {
    console.warn("[ReadBridge Auth] sync gagal (login tetap jalan):", err.message);
  }
  await persistUserSession(user, syncOk);
  stripOAuthParamsFromUrl();
  setAuthStatus("Mengalihkan...");
  window.location.replace(getRedirectTarget(config));
}

function failRedirect(config, extra = "") {
  clearLoginPending();
  stripOAuthParamsFromUrl();
  setAuthStatus("Login gagal");
  const msg =
    "Login Google tidak selesai.\n\n" +
    "Coba urutan ini:\n" +
    "1. Application → Clear site data (centang semua)\n" +
    "2. Buka login di tab biasa (bukan PWA)\n" +
    "3. Firebase → Authorized domains → tambah liffyesei-star.github.io\n" +
    (prefersPopup() ? "4. Di login, klik «Coba dengan popup»\n" : "") +
    extra;
  alert(msg);
  window.location.replace("login.html?auth_failed=1");
}

/**
 * Halaman khusus OAuth — dipanggil dari auth-handler.html
 */
export async function runGoogleAuthHandler(config = {}) {
  log("handler", location.href, { oauth: looksLikeOAuthReturn(), pending: isLoginPending(), go: wantsToStartLogin() });

  if (isExplicitLogout()) {
    const auth = createAuth();
    try {
      await signOut(auth);
    } catch (_) {}
    clearLocalAuthSession();
    window.location.replace("login.html");
    return;
  }

  if (hasLocalAppSession() && !looksLikeOAuthReturn() && !isLoginPending() && !wantsToStartLogin()) {
    window.location.replace(getRedirectTarget(config));
    return;
  }

  const auth = createAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const finishing = looksLikeOAuthReturn() || isLoginPending();

  if (finishing) {
    setAuthStatus("Memproses login Google...");

    let redirectError = null;
    let user = null;
    try {
      const result = await getRedirectResult(auth);
      user = result?.user || null;
      log("getRedirectResult", user?.email || "null");
    } catch (err) {
      redirectError = err;
      console.warn("[ReadBridge Auth] getRedirectResult:", err.code, err.message);
      if (err.code === "auth/unauthorized-domain") {
        alert("Domain tidak diizinkan.\n\nFirebase → Authorized domains → liffyesei-star.github.io");
        window.location.replace("login.html");
        return;
      }
    }

    if (!user && auth.currentUser) {
      user = auth.currentUser;
      log("pakai auth.currentUser", user.email);
    }

    if (!user) {
      for (let i = 0; i < 6; i++) {
        await wait(400);
        if (auth.currentUser) {
          user = auth.currentUser;
          log("currentUser muncul", user.email);
          break;
        }
      }
    }

    if (user) {
      await finishLogin(user, config);
      return;
    }

    failRedirect(config, redirectError ? `\nTeknis: ${redirectError.code || redirectError.message}` : "");
    return;
  }

  const forcePopup = new URLSearchParams(window.location.search).get("popup") === "1";

  if (wantsToStartLogin()) {
    markLoginPending();
    if (forcePopup || prefersPopup()) {
      setAuthStatus("Membuka popup Google...");
      try {
        const result = await signInWithPopup(auth, provider);
        clearLoginPending();
        await finishLogin(result.user, config);
        return;
      } catch (err) {
        console.warn("[ReadBridge Auth] popup gagal, coba redirect:", err.code);
        if (err.code === "auth/popup-closed-by-user") {
          window.location.replace("login.html");
          return;
        }
        markLoginPending();
      }
    }
    setAuthStatus("Mengalihkan ke Google...");
    await signInWithRedirect(auth, provider);
    return;
  }

  window.location.replace("login.html");
}

/**
 * Halaman login — tombol saja, OAuth di auth-handler.html
 */
export async function initGoogleAuth(config = {}) {
  setAuthStatus("Memuat...");

  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch (_) {}
  }

  if (isExplicitLogout()) {
    try {
      await signOut(createAuth());
    } catch (_) {}
    clearLocalAuthSession();
    setAuthStatus("Silakan masuk dengan Google");
  } else if (hasLocalAppSession()) {
    setAuthStatus("Sudah login, mengalihkan...");
    window.location.replace(getRedirectTarget(config));
    return;
  } else {
    const failed = new URLSearchParams(window.location.search).get("auth_failed");
    setAuthStatus(failed ? "Login gagal — coba lagi" : "Siap — klik Masuk dengan Google");
  }

  window.realGoogleLogin = function () {
    markLoginPending();
    window.location.href = `${HANDLER_PAGE}?go=1`;
  };

  window.realGoogleLoginPopup = function () {
    markLoginPending();
    window.location.href = `${HANDLER_PAGE}?go=1&popup=1`;
  };

  window.realGoogleLoginRedirect = function () {
    markLoginPending();
    window.location.href = `${HANDLER_PAGE}?go=1`;
  };
}

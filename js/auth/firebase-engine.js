/**
 * ReadBridge — Firebase Authentication Engine
 * Tanggung Jawab: Setup Firebase, Alur Google Login (Popup & Redirect), Whitelist Check.
 */
import { saveSession } from './session.js';
import { syncGoogleToken } from './api.js';

const RB_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDUfiy2BHYhHh1wql6uM5UvsF6hpNTVvhY",
  authDomain: "readbridge-8934c.firebaseapp.com",
  projectId: "readbridge-8934c",
  storageBucket: "readbridge-8934c.firebasestorage.app",
  messagingSenderId: "900450201794",
  appId: "1:900450201794:web:8d65f989e7fefe590d8b5b",
};

const ALLOWED_EMAILS = [
  'liffy_sei@liffy-seis-macbook-air.local',
  'tester@readbridge.com',
  'admin@readbridge.com',
  'rafanrizqoni@gmail.com',
  'liffyesei@gmail.com'
];

let authInstance = null;

export function getFirebaseAuth() {
  if (authInstance) return authInstance;

  if (typeof firebase === 'undefined') {
    console.error("[ReadBridge Auth] Firebase Compat SDK belum dimuat di HTML!");
    return null;
  }
  
  if (!firebase.apps.length) {
    firebase.initializeApp(RB_FIREBASE_CONFIG);
  }
  
  authInstance = firebase.auth();
  try {
    authInstance.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  } catch (e) {
    // Abaikan jika env tidak support
  }
  
  return authInstance;
}

export function isAllowedEmail(email) {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ALLOWED_EMAILS.includes(clean) || clean.endsWith('@readbridge.com');
}

function isSafariOrIOS() {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(platform) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isSafari || isIOS;
}

export function useRedirectLogin() {
  sessionStorage.setItem("rb_redirect_pending", "true");
  window.location.href = "auth-handler.html?go=1";
}

/**
 * Memulai proses login Google.
 * @param {Function} onStatusChange Callback untuk mengupdate UI (status text).
 * @param {Function} onSuccess Callback saat login sukses.
 * @param {Function} onError Callback saat terjadi error.
 */
export async function startGoogleLogin(onStatusChange, onSuccess, onError) {
  const auth = getFirebaseAuth();
  if (!auth) {
    if (onError) onError("Firebase tidak siap.");
    return;
  }

  // Cek Safari/iOS ITP Constraint
  if (isSafariOrIOS()) {
    console.log("[ReadBridge Auth] Safari/iOS terdeteksi. Menggunakan alur Redirect...");
    if (onStatusChange) onStatusChange("Mengalihkan ke sistem login aman Safari...");
    setTimeout(useRedirectLogin, 300);
    return;
  }

  if (onStatusChange) onStatusChange("Membuka Google...");
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  // Listener untuk menangkap jika popup gagal komunikasi tapi Firebase state berubah
  const unsub = auth.onAuthStateChanged(user => {
    if (user) {
      unsub();
      processGoogleUser(user, onStatusChange, onSuccess, onError);
    }
  });

  try {
    const cred = await auth.signInWithPopup(provider);
    if (cred && cred.user) {
      unsub();
      await processGoogleUser(cred.user, onStatusChange, onSuccess, onError);
    }
  } catch (err) {
    unsub();
    if (err.code === "auth/popup-closed-by-user") {
      if (onError) onError("Dibatalkan.");
      return;
    }
    if (err.code === "auth/popup-blocked" || err.code === "auth/internal-error") {
      if (onStatusChange) onStatusChange("Mengalihkan ke alur redirect...");
      setTimeout(useRedirectLogin, 600);
      return;
    }
    if (onError) onError(err.message || "Gagal login.");
  }
}

/**
 * Memproses user setelah Firebase berhasil auth.
 */
export async function processGoogleUser(user, onStatusChange, onSuccess, onError) {
  if (!isAllowedEmail(user.email)) {
    getFirebaseAuth().signOut();
    if (onError) onError("Akun belum terdaftar dalam daftar putih (Closed Alpha).");
    return;
  }

  if (onStatusChange) onStatusChange("Menyinkronkan akun...");
  
  try {
    const firebaseToken = await user.getIdToken(true);
    const syncRes = await syncGoogleToken(firebaseToken);
    
    if (syncRes && syncRes.token) {
      saveSession({ token: syncRes.token, user: syncRes.user, isGoogle: false });
    } else {
      // Fallback if sync doesn't return a token
      saveSession({ token: firebaseToken, user, isGoogle: true });
    }
    if (onSuccess) onSuccess(user);
  } catch (err) {
    if (onError) onError("Gagal sinkronisasi token dengan server: " + err.message);
  }
}

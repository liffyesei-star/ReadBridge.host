/**
 * ReadBridge — Logout Manager
 * Tanggung Jawab: Menghapus sesi, intercept fetch untuk 401, dan event listener tombol logout.
 */
import { clearSession, isSessionValid } from './session.js';
import { getFirebaseAuth } from './firebase-engine.js';

// Public pages list
const PUBLIC_PAGES = [
  "login.html", "register.html", "auth-handler.html", "reset-password.html",
  "debug-login.html", "tentang-kami.html", "pusat-bantuan.html",
  "kebijakan-privasi.html", "syarat-dan-ketentuan.html"
];

function isPublicPage(path) {
  return PUBLIC_PAGES.some(page => path.includes(page));
}

/**
 * Fungsi logout global.
 */
export async function logoutUser(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      await auth.signOut().catch(() => {});
    }
  } catch (err) {
    console.warn("[ReadBridge Auth] Logout error:", err);
  } finally {
    clearSession();
    window.location.href = "login.html";
  }
}

/**
 * Trigger logout paksa (misal token expired atau 401).
 */
export function triggerAutoLogout(message = "Sesi Anda telah berakhir. Silakan login kembali.") {
  console.warn(`[ReadBridge Auth] ${message}`);
  clearSession();
  try {
    const auth = getFirebaseAuth();
    if (auth) auth.signOut().catch(() => {});
  } catch (e) {}
  alert(message);
  window.location.href = "login.html";
}

// ─── INIT: Event Listeners & Interceptors ───
export function initLogoutManager() {
  // Global Logout Click Listener
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="login.html"]');
    if (!link || !/log\s*out/i.test(link.textContent)) return;
    
    if (link.getAttribute("data-rb-logout-handled") === "1") return;
    link.setAttribute("data-rb-logout-handled", "1");
    logoutUser(event);
  }, true);

  // Check Token Expiration secara berkala
  const checkToken = () => {
    const path = window.location.pathname.toLowerCase();
    if (isPublicPage(path)) return;
    
    // Jika tidak valid padahal ada token, logout.
    if (localStorage.getItem("rb_token") && !isSessionValid()) {
      triggerAutoLogout("Sesi login Anda telah kedaluwarsa.");
    }
  };
  
  setTimeout(checkToken, 1000);
  setInterval(checkToken, 10000);

  // Fetch Interceptor untuk otomatis logout jika API return 401
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    if (response.status === 401) {
      const path = window.location.pathname.toLowerCase();
      if (!isPublicPage(path)) {
        triggerAutoLogout("Akses ditolak (401). Sesi tidak valid.");
      }
    }
    return response;
  };
}

// Auto init saat modul dimuat
initLogoutManager();

/**
 * ReadBridge — Session Manager
 * Tanggung Jawab: Menyimpan, menghapus, dan memvalidasi token sesi di localStorage.
 */

const SESSION_KEYS = [
  "rb_token",
  "rb_is_logged_in",
  "rb_is_synced",
  "rb_username",
  "rb_email",
  "rb_uid",
  "rb_profile_pic",
  "rb_user_email",
  "rb_has_toko",
];

/**
 * Parsing JWT token untuk mendapatkan payload.
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Cek apakah sesi saat ini masih valid (token belum expired).
 */
export function isSessionValid() {
  const token = localStorage.getItem("rb_token");
  const isLoggedIn = localStorage.getItem("rb_is_logged_in") === "true";
  
  if (!token || !isLoggedIn) return false;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;

  // Cek expiry (dalam detik, diubah ke milidetik)
  return Date.now() < payload.exp * 1000;
}

/**
 * Simpan data sesi lengkap (dari login Google atau lokal).
 */
export function saveSession({ token, user, isGoogle = false }) {
  localStorage.removeItem("rb_explicit_logout");
  localStorage.setItem("rb_is_logged_in", "true");
  localStorage.setItem("rb_token", token);
  
  if (isGoogle) {
    localStorage.setItem("rb_username", user.displayName || (user.email ? user.email.split('@')[0] : "Google User"));
    localStorage.setItem("rb_email", user.email || "");
    localStorage.setItem("rb_uid", user.uid);
    if (user.photoURL) {
      localStorage.setItem("rb_profile_pic", user.photoURL);
    }
  } else {
    localStorage.setItem("rb_username", user.nama || user.username || "Pengguna");
    localStorage.setItem("rb_email", user.email || "");
    if (user.id) localStorage.setItem("rb_uid", user.id);
  }
}

/**
 * Hapus semua data sesi dari local storage.
 */
export function clearSession() {
  localStorage.setItem("rb_explicit_logout", "true");
  SESSION_KEYS.forEach(k => localStorage.removeItem(k));
  sessionStorage.removeItem("rb_google_busy");
}

/**
 * Mendapatkan token saat ini.
 */
export function getToken() {
  return localStorage.getItem("rb_token");
}

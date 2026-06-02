/**
 * Logout ReadBridge: hapus sesi lokal + Firebase signOut.
 * Pasang <script src="auth-logout.js?v=1"></script> di halaman yang punya menu Log Out.
 */
const AUTH_MODULE = "./auth-google.js?v=6";

function clearLocalAuthFallback() {
  localStorage.setItem("rb_explicit_logout", "true");
  [
    "rb_token",
    "rb_is_logged_in",
    "rb_is_synced",
    "rb_username",
    "rb_email",
    "rb_uid",
    "rb_profile_pic",
    "rb_user_email",
    "rb_login_in_progress",
    "rb_login_started_at",
  ].forEach((k) => localStorage.removeItem(k));
}

window.rbLogout = async function rbLogout(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    const mod = await import(AUTH_MODULE);
    await mod.logoutReadBridge();
  } catch (err) {
    console.warn("[ReadBridge] logout fallback:", err);
    clearLocalAuthFallback();
  }
  window.location.href = "login.html";
};

document.addEventListener(
  "click",
  (event) => {
    const link = event.target.closest('a[href*="login.html"]');
    if (!link || !/log\s*out/i.test(link.textContent)) return;
    event.preventDefault();
    event.stopPropagation();
    if (link.getAttribute("data-rb-logout-handled") === "1") return;
    link.setAttribute("data-rb-logout-handled", "1");
    rbLogout(event);
  },
  true
);

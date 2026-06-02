/**
 * ReadBridge — logout & util sesi (login Google ada di auth-handler.html)
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUfiy2BHYhHh1wql6uM5UvsF6hpNTVvhY",
  authDomain: "readbridge-8934c.firebaseapp.com",
  projectId: "readbridge-8934c",
  storageBucket: "readbridge-8934c.firebasestorage.app",
  messagingSenderId: "900450201794",
  appId: "1:900450201794:web:8d65f989e7fefe590d8b5b",
};

export const LOGOUT_KEY = "rb_explicit_logout";

const SESSION_KEYS = [
  "rb_token",
  "rb_is_logged_in",
  "rb_is_synced",
  "rb_username",
  "rb_email",
  "rb_uid",
  "rb_profile_pic",
  "rb_user_email",
  "rb_login_in_progress",
];

let authInstance = null;

function getAuthInstance() {
  if (!authInstance) {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function clearLocalAuthSession() {
  SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("rb_login_in_progress");
}

export async function logoutReadBridge() {
  localStorage.setItem(LOGOUT_KEY, "true");
  clearLocalAuthSession();
  sessionStorage.removeItem("rb_google_busy");
  try {
    await signOut(getAuthInstance());
  } catch (e) {
    console.warn("[ReadBridge] signOut:", e.message);
  }
}

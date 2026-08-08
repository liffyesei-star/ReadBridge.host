/**
 * ReadBridge — API Manager
 * Tanggung Jawab: Berkomunikasi dengan backend (Login, Register, Sync, Forgot Password).
 */
import { getToken } from './session.js';

const API_PROD = "https://readbridge-backend-2whx.onrender.com";

export function getApiBaseUrl() {
  const saved = localStorage.getItem("rb_api_base_url");
  if (saved) return saved;
  const h = window.location.hostname;
  const isLocal = h === "localhost" || h === "127.0.0.1" || h.startsWith("192.168.") || h.endsWith(".local");
  return isLocal ? "http://" + h + ":5001" : API_PROD;
}

/**
 * Custom fetcher yang secara otomatis menyisipkan token Authorization jika ada.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers
  });

  return response;
}

export async function loginLocal(email, password) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function registerLocal(nama, email, password) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nama, email, password })
  });
  return res.json();
}

export async function syncGoogleToken(firebaseIdToken) {
  const res = await apiFetch('/api/auth/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${firebaseIdToken}` }
  });
  if (!res.ok) {
    let errMsg = `Sync failed with status ${res.status}`;
    try {
      const errData = await res.json();
      if (errData.message) errMsg = errData.message;
    } catch(e) {
      // Response wasn't JSON, ignore
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export async function forgotPassword(email) {
  const res = await apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function resetPassword(token, newPassword) {
  const res = await apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  });
  return res.json();
}

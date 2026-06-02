# Checklist Login Google ReadBridge (wajib)

Jika login Google gagal di **Safari, Chrome, Android**, cek urutan ini:

## 1. Firebase Console → Authentication → Settings → Authorized domains

Tambahkan domain berikut (jika belum ada):

- `localhost`
- `liffyesei-star.github.io`
- `readbridge-8934c.firebaseapp.com` (biasanya sudah ada)

Tanpa `liffyesei-star.github.io`, login dari GitHub Pages **pasti gagal**.

## 2. Firebase Console → Authentication → Sign-in method

- **Google** harus **Enabled**
- Support email diisi

## 3. Google Cloud Console (project `readbridge-8934c`)

**APIs & Services → Credentials → OAuth 2.0 Client (Web client auto-created by Firebase)**

**Authorized JavaScript origins:**

- `https://liffyesei-star.github.io`
- `http://localhost` (untuk dev lokal)

**Authorized redirect URIs:**

- `https://readbridge-8934c.firebaseapp.com/__/auth/handler`

## 4. Render backend

Pastikan env vars Firebase Admin lengkap (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, dll.).

Login Google **tetap bisa** meski sync backend gagal (setelah fix terbaru), tapi fitur posting/komentar butuh backend hidup.

## 5. Cache browser / PWA

1. Buka `debug-login.html` di situs Anda
2. Klik **Clear Cache & Reload**
3. Atau: Settings → hapus data situs untuk `liffyesei-star.github.io`

Service Worker lama bisa menyimpan JS login versi lama.

## 6. URL yang benar

Gunakan:

`https://liffyesei-star.github.io/ReadBridge.host/login.html`

Bukan file lokal `file://` untuk tes login Google.

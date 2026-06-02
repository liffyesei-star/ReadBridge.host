# Setup Firebase Google Login (ReadBridge)

Ikuti **berurutan** setelah rebuild auth.

## 1. Firebase Console

Project: **readbridge-8934c**

### Authentication → Sign-in method

- **Google** = Enabled  
- Support email diisi  

### Authentication → Settings → Authorized domains

Tambahkan jika belum ada:

- `localhost`
- `liffyesei-star.github.io`

## 2. Google Cloud Console

Project yang sama → **APIs & Services → Credentials** → OAuth 2.0 Client ID (Web client dari Firebase)

**Authorized JavaScript origins:**

- `https://liffyesei-star.github.io`
- `http://localhost`

**Authorized redirect URIs:**

- `https://readbridge-8934c.firebaseapp.com/__/auth/handler`

## 3. Render (backend)

Env Firebase Admin harus lengkap (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, dll.).

Login tetap jalan meski sync gagal; posting komunitas butuh backend hidup.

## 4. Tes login

1. Chrome → **Clear site data** untuk `github.io`  
2. Buka: `https://liffyesei-star.github.io/ReadBridge.host/login.html`  
3. Klik **Masuk dengan Google** → URL harus ke `auth-handler.html?go=1`  
4. Pilih akun Google → harus masuk `eksplor.html` atau `minat.html`  

**Chrome PC gagal?** Klik link **Coba dengan popup**.

**Jangan pakai PWA** untuk tes pertama — pakai tab browser biasa.

## 5. Alur kode (setelah rebuild)

| File | Fungsi |
|------|--------|
| `login.html` | Tombol → `auth-handler.html?go=1` |
| `auth-handler.html` | Satu-satunya halaman OAuth (Firebase compat) |
| `rb-auth.js` | Logout + hapus sesi |
| `auth-logout.js` | Menu Log Out di seluruh situs |

`auth-google.js` lama tidak dipakai untuk login lagi.

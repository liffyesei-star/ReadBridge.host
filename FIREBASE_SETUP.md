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
3. Klik **Masuk dengan Google** → **popup** Google (tetap di halaman login)  
4. Setelah berhasil → klik **Lanjut ke ReadBridge** (tidak auto-redirect)  

**Safari / iPhone:** klik link **Pakai metode redirect**.

Tunggu **8 detik** antar percobaan login (cooldown anti-loop).

## 5. Alur kode

| File | Fungsi |
|------|--------|
| `login.html` + `rb-google-login.js` | Popup Google (Chrome/Android Chrome) |
| `auth-handler.html` | Redirect saja (Safari/iPhone) |
| `rb-auth.js` | Logout |
| `auth-logout.js` | Menu Log Out |

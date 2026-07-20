# ReadBridge

**Deskripsi singkat**  
ReadBridge adalah sebuah platform literasi digital (Web PWA + Backend API + aplikasi Android) yang menyediakan e-book, jurnal akademik, modul pembelajaran, marketplace, dan fitur komunitas (diskusi & klub). Pengguna masuk menggunakan Firebase (Google SSO / email) lalu frontend melakukan sinkronisasi akun ke backend Node.js yang menyimpan data utama di MySQL.

---

## Teknologi yang digunakan
- Frontend: Static HTML + Tailwind CSS + Vanilla JavaScript (PWA: `manifest.json`, `sw.js`)  
- Backend: Node.js (>=18) + Express  
- Database: MySQL (`mysql2`)  
- Authentication: Firebase Authentication (client SDK) + `firebase-admin` di backend  
- Upload: `multer` / Cloudinary (opsional)  
- Payment: Midtrans (`midtrans-client`)  
- Lainnya (backend): `bcryptjs`, `jsonwebtoken`, `joi`, `nodemailer`, `uuid`, `morgan`, `helmet`, `express-rate-limit`  
- Mobile: Android (Gradle/Kotlin) di `readbridge-android/`

Referensi dokumentasi backend: `backend/DOKUMENTASI.md`.

---

## Cara menjalankan website (lokal)
Persyaratan: Node.js >= 18, MySQL, (opsional) Android Studio untuk modul Android.

1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env → isi DB_*, FIREBASE_*, MIDTRANS_*, FRONTEND_URL, ALLOWED_ORIGINS, dsb.
# (opsional) migrasi & seed jika tersedia:
# node database/migrate.js
# node database/seed.js
npm run dev   # untuk development (nodemon)
# atau
npm start     # untuk production
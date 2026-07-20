# 📖 ReadBridge — About & Manual Guide

> **Ekosistem Literasi Digital Terpadu** (Web PWA + Backend API + Aplikasi Mobile Android)  
> Menghubungkan Pembaca, Penulis, Perpustakaan Mitra, dan Komunitas Literasi.

---

## 📋 Daftar Isi
1. [Tentang ReadBridge (About ReadBridge)](#1-tentang-readbridge-about-readbridge)
   - [1.1 Latar Belakang & Visi Misi](#11-latar-belakang--visi-misi)
   - [1.2 Fitur-Fitur Unggulan](#12-fitur-fitur-unggulan)
   - [1.3 Arsitektur Sistem & Teknologi](#13-arsitektur-sistem--teknologi)
   - [1.4 Model Data & Skema Database](#14-model-data--skema-database)
2. [Panduan Instalasi & Pengoperasian (System Setup Guide)](#2-panduan-instalasi--pengoperasian-system-setup-guide)
   - [2.1 Prasyarat Sistem](#21-prasyarat-sistem)
   - [2.2 Pengaturan Database MySQL](#22-pengaturan-database-mysql)
   - [2.3 Pengaturan Backend (Node.js API)](#23-pengaturan-backend-nodejs-api)
   - [2.4 Pengaturan Frontend (Web & PWA)](#24-pengaturan-frontend-web--pwa)
   - [2.5 Pengaturan Aplikasi Mobile Android](#25-pengaturan-aplikasi-mobile-android)
3. [Panduan Pengguna (User Manual Guide)](#3-panduan-pengguna-user-manual-guide)
   - [3.1 Alur Registrasi & Onboarding](#31-alur-registrasi--onboarding)
   - [3.2 Autentikasi (Email/Password & Google SSO)](#32-autentikasi-emailpassword--google-sso)
   - [3.3 Eksplorasi Katalog & Rangkuman Edukasi](#33-eksplorasi-katalog--rangkuman-edukasi)
   - [3.4 Marketplace (Pembelian & Penyewaan Buku)](#34-marketplace-pembelian--penyewaan-buku)
   - [3.5 Perpustakaan Saya & Pembaca E-Book](#35-perpustakaan-saya--pembaca-e-book)
   - [3.6 Komunitas, Klub Baca & Forum Diskusi](#36-komunitas-klub-baca--forum-diskusi)
   - [3.7 Fitur Penjual / Creator (Buka Toko & Dashboard)](#37-fitur-penjual--creator-buka-toko--dashboard)
   - [3.8 Gamifikasi & Sistem Poin Leaderboard](#38-gamifikasi--sistem-poin-leaderboard)
4. [Panduan Instalasi PWA (Progressive Web App)](#4-panduan-instalasi-pwa-progressive-web-app)
5. [Troubleshooting & FAQ](#5-troubleshooting--faq)

---

## 1. Tentang ReadBridge (About ReadBridge)

### 1.1 Latar Belakang & Visi Misi
**ReadBridge** adalah sebuah platform ekosistem literasi digital komprehensif yang dirancang untuk menjawab tantangan rendahnya minat baca serta keterbatasan akses terhadap bahan bacaan berkualitas, jurnal akademik, dan modul pembelajaran di Indonesia.

ReadBridge menjembatani hubungan antara **Pembaca**, **Penulis/Kreator**, **Perpustakaan Mitra**, dan **Komunitas Literasi** dalam satu platform interaktif berbasis Web PWA (*Progressive Web App*), RESTful API Backend, serta aplikasi Android native.

* **Visi**: Menjadi ekosistem literasi digital inklusif terbesar di Indonesia yang memudahkan akses pengetahuan untuk semua kalangan.
* **Misi**:
  1. Menyediakan pilihan akses literasi yang fleksibel melalui skema beli permanen maupun sewa terjangkau (7, 14, atau 30 hari).
  2. Memfasilitasi edukasi dan penelitian dengan menyediakan jurnal ilmiah serta rangkuman materi persiapan ujian (seperti SNBT).
  3. Membangun ruang komunitas yang aktif melalui forum diskusi bertema, klub buku, dan sistem gamifikasi.
  4. Memberdayakan penulis independen dan toko buku melalui fitur Marketplace dan Seller Dashboard.

---

### 1.2 Fitur-Fitur Unggulan

ReadBridge dirancang dengan berbagai modul interaktif:

| Modul Fitur | Deskripsi |
| :--- | :--- |
| **🔐 Autentikasi Hibrid & Sync** | Dukungan Firebase Auth (Google Single Sign-On & Email/Password) dengan otomatisasi pemetaan (*synchronization*) akun pengguna ke database MySQL backend. |
| **📚 Marketplace & Penyewaan Buku** | Beli e-book secara permanen atau sewa secara proporsional (7, 14, 30 hari). Terintegrasi dengan sistem checkout, keranjang dinamis, dan payment gateway Midtrans. |
| **📖 Perpustakaan Digital Saya** | Tempat menyimpan koleksi e-book yang telah dibeli atau disewa, dilengkapi pelacak masa berlaku sewa dan pembaca digital terintegrasi. |
| **🎓 Jurnal & Rangkuman Edukasi** | Akses ke artikel publikasi, jurnal penelitian ilmiah, serta modul rangkuman pembelajaran terstruktur (misalnya Rangkuman Literasi Indonesia SNBT). |
| **💬 Komunitas & Klub Baca** | Forum interaktif gaya Reddit dengan fitur *Upvote/Downvote*, komentar bertingkat, dan Klub Baca spesifik (misal: Klub Pecinta Fiksi). |
| **🛒 Dashboard Seller / Kreator** | Penulis & mitra toko dapat membuka toko online (`buka-toko.html`), menambahkan produk/buku baru, mengelola inventaris, dan memantau status transaksi penjualan. |
| **🏆 Gamifikasi & Leaderboard** | Setiap aktivitas membaca, bertransaksi, dan berdiskusi memberikan poin Experience (XP). Pengguna dapat melihat posisi klasemen pada leaderboard mingguan. |
| **📱 PWA & Dukungan Offline** | Dukungan *Service Worker* (`sw.js`) dan web manifest (`manifest.json`) sehingga aplikasi dapat diinstal di desktop/smartphone dan dapat diakses dengan cepat. |

---

### 1.3 Arsitektur Sistem & Teknologi

ReadBridge dibangun dengan arsitektur modern terpisah (Decoupled Frontend-Backend Architecture):

```
┌─────────────────────────────────────────────────────┐
│                 FRONTEND WEB (Client)               │
│  HTML5 + Tailwind CSS + Vanilla JavaScript (ES6)    │
│  PWA Enabled: Service Worker (sw.js) + manifest     │
└─────────┬───────────────────┬───────────────────┬───┘
          │ Firebase SDK      │ REST API          │ Local Storage
          ▼                   ▼                   ▼
┌──────────────────┐  ┌───────────────────────────────┐
│  Firebase Auth   │  │   BACKEND API (Node.js)       │
│  (Google SSO &   │  │   Express.js Framework        │
│  Email Auth)     │  │   - Auth / Sync Routes        │
└─────────┬────────┘  │   - Books / Rental Routes     │
          │ Verify    │   - Community & Forum Routes  │
          │ Token     │   - Transactions (Midtrans)   │
          └──────────►└───────────────┬───────────────┘
                                      │ mysql2 Driver
                                      ▼
                        ┌─────────────────────────┐
                        │    MySQL Database       │
                        │  (Tabel users, buku,    │
                        │   transaksi, diskusi,   │
                        │   perpustakaan, dll)    │
                        └─────────────────────────┘
```

#### Detail Tech Stack:
- **Frontend Web**: HTML5, Tailwind CSS, Vanilla JavaScript (ES6+), PWA (`manifest.json`, `sw.js`).
- **Backend API**: Node.js (>= 18), Express.js framework.
- **Database**: MySQL dengan driver `mysql2` & *connection pool*.
- **Autentikasi**: Firebase Client SDK + `firebase-admin` (Token Verification).
- **Keamanan & Middleware**: `helmet`, `express-rate-limit`, `joi` (input validation), `jsonwebtoken` (JWT), `bcryptjs`.
- **Payment Gateway**: Midtrans SDK (`midtrans-client`).
- **Aplikasi Mobile**: Android Native (Gradle/Kotlin) di subdirektori `readbridge-android/`.

---

### 1.4 Model Data & Skema Database

Backend MySQL ReadBridge menggunakan beberapa tabel utama untuk menyimpan data terstruktur:

1. **`users`**: Menyimpan profil pengguna, email, role (`user`/`seller`/`admin`), poin reward, dan UID Firebase.
2. **`buku`**: Menyimpan katalog buku, judul, penulis, kategori, harga beli, harga sewa, stok, dan status aktif.
3. **`jurnal`**: Menyimpan database artikel & jurnal ilmiah beserta URL berkas PDF / rangkuman.
4. **`perpustakaan`**: Menyimpan relasi kepemilikan buku pengguna (tipe `beli` atau `sewa`) beserta tanggal kedaluwarsa rental.
5. **`transaksi`**: Menyimpan rekam jejak pembayaran, kode invoice, total bayar, metode pembayaran, dan status (`pending`/`berhasil`/`gagal`).
6. **`diskusi` & `club`**: Menyimpan topik forum komunitas, pesan postingan, jumlah vote, dan keanggotaan klub.
7. **`notifikasi`**: Menyimpan pesan pemberitahuan sistem dan transaksi per pengguna.

---

## 2. Panduan Instalasi & Pengoperasian (System Setup Guide)

### 2.1 Prasyarat Sistem
Sebelum menjalankan ReadBridge secara lokal, pastikan perangkat Anda telah memenuhi persyaratan berikut:
- **Node.js**: Versi 18.x atau lebih baru.
- **npm**: Versi 9.x atau lebih baru (termasuk saat penginstalan Node.js).
- **Database Server**: MySQL (via XAMPP, MySQL Community Server, atau Docker Container).
- **Web Browser**: Google Chrome, Edge, Safari, atau Firefox versi terbaru.
- **(Opsional) Android Studio**: Jika ingin menjalankan / kompilasi proyek mobile di `readbridge-android/`.

---

### 2.2 Pengaturan Database MySQL

1. Pastikan layanan MySQL service di komputer Anda sudah berjalan (misal: aktifkan MySQL pada control panel XAMPP).
2. Buat database baru di MySQL bernama `readbridge_db`:
   ```sql
   CREATE DATABASE readbridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. *(Opsional)* Jika tersedia skrip migrasi database, jalankan perintah berikut di folder backend:
   ```bash
   cd backend
   node database/migrate.js
   node database/seed.js
   ```

---

### 2.3 Pengaturan Backend (Node.js API)

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Install seluruh dependensi paket Node.js:
   ```bash
   npm install
   ```
3. Salin berkas lingkungan `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
4. Buka file `.env` menggunakan teks editor dan sesuaikan konfigurasinya:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Konfigurasi Database MySQL
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=readbridge_db
   DB_PORT=3306
   
   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=readbridge-8934c
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email@...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # Payment Gateway Midtrans (Opsional untuk tes pembayaran)
   MIDTRANS_SERVER_KEY=your-midtrans-server-key
   MIDTRANS_CLIENT_KEY=your-midtrans-client-key
   MIDTRANS_IS_PRODUCTION=false
   
   # Allowed CORS Origins
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5500
   ```
5. Jalankan server Backend API:
   - **Mode Pengembang (Development - Hot Reloading)**:
     ```bash
     npm run dev
     ```
   - **Mode Produksi**:
     ```bash
     npm start
     ```
   *Server backend akan berjalan di URL:* `http://localhost:5000` (atau port yang diset di `.env`).

---

### 2.4 Pengaturan Frontend (Web & PWA)

Frontend ReadBridge berupa berkas HTML, CSS, dan JS statis yang siap dijalankan melalui Web Server statis:

1. **Menggunakan VS Code Live Server**:
   - Buka folder proyek di Visual Studio Code.
   - Klik kanan pada berkas `index.html` → pilih **Open with Live Server**.
   - Frontend akan terbuka di browser pada URL `http://127.0.0.1:5500` atau `http://localhost:3000`.

2. **Menggunakan `npx serve` atau Python HTTP Server**:
   ```bash
   # Menggunakan npx serve
   npx serve . -p 3000

   # Atau menggunakan Python 3
   python3 -m http.server 3000
   ```
3. Buka peramban (*browser*) Anda dan akses `http://localhost:3000`.

---

### 2.5 Pengaturan Aplikasi Mobile Android

1. Buka aplikasi **Android Studio**.
2. Pilih menu **File > Open**, lalu arahkan ke folder `readbridge-android/`.
3. Biarkan Gradle melakukan sinkronisasi dependensi (*Gradle Sync*).
4. Pastikan file `build.gradle` mengarah ke URL API Backend lokal (atau IP jaringan lokal komputer Anda, misal: `http://10.0.2.2:5000` untuk emulator Android).
5. Klik tombol **Run** untuk menjalankan di Emulator Android atau Perangkat Fisik (via USB Debugging).

---

## 3. Panduan Pengguna (User Manual Guide)

```mermaid
flowchart LR
    A[Landing Page index.html] --> B[Login / Register]
    B --> C[Eksplor & Pilih Buku/Jurnal]
    C --> D[Checkout Beli / Sewa]
    D --> E[Perpustakaan Digital & Pembaca]
    E --> F[Komunitas & Gamifikasi]
```

### 3.1 Alur Registrasi & Onboarding

1. Akses Halaman Utama (`index.html`).
2. Klik tombol **Daftar** di navigasi atas atau tombol **Mulai Sekarang** untuk berpindah ke `register.html`.
3. Lengkapi formulir pendaftaran:
   - Nama Lengkap
   - Email Aktif
   - Password (minimal 6 karakter)
4. Tekan tombol **Daftar Akun**. Sistem akan membuat akun baru di Firebase Auth dan secara otomatis menyinkronkan profil ke database backend.
5. Anda akan diarahkan ke halaman pemetaan minat (`minat.html`). Pilih kategori buku favorit Anda (misal: *Fiksi*, *Sains*, *Bisnis*, *Komik*) lalu klik **Simpan & Lanjutkan**.

---

### 3.2 Autentikasi (Email/Password & Google SSO)

- **Login Email & Password**:
  1. Buka `login.html`.
  2. Masukkan alamat email dan kata sandi yang telah terdaftar.
  3. Klik **Masuk**.
- **Login Google (Single Sign-On)**:
  1. Pada halaman `login.html`, klik tombol **Masuk dengan Google**.
  2. Jendela pop-up Firebase SSO akan muncul. Pilih akun Google Anda.
  3. Setelah verifikasi berhasil, akun akan langsung tersambung dan Anda diarahkan ke Dashboard Profil (`profile.html`).

---

### 3.3 Eksplorasi Katalog & Rangkuman Edukasi

1. **Mencari Buku**:
   - Buka halaman `eksplor.html` atau `marketplace.html`.
   - Gunakan kotak pencarian (*Search Bar*) di bagian atas untuk mengetik judul buku, nama penulis, atau kata kunci.
   - Gunakan filter kategori di samping untuk menyaring buku berdasarkan genre.
2. **Membaca Jurnal & Rangkuman Materi**:
   - Akses menu **Jurnal & Edukasi** (`detail-jurnal.html`).
   - Pilih modul pembelajaran yang diinginkan (misalnya Rangkuman Literasi Indonesia SNBT di `Rangkuman_Lit_Indo_SNBT.html`).
   - Anda dapat membaca ringkasan materi, mengunduh lampiran, atau mengakses pranala luar.

---

### 3.4 Marketplace (Pembelian & Penyewaan Buku)

ReadBridge menawarkan 2 metode transaksi bacaan:

1. **Membeli Buku (Permanent Access)**:
   - Pilih buku di `marketplace.html` untuk melihat `detail.html`.
   - Klik opsi **Beli Permanen**.
   - Tekan tombol **Tambah ke Keranjang** atau **Beli Sekarang**.
   - Anda akan diarahkan ke halaman checkout (`checkout.html`). Pilih metode pembayaran, lalu klik **Bayar**.
   - Setelah pembayaran berhasil, invoice transaksi (`invoice.html`) akan terbit dan buku otomatis masuk ke **Perpustakaan Saya**.

2. **Menyewa Buku (BridgePass Rental)**:
   - Pada halaman detail buku atau halaman sewa (`sewa.html`), pilih opsi **Sewa Buku**.
   - Pada halaman `checkout-sewa.html`, pilih durasi sewa yang diinginkan:
     - **7 Hari** (Diskon sewa pendek)
     - **14 Hari** (Standar)
     - **30 Hari** (Sewa penuh)
   - Sistem akan menghitung total biaya sewa secara proporsional.
   - Selesaikan pembayaran untuk mengaktifkan lisensi sewa temporer.

---

### 3.5 Perpustakaan Saya & Pembaca E-Book

1. Buka halaman **Perpustakaan Saya** (`perpustakaan.html`).
2. Semua buku yang berhasil Anda beli atau sewa akan ditampilkan di sini.
3. Untuk buku sewa, terdapat indikator sisa hari masa berlaku rental (misalnya: *Sisa 5 Hari*).
4. Klik tombol **Baca Buku** untuk membuka modal E-Reader bawaan untuk membaca isi e-book langsung di dalam aplikasi.

---

### 3.6 Komunitas, Klub Baca & Forum Diskusi

1. **Bergabung ke Klub Baca**:
   - Buka halaman **Komunitas** (`komunitas.html`).
   - Pilih klub buku yang menarik minat Anda (misalnya: *Klub Pecinta Fiksi* di `club-pecinta-fiksi.html`).
   - Klik **Gabung Klub** untuk berlangganan postingan dan diskusi klub.
2. **Berinteraksi dalam Forum Diskusi**:
   - Buka detail diskusi (`detail-diskusi.html`).
   - Berikan dukungan argumen dengan menekan tombol **Upvote (+1)** atau **Downvote (-1)**.
   - Tulis tanggapan atau opini Anda pada kolom komentar di bagian bawah.
3. **Membuat Thread Diskusi Baru**:
   - Klik tombol **+ Buat Diskusi Baru** di halaman komunitas.
   - Tulis judul topik, deskripsi, pilih kategori/klub, lalu unggah.

---

### 3.7 Fitur Penjual / Creator (Buka Toko & Dashboard)

Bagi penulis mandiri, penerbit lokal, atau toko buku:

1. **Membuka Toko**:
   - Akses halaman `buka-toko.html`.
   - Isi informasi nama toko, deskripsi toko, alamat/kontak, dan rekening penarikan dana.
   - Tekan **Daftarkan Toko Saya**. Status akun Anda akan ditingkatkan menjadi **Seller/Kreator**.
2. **Mengelola Toko di Dashboard Seller**:
   - Masuk ke `dashboard-seller.html`.
   - **Tambah Buku/Produk**: Klik **Tambah Produk Baru**, isi judul buku, harga beli, harga sewa, sinopsis, dan unggah sampul buku (`fiksi_cover.png`/gambar produk) serta berkas e-book.
   - **Pantau Penjualan**: Melihat statistik total pendapatan, produk terlaris, dan daftar transaksi dari pembeli.

---

### 3.8 Gamifikasi & Sistem Poin Leaderboard

- **Mendapatkan Poin XP**:
  - Menyelesaikan pembacaan buku / bab baru (+20 XP).
  - Melakukan transaksi pembelian/penyewaan (+50 XP).
  - Membuat postingan diskusi berbobot / mendapat upvote (+10 XP).
- **Leaderboard Pembaca**:
  - Akses tab **Leaderboard** pada `profile.html` atau `leaderboard.html`.
  - Peringkat diperbarui secara berkala berdasarkan total XP harian/mingguan. Pembaca teratas berkesempatan mendapatkan voucher potongan sewa buku.

---

## 4. Panduan Instalasi PWA (Progressive Web App)

ReadBridge telah mendukung teknologi Progressive Web App (PWA), sehingga dapat diinstal di komputer desktop maupun ponsel pintar tanpa melalui App Store:

### Di Google Chrome / Microsoft Edge (Desktop):
1. Buka website ReadBridge di Google Chrome atau Microsoft Edge.
2. Perhatikan bagian kanan *Address Bar* (bilah alamat URL). Anda akan melihat ikon **Install ReadBridge** (ikon komputer dengan panah bawah).
3. Klik ikon tersebut, lalu pilih **Install**.
4. Aplikasi ReadBridge akan terbuka di jendela tersendiri dan pintasan (*shortcut*) akan muncul di Desktop / Start Menu komputer Anda.

### Di Android (Google Chrome):
1. Buka peramban Chrome di smartphone Android Anda.
2. Kunjungi alamat web ReadBridge.
3. Banner di bawah layar akan muncul bertuliskan **"Tambahkan ReadBridge ke Layar Utama"**.
4. Tekan banner tersebut, atau klik menu opsi tiga titik di kanan atas Chrome → pilih **Tambahkan ke Layar Utama (Add to Home Screen)**.

---

## 5. Troubleshooting & FAQ

### ❓ Q: Mengapa Login Google SSO tidak merespons atau melempar error?
> **Solusi**:
> 1. Pastikan domain frontend Anda (`localhost` / `127.0.0.1`) sudah terdaftar di **Firebase Console > Authentication > Settings > Authorized Domains**.
> 2. Pastikan file `.env` di backend sudah menyertakan `FIREBASE_PROJECT_ID` dan *Credentials* Firebase Admin SDK yang valid.

---

### ❓ Q: Mengapa Data Buku / Transaksi Tidak Muncul?
> **Solusi**:
> 1. Periksa apakah server backend Node.js sudah berjalan di port 5000 (`http://localhost:5000/api/health` atau `/api/books`).
> 2. Pastikan koneksi database MySQL di file `.env` sudah sesuai (Host, Username, Password, DB Name).

---

### ❓ Q: Tampilan PWA tidak memperbarui versi terbaru (Cache Stale)?
> **Solusi**:
> 1. Buka Chrome Developer Tools (tekan `F12` atau `Ctrl+Shift+I`).
> 2. Masuk ke tab **Application** > **Service Workers**.
> 3. Klik **Unregister** atau centang **Update on reload**, lalu muat ulang halaman (`Ctrl + F5`).

---

*Dokumen ini dibuat dan dikelola sebagai bagian dari dokumentasi resmi platform ReadBridge.*

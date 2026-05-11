# User Flow Project: ReadBridge

Dokumen ini merangkum alur perjalanan pengguna (*User Journey/User Flow*) dari awal mengakses aplikasi hingga menyelesaikan aktivitas utama (membaca, membeli, menyewa, dan berinteraksi).

---

## 1. Alur Registrasi & Onboarding (Pengguna Baru)
Alur ketika pengguna pertama kali menggunakan platform, membuat akun, dan mempersonalisasi minat bacanya.

**Flow Teks:**
Landing Page (`index.html`) → Buat Akun (`register.html`) → Pilih Minat Buku/Jurnal (`minat.html`) → Masuk ke Profil/Dashboard (`profile.html`)

**Diagram:**
```mermaid
flowchart LR
    A[Landing Page] --> B[Register / Login]
    B --> C[Pilih Minat]
    C --> D[Dashboard Profile]
```

---

## 2. Alur Eksplorasi Literatur & Jurnal Edukasi
Alur bagi pelajar/mahasiswa yang mencari sumber referensi jurnal atau buku ilmiah.

**Flow Teks:**
Halaman Eksplor (`eksplor.html`) → Cari Kata Kunci / Filter Kategori → Buka Detail Jurnal (`detail-jurnal.html`) → Lihat Rangkuman Singkat (`Rangkuman_Lit_Indo_SNBT.html`) → Akses Sumber Asli (*External Link/PDF*)

**Diagram:**
```mermaid
flowchart LR
    A[Eksplor Koleksi] --> B[Cari Jurnal/Buku]
    B --> C[Halaman Detail Jurnal]
    C --> D[Baca Rangkuman]
    C --> E[Akses Teks Asli / PDF]
```

---

## 3. Alur Marketplace (Pembelian Buku Fisik/Digital)
Alur transaksi jual-beli buku layaknya *E-Commerce*.

**Flow Teks:**
Buka Marketplace (`marketplace.html`) → Pilih Buku (`detail.html`) → Klik Beli/Tambah Keranjang → Halaman Checkout (`checkout.html`) → Lakukan Pembayaran → Muncul Invoice (`invoice.html`) → Cek Status di Riwayat Transaksi (`transaksi.html` / tab Detail Akun)

**Diagram:**
```mermaid
flowchart LR
    A[Marketplace] --> B[Detail Buku]
    B --> C[Checkout]
    C --> D[Invoice / Pembayaran]
    D --> E[Riwayat Transaksi Profil]
```

---

## 4. Alur Perpustakaan & Sewa Buku (BridgePass)
Alur meminjam buku fisik dari perpustakaan daerah yang bermitra dengan platform.

**Flow Teks:**
Perpustakaan & Sewa (`sewa.html` / `perpustakaan.html`) → Pilih Buku Rental → Checkout Sewa/Peminjaman (`checkout-sewa.html`) → Dapatkan Tiket Ambil Buku / Invoice (`invoice.html`)

**Diagram:**
```mermaid
flowchart LR
    A[Perpustakaan Mitra] --> B[Pilih Buku Sewa]
    B --> C[Checkout Sewa]
    C --> D[Tiket / Invoice Peminjaman]
```

---

## 5. Alur Interaksi Forum Komunitas
Alur bergabung ke klub buku dan melakukan diskusi atau bedah buku bersama pembaca lain.

**Flow Teks:**
Halaman Komunitas (`komunitas.html`) → Cari atau Gabung Klub Buku (`club-pecinta-fiksi.html` / `club.html`) → Pilih Judul Diskusi (`detail-diskusi.html`) → *Upvote*/Tinggalkan Komentar

**Diagram:**
```mermaid
flowchart LR
    A[Halaman Komunitas] --> B[Pilih Klub / Grup Diskusi]
    B --> C[Buka Postingan Diskusi]
    C --> D[Beri Upvote / Komentar]
```

---

## 6. Alur Gamifikasi (Daily Quests & Leaderboard)
Alur pemberian *reward* (XP) kepada pengguna untuk menjaga tingkat *retention* (pengguna kembali lagi tiap hari).

**Flow Teks:**
Pengguna Berinteraksi (Membaca/Beli/Diskusi) → XP Bertambah & Level Naik → Menerima Notifikasi (`notifikasi.html`) → Cek Peringkat Klasemen Mingguan di Tab Leaderboard (`profile.html#leaderboard`)

**Diagram:**
```mermaid
flowchart LR
    A[Selesaikan Aktivitas] --> B[Dapat XP / Level Up]
    B --> C[Cek Notifikasi]
    C --> D[Lihat Peringkat Leaderboard]
```

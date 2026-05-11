-- =============================================
-- READBRIDGE DATABASE SCHEMA
-- Jalankan: mysql -u root -p readbridge_db < schema.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS readbridge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE readbridge_db;

-- =============================================
-- 1. USERS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  firebase_uid  VARCHAR(128) UNIQUE DEFAULT NULL,
  nama          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password      VARCHAR(255) DEFAULT NULL,
  foto_profil   VARCHAR(255) DEFAULT NULL,
  bio           TEXT DEFAULT NULL,
  role          ENUM('user', 'penulis', 'admin') DEFAULT 'user',
  poin          INT DEFAULT 0,
  level         VARCHAR(50) DEFAULT 'Pembaca Pemula',
  minat         JSON DEFAULT NULL,           -- ["fiksi","romance","thriller"]
  aktif         TINYINT(1) DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- 2. KATEGORI BUKU
-- =============================================
CREATE TABLE IF NOT EXISTS kategori (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  nama  VARCHAR(100) NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL,
  ikon  VARCHAR(10) DEFAULT '📚'
);

INSERT IGNORE INTO kategori (nama, slug, ikon) VALUES
  ('Fiksi', 'fiksi', '📖'),
  ('Non-Fiksi', 'non-fiksi', '📰'),
  ('Romance', 'romance', '💕'),
  ('Thriller', 'thriller', '🔪'),
  ('Jurnal Ilmiah', 'jurnal', '🔬'),
  ('Pendidikan', 'pendidikan', '🎓'),
  ('Bisnis', 'bisnis', '💼'),
  ('Self-Help', 'self-help', '🌱'),
  ('Sejarah', 'sejarah', '🏛️'),
  ('Teknologi', 'teknologi', '💻');

-- =============================================
-- 3. BUKU
-- =============================================
CREATE TABLE IF NOT EXISTS buku (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  judul           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  penulis_id      INT REFERENCES users(id),
  penulis_nama    VARCHAR(100) NOT NULL,           -- denormalized untuk performa
  kategori_id     INT REFERENCES kategori(id),
  deskripsi       TEXT,
  cover_url       VARCHAR(255),
  file_url        VARCHAR(255),                     -- file PDF/EPUB
  harga_beli      DECIMAL(12,2) DEFAULT 0,
  harga_sewa      DECIMAL(12,2) DEFAULT 0,         -- harga sewa per 30 hari
  bisa_beli       TINYINT(1) DEFAULT 1,
  bisa_sewa       TINYINT(1) DEFAULT 1,
  bisa_gratis     TINYINT(1) DEFAULT 0,
  rating          DECIMAL(2,1) DEFAULT 0.0,
  total_ulasan    INT DEFAULT 0,
  total_terjual   INT DEFAULT 0,
  total_disewa    INT DEFAULT 0,
  halaman         INT DEFAULT 0,
  bahasa          VARCHAR(50) DEFAULT 'Indonesia',
  tahun_terbit    YEAR,
  isbn            VARCHAR(20) DEFAULT NULL,
  tags            JSON DEFAULT NULL,               -- ["populer","trending","baru"]
  aktif           TINYINT(1) DEFAULT 1,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT KEY ft_buku (judul, penulis_nama, deskripsi)
);

-- =============================================
-- 4. PERPUSTAKAAN USER (buku yang dimiliki/disewa)
-- =============================================
CREATE TABLE IF NOT EXISTS perpustakaan (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         INT NOT NULL REFERENCES users(id),
  buku_id         INT NOT NULL REFERENCES buku(id),
  tipe            ENUM('beli', 'sewa', 'gratis') NOT NULL,
  status          ENUM('aktif', 'expired', 'selesai') DEFAULT 'aktif',
  tanggal_mulai   DATETIME DEFAULT CURRENT_TIMESTAMP,
  tanggal_expired DATETIME DEFAULT NULL,           -- NULL = permanen (beli)
  progress_halaman INT DEFAULT 0,
  selesai         TINYINT(1) DEFAULT 0,
  transaksi_id    INT DEFAULT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_buku (user_id, buku_id)
);

-- =============================================
-- 5. TRANSAKSI
-- =============================================
CREATE TABLE IF NOT EXISTS transaksi (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  kode_transaksi  VARCHAR(50) UNIQUE NOT NULL,     -- RB-20240101-XXXX
  user_id         INT NOT NULL REFERENCES users(id),
  buku_id         INT NOT NULL REFERENCES buku(id),
  tipe            ENUM('beli', 'sewa') NOT NULL,
  harga           DECIMAL(12,2) NOT NULL,
  durasi_sewa_hari INT DEFAULT NULL,               -- NULL untuk pembelian
  status          ENUM('pending', 'berhasil', 'gagal', 'refund') DEFAULT 'pending',
  metode_bayar    VARCHAR(50) DEFAULT NULL,        -- 'midtrans', 'transfer', dll
  payment_token   VARCHAR(255) DEFAULT NULL,       -- token dari payment gateway
  payment_url     VARCHAR(500) DEFAULT NULL,
  dibayar_at      DATETIME DEFAULT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- 6. ULASAN BUKU
-- =============================================
CREATE TABLE IF NOT EXISTS ulasan (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  buku_id     INT NOT NULL REFERENCES buku(id),
  user_id     INT NOT NULL REFERENCES users(id),
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  komentar    TEXT,
  likes       INT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ulasan (buku_id, user_id)
);

-- =============================================
-- 7. KOMUNITAS / CLUB
-- =============================================
CREATE TABLE IF NOT EXISTS club (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nama          VARCHAR(150) NOT NULL,
  slug          VARCHAR(150) UNIQUE NOT NULL,
  deskripsi     TEXT,
  foto_cover    VARCHAR(255),
  kategori      VARCHAR(100),
  kreator_id    INT REFERENCES users(id),
  total_anggota INT DEFAULT 0,
  privat        TINYINT(1) DEFAULT 0,
  aktif         TINYINT(1) DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS club_anggota (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  club_id     INT NOT NULL REFERENCES club(id),
  user_id     INT NOT NULL REFERENCES users(id),
  role        ENUM('anggota', 'moderator', 'kreator') DEFAULT 'anggota',
  joined_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_club_user (club_id, user_id)
);

-- =============================================
-- 8. DISKUSI / FORUM
-- =============================================
CREATE TABLE IF NOT EXISTS diskusi (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  club_id       INT REFERENCES club(id),            -- NULL = diskusi umum
  user_id       INT NOT NULL REFERENCES users(id),
  judul         VARCHAR(255) NOT NULL,
  konten        TEXT NOT NULL,
  buku_id       INT REFERENCES buku(id),             -- jika diskusi tentang buku
  total_balasan INT DEFAULT 0,
  total_likes   INT DEFAULT 0,
  pinned        TINYINT(1) DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diskusi_balasan (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  diskusi_id  INT NOT NULL REFERENCES diskusi(id),
  user_id     INT NOT NULL REFERENCES users(id),
  konten      TEXT NOT NULL,
  parent_id   INT REFERENCES diskusi_balasan(id),   -- untuk nested reply
  likes       INT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diskusi_likes (
  user_id     INT NOT NULL REFERENCES users(id),
  diskusi_id  INT NOT NULL REFERENCES diskusi(id),
  PRIMARY KEY (user_id, diskusi_id)
);

-- =============================================
-- 9. NOTIFIKASI
-- =============================================
CREATE TABLE IF NOT EXISTS notifikasi (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL REFERENCES users(id),
  tipe        ENUM('transaksi', 'komunitas', 'sistem', 'reminder', 'promo') NOT NULL,
  judul       VARCHAR(200) NOT NULL,
  pesan       TEXT NOT NULL,
  link_url    VARCHAR(255) DEFAULT NULL,
  sudah_dibaca TINYINT(1) DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. LEADERBOARD / POIN HISTORY
-- =============================================
CREATE TABLE IF NOT EXISTS poin_history (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL REFERENCES users(id),
  poin        INT NOT NULL,                         -- bisa negatif
  keterangan  VARCHAR(255) NOT NULL,
  tipe        ENUM('baca', 'ulasan', 'diskusi', 'tantangan', 'referral', 'pembelian') NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 11. WISHLIST
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist (
  user_id     INT NOT NULL REFERENCES users(id),
  buku_id     INT NOT NULL REFERENCES buku(id),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, buku_id)
);

-- =============================================
-- INDEXES UNTUK PERFORMA
-- =============================================
CREATE INDEX idx_buku_kategori ON buku(kategori_id);
CREATE INDEX idx_buku_aktif ON buku(aktif, created_at DESC);
CREATE INDEX idx_perpustakaan_user ON perpustakaan(user_id, status);
CREATE INDEX idx_transaksi_user ON transaksi(user_id, created_at DESC);
CREATE INDEX idx_diskusi_club ON diskusi(club_id, created_at DESC);
CREATE INDEX idx_notifikasi_user ON notifikasi(user_id, sudah_dibaca, created_at DESC);
CREATE INDEX idx_poin_user ON poin_history(user_id, created_at DESC);

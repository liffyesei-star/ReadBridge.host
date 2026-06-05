-- =============================================
-- MIGRATION: SELLER & PRELOVED FEATURES
-- =============================================

-- 1. Create table TOKO
CREATE TABLE IF NOT EXISTS toko (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  nama_toko VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  lokasi VARCHAR(150) NOT NULL,
  foto_toko VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Extend BUKU table for physical & preloved books
ALTER TABLE buku
ADD COLUMN toko_id INT DEFAULT NULL,
ADD COLUMN tipe_buku ENUM('digital', 'fisik', 'preloved') DEFAULT 'digital',
ADD COLUMN kondisi ENUM('Sempurna', 'Bagus', 'Lecet') DEFAULT NULL,
ADD COLUMN stok INT DEFAULT 1,
ADD COLUMN lokasi VARCHAR(150) DEFAULT NULL;

-- 3. Add foreign key from buku to toko
-- Note: MySQL might fail if the constraint already exists, we use ALTER with SET NULL.
ALTER TABLE buku
ADD CONSTRAINT fk_buku_toko FOREIGN KEY (toko_id) REFERENCES toko(id) ON DELETE SET NULL;

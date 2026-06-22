-- Migration: Tambah kolom media_url dan media_type ke tabel diskusi dan diskusi_balasan
-- Memungkinkan post komunitas menyertakan foto atau video dari Cloudinary CDN

ALTER TABLE diskusi
  ADD COLUMN media_url TEXT DEFAULT NULL,
  ADD COLUMN media_type ENUM('image','video') DEFAULT NULL;

ALTER TABLE diskusi_balasan
  ADD COLUMN media_url TEXT DEFAULT NULL,
  ADD COLUMN media_type ENUM('image','video') DEFAULT NULL;

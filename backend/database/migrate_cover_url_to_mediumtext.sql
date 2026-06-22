-- Migration: Ubah cover_url dan foto_profil menjadi MEDIUMTEXT
-- agar dapat menampung data gambar Base64 dari kompresi frontend.
-- VARCHAR(255) hanya bisa menyimpan 255 karakter - jauh tidak cukup untuk Base64.
-- MEDIUMTEXT bisa menyimpan hingga 16MB.

ALTER TABLE buku MODIFY COLUMN cover_url MEDIUMTEXT;
ALTER TABLE buku MODIFY COLUMN file_url MEDIUMTEXT;
ALTER TABLE users MODIFY COLUMN foto_profil MEDIUMTEXT;
ALTER TABLE toko MODIFY COLUMN foto_toko MEDIUMTEXT;
ALTER TABLE ebook MODIFY COLUMN cover_url MEDIUMTEXT;

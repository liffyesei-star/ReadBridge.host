-- Migration: Tambah kolom reset password ke tabel users
-- Jalankan: mysql -u root -p readbridge_db < migrate_add_reset_token.sql

ALTER TABLE users 
ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_password_expires DATETIME DEFAULT NULL;

-- Index untuk mencari user by token dan cek expire
CREATE INDEX idx_reset_token ON users(reset_password_token);
CREATE INDEX idx_reset_expires ON users(reset_password_expires);

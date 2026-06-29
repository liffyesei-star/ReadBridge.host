-- =============================================
-- MIGRASI: Club Management System V2
-- Tanggal: 2026-06-29
-- =============================================

-- 1. Modifikasi tabel club
ALTER TABLE club
  MODIFY COLUMN foto_cover MEDIUMTEXT DEFAULT NULL;

ALTER TABLE club ADD COLUMN icon_url   MEDIUMTEXT  DEFAULT NULL;
ALTER TABLE club ADD COLUMN banner_url MEDIUMTEXT  DEFAULT NULL;
ALTER TABLE club ADD COLUMN invite_code VARCHAR(20) DEFAULT NULL;
ALTER TABLE club ADD UNIQUE INDEX idx_club_invite (invite_code);
ALTER TABLE club ADD COLUMN color_primary VARCHAR(7) DEFAULT '#0284c7';
ALTER TABLE club ADD COLUMN color_scheme  VARCHAR(7) DEFAULT '#e0f2fe';
ALTER TABLE club ADD COLUMN aturan TEXT DEFAULT NULL;

-- 2. Modifikasi tabel club_anggota
ALTER TABLE club_anggota ADD COLUMN status ENUM('aktif','banned') DEFAULT 'aktif';

-- 3. Buat tabel club_banned
CREATE TABLE IF NOT EXISTS club_banned (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  club_id   INT NOT NULL,
  user_id   INT NOT NULL,
  banned_by INT NOT NULL,
  alasan    TEXT,
  banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ban (club_id, user_id),
  FOREIGN KEY (club_id)   REFERENCES club(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE
);

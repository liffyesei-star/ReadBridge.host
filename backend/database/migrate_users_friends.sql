-- migrate_users_friends.sql
-- Menambahkan kolom username dan rb_id ke tabel users, serta membuat tabel friends

ALTER TABLE users 
ADD COLUMN username VARCHAR(50) UNIQUE DEFAULT NULL AFTER nama,
ADD COLUMN rb_id VARCHAR(20) UNIQUE DEFAULT NULL AFTER id;

CREATE TABLE IF NOT EXISTS friends (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id1 INT NOT NULL,
  user_id2 INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  action_user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_friends (user_id1, user_id2)
);

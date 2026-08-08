const db = require('../config/db');

class UserRepository {
  async findByEmail(email) {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email.toLowerCase().trim()]);
    return users.length ? users[0] : null;
  }

  async findByUsername(username) {
    const [users] = await db.execute("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);
    return users.length ? users[0] : null;
  }

  async createUser(data) {
    const { nama, email, password, username, rb_id, foto_profil } = data;
    const [result] = await db.execute(
      `INSERT INTO users (nama, email, password, role, poin, level, username, rb_id, foto_profil)
       VALUES (?, ?, ?, 'user', 0, 'Pembaca Pemula', ?, ?, ?)`,
      [nama, email, password, username, rb_id, foto_profil || null]
    );
    return result.insertId;
  }

  async updateLastLogin(userId) {
    try {
      await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [userId]);
    } catch (err) {
      console.warn("Could not update last_login (column might be missing):", err.message);
    }
  }

  async update(userId, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) return;
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => data[k]);
    values.push(userId);
    await db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, values);
  }

  async saveResetToken(userId, hashedToken, expiresAt) {
    await db.execute(
      "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?",
      [hashedToken, expiresAt, userId]
    );
  }

  async findByValidResetToken(hashedToken) {
    const [users] = await db.execute(
      `SELECT id FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expires > NOW() LIMIT 1`,
      [hashedToken]
    );
    return users.length ? users[0] : null;
  }

  async updatePassword(userId, hashedPassword) {
    await db.execute(
      `UPDATE users SET 
       password = ?, 
       reset_password_token = NULL, 
       reset_password_expires = NULL 
       WHERE id = ?`,
      [hashedPassword, userId]
    );
  }
}

module.exports = new UserRepository();

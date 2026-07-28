require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2/promise');
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
};

async function migrate() {
    console.log("Menjalankan migrasi E2EE...");
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.query(`ALTER TABLE users ADD COLUMN public_key TEXT DEFAULT NULL;`).catch(e => {
            if(e.code === 'ER_DUP_FIELDNAME') console.log("Kolom public_key sudah ada.");
            else throw e;
        });
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
              id INT PRIMARY KEY AUTO_INCREMENT,
              sender_id INT NOT NULL,
              receiver_id INT NOT NULL,
              encrypted_content_for_receiver TEXT NOT NULL,
              encrypted_content_for_sender TEXT NOT NULL,
              is_read TINYINT(1) DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Migrasi berhasil!");
    } catch (err) {
        console.error("Gagal migrasi:", err);
    } finally {
        await connection.end();
    }
}
migrate();

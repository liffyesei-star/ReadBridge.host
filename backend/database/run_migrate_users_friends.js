const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
    console.log("Menjalankan migrasi Users & Friends...");
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
            ssl: { rejectUnauthorized: false }
        });

        const sqlFile = path.join(__dirname, 'migrate_users_friends.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log("Mengeksekusi SQL...");
        await connection.query(sql);

        console.log("✅ Migrasi berhasil!");
        
        // Kita juga perlu set username awal (jika ada data lama)
        const [rows] = await connection.query("SELECT id, nama FROM users WHERE username IS NULL");
        for (let user of rows) {
            let baseName = user.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
            if(!baseName) baseName = 'user';
            
            // Format ID (RB-hash)
            let hash = 0;
            for (let i = 0; i < baseName.length; i++) {
                hash = baseName.charCodeAt(i) + ((hash << 5) - hash);
            }
            const absHash = Math.abs(hash).toString().padStart(6, '0').substring(0, 6);
            const rb_id = `RB-${absHash}`;
            
            // Check uniqueness for username
            let finalUsername = '@' + baseName;
            let [check] = await connection.query("SELECT id FROM users WHERE username = ?", [finalUsername]);
            let counter = 1;
            while(check.length > 0) {
                finalUsername = '@' + baseName + counter;
                [check] = await connection.query("SELECT id FROM users WHERE username = ?", [finalUsername]);
                counter++;
            }

            await connection.query("UPDATE users SET username = ?, rb_id = ? WHERE id = ?", [finalUsername, rb_id, user.id]);
            console.log(`Updated user ${user.id}: username=${finalUsername}, rb_id=${rb_id}`);
        }

        await connection.end();
    } catch (error) {
        console.error("❌ Gagal menjalankan migrasi:", error);
    }
}

runMigration();

/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
// database/migrate.js
// Jalankan: node database/migrate.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const runMigration = async () => {
  console.log("🚀 Memulai migrasi skema database...");
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Bersihkan komentar satu baris dan komentar multi-baris
    const cleanSql = schemaSql
      .replace(/--.*$/gm, "") 
      .replace(/\/\*[\s\S]*?\*\//g, "");

    // Pisahkan berdasarkan semicolon (;) di akhir baris
    const statements = cleanSql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Terdeteksi ${statements.length} pernyataan SQL. Menjalankan satu per satu...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await db.execute(stmt);
      } catch (err) {
        // Jika tabel sudah ada atau drop gagal, log sebagai warning saja
        console.warn(`⚠️ Warning pada pernyataan #${i + 1}: ${err.message}`);
      }
    }

    console.log("✅ Skema database berhasil dimigrasikan ke cloud Aiven!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migrasi skema gagal:", err.message);
    process.exit(1);
  }
};

runMigration();

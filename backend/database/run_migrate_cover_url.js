/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: June 2026
  Role: Lead Developer & UI/UX Designer
*/
// database/run_migrate_cover_url.js
// Jalankan: node database/run_migrate_cover_url.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const runMigration = async () => {
  console.log("🚀 Memulai migrasi kolom cover_url -> MEDIUMTEXT...");
  try {
    const sqlPath = path.join(__dirname, "migrate_cover_url_to_mediumtext.sql");
    const rawSql = fs.readFileSync(sqlPath, "utf8");

    // Bersihkan komentar
    const cleanSql = rawSql
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");

    const statements = cleanSql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Menjalankan ${statements.length} pernyataan ALTER TABLE...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await db.execute(stmt);
        console.log(`  ✅ [${i+1}/${statements.length}] ${stmt.substring(0, 60)}...`);
      } catch (err) {
        console.warn(`  ⚠️  [${i+1}/${statements.length}] Warning: ${err.message}`);
      }
    }

    console.log("\n✅ Migrasi selesai! Kolom cover_url, file_url, foto_profil, foto_toko sekarang MEDIUMTEXT.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migrasi gagal:", err.message);
    process.exit(1);
  }
};

runMigration();

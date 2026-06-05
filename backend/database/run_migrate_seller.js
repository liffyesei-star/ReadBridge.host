/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Role: Lead Developer
*/
// database/run_migrate_seller.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const fs = require("fs");
const db = require("../config/db");

const runMigration = async () => {
  console.log("🚀 Running seller feature database migration...");
  try {
    const migrationPath = path.join(__dirname, "migrate_seller.sql");
    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    // Clean comments
    const cleanSql = migrationSql
      .replace(/--.*$/gm, "") 
      .replace(/\/\*[\s\S]*?\*\//g, "");

    // Split statements by semicolon
    const statements = cleanSql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Found ${statements.length} SQL statements. Executing...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        console.log(`Executing statement #${i + 1}...`);
        await db.execute(stmt);
        console.log(`✅ Statement #${i + 1} succeeded.`);
      } catch (err) {
        console.warn(`⚠️ Warning/Error on statement #${i + 1}: ${err.message}`);
      }
    }

    console.log("✅ Database migration run finished.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
};

runMigration();

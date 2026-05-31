/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const mysql = require("mysql2/promise");
require("dotenv").config();

function buildSslConfig() {
  const host = process.env.DB_HOST || "localhost";
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (isLocal) return undefined;

  if (process.env.DB_SSL_CA) {
    return {
      ca: process.env.DB_SSL_CA.replace(/\\n/g, "\n"),
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  // Cloud MySQL (Aiven, PlanetScale, RDS, dll.) — TLS wajib
  return { rejectUnauthorized: false };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "readbridge_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  timezone: "+07:00",
  charset: "utf8mb4",
  ssl: buildSslConfig(),
});

let dbReady = false;

async function testConnection(attempt = 1, maxAttempts = 10) {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL terhubung ke database:", process.env.DB_NAME || "readbridge_db");
    conn.release();
    dbReady = true;
  } catch (err) {
    console.error(`❌ Gagal koneksi MySQL (percobaan ${attempt}/${maxAttempts}):`, err.code || "", err.message);
    if (attempt < maxAttempts) {
      const delayMs = Math.min(attempt * 3000, 15000);
      setTimeout(() => testConnection(attempt + 1, maxAttempts), delayMs);
    } else {
      console.error("⚠️ Server tetap berjalan — API database akan gagal sampai MySQL tersedia.");
      if ((process.env.DB_HOST || "").includes("aivencloud.com") && !process.env.DB_SSL_CA) {
        console.error("💡 Aiven: tambahkan env DB_SSL_CA (CA certificate dari Aiven Console → Connection info).");
      }
    }
  }
}

testConnection();

pool.isReady = () => dbReady;

module.exports = pool;

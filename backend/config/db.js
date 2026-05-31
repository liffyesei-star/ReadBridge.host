/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "readbridge_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
  charset: "utf8mb4",
  ssl: process.env.DB_HOST && process.env.DB_HOST !== "localhost" && process.env.DB_HOST !== "127.0.0.1" 
    ? { rejectUnauthorized: false } 
    : undefined
});

let dbReady = false;

async function testConnection(attempt = 1, maxAttempts = 5) {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL terhubung ke database:", process.env.DB_NAME || "readbridge_db");
    conn.release();
    dbReady = true;
  } catch (err) {
    console.error(`❌ Gagal koneksi MySQL (percobaan ${attempt}/${maxAttempts}):`, err.message);
    if (attempt < maxAttempts) {
      const delayMs = attempt * 2000;
      setTimeout(() => testConnection(attempt + 1, maxAttempts), delayMs);
    } else {
      console.error("⚠️ Server tetap berjalan — API database akan gagal sampai MySQL tersedia.");
    }
  }
}

testConnection();

pool.isReady = () => dbReady;

module.exports = pool;

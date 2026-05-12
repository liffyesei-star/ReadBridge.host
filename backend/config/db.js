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

// Test koneksi saat startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL terhubung ke database:", process.env.DB_NAME);
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi MySQL:", err.message);
    process.exit(1);
  });

module.exports = pool;

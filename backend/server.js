/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
// server.js - ReadBridge Backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Polyfill fetch untuk versi Node.js yang lebih lama di Render
if (!globalThis.fetch) {
  globalThis.fetch = require("node-fetch");
}
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const journalRoutes = require("./routes/journals");
const transactionRoutes = require("./routes/transactions");
const communityRoutes = require("./routes/community");
const userRoutes = require("./routes/users");
const helpdeskRoutes = require("./routes/helpdesk");
const tokoRoutes = require("./routes/toko");

// Initialize Firebase (side effect)
require("./config/firebase");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE GLOBAL
// =============================================

// Security headers
app.use(helmet());

// CORS - izinkan frontend mengakses
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500,https://liffyesei-star.github.io").split(",");
app.use(cors({
  origin: (origin, callback) => {
    // Mengizinkan tanpa origin, file:// preview (Origin: null), localhost, github.io, atau origin spesifik
    if (!origin || origin === 'null' || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.github.io') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS tidak diizinkan untuk origin: " + origin));
      }
    } catch (e) {
      callback(new Error("CORS invalid origin"));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads static folder
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logger (hanya di development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiter umum - 100 request per 15 menit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak request, coba lagi nanti." },
}));

// =============================================
// ROUTES
// =============================================
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/helpdesk", helpdeskRoutes);
app.use("/api/toko", tokoRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 ReadBridge API berjalan",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: db.isReady() ? "connected" : "connecting",
    endpoints: {
      auth: "/api/auth",
      books: "/api/books",
      journals: "/api/journals",
      transactions: "/api/transactions",
      community: "/api/community",
      users: "/api/users",
      helpdesk: "/api/helpdesk",
      toko: "/api/toko",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Terjadi kesalahan server" : err.message,
  });
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`\n🚀 ReadBridge Backend berjalan di http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📋 Dokumentasi API: http://localhost:${PORT}/\n`);
});

module.exports = app;

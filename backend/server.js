// server.js - ReadBridge Backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

// Initialize Firebase (side effect)
require("./config/firebase");

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE GLOBAL
// =============================================

// Security headers
app.use(helmet());

// CORS - izinkan frontend mengakses
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500").split(",");
app.use(cors({
  origin: (origin, callback) => {
    // Mengizinkan tanpa origin (misal dari postman) atau origin dari localhost/127.0.0.1
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS tidak diizinkan untuk origin: " + origin));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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

// Rate limiter ketat untuk auth - 10 request per 15 menit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Terlalu banyak percobaan login." },
});

// =============================================
// ROUTES
// =============================================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 ReadBridge API berjalan",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      books: "/api/books",
      journals: "/api/journals",
      transactions: "/api/transactions",
      community: "/api/community",
      users: "/api/users",
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

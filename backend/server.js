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
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

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
const uploadRoutes = require("./routes/upload");
const shippingRoutes = require("./routes/shipping");
const messageRoutes = require("./routes/messages");

// Firebase removed
const db = require("./config/db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500,https://liffyesei-star.github.io").split(",");

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
        if (!origin || origin === 'null' || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        try {
          const url = new URL(origin);
          const hostname = url.hostname;
          if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.github.io') || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(null, true);
        } catch (e) {
          return callback(null, true);
        }
    },
    methods: ["GET", "POST"]
  }
});

// Middleware Socket.IO untuk Autentikasi
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
        // Coba verifikasi dengan local JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-super-aman');
            socket.user = decoded;
            return next();
        } catch (localErr) {
            throw new Error("Invalid token");
        }
    } catch (err) {
        console.error("Socket auth error:", err.message);
        next(new Error("Authentication error"));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.username})`);
    
    // Bergabung ke room khusus user ini (berdasarkan ID user)
    socket.join(`user_${socket.user.id}`);

    // Event ketika mengirim pesan
    socket.on('send_message', async (data) => {
        // data: { receiverId, encryptedContentForReceiver, encryptedContentForSender }
        try {
            // 1. Simpan ke Database MySQL
            const [result] = await db.execute(
                `INSERT INTO messages (sender_id, receiver_id, encrypted_content_for_receiver, encrypted_content_for_sender)
                 VALUES (?, ?, ?, ?)`,
                [socket.user.id, data.receiverId, data.encryptedContentForReceiver, data.encryptedContentForSender]
            );

            const insertedId = result.insertId;

            const messageObj = {
                id: insertedId,
                sender_id: socket.user.id,
                receiver_id: data.receiverId,
                encrypted_content_for_receiver: data.encryptedContentForReceiver,
                encrypted_content_for_sender: data.encryptedContentForSender,
                created_at: new Date().toISOString()
            };

            // 2. Kirim pesan ke penerima secara real-time
            io.to(`user_${data.receiverId}`).emit('receive_message', messageObj);
            
            // 3. Konfirmasi ke pengirim bahwa pesan berhasil disimpan
            socket.emit('message_sent_success', messageObj);

        } catch (err) {
            console.error('Error saving/sending message via socket:', err);
            socket.emit('message_error', { error: 'Gagal mengirim pesan.' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.id}`);
    });
});


// =============================================
// MIDDLEWARE GLOBAL
// =============================================

// Security headers - allow cross-origin resource policy for serving images to frontend
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - izinkan frontend mengakses
app.use(cors({
  origin: (origin, callback) => {
    // Mengizinkan request tanpa origin (curl/mobile) atau file:// (Origin: 'null')
    if (!origin || origin === 'null' || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.github.io') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to avoid breaking frontend interaction
    } catch (e) {
      return callback(null, true); // Fallback allow for unusual origins
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

// Rate limiter umum — 300 request per 15 menit (dinaikkan agar user aktif tidak terkena block)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
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
app.use("/api/upload", uploadRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/messages", messageRoutes);

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
server.listen(PORT, () => {
  console.log(`\n🚀 ReadBridge Backend & Socket.IO berjalan di http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📋 Dokumentasi API: http://localhost:${PORT}/\n`);
});

module.exports = { app, server };

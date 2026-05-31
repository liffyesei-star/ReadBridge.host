/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
const admin = require("firebase-admin");
require("dotenv").config();

function parsePrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  try {
    // Hanya inisialisasi jika ada project ID
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id') {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
          authUri: "https://accounts.google.com/o/oauth2/auth",
          tokenUri: "https://oauth2.googleapis.com/token",
          authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
          clientX509CertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
        }),
      });
      console.log("✅ Firebase Admin SDK initialized");
    } else {
      console.log("⚠️ Firebase Admin SDK di-skip (kredensial kosong di .env)");
    }
  } catch (error) {
    console.error("⚠️ Firebase Admin SDK gagal diinisialisasi (abaikan jika menggunakan login lokal):", error.message);
  }
}

module.exports = admin;

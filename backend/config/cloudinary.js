/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: June 2026
  Role: Lead Developer & UI/UX Designer
*/
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

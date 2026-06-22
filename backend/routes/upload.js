/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: June 2026
  Role: Lead Developer & UI/UX Designer
*/
// routes/upload.js
// Handles image uploads to Cloudinary cloud storage.
// Supports: cover buku, foto profil, foto toko
// Semua format gambar didukung termasuk HEIC (Cloudinary auto-convert)

const express  = require('express');
const multer   = require('multer');
const cloudinary = require('../config/cloudinary');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Gunakan memory storage - file tidak disimpan di disk, langsung dikirim ke Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB (untuk video)
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/heic','image/heif'];
    const allowedVideos = ['video/mp4','video/quicktime','video/avi','video/webm','video/x-msvideo','video/mov'];
    if (allowedImages.includes(file.mimetype.toLowerCase()) || allowedVideos.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Format tidak didukung. Gambar: JPG/PNG/WEBP/HEIC. Video: MP4/MOV/AVI/WEBM.'));
    }
  }
});

/**
 * POST /api/upload/image
 * Upload gambar ke Cloudinary
 * Body: multipart/form-data dengan field 'image'
 * Query: ?folder=covers|profiles|shops (opsional, default: 'readbridge')
 */
router.post('/image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
    }

    const folder = req.query.folder || 'readbridge';
    const allowedFolders = ['covers', 'profiles', 'shops', 'readbridge'];
    const safeFolder = allowedFolders.includes(folder) ? `readbridge/${folder}` : 'readbridge/misc';

    // Upload buffer ke Cloudinary via upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: safeFolder,
          resource_type: 'image',
          transformation: [
            // Auto compress & convert ke JPEG WebP (lebih kecil)
            { quality: 'auto:good', fetch_format: 'auto' },
            // Resize maksimal 800px width untuk cover buku
            { width: 800, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: uploadResult.secure_url,           // URL permanen CDN Cloudinary
      public_id: uploadResult.public_id,      // ID untuk delete nanti
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size_bytes: uploadResult.bytes,
    });

  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal mengunggah gambar.' });
  }
});

/**
 * DELETE /api/upload/image/:publicId
 * Hapus gambar dari Cloudinary (opsional - saat buku/profil dihapus)
 */
router.delete('/image/:publicId(*)', verifyToken, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    // Hanya boleh hapus file dalam folder readbridge
    if (!publicId.startsWith('readbridge/')) {
      return res.status(403).json({ success: false, message: 'Tidak diizinkan.' });
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Gambar berhasil dihapus.' });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus gambar.' });
  }
});

/**
 * POST /api/upload/video
 * Upload video ke Cloudinary untuk post komunitas
 * Body: multipart/form-data dengan field 'video'
 */
router.post('/video', verifyToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file video yang diunggah.' });
    }

    const videoTypes = ['video/mp4','video/quicktime','video/avi','video/webm','video/x-msvideo','video/mov'];
    if (!videoTypes.includes(req.file.mimetype.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Bukan file video. Gunakan MP4, MOV, AVI, atau WEBM.' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'readbridge/community/videos',
          resource_type: 'video',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1280, crop: 'limit' } // max 720p
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      duration: uploadResult.duration,
      format: uploadResult.format,
      size_bytes: uploadResult.bytes,
    });

  } catch (err) {
    console.error('Cloudinary video upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal mengunggah video.' });
  }
});

module.exports = router;

const db = require('../config/db');

/**
 * Helper terpusat untuk menambahkan notifikasi user ke database
 * @param {number} userId - ID penerima notifikasi
 * @param {'transaksi'|'komunitas'|'sistem'|'reminder'|'promo'|'prestasi'} tipe - Kategori notifikasi
 * @param {string} judul - Judul ringkas notifikasi
 * @param {string} pesan - Isi detail notifikasi
 * @param {string|null} linkUrl - URL tujuan saat notifikasi diklik
 */
async function addNotification(userId, tipe, judul, pesan, linkUrl = null) {
  if (!userId) return false;
  try {
    const validTipe = ['transaksi', 'komunitas', 'sistem', 'reminder', 'promo', 'prestasi'].includes(tipe) 
      ? tipe 
      : 'sistem';

    await db.execute(
      `INSERT INTO notifikasi (user_id, tipe, judul, pesan, link_url) VALUES (?, ?, ?, ?, ?)`,
      [userId, validTipe, judul, pesan, linkUrl || null]
    );
    return true;
  } catch (error) {
    console.error("Gagal menambahkan notifikasi:", error);
    return false;
  }
}

module.exports = { addNotification };

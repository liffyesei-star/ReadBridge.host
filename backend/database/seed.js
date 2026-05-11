// database/seed.js
// Jalankan: node database/seed.js
require("dotenv").config();
const db = require("../config/db");

const seedData = async () => {
  console.log("🌱 Mulai seed data...");

  // ===================== BUKU =====================
  const buku = [
    { judul: "Sejarah Nasional Indonesia Jilid 1", penulis: "Marwati Djoened Poesponegoro", kategori: 2, harga: 85000, rating: 4.8, ulasan: 124, tags: ["Populer"] },
    { judul: "Pengantar Ilmu Sejarah", penulis: "Kuntowijoyo", kategori: 2, harga: 65000, rating: 4.6, ulasan: 89, tags: [] },
    { judul: "Nusantara: Sejarah Indonesia", penulis: "Bernard H.M. Vlekke", kategori: 2, harga: 120000, rating: 4.9, ulasan: 215, tags: ["Edisi Terbatas"] },
    { judul: "Sapiens: Riwayat Singkat Umat Manusia", penulis: "Yuval Noah Harari", kategori: 2, harga: 105000, rating: 4.8, ulasan: 532, tags: [] },
    { judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: 1, harga: 110000, rating: 4.9, ulasan: 840, tags: ["Klasik"] },
    { judul: "Atomic Habits", penulis: "James Clear", kategori: 8, harga: 95000, rating: 4.9, ulasan: 1024, tags: ["Bestseller"] },
    { judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: 1, harga: 75000, rating: 4.7, ulasan: 678, tags: [] },
    { judul: "Cantik Itu Luka", penulis: "Eka Kurniawan", kategori: 1, harga: 90000, rating: 4.8, ulasan: 450, tags: ["Trending"] },
    { judul: "Laut Bercerita", penulis: "Leila S. Chudori", kategori: 1, harga: 100000, rating: 4.9, ulasan: 800, tags: [] },
    { judul: "Filosofi Teras", penulis: "Henry Manampiring", kategori: 8, harga: 80000, rating: 4.8, ulasan: 1200, tags: ["Populer"] },
    { judul: "Pulang", penulis: "Leila S. Chudori", kategori: 1, harga: 90000, rating: 4.7, ulasan: 420, tags: [] },
    { judul: "Kosmos", penulis: "Carl Sagan", kategori: 2, harga: 150000, rating: 4.9, ulasan: 310, tags: ["Edisi Terbatas"] },
  ];

  for (const b of buku) {
    const slug = b.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 9999);
    const hargaSewa = Math.floor(b.harga * 0.15);
    await db.execute(
      `INSERT IGNORE INTO buku (judul, slug, penulis_nama, kategori_id, harga_beli, harga_sewa, bisa_beli, bisa_sewa, rating, total_ulasan, tags)
       VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)`,
      [b.judul, slug, b.penulis, b.kategori, b.harga, hargaSewa, b.rating, b.ulasan, JSON.stringify(b.tags)]
    );
  }
  console.log(`✅ ${buku.length} buku berhasil di-seed`);

  // ===================== JURNAL =====================
  const jurnal_data = [
    { judul: "Jurnal Sejarah: Dinamika Politik Indonesia Pasca Reformasi", penulis: "Dr. Anhar Gonggong", universitas: "Universitas Indonesia", tahun: 2020, unduhan: 1205, rating: 4.8, kategori: "Sosial Humaniora", akses: "Open Access" },
    { judul: "Studi Literatur: Pengaruh Literasi Digital di Era Society 5.0", penulis: "Prof. Rhenald Kasali", universitas: "Universitas Gadjah Mada", tahun: 2022, unduhan: 854, rating: 4.5, kategori: "Pendidikan", akses: "Open Access" },
    { judul: "Jurnal Ilmu Komputer: Implementasi AI pada Sistem Perpustakaan", penulis: "Dr. Romi Satria Wahono", universitas: "Institut Teknologi Bandung", tahun: 2023, unduhan: 432, rating: 4.9, kategori: "Sains & Teknologi", akses: "Exclusive Access" },
    { judul: "Dampak Perubahan Iklim Terhadap Ekonomi Pertanian", penulis: "Dr. Emil Salim", universitas: "Institut Pertanian Bogor", tahun: 2021, unduhan: 678, rating: 4.6, kategori: "Sains & Teknologi", akses: "Open Access" },
    { judul: "Inovasi Pembelajaran Daring Selama Pandemi", penulis: "Prof. Anita Lie", universitas: "Universitas Katolik Widya Mandala", tahun: 2021, unduhan: 1500, rating: 4.7, kategori: "Pendidikan", akses: "Open Access" },
    { judul: "Pengembangan Vaksin Nasional: Tantangan dan Peluang", penulis: "Dr. Amin Soebandrio", universitas: "Lembaga Eijkman", tahun: 2022, unduhan: 920, rating: 4.4, kategori: "Sains & Teknologi", akses: "Exclusive Access" },
    { judul: "Perkembangan Arsitektur Tropis Modern", penulis: "Prof. Eko Purwanto", universitas: "Universitas Tarumanagara", tahun: 2019, unduhan: 345, rating: 4.8, kategori: "Sains & Teknologi", akses: "Open Access" },
    { judul: "Etika Artificial Intelligence dalam Layanan Kesehatan", penulis: "Dr. Setiawan Dalimunthe", universitas: "Fakultas Kedokteran UI", tahun: 2023, unduhan: 512, rating: 4.9, kategori: "Sains & Teknologi", akses: "Exclusive Access" },
  ];

  // Tambahkan kolom jurnal ke schema jika belum ada
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS jurnal (
      id INT PRIMARY KEY AUTO_INCREMENT,
      judul VARCHAR(300) NOT NULL,
      penulis_nama VARCHAR(150) NOT NULL,
      universitas VARCHAR(200),
      tahun_terbit YEAR,
      total_unduhan INT DEFAULT 0,
      total_dilihat INT DEFAULT 0,
      rating DECIMAL(2,1) DEFAULT 0.0,
      total_ulasan INT DEFAULT 0,
      kategori VARCHAR(100),
      akses ENUM('Open Access','Exclusive Access') DEFAULT 'Open Access',
      abstrak TEXT,
      file_url VARCHAR(255),
      aktif TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  } catch {}

  for (const j of jurnal_data) {
    await db.execute(
      `INSERT IGNORE INTO jurnal (judul, penulis_nama, universitas, tahun_terbit, total_unduhan, rating, kategori, akses)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [j.judul, j.penulis, j.universitas, j.tahun, j.unduhan, j.rating, j.kategori, j.akses]
    );
  }
  console.log(`✅ ${jurnal_data.length} jurnal berhasil di-seed`);

  // ===================== DISKUSI =====================
  const diskusi_data = [
    { judul: "Rekomendasi novel fiksi sejarah Indonesia?", konten: "Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.", likes: 1200 },
    { judul: "Bedah Buku: Atomic Habits karya James Clear", konten: "Mari kita diskusikan bab 3 dari Atomic Habits. Bagaimana kalian mengimplementasikan 'Make it Obvious' dalam rutinitas harian kalian?", likes: 850 },
    { judul: "Tips membaca jurnal berbahasa Inggris dengan cepat", konten: "Ada yang punya teknik atau tools AI yang bagus buat bantu mereview literatur jurnal bahasa inggris ngga? Mohon infonya ya kak.", likes: 3400 },
    { judul: "Buku fiksi sains yang mind-blowing?", konten: "Ada saran buku fiksi sains yang konsepnya fresh dan bikin mikir keras? Baru selesai baca Dune dan butuh sesuatu yang sejenis.", likes: 500 },
    { judul: "Bagaimana cara konsisten membaca buku?", konten: "Saya sering beli buku tapi jarang selesai dibaca. Selalu ada saja alasan buat berhenti. Minta tips dong supaya bisa konsisten baca setiap hari.", likes: 2100 },
    { judul: "Diskusi Jurnal: Pengaruh AI terhadap lapangan kerja", konten: "Baru saja baca jurnal terbaru dari MIT tentang otomasi. Menurut kalian, profesi apa saja yang akan paling terdampak dalam 5 tahun ke depan?", likes: 750 },
  ];

  // Seed diskusi dengan user_id dummy (ID 1 = admin)
  for (const d of diskusi_data) {
    await db.execute(
      "INSERT IGNORE INTO diskusi (user_id, judul, konten, total_likes) VALUES (1, ?, ?, ?)",
      [d.judul, d.konten, d.likes]
    ).catch(() => {}); // Ignore jika user_id 1 belum ada
  }
  console.log(`✅ ${diskusi_data.length} diskusi berhasil di-seed (jika admin user ada)`);

  console.log("\n🎉 Seed selesai! Database ReadBridge siap digunakan.\n");
  process.exit(0);
};

seedData().catch(err => {
  console.error("❌ Seed gagal:", err.message);
  process.exit(1);
});

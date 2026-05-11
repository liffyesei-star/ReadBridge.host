// main.js - Script Interaktif untuk ReadBridge

// 2. Data Base (Simulasi Array Database)
// Data Buku
const imgBuku = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuApdMuG3pfOyT45TKpszN-u5p7r1oX9aiBChHWVTMo8VwUuEphgMhzpdAVa4XEQpZgD9IzJG6lf6kLV-3_KyV2Y8PhhfVooBF5YOwubgF5cNUseZ3PO8xTKJhXlKUP1gy2iST0n3WfZ5Y-zSZc2N4U1MdOXpaGoEZxPol1ENCfUOSB93pADkccu3bQ9B5QiG7OOYNM2BCYhg_aSSthqVW92EJ5szvP_eH-k4fUC_PaP2UYVB7I8gYczOUTVuEZ2kmq3eKKyUT1kS0A",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB20mW314sFNPWzvOF_CpCAdw90Y-mmknLvC9JBPb4pHHUZvNYmJ3F-UINSXQJtThnhYkgaP_QQGIxBna--xCuCu0CluusyF76_N8MtPIwXsZir4uO-c4IIpHxoYLGKwlQtyPP-dVZhMhY3c1RDKtMi3VAe6a75GbvBbo8ZMvLKgNwkNmruPktKKfe7ANWZeg_DU7TAPtBiHzLIhkuqz6RzQZ2dSbOO4_O4i59rXDaBIJ3MLzGhGjILnoORo94tk44T0EXa98DflJQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAg98F8GBT94G18yXH1uJ6fy4JRWjmxgKXmQhYgrtegNNTXHYW5BGOwziIRv0wfUgKRNwhklaPrqi0rvwAURNdudCZ6-R0Jo6hrZK0U-oEpB5_MRI3qAQDdZXePtT1cYpe5x1rOLbbh0vjHBJKsUiVuPSRACz9WRyCvaEZz6XFvSy-2aJAY7pIgjQ4kSmvxEFrNzc2fvsu_8Yr2fo0nmD4AMmH9cmxCwdDf707SUvQz1wY7koa43wp2OQJBOrwTWPdQudK0DeuZdFI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAhnYOkX0t3qAzr0mWIbwz5yb3J-3pjarDKs9pacF9zCQ94DO-XoCcqxBiOkrG3PxYhMx_zCHTezkvWjWkc2DBIsPmGjbXwTmBxLk-SVMCzbNfIGcE3iKYP6UqSqm5QwwwSHf8Uqmf_cBHcJk_HTTkxCTfsXBlqNJ8GJ5iPcOuHEqwr2JqhHCdEEVtkkM3PeMaPXTj9L1R9ILP_P8k3x01D76RW0DKuGkQJ6PpxgAzm623v2hKOUWdzDjEQy5KfC57nxFS1lqOnAno",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-_RYEy2W-mlbDtgm-aWh_I8at6APxU8q_BWedJb-9DvV3FnEltycsFwigAD9jsw-f0q6RYDyhGmPKlz82nIh4gBwuH8KrgnBcPWPRp886P14WiPkOWjs5qD1zydVp23FU8MwQGBwXksuGsD0Tl4-P-nbl8dWjTWP_7vtIWTxNppoufJvMR_Ij2CDGXPIL8-NapWPIKUen1_d4A3GZXPaf03R0BpHJlorBfwdLMeWgsEL_6j1MbyqsUGqJch02LrozviiYUdBWtdo"
];
const books = [
  { id: 1, type: 'book', category: 'Non-Fiksi', title: "Sejarah Nasional Indonesia Jilid 1", author: "Marwati Djoened Poesponegoro", rating: 4.8, reviews: 124, price: 85000, image: imgBuku[0], badge: "Populer", reviewer: "Aditya Pratama", abstract: "Buku sejarah nasional jilid 1." },
  { id: 2, type: 'book', category: 'Non-Fiksi', title: "Pengantar Ilmu Sejarah", author: "Kuntowijoyo", rating: 4.6, reviews: 89, price: 65000, image: imgBuku[1], badge: null, reviewer: "Indah Permatasari", abstract: "Buku pengantar ilmu sejarah." },
  { id: 3, type: 'book', category: 'Non-Fiksi', title: "Nusantara: Sejarah Indonesia", author: "Bernard H.M. Vlekke", rating: 4.9, reviews: 215, price: 120000, image: imgBuku[2], badge: "Edisi Terbatas", reviewer: "Satria Dewa", abstract: "Sejarah nusantara dari masa ke masa." },
  { id: 4, type: 'book', category: 'Non-Fiksi', title: "Sapiens: Riwayat Singkat Umat Manusia", author: "Yuval Noah Harari", rating: 4.8, reviews: 532, price: 105000, image: imgBuku[3], badge: null, reviewer: "Maya Andini", abstract: "Menjelajahi sejarah umat manusia dari zaman batu hingga abad ke-21." },
  { id: 5, type: 'book', category: 'Fiksi', title: "Bumi Manusia", author: "Pramoedya Ananta Toer", rating: 4.9, reviews: 840, price: 110000, image: imgBuku[4], badge: "Klasik", reviewer: "Doni Saputra", abstract: "Kisah Minke di masa kolonial Hindia Belanda." },
  { id: 6, type: 'book', category: 'Pengembangan Diri', title: "Atomic Habits", author: "James Clear", rating: 4.9, reviews: 1024, price: 95000, image: imgBuku[0], badge: "Bestseller", reviewer: "Rina Marlina", abstract: "Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk." },
  { id: 7, type: 'book', category: 'Fiksi', title: "Laskar Pelangi", author: "Andrea Hirata", rating: 4.7, reviews: 678, price: 75000, image: imgBuku[1], badge: null, reviewer: "Kurniawan Dwi", abstract: "Kisah persahabatan anak-anak Belitong." },
  { id: 8, type: 'book', category: 'Fiksi', title: "Cantik Itu Luka", author: "Eka Kurniawan", rating: 4.8, reviews: 450, price: 90000, image: imgBuku[2], badge: "Trending", reviewer: "Lisa Damayanti", abstract: "Kisah epik keluarga Halimunda." },
  { id: 9, type: 'book', category: 'Fiksi', title: "Laut Bercerita", author: "Leila S. Chudori", rating: 4.9, reviews: 800, price: 100000, image: imgBuku[3], badge: null, reviewer: "Hendra Kusuma", abstract: "Suara mereka yang dihilangkan pada era reformasi." },
  { id: 10, type: 'book', category: 'Pengembangan Diri', title: "Filosofi Teras", author: "Henry Manampiring", rating: 4.8, reviews: 1200, price: 80000, image: imgBuku[4], badge: "Populer", reviewer: "Nina Oktavia", abstract: "Pengantar filsafat Stoa untuk milenial." },
  { id: 11, type: 'book', category: 'Fiksi', title: "Pulang", author: "Leila S. Chudori", rating: 4.7, reviews: 420, price: 90000, image: imgBuku[0], badge: null, reviewer: "Fauzan Akbar", abstract: "Kisah eksil politik Indonesia di luar negeri." },
  { id: 12, type: 'book', category: 'Non-Fiksi', title: "Kosmos", author: "Carl Sagan", rating: 4.9, reviews: 310, price: 150000, image: imgBuku[1], badge: "Edisi Terbatas", reviewer: "Tari Wulandari", abstract: "Perjalanan memahami alam semesta." }
];

// Data Jurnal
const journals = [
  { id: 1, type: 'journal', title: "Jurnal Sejarah: Dinamika Politik Indonesia Pasca Reformasi", author: "Dr. Anhar Gonggong", publishedYear: 2020, university: "Universitas Indonesia", downloads: 1205, rating: 4.8, reviews: 34, reviewer: "Bayu Setiawan", abstract: "Analisis komprehensif mengenai pergeseran peta kekuatan politik dan dampaknya terhadap kebijakan publik dari tahun 1998 hingga 2020.", discussionQuestion: "Bagaimana perbandingan pengaruh kebijakan sebelum dan sesudah 2010 dalam peta politik?", discussionAnswer: "Pergeseran pasca 2010 lebih menekankan desentralisasi yang memperkuat otonomi daerah, berbeda dengan awal reformasi." },
  { id: 2, type: 'journal', title: "Studi Literatur: Pengaruh Literasi Digital di Era Society 5.0", author: "Prof. Rhenald Kasali", publishedYear: 2022, university: "Universitas Gadjah Mada", downloads: 854, rating: 4.5, reviews: 19, reviewer: "Anita Yulianti", abstract: "Mengkaji bagaimana peningkatan literasi digital berkontribusi pada kesiapan masyarakat menghadapi disrupsi teknologi di era Society 5.0.", discussionQuestion: "Apakah literasi digital ini diukur berdasarkan demografi umur tertentu?", discussionAnswer: "Ya, fokus utama studi ini adalah generasi milenial dan Gen Z sebagai pendorong utama society 5.0." },
  { id: 3, type: 'journal', title: "Jurnal Ilmu Komputer: Implementasi AI pada Sistem Perpustakaan", author: "Dr. Romi Satria Wahono", publishedYear: 2023, university: "Institut Teknologi Bandung", downloads: 432, rating: 4.9, reviews: 52, reviewer: "Yusuf Hidayat", abstract: "Penerapan algoritma machine learning untuk rekomendasi buku dan optimasi sistem klasifikasi perpustakaan digital.", discussionQuestion: "Algoritma machine learning apa yang paling efektif dalam rekomendasi ini?", discussionAnswer: "Kami menemukan bahwa kombinasi collaborative filtering dan neural networks memberikan hasil yang paling akurat." },
  { id: 4, type: 'journal', title: "Dampak Perubahan Iklim Terhadap Ekonomi Pertanian", author: "Dr. Emil Salim", publishedYear: 2021, university: "Institut Pertanian Bogor", downloads: 678, rating: 4.6, reviews: 27, reviewer: "Sari Purnamasari", abstract: "Kajian empiris mengenai penurunan hasil panen akibat anomali cuaca di wilayah Jawa Barat selama satu dekade terakhir.", discussionQuestion: "Apakah ada variabel jenis tanah yang diikutsertakan dalam kajian ini?", discussionAnswer: "Kajian ini berfokus pada anomali curah hujan dan suhu, namun kami merekomendasikan variabel tanah untuk studi selanjutnya." },
  { id: 5, type: 'journal', title: "Inovasi Pembelajaran Daring Selama Pandemi", author: "Prof. Anita Lie", publishedYear: 2021, university: "Universitas Katolik Widya Mandala", downloads: 1500, rating: 4.7, reviews: 45, reviewer: "Kevin Sanjaya", abstract: "Evaluasi efektivitas berbagai platform e-learning dalam menjaga kualitas pendidikan selama masa pembatasan sosial berskala besar.", discussionQuestion: "Bagaimana dengan aspek interaktivitas siswa di daerah terpelosok?", discussionAnswer: "Aspek ini cukup krusial, studi kami mencatat adanya ketimpangan yang signifikan akibat infrastruktur jaringan." },
  { id: 6, type: 'journal', title: "Pengembangan Vaksin Nasional: Tantangan dan Peluang", author: "Dr. Amin Soebandrio", publishedYear: 2022, university: "Lembaga Eijkman", downloads: 920, rating: 4.4, reviews: 12, reviewer: "Lia Safitri", abstract: "Tinjauan mendalam mengenai proses riset dan pengembangan vaksin Merah Putih di Indonesia.", discussionQuestion: "Apa tantangan terbesar dalam tahap uji klinis fase 3?", discussionAnswer: "Tantangan utamanya adalah mendapatkan relawan yang belum pernah divaksinasi sebelumnya di tengah program vaksinasi masal." },
  { id: 7, type: 'journal', title: "Perkembangan Arsitektur Tropis Modern", author: "Prof. Eko Purwanto", publishedYear: 2019, university: "Universitas Tarumanagara", downloads: 345, rating: 4.8, reviews: 31, reviewer: "Dimas Anggara", abstract: "Eksplorasi desain bangunan yang responsif terhadap iklim tropis dengan pendekatan estetika modern dan material lokal.", discussionQuestion: "Material lokal apa saja yang terbukti paling efisien meredam panas?", discussionAnswer: "Bambu dan bata merah ekspos, ketika dipadukan dengan sirkulasi silang, menunjukkan penurunan suhu ruang tertinggi." },
  { id: 8, type: 'journal', title: "Etika Artificial Intelligence dalam Layanan Kesehatan", author: "Dr. Setiawan Dalimunthe", publishedYear: 2023, university: "Fakultas Kedokteran UI", downloads: 512, rating: 4.9, reviews: 68, reviewer: "Siska Saraswati", abstract: "Diskusi mengenai batasan moral, privasi data pasien, dan tanggung jawab hukum dalam penerapan AI di rumah sakit.", discussionQuestion: "Siapa yang bertanggung jawab secara hukum jika AI membuat misdiagnosis?", discussionAnswer: "Secara etika saat ini, tanggung jawab akhir tetap berada di tangan tenaga medis profesional sebagai 'human in the loop'." }
];

// Data Diskusi
const discussions = [
  { id: 1, type: 'discussion', title: "Rekomendasi novel fiksi sejarah Indonesia?", author: "@SastraWangi", timeAgo: "2 jam yang lalu", upvotes: "1.2k", comments: 45, content: "Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.", tags: ["#Fiksi", "#Sejarah"] },
  { id: 2, type: 'discussion', title: "Bedah Buku: Atomic Habits karya James Clear", author: "@ProduktivitasTinggi", timeAgo: "1 hari yang lalu", upvotes: "850", comments: 120, content: "Mari kita diskusikan bab 3 dari Atomic Habits. Bagaimana kalian mengimplementasikan 'Make it Obvious' dalam rutinitas harian kalian?", tags: ["#BedahBuku", "#SelfImprovement"] },
  { id: 3, type: 'discussion', title: "Tips membaca jurnal berbahasa Inggris dengan cepat", author: "@PejuangSkripsi", timeAgo: "5 jam yang lalu", upvotes: "3.4k", comments: 210, content: "Ada yang punya teknik atau tools AI yang bagus buat bantu mereview literatur jurnal bahasa inggris ngga? Mohon infonya ya kak.", tags: ["#Skripsi", "#TipsBelajar"] },
  { id: 4, type: 'discussion', title: "Buku fiksi sains yang mind-blowing?", author: "@SciFiNerd", timeAgo: "3 hari yang lalu", upvotes: "500", comments: 80, content: "Ada saran buku fiksi sains yang konsepnya fresh dan bikin mikir keras? Baru selesai baca Dune dan butuh sesuatu yang sejenis.", tags: ["#SciFi", "#RekomendasiBuku"] },
  { id: 5, type: 'discussion', title: "Bagaimana cara konsisten membaca buku?", author: "@PembacaPemula", timeAgo: "1 minggu yang lalu", upvotes: "2.1k", comments: 150, content: "Saya sering beli buku tapi jarang selesai dibaca. Selalu ada saja alasan buat berhenti. Minta tips dong supaya bisa konsisten baca setiap hari.", tags: ["#TipsMembaca", "#Produktivitas"] },
  { id: 6, type: 'discussion', title: "Diskusi Jurnal: Pengaruh AI terhadap lapangan kerja", author: "@TechEnthusiast", timeAgo: "12 jam yang lalu", upvotes: "750", comments: 95, content: "Baru saja baca jurnal terbaru dari MIT tentang otomasi. Menurut kalian, profesi apa saja yang akan paling terdampak dalam 5 tahun ke depan?", tags: ["#DiskusiJurnal", "#TechNews"] }
];

// Data Marketplace (Buku Preloved)
// Data Marketplace (Buku Preloved) disinkronisasi dengan books
const marketplaceBooks = books.map((b, i) => ({
  ...b,
  id: 100 + b.id, // Preloved id
  condition: i % 2 === 0 ? "Bagus" : "Lecet",
  stock: (i % 3) + 1,
  location: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"][i % 4],
  date: "2024-05-01",
  price: Math.floor(b.price * 0.7) // Harga preloved 70% dari harga baru
}));

// Data Sewa Buku disinkronisasi dengan books
const sewaBooks = books.map((b, i) => ({
  ...b,
  id: 200 + b.id, // Sewa id
  stock: (i % 4) + 1,
  priceHarian: Math.floor(b.price * 0.05),
  priceMingguan: Math.floor(b.price * 0.25),
  priceBulanan: Math.floor(b.price * 0.8)
}));

window.readbridgeData = { books, journals, discussions, marketplaceBooks, sewaBooks };

document.addEventListener("DOMContentLoaded", function () {
  // --- A. RUNTUTAN (SEQUENCE) ---
  // Kode di bawah ini berjalan secara berurutan saat halaman selesai dimuat:
  // 1. Mengambil referensi elemen
  // 2. Mendefinisikan data base (Buku, Jurnal, Diskusi)
  // 3. Setup fungsi render sesuai kategori yang aktif
  // 4. Menambahkan event listener pada form pencarian & tab nav

  // 1. Mengambil elemen DOM
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const resultGrid = document.getElementById("book-grid");
  const resultMessage = document.getElementById("result-message");
  
  // Tab elements
  const tabBuku = document.getElementById("tab-buku");
  const tabJurnal = document.getElementById("tab-jurnal");
  const tabDiskusi = document.getElementById("tab-diskusi");

  // Jika elemen tidak ditemukan (misal di halaman yang bukan eksplor.html), hentikan eksekusi
  if (!resultGrid) return;

  // Status Tab Aktif (Default: 'buku')
  const imgBuku = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuApdMuG3pfOyT45TKpszN-u5p7r1oX9aiBChHWVTMo8VwUuEphgMhzpdAVa4XEQpZgD9IzJG6lf6kLV-3_KyV2Y8PhhfVooBF5YOwubgF5cNUseZ3PO8xTKJhXlKUP1gy2iST0n3WfZ5Y-zSZc2N4U1MdOXpaGoEZxPol1ENCfUOSB93pADkccu3bQ9B5QiG7OOYNM2BCYhg_aSSthqVW92EJ5szvP_eH-k4fUC_PaP2UYVB7I8gYczOUTVuEZ2kmq3eKKyUT1kS0A",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB20mW314sFNPWzvOF_CpCAdw90Y-mmknLvC9JBPb4pHHUZvNYmJ3F-UINSXQJtThnhYkgaP_QQGIxBna--xCuCu0CluusyF76_N8MtPIwXsZir4uO-c4IIpHxoYLGKwlQtyPP-dVZhMhY3c1RDKtMi3VAe6a75GbvBbo8ZMvLKgNwkNmruPktKKfe7ANWZeg_DU7TAPtBiHzLIhkuqz6RzQZ2dSbOO4_O4i59rXDaBIJ3MLzGhGjILnoORo94tk44T0EXa98DflJQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAg98F8GBT94G18yXH1uJ6fy4JRWjmxgKXmQhYgrtegNNTXHYW5BGOwziIRv0wfUgKRNwhklaPrqi0rvwAURNdudCZ6-R0Jo6hrZK0U-oEpB5_MRI3qAQDdZXePtT1cYpe5x1rOLbbh0vjHBJKsUiVuPSRACz9WRyCvaEZz6XFvSy-2aJAY7pIgjQ4kSmvxEFrNzc2fvsu_8Yr2fo0nmD4AMmH9cmxCwdDf707SUvQz1wY7koa43wp2OQJBOrwTWPdQudK0DeuZdFI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhnYOkX0t3qAzr0mWIbwz5yb3J-3pjarDKs9pacF9zCQ94DO-XoCcqxBiOkrG3PxYhMx_zCHTezkvWjWkc2DBIsPmGjbXwTmBxLk-SVMCzbNfIGcE3iKYP6UqSqm5QwwwSHf8Uqmf_cBHcJk_HTTkxCTfsXBlqNJ8GJ5iPcOuHEqwr2JqhHCdEEVtkkM3PeMaPXTj9L1R9ILP_P8k3x01D76RW0DKuGkQJ6PpxgAzm623v2hKOUWdzDjEQy5KfC57nxFS1lqOnAno",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-_RYEy2W-mlbDtgm-aWh_I8at6APxU8q_BWedJb-9DvV3FnEltycsFwigAD9jsw-f0q6RYDyhGmPKlz82nIh4gBwuH8KrgnBcPWPRp886P14WiPkOWjs5qD1zydVp23FU8MwQGBwXksuGsD0Tl4-P-nbl8dWjTWP_7vtIWTxNppoufJvMR_Ij2CDGXPIL8-NapWPIKUen1_d4A3GZXPaf03R0BpHJlorBfwdLMeWgsEL_6j1MbyqsUGqJch02LrozviiYUdBWtdo"
  ];
  const books = [
    { id: 1, type: 'book', title: "Sejarah Nasional Indonesia Jilid 1", author: "Marwati Djoened Poesponegoro", rating: 4.8, reviews: 124, price: 85000, image: imgBuku[0], badge: "Populer" },
    { id: 2, type: 'book', title: "Pengantar Ilmu Sejarah", author: "Kuntowijoyo", rating: 4.6, reviews: 89, price: 65000, image: imgBuku[1], badge: null },
    { id: 3, type: 'book', title: "Nusantara: Sejarah Indonesia", author: "Bernard H.M. Vlekke", rating: 4.9, reviews: 215, price: 120000, image: imgBuku[2], badge: "Edisi Terbatas" },
    { id: 4, type: 'book', title: "Sapiens: Riwayat Singkat Umat Manusia", author: "Yuval Noah Harari", rating: 4.8, reviews: 532, price: 105000, image: imgBuku[3], badge: null },
    { id: 5, type: 'book', title: "Bumi Manusia", author: "Pramoedya Ananta Toer", rating: 4.9, reviews: 840, price: 110000, image: imgBuku[4], badge: "Klasik" },
    { id: 6, type: 'book', title: "Atomic Habits", author: "James Clear", rating: 4.9, reviews: 1024, price: 95000, image: imgBuku[0], badge: "Bestseller" },
    { id: 7, type: 'book', title: "Laskar Pelangi", author: "Andrea Hirata", rating: 4.7, reviews: 678, price: 75000, image: imgBuku[1], badge: null },
    { id: 8, type: 'book', title: "Cantik Itu Luka", author: "Eka Kurniawan", rating: 4.8, reviews: 450, price: 90000, image: imgBuku[2], badge: "Trending" },
    { id: 9, type: 'book', title: "Laut Bercerita", author: "Leila S. Chudori", rating: 4.9, reviews: 800, price: 100000, image: imgBuku[3], badge: null },
    { id: 10, type: 'book', title: "Filosofi Teras", author: "Henry Manampiring", rating: 4.8, reviews: 1200, price: 80000, image: imgBuku[4], badge: "Populer" },
    { id: 11, type: 'book', title: "Pulang", author: "Leila S. Chudori", rating: 4.7, reviews: 420, price: 90000, image: imgBuku[0], badge: null },
    { id: 12, type: 'book', title: "Kosmos", author: "Carl Sagan", rating: 4.9, reviews: 310, price: 150000, image: imgBuku[1], badge: "Edisi Terbatas" }
  ];

  // Data Jurnal
  const journals = [
    { id: 1, type: 'journal', title: "Jurnal Sejarah: Dinamika Politik Indonesia Pasca Reformasi", author: "Dr. Anhar Gonggong", publishedYear: 2020, university: "Universitas Indonesia", downloads: 1205, abstract: "Analisis komprehensif mengenai pergeseran peta kekuatan politik dan dampaknya terhadap kebijakan publik dari tahun 1998 hingga 2020.", category: "Sosial Humaniora", access: "Open Access", rating: 4.8, reviews: 156, reviewer: "Ridwan Kamil" },
    { id: 2, type: 'journal', title: "Studi Literatur: Pengaruh Literasi Digital di Era Society 5.0", author: "Prof. Rhenald Kasali", publishedYear: 2022, university: "Universitas Gadjah Mada", downloads: 854, abstract: "Mengkaji bagaimana peningkatan literasi digital berkontribusi pada kesiapan masyarakat menghadapi disrupsi teknologi di era Society 5.0.", category: "Pendidikan", access: "Open Access", rating: 4.7, reviews: 92, reviewer: "Nadiem Makarim" },
    { id: 3, type: 'journal', title: "Jurnal Ilmu Komputer: Implementasi AI pada Sistem Perpustakaan", author: "Dr. Romi Satria Wahono", publishedYear: 2023, university: "Institut Teknologi Bandung", downloads: 432, abstract: "Penerapan algoritma machine learning untuk rekomendasi buku dan optimasi sistem klasifikasi perpustakaan digital.", category: "Sains & Teknologi", access: "Exclusive Access", rating: 4.9, reviews: 310, reviewer: "Ferry Irawan" },
    { id: 4, type: 'journal', title: "Dampak Perubahan Iklim Terhadap Ekonomi Pertanian", author: "Dr. Emil Salim", publishedYear: 2021, university: "Institut Pertanian Bogor", downloads: 678, abstract: "Kajian empiris mengenai penurunan hasil panen akibat anomali cuaca di wilayah Jawa Barat selama satu dekade terakhir.", category: "Sains & Teknologi", access: "Open Access", rating: 4.6, reviews: 88, reviewer: "Siti Nurbaya" },
    { id: 5, type: 'journal', title: "Inovasi Pembelajaran Daring Selama Pandemi", author: "Prof. Anita Lie", publishedYear: 2021, university: "Universitas Katolik Widya Mandala", downloads: 1500, abstract: "Evaluasi efektivitas berbagai platform e-learning dalam menjaga kualitas pendidikan selama masa pembatasan sosial berskala besar.", category: "Pendidikan", access: "Open Access", rating: 4.8, reviews: 420, reviewer: "Anies Baswedan" },
    { id: 6, type: 'journal', title: "Pengembangan Vaksin Nasional: Tantangan dan Peluang", author: "Dr. Amin Soebandrio", publishedYear: 2022, university: "Lembaga Eijkman", downloads: 920, abstract: "Tinjauan mendalam mengenai proses riset dan pengembangan vaksin Merah Putih di Indonesia.", category: "Sains & Teknologi", access: "Exclusive Access", rating: 4.5, reviews: 115, reviewer: "Terawan Agus" },
    { id: 7, type: 'journal', title: "Perkembangan Arsitektur Tropis Modern", author: "Prof. Eko Purwanto", publishedYear: 2019, university: "Universitas Tarumanagara", downloads: 345, abstract: "Eksplorasi desain bangunan yang responsif terhadap iklim tropis dengan pendekatan estetika modern dan material lokal.", category: "Sains & Teknologi", access: "Open Access", rating: 4.7, reviews: 67, reviewer: "Andra Matin" },
    { id: 8, type: 'journal', title: "Etika Artificial Intelligence dalam Layanan Kesehatan", author: "Dr. Setiawan Dalimunthe", publishedYear: 2023, university: "Fakultas Kedokteran UI", downloads: 512, abstract: "Diskusi mengenai batasan moral, privasi data pasien, dan tanggung jawab hukum dalam penerapan AI di rumah sakit.", category: "Sains & Teknologi", access: "Exclusive Access", rating: 4.9, reviews: 210, reviewer: "Pratikno" }
  ];

  // Data Diskusi
  const discussions = [
    { id: 1, type: 'discussion', title: "Rekomendasi novel fiksi sejarah Indonesia?", author: "@SastraWangi", timeAgo: "2 jam yang lalu", upvotes: "1.2k", comments: 45, content: "Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.", tags: ["#Fiksi", "#Sejarah"] },
    { id: 2, type: 'discussion', title: "Bedah Buku: Atomic Habits karya James Clear", author: "@ProduktivitasTinggi", timeAgo: "1 hari yang lalu", upvotes: "850", comments: 120, content: "Mari kita diskusikan bab 3 dari Atomic Habits. Bagaimana kalian mengimplementasikan 'Make it Obvious' dalam rutinitas harian kalian?", tags: ["#BedahBuku", "#SelfImprovement"] },
    { id: 3, type: 'discussion', title: "Tips membaca jurnal berbahasa Inggris dengan cepat", author: "@PejuangSkripsi", timeAgo: "5 jam yang lalu", upvotes: "3.4k", comments: 210, content: "Ada yang punya teknik atau tools AI yang bagus buat bantu mereview literatur jurnal bahasa inggris ngga? Mohon infonya ya kak.", tags: ["#Skripsi", "#TipsBelajar"] },
    { id: 4, type: 'discussion', title: "Buku fiksi sains yang mind-blowing?", author: "@SciFiNerd", timeAgo: "3 hari yang lalu", upvotes: "500", comments: 80, content: "Ada saran buku fiksi sains yang konsepnya fresh dan bikin mikir keras? Baru selesai baca Dune dan butuh sesuatu yang sejenis.", tags: ["#SciFi", "#RekomendasiBuku"] },
    { id: 5, type: 'discussion', title: "Bagaimana cara konsisten membaca buku?", author: "@PembacaPemula", timeAgo: "1 minggu yang lalu", upvotes: "2.1k", comments: 150, content: "Saya sering beli buku tapi jarang selesai dibaca. Selalu ada saja alasan buat berhenti. Minta tips dong supaya bisa konsisten baca setiap hari.", tags: ["#TipsMembaca", "#Produktivitas"] },
    { id: 6, type: 'discussion', title: "Diskusi Jurnal: Pengaruh AI terhadap lapangan kerja", author: "@TechEnthusiast", timeAgo: "12 jam yang lalu", upvotes: "750", comments: 95, content: "Baru saja baca jurnal terbaru dari MIT tentang otomasi. Menurut kalian, profesi apa saja yang akan paling terdampak dalam 5 tahun ke depan?", tags: ["#DiskusiJurnal", "#TechNews"] }
  ];

  // Status Tab Aktif (Default: 'buku')
  let currentActiveTab = 'buku';

  // 3. Fungsi Utility Format Harga
  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  }

  // --- D. PERULANGAN (LOOPING) ---
  // & E. MENAMPILKAN DAFTAR DATA
  function renderData(data, type) {
    resultGrid.innerHTML = ""; // Kosongkan grid terlebih dahulu

    // B. PERCABANGAN (IF/ELSE)
    if (data.length === 0) {
      // Jika hasil pencarian kosong
      resultGrid.innerHTML = `<p class="col-span-full text-center text-on-surface-variant font-body-md py-lg">Tidak ada ${type} yang cocok dengan pencarian Anda.</p>`;
    } else {
      // Jika ada data, gunakan LOOPING untuk membuat elemen kartu
      data.forEach((item) => {
        let cardHTML = "";

        // Percabangan untuk merender layout yang berbeda sesuai tipe data (Buku / Jurnal / Diskusi)
        if (type === 'buku') {
          let badgeHTML = item.badge ? `<div class="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">local_fire_department</span> ${item.badge}</div>` : "";
          let imageHTML = item.image ? `<img alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${item.image}"/>` : `<div class="w-full h-full flex items-center justify-center bg-surface-variant group-hover:scale-105 transition-transform duration-500"><span class="material-symbols-outlined text-[64px] text-outline-variant">menu_book</span></div>`;

          cardHTML = `
            <a href="detail.html?id=${item.id}" class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer">
              <div class="h-48 w-full bg-surface-container-high relative overflow-hidden">
                ${imageHTML}
                ${badgeHTML}
              </div>
              <div class="p-md flex flex-col flex-grow">
                <h3 class="font-title-lg text-title-lg text-on-surface line-clamp-2 leading-tight mb-xs">${item.title}</h3>
                <p class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${item.author}</p>
                <div class="flex items-center gap-xs mb-auto"><span class="material-symbols-outlined text-tertiary-container text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span><span class="font-label-sm text-label-sm font-bold">${item.rating}</span><span class="font-label-sm text-label-sm text-outline">(${item.reviews})</span></div>
                <div class="mt-md pt-sm border-t border-outline-variant/30 flex justify-between items-center">
                  <span class="font-headline-md text-headline-md text-primary font-bold">${formatRupiah(item.price)}</span>
                  <button class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"><span class="material-symbols-outlined text-[18px]">bookmark_add</span></button>
                </div>
              </div>
            </a>
          `;
        } 
        else if (type === 'jurnal') {
          // Layout Kartu Jurnal
          cardHTML = `
            <a href="detail-jurnal.html?id=${item.id}" class="block col-span-full md:col-span-1 lg:col-span-2 xl:col-span-2">
              <article class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-sm h-full relative">
                <div class="flex justify-between items-start">
                  <div class="flex flex-wrap gap-2">
                    <span class="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-1 rounded">JURNAL</span>
                    <span class="bg-surface-container-high text-on-surface text-xs font-bold px-2 py-1 rounded">${item.category}</span>
                    <span class="bg-secondary-container text-on-secondary-container text-xs font-bold px-2 py-1 rounded">${item.access}</span>
                  </div>
                  <span class="text-on-surface-variant font-label-sm text-label-sm shrink-0 ml-2">${item.publishedYear}</span>
                </div>
                <h3 class="font-title-lg text-title-lg text-on-surface font-bold leading-tight group-hover:text-primary mt-2">${item.title}</h3>
                <p class="font-label-sm text-label-sm text-primary font-bold">${item.author} <span class="text-on-surface-variant font-normal">• ${item.university}</span></p>
                <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-relaxed mt-2">${item.abstract}</p>
                <div class="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/30">
                  <div class="flex items-center gap-xs text-on-surface-variant font-label-sm"><span class="material-symbols-outlined text-[18px]">download</span> ${item.downloads} Unduhan</div>
                  <span class="btn btn--outlined py-1 px-4 text-sm font-bold rounded-full text-center hover:bg-surface-container transition-colors inline-block border border-primary text-primary">Baca Jurnal</span>
                </div>
              </article>
            </a>
          `;
        }
        else if (type === 'diskusi') {
           // Layout Kartu Diskusi
           let tagsHTML = item.tags.map(tag => `<span class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm">${tag}</span>`).join('');
           
           cardHTML = `
             <article class="bg-surface-container-lowest col-span-full rounded-2xl p-lg flex flex-col gap-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
               <div class="flex items-center justify-between">
                 <div class="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm">
                   <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-outline">person</span></div>
                   <div class="flex flex-col"><span class="font-bold text-on-surface text-label-md">${item.author}</span><span class="text-on-surface-variant/80">${item.timeAgo}</span></div>
                 </div>
                 <button class="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors"><span class="material-symbols-outlined">more_horiz</span></button>
               </div>
               <div class="flex flex-col gap-2">
                 <a href="detail-diskusi.html?id=${item.id}" class="group"><h2 class="font-title-lg text-title-lg text-on-surface font-bold leading-tight cursor-pointer group-hover:text-primary">${item.title}</h2></a>
                 <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-relaxed">${item.content}</p>
               </div>
               <div class="flex gap-2 mt-1">${tagsHTML}</div>
               <div class="flex gap-4 mt-2 pt-4 border-t border-outline-variant/30 text-on-surface-variant items-center justify-between">
                 <div class="flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-1 border border-outline-variant/20">
                   <button class="hover:text-primary hover:bg-surface-container-high p-1.5 rounded-full transition-colors"><span class="material-symbols-outlined text-[20px]">arrow_upward</span></button>
                   <span class="font-label-md text-label-md font-bold px-2 text-on-surface">${item.upvotes}</span>
                   <button class="hover:text-error hover:bg-surface-container-high p-1.5 rounded-full transition-colors"><span class="material-symbols-outlined text-[20px]">arrow_downward</span></button>
                 </div>
                 <button class="flex items-center gap-sm hover:bg-surface-container-low px-4 py-2 rounded-full transition-colors font-label-md text-label-md text-on-surface"><span class="material-symbols-outlined text-[20px]">chat_bubble</span> ${item.comments} Balasan</button>
               </div>
             </article>
           `;
        }

        // Tambahkan HTML yang dibuat ke dalam grid
        resultGrid.innerHTML += cardHTML;
      });
    }

    // Update pesan hasil
    if (resultMessage) {
        resultMessage.textContent = `Menampilkan ${data.length} hasil untuk ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
  }

  // Tampilkan tab default (Buku) saat pertama kali dimuat (Sequence lanjutan)
  renderData(books, 'buku');

  // --- Fungsi Ganti Tab ---
  function switchTab(selectedTabStr) {
    currentActiveTab = selectedTabStr;
    
    // Reset style semua tab
    [tabBuku, tabJurnal, tabDiskusi].forEach(tab => {
       if(!tab) return;
       tab.className = "font-title-lg text-title-lg text-on-surface-variant hover:text-primary transition-colors pb-2 px-2";
    });

    // Aktifkan tab yang dipilih
    let activeElement;
    let dataToRender = [];

    if (selectedTabStr === 'buku') {
       activeElement = tabBuku;
       dataToRender = books;
    } else if (selectedTabStr === 'jurnal') {
       activeElement = tabJurnal;
       dataToRender = journals;
    } else if (selectedTabStr === 'diskusi') {
       activeElement = tabDiskusi;
       dataToRender = discussions;
    }

    if (activeElement) {
       activeElement.className = "font-title-lg text-title-lg text-primary border-b-2 border-primary pb-2 px-2 transition-colors";
    }

    // Ganti Sidebar Filter berdasarkan tab yang aktif
    const filterBuku = document.getElementById('filter-buku');
    const filterJurnal = document.getElementById('filter-jurnal');
    const filterDiskusi = document.getElementById('filter-diskusi');
    
    if (filterBuku && filterJurnal && filterDiskusi) {
        filterBuku.classList.add('hidden'); filterBuku.classList.remove('block');
        filterJurnal.classList.add('hidden'); filterJurnal.classList.remove('block');
        filterDiskusi.classList.add('hidden'); filterDiskusi.classList.remove('block');
        
        if (selectedTabStr === 'buku') {
            filterBuku.classList.remove('hidden'); filterBuku.classList.add('block');
        } else if (selectedTabStr === 'jurnal') {
            filterJurnal.classList.remove('hidden'); filterJurnal.classList.add('block');
        } else if (selectedTabStr === 'diskusi') {
            filterDiskusi.classList.remove('hidden'); filterDiskusi.classList.add('block');
        }
    }

    // Reset isi input pencarian saat pindah tab
    if (searchInput) searchInput.value = "";
    
    // Render ulang data sesuai tab
    renderData(dataToRender, selectedTabStr);
  }

  // Pasang Event Listener Tab
  if (tabBuku) tabBuku.addEventListener("click", () => switchTab('buku'));
  if (tabJurnal) tabJurnal.addEventListener("click", () => switchTab('jurnal'));
  if (tabDiskusi) tabDiskusi.addEventListener("click", () => switchTab('diskusi'));


  // 4. Fitur Pencarian
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", function () {
      const keyword = searchInput.value.trim().toLowerCase();

      // --- C. VALIDASI INPUT TIDAK BOLEH KOSONG ---
      if (keyword === "") {
        alert("Input pencarian tidak boleh kosong!");
        return; // Hentikan fungsi jika kosong
      }

      // Tentukan source data berdasarkan tab aktif
      let sourceData = [];
      if (currentActiveTab === 'buku') sourceData = books;
      else if (currentActiveTab === 'jurnal') sourceData = journals;
      else if (currentActiveTab === 'diskusi') sourceData = discussions;

      // Filter data menggunakan perulangan array (.filter)
      const filteredData = sourceData.filter((item) => {
        // Logika pencarian menyesuaikan tipe tab
        if (currentActiveTab === 'buku' || currentActiveTab === 'jurnal') {
           return item.title.toLowerCase().includes(keyword) || item.author.toLowerCase().includes(keyword);
        } else if (currentActiveTab === 'diskusi') {
           return item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword);
        }
      });

      // Tampilkan hasil filter
      renderData(filteredData, currentActiveTab);
    });

    // Menambahkan dukungan tombol "Enter" di keyboard
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }

  // Filter Logic untuk Jurnal
  const applyFilterBtn = document.getElementById('apply-filter-btn');
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (currentActiveTab === 'jurnal') {
        const isPendidikan = document.getElementById('filter-jurnal-cat-pendidikan')?.checked;
        const isSains = document.getElementById('filter-jurnal-cat-sains')?.checked;
        const isSoshum = document.getElementById('filter-jurnal-cat-soshum')?.checked;
        
        const isAccessOpen = document.getElementById('filter-jurnal-access-open')?.checked;
        const isAccessExclusive = document.getElementById('filter-jurnal-access-exclusive')?.checked;
        
        const yearFilterEl = document.querySelector('input[name="tahun_jurnal"]:checked');
        const yearVal = yearFilterEl ? yearFilterEl.value : 'all';
        
        const filteredData = journals.filter(j => {
           let passCat = false;
           if (isPendidikan && j.category === 'Pendidikan') passCat = true;
           if (isSains && j.category === 'Sains & Teknologi') passCat = true;
           if (isSoshum && j.category === 'Sosial Humaniora') passCat = true;
           
           let passAccess = false;
           if (isAccessOpen && j.access === 'Open Access') passAccess = true;
           if (isAccessExclusive && j.access === 'Exclusive Access') passAccess = true;
           
           let passYear = false;
           if (yearVal === 'all') passYear = true;
           else if (yearVal === '2023-2024' && (j.publishedYear === 2023 || j.publishedYear === 2024)) passYear = true;
           else if (yearVal === '2020-2022' && (j.publishedYear >= 2020 && j.publishedYear <= 2022)) passYear = true;
           else if (yearVal === '2019' && j.publishedYear === 2019) passYear = true; // just to be safe for old data
           else if (yearVal === '2020-2022' && j.publishedYear === 2019) passYear = true; // wait 2019 isn't 2020
           
           // If publishedYear is not caught, include it in 'all' anyway, but not in specific ranges unless it matches
           
           return passCat && passAccess && passYear;
        });
        
        renderData(filteredData, 'jurnal');
      } else {
         alert('Filter khusus untuk tab ini akan segera hadir.');
      }
    });
  }

  // --- F. FITUR NOTIFIKASI ---
  // Menambahkan fungsionalitas untuk halaman notifikasi
  const markAllReadBtn = document.getElementById("mark-all-read");
  const notificationCards = document.querySelectorAll(".notification-card.unread");

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function() {
      // Loop untuk menghapus status unread dari semua notifikasi
      notificationCards.forEach(card => {
        // Hapus class unread
        card.classList.remove("unread");
        
        // Sembunyikan dot merah
        const dot = card.querySelector(".unread-dot");
        if (dot) {
          dot.style.display = "none";
        }

        // Tambahkan efek transparansi (opacity-80) untuk menandakan sudah dibaca
        const contentArea = card.querySelector(".flex-grow");
        if (contentArea) {
          contentArea.classList.add("opacity-80");
        }
      });

      // Update badge di navbar jika ada
      const navBadge = document.querySelector("header .bg-error");
      if (navBadge) {
        navBadge.style.display = "none";
      }

      alert("Semua notifikasi telah ditandai sebagai dibaca.");
    });
  }

  // --- G. FITUR KLIK GLOBAL UNTUK SEMUA ELEMEN INTERAKTIF ---
  // Menangkap semua klik pada tombol, filter, hashtag, icon, dll.
  document.addEventListener('click', function(e) {
    // Jangan proses jika ini klik form, select, atau dropdown profile
    if (e.target.closest('#profile-menu-container') || e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'select') return;

    // Cari elemen terdekat yang merupakan interaktif
    const clickable = e.target.closest('button, .cursor-pointer, a[href="#"]');
    
    if (clickable) {
      // Jika itu sebuah tautan yang valid (bukan #) dan kita tidak sedang menekan button/icon spesifik di dalamnya,
      // biarkan browser berpindah halaman secara natural (contoh: klik seluruh Card untuk pergi ke detail.html)
      if (clickable.tagName.toLowerCase() === 'a' && clickable.getAttribute('href') && clickable.getAttribute('href') !== '#') {
        return; 
      }

      // Abaikan jika ada alert sendiri
      if (clickable.id === 'mark-all-read') return;
      if (clickable.closest('#tab-buku') || clickable.closest('#tab-jurnal') || clickable.closest('#tab-diskusi')) return;
      
      // Coba dapatkan nama ikon jika dia berupa tombol ikon
      let content = "";
      const icon = clickable.querySelector('.material-symbols-outlined');
      
      // Kalau di dalam clickable cuma ada icon dan tanpa teks lain yang panjang, ambil teks ikonnya
      if (icon && clickable.innerText.trim() === icon.innerText.trim()) {
          content = icon.innerText.trim();
      } else if (!icon && clickable.innerText.trim().length < 50) {
          content = clickable.innerText.trim();
      } else if (icon) {
          // Jika elemen sangat besar (misal card) tapi entah kenapa tertangkap, jangan gunakan isinya semua.
          // Coba pastikan apa target aslinya yang di klik
          const realTargetIcon = e.target.closest('.material-symbols-outlined');
          if (realTargetIcon) {
              content = realTargetIcon.innerText.trim();
          }
      }

      // Jangan proses jika kosong
      if (!content) return;

      // Logika output interaksi sesuai konten persis (bukan sekadar includes string yang bisa meleset ke card)
      if (content === 'bookmark_add') {
        alert('Tersimpan ke Koleksi Anda!');
        const iconEl = clickable.querySelector('.material-symbols-outlined') || e.target;
        if (iconEl && iconEl.innerText === 'bookmark_add') iconEl.innerText = 'bookmark_added';
        e.preventDefault();
        return;
      }
      
      if (content === 'bookmark_added') {
        alert('Dihapus dari Koleksi Anda!');
        const iconEl = clickable.querySelector('.material-symbols-outlined') || e.target;
        if (iconEl && iconEl.innerText === 'bookmark_added') iconEl.innerText = 'bookmark_add';
        e.preventDefault();
        return;
      }

      if (content === 'favorite') {
        alert('Anda menyukai postingan ini!');
        e.preventDefault();
        return;
      }

      if (content === 'mode_comment') {
        alert('Membuka kolom komentar...');
        e.preventDefault();
        return;
      }

      if (content === 'share') {
        alert('Membagikan tautan...');
        e.preventDefault();
        return;
      }

      if (content === 'search') {
        return; // Biarkan logika search di atas berjalan
      }

      // Untuk tag filter atau tombol general (misal "E-Book", "#Fiksi", dll)
      if (content.length > 0 && content !== 'visibility' && content !== 'visibility_off') {
        alert(`Memproses interaksi: ${content}`);
        e.preventDefault();
      }
    }
  });

});

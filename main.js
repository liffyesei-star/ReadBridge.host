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
let books = [];
const marketplaceBooks = [];
const sewaBooks = [];

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

// Data Tulisan Literasi
const literacyArticles = [
  {
    id: 1,
    type: 'article',
    title: "Kenapa Membaca 15 Menit Sehari Bisa Mengubah Cara Kita Belajar",
    author: "@NadiaLiterasi",
    publishDate: "28 Juni 2026",
    editedDate: "29 Juni 2026",
    readTime: "5 menit baca",
    upvotes: "2.4k",
    comments: 86,
    xp: 120,
    topics: ["#KebiasaanMembaca", "#BelajarMandiri", "#Produktivitas"],
    coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=1200",
    imageCredit: "Foto oleh Blaz Photo via Unsplash",
    excerpt: "Literasi tidak selalu dimulai dari target besar. Kebiasaan pendek yang konsisten membantu otak mengenali pola, membangun kosakata, dan memperluas cara kita menyusun argumen.",
    sources: [
      "National Literacy Trust - Reading for pleasure research overview",
      "OECD - Reading performance and learning habits"
    ]
  },
  {
    id: 2,
    type: 'article',
    title: "Cara Menulis Ulasan Buku yang Tidak Sekadar Bagus atau Jelek",
    author: "@AksaraRuang",
    publishDate: "27 Juni 2026",
    editedDate: null,
    readTime: "7 menit baca",
    upvotes: "980",
    comments: 42,
    xp: 150,
    topics: ["#UlasanBuku", "#CreatorWrite", "#Komunitas"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200",
    imageCredit: "Foto oleh Green Chameleon via Unsplash",
    excerpt: "Ulasan yang kuat punya konteks, bukti, dan posisi pembaca. Artikel ini membedah struktur sederhana agar opini terasa jernih dan bisa dibalas dengan diskusi yang sehat.",
    sources: [
      "Purdue OWL - Writing a book review",
      "ReadBridge Community Guide - Etika berdiskusi"
    ]
  },
  {
    id: 3,
    type: 'article',
    title: "Membaca Data Populer: Jangan Langsung Percaya Grafik yang Viral",
    author: "@RakaData",
    publishDate: "25 Juni 2026",
    editedDate: "26 Juni 2026",
    readTime: "6 menit baca",
    upvotes: "1.7k",
    comments: 63,
    xp: 180,
    topics: ["#LiterasiData", "#BerpikirKritis", "#Sumber"],
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    imageCredit: "Foto oleh Luke Chesser via Unsplash",
    excerpt: "Grafik bisa membantu pemahaman, tapi juga bisa menyesatkan. Kenali skala, sampel, konteks, dan sumber sebelum menyimpulkan sebuah klaim.",
    sources: [
      "Data Literacy Project - Essential skills",
      "UNESCO - Media and information literacy resources"
    ]
  }
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

function getCreatorWriteArticles() {
  let userArticles = [];
  try {
    userArticles = JSON.parse(localStorage.getItem('rb_creator_articles') || '[]');
  } catch (err) {
    userArticles = [];
  }
  return [...userArticles, ...literacyArticles];
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

window.readbridgeData = { books, journals, literacyArticles, getCreatorWriteArticles, discussions, marketplaceBooks, sewaBooks };

// Fetch books from API
const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const apiBaseUrl = localStorage.getItem('rb_api_base_url') || (isLocalFrontend ? 'http://localhost:5001' : 'https://readbridge-backend-2whx.onrender.com');

async function loadBooksFromApi() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/books?limit=100`);
    const data = await response.json();
    if (data.success && data.data) {
      books = data.data.map(b => {
        let badge = null;
        try {
          const parsedTags = typeof b.tags === 'string' ? JSON.parse(b.tags) : b.tags;
          if (Array.isArray(parsedTags) && parsedTags.length > 0) {
            badge = parsedTags[0].replace(/^#/, '');
          }
        } catch(e) {}
        
        return {
          id: b.id,
          type: 'book',
          category: b.kategori || 'Fiksi',
          title: b.judul,
          author: b.penulis_nama,
          rating: parseFloat(b.rating) || 4.5,
          reviews: b.total_ulasan || 0,
          price: parseFloat(b.harga_beli) || 0,
          image: b.cover_url || null,
          badge: badge,
          reviewer: 'Pembaca Anonim',
          abstract: b.deskripsi || '',
          isDb: true
        };
      });
      window.readbridgeData.books = books;
    }
  } catch (err) {
    console.warn("Failed to load books from backend API in main.js:", err);
  }
}

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
  const tabBukuDigital = document.getElementById("tab-buku-digital");
  const tabTulisan = document.getElementById("tab-tulisan");
  const ebookSection = document.getElementById("ebook-section");

  // Jika elemen tidak ditemukan (misal di halaman yang bukan eksplor.html), hentikan eksekusi
  if (!resultGrid) return;

  // Status Tab Aktif (Default: 'buku')
  loadBooksFromApi().then(() => {
    if (currentActiveTab === 'buku') {
      renderData(books, 'buku');
    }
  });



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
          let imageHTML = item.image ? `<img alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${item.image}" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';"/><div style="display:none" class="w-full h-full flex items-center justify-center bg-surface-variant"><span class="material-symbols-outlined text-[64px] text-outline-variant">menu_book</span></div>` : `<div class="w-full h-full flex items-center justify-center bg-surface-variant group-hover:scale-105 transition-transform duration-500"><span class="material-symbols-outlined text-[64px] text-outline-variant">menu_book</span></div>`;

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
        else if (type === 'tulisan') {
          const safeTitle = escapeHTML(item.title);
          const safeAuthor = escapeHTML(item.author);
          const safePublishDate = escapeHTML(item.publishDate);
          const safeEditedDate = escapeHTML(item.editedDate);
          const safeReadTime = escapeHTML(item.readTime);
          const safeExcerpt = escapeHTML(item.excerpt);
          const safeImageCredit = escapeHTML(item.imageCredit);
          const topicsHTML = item.topics.map(topic => `<span class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm">${escapeHTML(topic)}</span>`).join('');
          const editedHTML = item.editedDate ? `<span class="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span><span>Diedit ${safeEditedDate}</span>` : '';
          const sourcesHTML = item.sources.slice(0, 2).map(source => `<li>${escapeHTML(source)}</li>`).join('');

          cardHTML = `
            <article class="bg-surface-container-lowest col-span-full rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                <a href="detail-tulisan.html?id=${item.id}" class="block h-56 lg:h-full bg-surface-container-high overflow-hidden">
                  <img alt="${safeTitle}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${escapeHTML(item.coverImage)}">
                </a>
                <div class="p-lg flex flex-col gap-md">
                  <div class="flex flex-wrap items-center justify-between gap-sm">
                    <div class="flex flex-wrap gap-2">${topicsHTML}</div>
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm font-bold">
                      <span class="material-symbols-outlined text-[16px]">bolt</span> +${item.xp} XP
                    </span>
                  </div>
                  <div class="flex flex-col gap-sm">
                    <a href="detail-tulisan.html?id=${item.id}" class="group">
                      <h3 class="font-headline-md text-[22px] leading-tight text-on-surface font-bold group-hover:text-primary transition-colors">${safeTitle}</h3>
                    </a>
                    <div class="flex flex-wrap items-center gap-sm text-label-md font-label-md text-on-surface-variant">
                      <span class="font-bold text-primary">${safeAuthor}</span>
                      <span class="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>${safePublishDate}</span>
                      ${editedHTML}
                      <span class="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>${safeReadTime}</span>
                    </div>
                    <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-2">${safeExcerpt}</p>
                  </div>
                  <div class="border-l-4 border-tertiary bg-tertiary-container/10 px-md py-sm rounded-r-lg">
                    <p class="font-label-sm text-label-sm text-on-surface font-bold mb-xs">Sumber</p>
                    <ul class="list-disc list-inside font-label-sm text-label-sm text-on-surface-variant space-y-1">${sourcesHTML}</ul>
                  </div>
                  <div class="flex flex-wrap items-center justify-between gap-sm pt-sm border-t border-outline-variant/30">
                    <p class="font-label-sm text-label-sm text-on-surface-variant">${safeImageCredit}</p>
                    <div class="flex items-center gap-sm text-on-surface">
                      <button class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-container-low transition-colors font-label-md text-label-md">
                        <span class="material-symbols-outlined text-[20px]">arrow_upward</span> ${item.upvotes}
                      </button>
                      <a href="detail-tulisan.html?id=${item.id}#comments" class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-container-low transition-colors font-label-md text-label-md">
                        <span class="material-symbols-outlined text-[20px]">chat_bubble</span> ${item.comments}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
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
    [tabBuku, tabBukuDigital, tabTulisan].forEach(tab => {
      if (!tab) return;
      tab.className = "font-title-lg text-title-lg text-on-surface-variant hover:text-primary transition-colors pb-2 px-2 shrink-0 select-none";
    });

    // Sembunyikan/tampilkan grid default & e-book section
    if (selectedTabStr === 'buku-digital') {
      if (resultGrid) resultGrid.classList.add('hidden');
      if (ebookSection) {
        ebookSection.classList.remove('hidden');
        ebookSection.classList.add('flex');
      }
    } else {
      if (ebookSection) {
        ebookSection.classList.add('hidden');
        ebookSection.classList.remove('flex');
      }
      if (resultGrid) resultGrid.classList.remove('hidden');
    }

    // Aktifkan tab yang dipilih
    let activeElement;
    let dataToRender = [];

    if (selectedTabStr === 'buku') {
      activeElement = tabBuku;
      dataToRender = books;
    } else if (selectedTabStr === 'buku-digital') {
      activeElement = tabBukuDigital;
    } else if (selectedTabStr === 'tulisan') {
      activeElement = tabTulisan;
      dataToRender = getCreatorWriteArticles();
    }

    if (activeElement) {
      if (selectedTabStr === 'buku-digital') {
        activeElement.className = "font-title-lg text-title-lg text-primary border-b-2 border-primary pb-2 px-2 shrink-0 flex items-center gap-1 select-none font-bold";
      } else {
        activeElement.className = "font-title-lg text-title-lg text-primary border-b-2 border-primary pb-2 px-2 transition-colors shrink-0";
      }
    }

    // Ganti Sidebar Filter berdasarkan tab yang aktif
    const filterBuku = document.getElementById('filter-buku');
    const filterEbook = document.getElementById('filter-buku-digital');
    const filterTulisan = document.getElementById('filter-tulisan');

    if (filterBuku) {
      filterBuku.classList.add('hidden'); filterBuku.classList.remove('block');
    }
    if (filterEbook) {
      filterEbook.classList.add('hidden'); filterEbook.classList.remove('block');
    }
    if (filterTulisan) {
      filterTulisan.classList.add('hidden'); filterTulisan.classList.remove('block');
    }

    if (selectedTabStr === 'buku' && filterBuku) {
      filterBuku.classList.remove('hidden'); filterBuku.classList.add('block');
    } else if (selectedTabStr === 'buku-digital' && filterEbook) {
      filterEbook.classList.remove('hidden'); filterEbook.classList.add('block');
    } else if (selectedTabStr === 'tulisan' && filterTulisan) {
      filterTulisan.classList.remove('hidden'); filterTulisan.classList.add('block');
    }

    // Reset isi input pencarian saat pindah tab
    if (searchInput) searchInput.value = "";

    // Render ulang data sesuai tab
    if (selectedTabStr === 'buku-digital') {
      renderEbooks();
      updateEbookBannerUI();
      if (resultMessage) resultMessage.textContent = "Menampilkan E-Book digital eksklusif.";
    } else {
      renderData(dataToRender, selectedTabStr);
    }
  }

  // Pasang Event Listener Tab
  if (tabBuku) tabBuku.addEventListener("click", () => switchTab('buku'));
  if (tabBukuDigital) tabBukuDigital.addEventListener("click", () => switchTab('buku-digital'));
  if (tabTulisan) tabTulisan.addEventListener("click", () => switchTab('tulisan'));


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
      else if (currentActiveTab === 'tulisan') sourceData = getCreatorWriteArticles();
      else if (currentActiveTab === 'diskusi') sourceData = discussions;

      // Filter data menggunakan perulangan array (.filter)
      const filteredData = sourceData.filter((item) => {
        // Logika pencarian menyesuaikan tipe tab
        if (currentActiveTab === 'buku' || currentActiveTab === 'jurnal') {
          return item.title.toLowerCase().includes(keyword) || item.author.toLowerCase().includes(keyword);
        } else if (currentActiveTab === 'tulisan') {
          return item.title.toLowerCase().includes(keyword) || item.excerpt.toLowerCase().includes(keyword) || item.author.toLowerCase().includes(keyword) || item.topics.join(' ').toLowerCase().includes(keyword);
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
      } else if (currentActiveTab === 'tulisan') {
        const selectedTopics = Array.from(document.querySelectorAll('[data-topic-filter]:checked')).map(input => input.value);
        const filteredArticles = getCreatorWriteArticles().filter(article => {
          if (selectedTopics.length === 0) return true;
          return article.topics.some(topic => selectedTopics.includes(topic.replace('#', '')));
        });
        renderData(filteredArticles, 'tulisan');
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
    markAllReadBtn.addEventListener("click", function () {
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
  document.addEventListener('click', function (e) {
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
      if (clickable.closest('#tab-buku') || clickable.closest('#tab-buku-digital') || clickable.closest('#tab-tulisan')) return;

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

  // ==========================================
  // E-BOOK (BUKU DIGITAL) PREMIUM IMPLEMENTATION
  // ==========================================

  // 1. E-Book Database
  const ebooks = [
    {
      id: 501,
      title: "Atomic Habits: Perubahan Kecil Yang Memberikan Hasil Luar Biasa",
      author: "James Clear",
      category: "Pengembangan Diri",
      rating: 4.9,
      reviews: 2450,
      readingTime: "5 menit",
      isPremium: false,
      isMonthlySpecial: false,
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Pendahuluan: Kekuatan Perubahan 1%. Sangat mudah untuk melebih-lebihkan pentingnya satu momen penting dan meremehkan nilai membuat perbaikan kecil setiap hari. Terlalu sering, kita meyakinkan diri sendiri bahwa kesuksesan besar membutuhkan tindakan besar. Baik itu menurunkan berat badan, membangun bisnis, menulis buku, memenangkan kejuaraan, atau mencapai tujuan lainnya, kita menekan diri kita untuk membuat beberapa perbaikan yang mengguncang bumi yang akan dibicarakan semua orang. Sementara itu, meningkatkan 1% mungkin tidak terlalu terlihat—bahkan kadang-kadang tidak terasa—tetapi itu bisa jauh lebih bermakna, terutama dalam jangka panjang.",
        "Bab 1: Mengapa Kebiasaan Kecil Membuat Perubahan Besar. Kebiasaan adalah bunga majemuk dari perbaikan diri. Sama seperti uang yang berlipat ganda melalui bunga majemuk, efek dari kebiasaan Anda berlipat ganda saat Anda mengulanginya. Efeknya tampak kecil pada hari tertentu, namun dampaknya selama berbulan-bulan dan bertahun-tahun bisa sangat luar biasa. Hanya ketika melihat kembali dua, lima, atau mungkin sepuluh tahun kemudian, nilai dari kebiasaan baik dan kerugian dari kebiasaan buruk menjadi sangat jelas.",
        "Bab 2: Identitas adalah Kunci Perubahan Perilaku. Mengapa begitu mudah mengulangi kebiasaan buruk dan begitu sulit membangun kebiasaan baik? Masalahnya bukan karena Anda tidak ingin berubah, tetapi karena sistem Anda salah. Anda tidak naik ke tingkat tujuan Anda; Anda jatuh ke tingkat sistem Anda. Kunci untuk perubahan yang bertahan lama bukanlah fokus pada apa yang ingin Anda capai, melainkan pada siapa Anda ingin menjadi. Identitas Anda muncul dari kebiasaan-kebiasaan Anda.",
        "Bab 3: Empat Hukum Perubahan Perilaku. Empat Hukum Perubahan Perilaku adalah seperangkat aturan sederhana yang dapat kita gunakan untuk membangun kebiasaan yang lebih baik. Mereka adalah: (1) menjadikannya terlihat, (2) menjadikannya menarik, (3) menjadikannya mudah, dan (4) menjadikannya memuaskan. Dalam bab ini, kita akan membahas cara menerapkan hukum-hukum ini untuk mendominasi kehidupan sehari-hari Anda dengan efektivitas luar biasa.",
        "Bab 4: Rahasia Mempertahankan Kebiasaan Baik. Kebiasaan baik akan bertahan lama jika memberikan kepuasan instan. Otak manusia berevolusi untuk memprioritaskan imbalan langsung daripada imbalan masa depan. Untuk mempertahankan kebiasaan baik, Anda harus menemukan cara untuk menambahkan sedikit kesenangan instan ke dalam rutinitas Anda. Ini adalah kunci pamungkas untuk menjadi tidak terhentikan."
      ]
    },
    {
      id: 502,
      title: "Laskar Pelangi (Edisi Digital)",
      author: "Andrea Hirata",
      category: "Novel & Fiksi",
      rating: 4.8,
      reviews: 1320,
      readingTime: "4 menit",
      isPremium: false,
      isMonthlySpecial: false,
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Sepuluh Anggota Baru. Pagi itu, matahari bersinar hangat di atas atap sekolah Muhammadiyah yang reyot di Belitong. Harun, seorang anak dengan senyum lebar yang tulus, berlari-lari kecil menuju halaman sekolah. Di dalam kelas, Bu Muslimah dan Pak Harfan menunggu dengan cemas. Mereka membutuhkan minimal sepuluh siswa agar sekolah tidak ditutup oleh pengawas sekolah. Detik-detik berlalu dengan menegangkan, sampai akhirnya Lintang dan ibunya datang dari kejauhan.",
        "Bab 2: Mimpi di Bawah Pohon Filicium. Di bawah rindangnya pohon filicium di halaman sekolah, kesepuluh anak yang kemudian dijuluki Laskar Pelangi itu sering berkumpul dan merajut mimpi-mimpi mereka. Lintang, sang jenius matematika pesisir, bercita-cita menjadi ilmuwan. Ikal bermimpi berkeliling dunia. Mahar dengan bakat seninya yang eksentrik selalu bernyanyi penuh imajinasi. Sekolah reyot itu tidak membatasi ketinggian mimpi mereka.",
        "Bab 3: Pertempuran Kecerdasan. Hari cerdas cermat sekabupaten Belitong tiba. Sekolah Muhammadiyah yang miskin harus berhadapan dengan sekolah PN Timah yang kaya dan berfasilitas lengkap. Ketegangan memuncak saat Lintang maju ke meja perlombaan. Dengan kecepatan berpikir yang luar biasa, Lintang melahap semua pertanyaan fisika dan matematika, membungkam keangkuhan lawan dan membawa kemenangan bersejarah.",
        "Bab 4: Badai Ujian Kehidupan. Kehidupan selalu memiliki caranya sendiri untuk menguji ketahanan mimpi. Badai melanda saat ayah Lintang, seorang nelayan miskin, meninggal di laut. Sebagai anak laki-laki tertua, Lintang harus meletakkan pensilnya dan bekerja untuk menghidupi adik-adiknya. Kejeniusannya harus tunduk pada kerasnya realitas ekonomi Belitong. Ini adalah momen patah hati terbesar bagi Laskar Pelangi.",
        "Bab 5: Epilog: Cahaya Bintang Belitong. Bertahun-tahun kemudian, Ikal berdiri di atas geladak kapal yang merapat di pelabuhan Eropa, mengenang masa-masa indahnya di Belitong. Laskar Pelangi mengajarkan kita bahwa kemiskinan tidak bisa membelenggu jiwa yang merdeka, dan bahwa pendidikan sejati lahir dari ketulusan guru seperti Bu Muslimah dan semangat juang yang tak pernah padam."
      ]
    },
    {
      id: 503,
      title: "Sapiens: Riwayat Singkat Umat Manusia",
      author: "Yuval Noah Harari",
      category: "Sains & Teknologi",
      rating: 4.9,
      reviews: 945,
      readingTime: "6 menit",
      isPremium: true,
      isMonthlySpecial: true,
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Revolusi Kognitif. Sekitar 70.000 tahun yang lalu, organisme yang termasuk dalam spesies Homo sapiens mulai membentuk struktur yang jauh lebih rumit yang disebut kebudayaan. Perkembangan kebudayaan berikutnya disebut sejarah. Tiga revolusi penting membentuk jalannya sejarah: Revolusi Kognitif memulai sejarah sekitar 70.000 tahun yang lalu. Revolusi Pertanian mempercepatnya sekitar 12.000 tahun yang lalu. Revolusi Ilmiah, yang baru berjalan 500 tahun lalu, sangat mungkin mengakhiri sejarah dan memulai sesuatu yang sama sekali berbeda.",
        "Bab 2: Pohon Pengetahuan. Apa yang begitu istimewa dari bahasa baru Sapiens yang memungkinkan kita menaklukkan dunia? Jawaban yang paling mungkin adalah bahwa bahasa kita unik karena memungkinkan kita berbicara tentang hal-hal yang sama sekali tidak ada secara fisik: mitos, legenda, dewa, dan konsep abstrak seperti negara atau uang. Kemampuan memercayai fiksi bersama ini memungkinkan ribuan orang asing bekerja sama secara fleksibel.",
        "Bab 3: Kehidupan Pemburu-Pengumpul. Sebelum Revolusi Pertanian, nenek moyang kita hidup sebagai pemburu-pengumpul. Mereka memiliki pengetahuan mendalam tentang tumbuhan, hewan, dan bentang alam di sekitar mereka untuk bertahan hidup. Meskipun hidup sederhana, studi menunjukkan mereka bekerja lebih sedikit jam dan menikmati diet yang lebih bervariasi daripada petani-petani berikutnya. Namun, kehidupan mereka juga keras dan penuh bahaya.",
        "Bab 4: Banjir Besar Hewan. Ketika Homo sapiens menyebar ke seluruh penjuru dunia, mereka membawa kepunahan massal bagi megafauna lokal. Di Australia, dalam waktu beberapa ribu tahun setelah kedatangan Sapiens, hampir semua mamalia raksasa seberat lebih dari 50 kg lenyap. Sapiens terbukti menjadi pembunuh ekologis paling mematikan dalam sejarah planet bumi, bahkan sebelum mereka mengenal logam atau mesin uap.",
        "Bab 5: Penyatuan Umat Manusia. Seiring berjalannya sejarah, kebudayaan manusia yang terfragmentasi perlahan-lahan menyatu menjadi satu desa global yang saling terhubung. Tiga tatanan universal yang menyatukan umat manusia adalah: tatanan moneter (uang), tatanan imperial (kekaisaran), dan tatanan agama universal. Hari ini, hampir semua manusia berbagi tatanan geopolitik, sains, dan pasar keuangan yang sama."
      ]
    },
    {
      id: 504,
      title: "Dunia Sophie (Edisi Digital)",
      author: "Jostein Gaarder",
      category: "Novel & Fiksi",
      rating: 4.8,
      reviews: 812,
      readingTime: "5 menit",
      isPremium: true,
      isMonthlySpecial: true,
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Taman Eden. Suatu sore sepulang sekolah, Sophie Amundsen menemukan sebuah surat misterius di kotak posnya. Surat itu tidak memiliki prangko maupun nama pengirim, hanya berisi selembar kertas dengan pertanyaan singkat: 'Siapakah kamu?'. Sophie menatap pertanyaan itu dengan bingung. Bagaimana seseorang bisa benar-benar menjawab siapa dirinya? Belum sempat ia merenung, surat kedua datang dengan pertanyaan: 'Dari mana datangnya dunia?'.",
        "Bab 2: Topi Pesulap. Surat-surat misterius itu berlanjut menjadi kursus filsafat tertulis dari seorang mentor misterius bernama Alberto Knox. Alberto menjelaskan bahwa filsuf sejati seperti anak kecil yang tidak pernah kehilangan rasa ingin tahunya tentang dunia. Dunia ini diibaratkan seperti seekor kelinci putih besar yang ditarik keluar dari topi pesulap. Kebanyakan orang dewasa bersarang dengan nyaman di bulu kelinci, sementara para filsuf merangkak naik untuk menatap mata sang pesulap.",
        "Bab 3: Filsuf Alam. Di Yunani Kuno, para filsuf pertama mencari bahan dasar dari segala sesuatu di alam. Thales memercayai air sebagai asal mula kehidupan. Anaximenes memercayai udara. Democritus melangkah lebih jauh dengan mengajukan teori atom: bagian-bagian tak terlihat yang kekal dan tak dapat dibagi, yang menyusun semua materi di alam semesta. Pemikiran rasional ini membebaskan manusia dari takhayul mitologi kuno.",
        "Bab 4: Socrates, Plato, dan Aristoteles. Tiga raksasa filsafat Athena mengubah arah pemikiran manusia. Socrates mengajarkan metode dialog kritis untuk melahirkan kebenaran. Plato memercayai dunia ide yang kekal di mana jiwa kita berasal, sedangkan dunia fisik hanyalah bayangan dari dunia ide tersebut. Aristoteles menentang Plato, menegaskan bahwa kebenaran ditemukan melalui observasi empiris di dunia nyata ini.",
        "Bab 5: Realitas Ilusi. Sophie perlahan-lahan menyadari bahwa kehidupannya sendiri mungkin tidak senyata yang ia duga. Petunjuk-petunjuk aneh bermunculan: kartu pos untuk seorang gadis bernama Hilde Møller Knag yang dikirim oleh ayahnya, seorang mayor PBB di Lebanon. Apakah Sophie benar-benar manusia hidup, ataukah ia hanyalah karakter fiksi dalam sebuah buku yang ditulis oleh sang Mayor untuk menghibur putrinya?"
      ]
    },
    {
      id: 505,
      title: "Filosofi Teras (E-Book Pengembangan Diri)",
      author: "Henry Manampiring",
      category: "Pengembangan Diri",
      rating: 4.9,
      reviews: 1890,
      readingTime: "5 menit",
      isPremium: false,
      isMonthlySpecial: false,
      coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Kekhawatiran Nasional. Kehidupan modern dipenuhi dengan kecemasan, mulai dari macetnya jalanan, kritikan netizen di media sosial, hingga kekhawatiran akan masa depan karir. Banyak dari kita membiarkan kebahagiaan kita ditentukan oleh faktor-faktor eksternal di luar kendali kita. Filosofi Teras (Stoikisme), sebuah mazhab filsafat Yunani kuno, menawarkan solusi praktis untuk menjaga kedamaian mental di tengah dunia yang kacau.",
        "Bab 2: Dikotomi Kendali. Prinsip terpenting dalam Stoikisme adalah Dikotomi Kendali: menyadari hal-hal yang ada di bawah kendali kita (pikiran, opini, tindakan kita) dan hal-hal yang tidak di bawah kendali kita (opini orang lain, cuaca, tindakan orang lain, hasil akhir). Kebahagiaan sejati hanya dicapai jika kita memfokuskan energi kita sepenuhnya pada apa yang bisa kita kendalikan, dan melepaskan kekhawatiran atas apa yang tidak bisa kita kendalikan.",
        "Bab 3: Mengelola Emosi Negatif. Stoikisme menegaskan bahwa emosi negatif seperti marah, cemas, atau sedih tidak disebabkan oleh peristiwa eksternal itu sendiri, melainkan oleh *penilaian* atau *interpretasi* kita terhadap peristiwa tersebut. Dengan menggunakan metode S-T-A-R (Stop, Think, Assess, Respond), kita dapat menunda respon emosional otomatis kita dan memilih tanggapan rasional yang bijak.",
        "Bab 4: Amor Fati: Mencintai Takdir. Seorang Stoik tidak hanya menerima kenyataan pahit, tetapi juga merangkul dan mencintainya sebagai bagian dari jalannya kehidupan (*Amor Fati*). Setiap rintangan atau kemalangan dipandang sebagai bahan bakar untuk melatih karakter kita menjadi lebih kuat. Kesulitan bukanlah penghambat, melainkan jalan itu sendiri.",
        "Bab 5: Kesimpulan: Menjadi Stoik Modern. Filosofi Teras bukan tentang menjadi manusia tanpa emosi layaknya robot, melainkan tentang memiliki emosi yang sehat dan ketangguhan mental (*tranquility*). Dengan mempraktikkan stoikisme dalam keseharian, kita dapat hidup bebas dari kecemasan berlebih dan menjadi versi terbaik dari diri kita sendiri."
      ]
    },
    {
      id: 506,
      title: "Mari Belajar Fisika Kurikulum Merdeka",
      author: "Prof. Yohanes Surya",
      category: "Buku Pelajaran",
      rating: 4.7,
      reviews: 142,
      readingTime: "4 menit",
      isPremium: false,
      isMonthlySpecial: false,
      coverImage: "https://images.unsplash.com/photo-1636466481862-345867098f36?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Pengukuran dan Besaran. Dalam fisika, pengukuran adalah membandingkan suatu besaran dengan besaran standar yang sejenis. Kita mengenal tujuh besaran pokok: panjang (meter), massa (kilogram), waktu (sekon), suhu (kelvin), kuat arus (ampere), intensitas cahaya (kandela), dan jumlah zat (mol). Ketepatan pengukuran sangat penting dalam eksperimen sains.",
        "Bab 2: Dinamika Gerak Lurus. Hukum Newton tentang gerak adalah fondasi dinamika klasik. Hukum I Newton menyatakan benda cenderung mempertahankan keadaannya (inersia). Hukum II Newton menyatakan percepatan sebanding dengan gaya bersih dan berbanding terbalik dengan massa. Hukum III Newton menyatakan setiap aksi selalu memicu reaksi yang sama besar dan berlawanan arah.",
        "Bab 3: Energi Terbarukan. Menghadapi krisis iklim global, transisi menuju energi terbarukan menjadi keharusan. Kita mempelajari konversi energi mekanik menjadi energi listrik menggunakan pembangkit listrik tenaga angin, hidro, dan surya. Efisiensi energi merupakan kunci masa depan bumi kita.",
        "Bab 4: Fluida Statis dan Dinamis. Tekanan hidrostatis bertambah seiring kedalaman fluida. Hukum Archimedes menyatakan gaya apung ke atas sama dengan berat fluida yang dipindahkan. Pada fluida dinamis, asas kontinuitas dan hukum Bernoulli menjelaskan mengapa pesawat terbang bisa mengudara dan bagaimana semprotan parfum bekerja.",
        "Bab 5: Fisika Modern dan Kuantum. Memasuki abad ke-20, fisika klasik gagal menjelaskan fenomena skala atom. Relativitas Einstein dan teori kuantum Planck mengubah cara pandang kita terhadap ruang, waktu, dan cahaya. Dualisme partikel-gelombang menyatakan cahaya bisa berperilaku sebagai gelombang sekaligus partikel (foton)."
      ]
    },
    {
      id: 507,
      title: "Detective Conan: Edisi Spesial Digital",
      author: "Gosho Aoyama",
      category: "Komik",
      rating: 4.8,
      reviews: 640,
      readingTime: "3 menit",
      isPremium: true,
      isMonthlySpecial: false,
      coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Halaman 1: Transformasi Shinichi Kudo. Shinichi Kudo adalah detektif SMA terkenal yang membantu polisi memecahkan kasus-kasus rumit. Suatu hari, saat menyelidiki transaksi mencurigakan oleh pria berjubah hitam di taman bermain, Shinichi diserang dari belakang. Ia dipaksa meminum racun eksperimental APTX 4869 yang sedang dikembangkan organisasi mereka.",
        "Halaman 2: Lahirnya Conan Edogawa. Alih-alih tewas, racun itu menyusutkan tubuh Shinichi menjadi seukuran anak SD kelas 1! Untuk menyembunyikan identitasnya agar tidak membahayakan orang-orang terdekatnya, Shinichi memakai kacamata ayahnya dan mengadopsi nama samaran Conan Edogawa (diambil dari sir Arthur Conan Doyle dan Rampo Edogawa).",
        "Halaman 3: Detektif Cilik Beraksi. Conan menumpang tinggal di rumah Ran Mouri dan ayahnya, Kogoro Mouri, seorang detektif swasta yang tidak kompeten. Dengan menggunakan alat-alat canggih ciptaan Profesor Agasa seperti dasi kupu-kupu pengubah suara dan jam tangan jarum bius, Conan diam-diam memecahkan kasus-kasus rumit atas nama Kogoro Tidur.",
        "Halaman 4: Misteri Organisasi Hitam. Conan terus mencari jejak organisasi hitam yang telah menyusutkannya. Ia bertemu dengan Ai Haibara (Sherry), mantan ilmuwan organisasi hitam yang menciptakan racun APTX 4869 dan menyusutkan dirinya sendiri demi melarikan diri dari kejaran organisasi kejam tersebut. Mereka kini bekerja sama untuk mengungkap konspirasi global.",
        "Halaman 5: Kebenaran Selalu Satu! Di hadapan pelaku kejahatan yang tidak bisa mengelak lagi, Conan (menggunakan suara Kogoro Mouri) memaparkan trik pembunuhan ruang tertutup yang sangat rapi. Melalui deduksi logis dan bukti ilmiah yang tak terbantahkan, Conan menegaskan prinsip hidupnya: 'Kebenaran hanya ada satu!'"
      ]
    }
  ];

  // E-Book components are correctly initialized at the top and handled in switchTab

  // 3. Logika Update Banner Premium E-Book
  function updateEbookBannerUI() {
    const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';
    const upgradeCta = document.getElementById('ebook-upgrade-cta-btn');
    const bannerTitle = document.getElementById('ebook-banner-title');
    const bannerDesc = document.getElementById('ebook-banner-desc');
    const bannerContainer = document.getElementById('ebook-premium-banner');

    if (isPremium) {
      if (bannerContainer) {
        bannerContainer.className = "bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 rounded-2xl p-lg md:p-xl text-white border border-emerald-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-md";
      }
      if (bannerTitle) bannerTitle.innerHTML = "Akses BridgePass Premium Aktif! 👑";
      if (bannerDesc) bannerDesc.textContent = "Selamat! Anda memiliki akses membaca penuh sepuasnya tanpa batasan waktu untuk seluruh buku digital, modul belajar, komik, dan tulisan literasi ReadBridge.";
      if (upgradeCta) {
        upgradeCta.innerHTML = "<span class='material-symbols-outlined text-[18px]'>verified</span> Akun Premium Aktif";
        upgradeCta.className = "w-full md:w-auto px-6 py-3 bg-emerald-500 text-white font-bold text-label-md rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-default select-none flex items-center justify-center gap-sm";
        upgradeCta.disabled = true;
      }
    } else {
      if (bannerContainer) {
        bannerContainer.className = "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-980 dark:to-slate-950 rounded-2xl p-lg md:p-xl text-white border border-indigo-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-md";
      }
      if (bannerTitle) bannerTitle.textContent = "Unlock Unlimited E-Books with BridgePass 👑";
      if (bannerDesc) bannerDesc.textContent = "Nikmati akses membaca sepuasnya untuk ribuan buku digital premium, tulisan komunitas pilihan, perpustakaan sewa, dan hilangkan semua batasan waktu membaca gratis sekarang!";
      if (upgradeCta) {
        upgradeCta.innerHTML = "<span class='material-symbols-outlined font-bold text-[18px]'>workspace_premium</span> Upgrade ke Premium";
        upgradeCta.className = "w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-label-md rounded-full shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-sm";
        upgradeCta.disabled = false;
      }
    }
  }

  // 4. Timer Rotasi Bulanan
  function startMonthlyTimer() {
    const timerEl = document.getElementById('monthly-special-timer');
    if (!timerEl) return;

    function updateTimer() {
      const now = new Date();
      // Reset periodik pada tanggal 30 setiap bulan
      const targetDate = new Date(now.getFullYear(), now.getMonth(), 30, 23, 59, 59);
      if (targetDate < now) {
        targetDate.setMonth(targetDate.getMonth() + 1);
        targetDate.setDate(30);
      }
      const diff = targetDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      timerEl.textContent = `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  startMonthlyTimer();

  // 5. Render E-Books berdasarkan Minat Onboarding & Katalog Lengkap
  function renderEbooks(filteredEbooksList = null) {
    const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';
    const monthlyGrid = document.getElementById('ebook-monthly-grid');
    const onboardingSection = document.getElementById('ebook-onboarding-section');
    const directoryGrid = document.getElementById('ebook-directory-grid');

    if (!directoryGrid) return;

    // A. Render Buku Pilihan Bulanan (Spotlight)
    if (monthlyGrid) {
      monthlyGrid.innerHTML = "";
      const monthlySpecials = ebooks.filter(e => e.isMonthlySpecial);
      monthlySpecials.forEach(item => {
        const cardHTML = `
          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-md shadow-sm hover:shadow-md transition-all flex gap-md relative overflow-hidden group">
            <div class="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider flex items-center gap-0.5 shadow-sm z-10">
              <span class="material-symbols-outlined text-[12px] style='font-variation-settings: "FILL" 1;'">workspace_premium</span> PREMIUM SPECIAL
            </div>
            <div class="w-24 h-32 bg-surface-container-high rounded-xl overflow-hidden shrink-0 shadow-sm relative">
              <img alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${item.coverImage}"/>
            </div>
            <div class="flex flex-col justify-between flex-grow">
              <div class="flex flex-col gap-xs">
                <span class="text-xs font-bold text-primary">${item.category}</span>
                <h4 class="font-title-lg text-[16px] font-bold text-on-surface line-clamp-2 leading-tight">${item.title}</h4>
                <p class="font-label-sm text-label-sm text-on-surface-variant">${item.author}</p>
              </div>
              <div class="flex items-center justify-between mt-sm">
                <span class="text-[12px] font-bold text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-tertiary-container">star</span> ${item.rating}</span>
                <button onclick="openEbookReader(${item.id})" class="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-full hover:bg-surface-tint transition-all flex items-center gap-1 shadow-sm">
                  Baca Buku <span class="material-symbols-outlined text-[14px]">menu_book</span>
                </button>
              </div>
            </div>
          </div>
        `;
        monthlyGrid.innerHTML += cardHTML;
      });
    }

    // B. Render Rekomendasi berdasarkan Minat Onboarding
    if (onboardingSection) {
      onboardingSection.innerHTML = "";

      let userInterests = [];
      try {
        userInterests = JSON.parse(localStorage.getItem('rb_interests')) || ["fiksi", "self_dev"];
      } catch (e) {
        userInterests = ["fiksi", "self_dev"];
      }
      if (userInterests.length === 0) userInterests = ["fiksi", "self_dev"];

      // Map kode data-id ke nama kategori & judul row cantik
      const interestMap = {
        "fiksi": { name: "Novel & Fiksi", title: "Novel & Fiksi Pilihan Untukmu 📚", desc: "Jelajahi petualangan imajinatif dari novelis terbaik." },
        "self_dev": { name: "Pengembangan Diri", title: "🌱 Rekomendasi Pengembangan Diri", desc: "Mulai bangun kebiasaan baru dan capai potensi terbaikmu." },
        "komik": { name: "Komik", title: "🎨 Komik & Novel Grafis Terbaik", desc: "Nikmati visual memukau dan petualangan seru." },
        "jurnal": { name: "Sains & Teknologi", title: "Referensi Sains & Teknologi", desc: "Kumpulan bacaan digital untuk menambah pengetahuan akademis." },
        "pelajaran": { name: "Buku Pelajaran", title: "🏫 Buku Pelajaran & Pendamping Kurikulum", desc: "Buku penunjang belajar harian agar makin berprestasi." }
      };

      userInterests.forEach(interestKey => {
        const itemInfo = interestMap[interestKey];
        if (!itemInfo) return;

        // Cari buku yang cocok dengan kategori ini
        const matchingBooks = ebooks.filter(e => e.category === itemInfo.name);
        if (matchingBooks.length === 0) return;

        let rowHTML = `
          <div class="flex flex-col gap-md">
            <div class="border-b border-outline-variant/30 pb-2">
              <h4 class="font-title-lg text-title-lg font-extrabold text-on-surface">${itemInfo.title}</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant">${itemInfo.desc}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        `;

        matchingBooks.forEach(b => {
          const premiumBadge = b.isPremium ? `<div class="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-2 py-1 rounded-md text-[10px] tracking-wider flex items-center gap-0.5 shadow-md z-10"><span class="material-symbols-outlined text-[12px] style='font-variation-settings: "FILL" 1;'">workspace_premium</span> PREMIUM</div>` : `<div class="absolute top-2 right-2 bg-secondary text-on-secondary font-bold px-2 py-1 rounded-md text-[10px] tracking-wider shadow-md z-10">FREE</div>`;

          rowHTML += `
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group cursor-pointer relative" onclick="openEbookReader(${b.id})">
              <div class="h-44 w-full bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                <img alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${b.coverImage}"/>
                ${premiumBadge}
              </div>
              <div class="p-md flex flex-col flex-grow">
                <span class="text-xs font-bold text-primary mb-xs">${b.category}</span>
                <h3 class="font-title-lg text-[15px] font-bold text-on-surface line-clamp-2 leading-tight mb-xs">${b.title}</h3>
                <p class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${b.author}</p>
                <div class="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant/30">
                  <span class="text-[12px] font-bold text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-tertiary-container">star</span> ${b.rating}</span>
                  <span class="text-[11px] font-bold px-2.5 py-1 bg-surface-container text-primary rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">menu_book</span> Baca</span>
                </div>
              </div>
            </div>
          `;
        });

        rowHTML += `
            </div>
          </div>
        `;
        onboardingSection.innerHTML += rowHTML;
      });
    }

    // C. Render Katalog Directory Lengkap
    directoryGrid.innerHTML = "";
    const listToRender = filteredEbooksList || ebooks;

    if (listToRender.length === 0) {
      directoryGrid.innerHTML = `<p class="col-span-full text-center text-on-surface-variant font-body-md py-lg">Tidak ada E-Book yang cocok dengan filter atau pencarian Anda.</p>`;
      return;
    }

    listToRender.forEach(b => {
      const premiumBadge = b.isPremium ? `<div class="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-2 py-1 rounded-md text-[10px] tracking-wider flex items-center gap-0.5 shadow-md z-10"><span class="material-symbols-outlined text-[12px] style='font-variation-settings: "FILL" 1;'">workspace_premium</span> PREMIUM</div>` : `<div class="absolute top-2 right-2 bg-secondary text-on-secondary font-bold px-2 py-1 rounded-md text-[10px] tracking-wider shadow-md z-10">FREE</div>`;

      const cardHTML = `
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group cursor-pointer relative" onclick="openEbookReader(${b.id})">
          <div class="h-44 w-full bg-surface-container-high relative overflow-hidden flex items-center justify-center">
            <img alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${b.coverImage}"/>
            ${premiumBadge}
          </div>
          <div class="p-md flex flex-col flex-grow">
            <span class="text-xs font-bold text-primary mb-xs">${b.category}</span>
            <h3 class="font-title-lg text-[15px] font-bold text-on-surface line-clamp-2 leading-tight mb-xs">${b.title}</h3>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${b.author}</p>
            <div class="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant/30">
              <span class="text-[12px] font-bold text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-tertiary-container">star</span> ${b.rating}</span>
              <span class="text-[11px] font-bold px-2.5 py-1 bg-surface-container text-primary rounded-full hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">menu_book</span> Baca</span>
            </div>
          </div>
        </div>
      `;
      directoryGrid.innerHTML += cardHTML;
    });
  }

  // 6. Logika Filter & Pencarian khusus E-Book
  const ebookSearchBtn = document.getElementById('search-btn');
  const ebookSearchInput = document.getElementById('search-input');

  // Override tombol pencarian jika di tab E-Book
  if (ebookSearchBtn && ebookSearchInput) {
    ebookSearchBtn.addEventListener('click', (e) => {
      if (currentActiveTab === 'buku-digital') {
        const keyword = ebookSearchInput.value.trim().toLowerCase();
        if (keyword === "") {
          renderEbooks();
          return;
        }

        const filteredList = ebooks.filter(b =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword) ||
          b.category.toLowerCase().includes(keyword)
        );
        renderEbooks(filteredList);
      }
    });
  }

  // Terapkan filter khusus E-Book
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', (e) => {
      if (currentActiveTab === 'buku-digital') {
        e.preventDefault();

        // Kategori checkboxes
        const isFiksi = document.getElementById('filter-ebook-cat-fiksi')?.checked;
        const isSelfdev = document.getElementById('filter-ebook-cat-selfdev')?.checked;
        const isKomik = document.getElementById('filter-ebook-cat-komik')?.checked;
        const isSains = document.getElementById('filter-ebook-cat-sains')?.checked;
        const isPelajaran = document.getElementById('filter-ebook-cat-pelajaran')?.checked;

        // Tipe akses radio
        const accessRadio = document.querySelector('input[name="ebook_access"]:checked');
        const accessVal = accessRadio ? accessRadio.value : 'all';

        const filteredList = ebooks.filter(b => {
          let passCat = false;
          if (isFiksi && b.category === 'Novel & Fiksi') passCat = true;
          if (isSelfdev && b.category === 'Pengembangan Diri') passCat = true;
          if (isKomik && b.category === 'Komik') passCat = true;
          if (isSains && b.category === 'Sains & Teknologi') passCat = true;
          if (isPelajaran && b.category === 'Buku Pelajaran') passCat = true;

          let passAccess = false;
          if (accessVal === 'all') passAccess = true;
          else if (accessVal === 'free' && !b.isPremium) passAccess = true;
          else if (accessVal === 'premium' && b.isPremium) passAccess = true;

          return passCat && passAccess;
        });

        renderEbooks(filteredList);
      }
    });
  }

  // ==========================================
  // E-BOOK INTERACTIVE E-READER ENGINE
  // ==========================================
  let currentReaderBook = null;
  const maxFreePages = 3;
  let readingTimerInterval = null;
  let timerMsRemaining = 60000; // 60 Detik sesi membaca gratis
  let isTimerActive = false;

  // Kontrol E-Reader Elements
  const readerModal = document.getElementById('ebook-reader-modal');
  const readerCloseBtn = document.getElementById('reader-close-btn');
  const readerBookTitle = document.getElementById('reader-book-title');
  const readerBookAuthor = document.getElementById('reader-book-author');
  const readerToc = document.getElementById('reader-toc');
  const readerChapterTitle = document.getElementById('reader-chapter-title');
  const readerChapterText = document.getElementById('reader-chapter-text');
  const readerPageIndicator = document.getElementById('reader-page-indicator');
  const readerPrevBtn = document.getElementById('reader-prev-btn');
  const readerNextBtn = document.getElementById('reader-next-btn');
  const readerLockedOverlay = document.getElementById('reader-locked-overlay');
  const readerUpgradeBtn = document.getElementById('reader-upgrade-btn');
  const readerLockedCloseBtn = document.getElementById('reader-locked-close-btn');
  const readerTimerContainer = document.getElementById('reader-timer-container');
  const readerTimerCountdown = document.getElementById('reader-timer-countdown');
  const readerPremiumStatus = document.getElementById('reader-premium-status');
  const readerContentArea = document.getElementById('reader-content-area');

  // Kontrol Font & Tema
  const readerFontBtn = document.getElementById('reader-font-btn');
  const readerFontDropdown = document.getElementById('reader-font-dropdown');
  const fSizeSm = document.getElementById('font-size-sm');
  const fSizeMd = document.getElementById('font-size-md');
  const fSizeLg = document.getElementById('font-size-lg');
  const themeLight = document.getElementById('reader-theme-light');
  const themeSepia = document.getElementById('reader-theme-sepia');
  const themeDark = document.getElementById('reader-theme-dark');
  const readerViewport = document.getElementById('reader-viewport');

  // Font size state
  let currentFontSize = 'md'; // sm, md, lg
  // Theme state
  let currentReaderTheme = 'light'; // light, sepia, dark

  // Font Dropdown trigger
  if (readerFontBtn && readerFontDropdown) {
    readerFontBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      readerFontDropdown.classList.toggle('hidden');
      readerFontDropdown.classList.toggle('flex');
    });
    document.addEventListener('click', (e) => {
      if (!readerFontDropdown.contains(e.target) && !readerFontBtn.contains(e.target)) {
        readerFontDropdown.classList.add('hidden');
        readerFontDropdown.classList.remove('flex');
      }
    });
  }

  // Update Font Size UI
  function setFontSize(size) {
    currentFontSize = size;
    [fSizeSm, fSizeMd, fSizeLg].forEach(btn => {
      if (btn) btn.className = "flex-1 py-1 border border-outline-variant rounded-md text-xs font-medium hover:bg-surface-container";
    });

    if (size === 'sm') {
      if (fSizeSm) fSizeSm.className = "flex-1 py-1 border-2 border-primary bg-primary-container text-on-primary-container rounded-md text-xs font-bold font-sans";
      if (readerChapterText) {
        readerChapterText.className = "text-[14px] leading-[1.7] tracking-wide text-on-surface/90 flex flex-col gap-md";
      }
    } else if (size === 'md') {
      if (fSizeMd) fSizeMd.className = "flex-1 py-1 border-2 border-primary bg-primary-container text-on-primary-container rounded-md text-sm font-bold font-sans";
      if (readerChapterText) {
        readerChapterText.className = "text-[17px] leading-[1.8] tracking-wide text-on-surface/90 flex flex-col gap-md";
      }
    } else if (size === 'lg') {
      if (fSizeLg) fSizeLg.className = "flex-1 py-1 border-2 border-primary bg-primary-container text-on-primary-container rounded-md text-md font-bold font-sans";
      if (readerChapterText) {
        readerChapterText.className = "text-[21px] leading-[1.9] tracking-wide text-on-surface/90 flex flex-col gap-md";
      }
    }
  }

  if (fSizeSm) fSizeSm.addEventListener('click', () => setFontSize('sm'));
  if (fSizeMd) fSizeMd.addEventListener('click', () => setFontSize('md'));
  if (fSizeLg) fSizeLg.addEventListener('click', () => setFontSize('lg'));

  // Update Theme UI
  function setReaderTheme(theme) {
    currentReaderTheme = theme;
    [themeLight, themeSepia, themeDark].forEach(btn => {
      if (btn) btn.className = "py-2 border border-outline-variant rounded-md font-medium text-xs";
    });

    if (theme === 'light') {
      if (themeLight) themeLight.className = "py-2 border-2 border-primary bg-white text-slate-800 rounded-md font-bold text-xs shadow-sm";
      if (readerViewport) {
        readerViewport.className = "flex-grow flex w-full relative overflow-hidden bg-white text-slate-800";
      }
    } else if (theme === 'sepia') {
      if (themeSepia) themeSepia.className = "py-2 border-2 border-primary bg-[#FBF0D9] text-[#5F4B32] rounded-md font-bold text-xs shadow-sm";
      if (readerViewport) {
        readerViewport.className = "flex-grow flex w-full relative overflow-hidden bg-[#FBF0D9] text-[#5F4B32]";
      }
    } else if (theme === 'dark') {
      if (themeDark) themeDark.className = "py-2 border-2 border-primary bg-slate-900 text-slate-100 rounded-md font-bold text-xs shadow-sm";
      if (readerViewport) {
        readerViewport.className = "flex-grow flex w-full relative overflow-hidden bg-slate-900 text-slate-100 dark-theme-custom";
      }
    }
  }

  if (themeLight) themeLight.addEventListener('click', () => setReaderTheme('light'));
  if (themeSepia) themeSepia.addEventListener('click', () => setReaderTheme('sepia'));
  if (themeDark) themeDark.addEventListener('click', () => setReaderTheme('dark'));

  // Buka Pembaca E-Book
  let currentReadingPageIndex = 0;
  window.openEbookReader = function (bookId) {
    const book = ebooks.find(e => e.id === bookId);
    if (!book) return;

    currentReaderBook = book;
    currentReadingPageIndex = 0;

    // Reset UI pembaca
    if (readerBookTitle) readerBookTitle.textContent = book.title;
    if (readerBookAuthor) readerBookAuthor.textContent = book.author;
    if (readerModal) {
      readerModal.classList.remove('hidden');
      readerModal.classList.add('flex');
    }

    // Terapkan default font & tema
    setFontSize('md');
    setReaderTheme('light');

    // Cek Status Premium & Mulai Timer Sesi
    const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';

    // Matikan interval yang ada jika ada
    if (readingTimerInterval) {
      clearInterval(readingTimerInterval);
      readingTimerInterval = null;
    }

    if (isPremium) {
      if (readerTimerContainer) readerTimerContainer.classList.add('hidden');
      if (readerPremiumStatus) {
        readerPremiumStatus.classList.remove('hidden');
        readerPremiumStatus.classList.add('flex');
      }
      isTimerActive = false;
    } else {
      if (readerPremiumStatus) readerPremiumStatus.classList.add('hidden');
      if (readerTimerContainer) {
        readerTimerContainer.classList.remove('hidden');
        readerTimerContainer.classList.add('flex');
      }
      // Mulai Timer hitung mundur 60 detik
      timerMsRemaining = 60000;
      isTimerActive = true;
      startReadingTimer();
    }

    // Muat Halaman Buku
    loadChapterPage(0);
  };

  // Tutup Pembaca E-Book
  function closeEbookReader() {
    if (readingTimerInterval) {
      clearInterval(readingTimerInterval);
      readingTimerInterval = null;
    }
    isTimerActive = false;

    if (readerModal) {
      readerModal.classList.add('hidden');
      readerModal.classList.remove('flex');
    }
    currentReaderBook = null;
  }

  if (readerCloseBtn) readerCloseBtn.addEventListener('click', closeEbookReader);

  // Render Teks & Bab Halaman Terpilih
  function loadChapterPage(pageIndex) {
    if (!currentReaderBook) return;

    currentReadingPageIndex = pageIndex;
    const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';

    // Reset overlay kunci
    if (readerLockedOverlay) readerLockedOverlay.classList.add('hidden');

    // A. CEK LIMITASI AKSES HALAMAN (Basic Member)
    if (!isPremium && pageIndex >= maxFreePages) {
      // Tampilkan popup limitasi halaman
      if (readerLockedOverlay) readerLockedOverlay.classList.remove('hidden');

      const lockTitle = document.getElementById('locked-overlay-title');
      const lockDesc = document.getElementById('locked-overlay-desc');
      if (lockTitle) lockTitle.textContent = "Batas Membaca Gratis Tercapai 👑";
      if (lockDesc) lockDesc.innerHTML = "Anda telah mencapai batas 3 halaman gratis. Aktivasi keanggotaan <strong>BridgePass Premium</strong> untuk membaca buku digital ini sepuasnya tanpa batas halaman maupun waktu!";

      // Matikan timer saat layar terkunci halaman
      if (readingTimerInterval) {
        clearInterval(readingTimerInterval);
        readingTimerInterval = null;
      }
      return;
    }

    // B. Cek sisa waktu membaca (Basic Member)
    if (!isPremium && timerMsRemaining <= 0) {
      lockReaderByTimer();
      return;
    }

    // Jika timer mati tapi waktu masih ada (kembali dari locked), nyalakan kembali
    if (!isPremium && isTimerActive && !readingTimerInterval) {
      startReadingTimer();
    }

    // Render TOC
    if (readerToc) {
      readerToc.innerHTML = "";
      currentReaderBook.pages.forEach((pageContent, idx) => {
        const isLocked = !isPremium && idx >= maxFreePages;
        const lockIcon = isLocked ? "<span class='material-symbols-outlined text-[16px] text-amber-500 ml-auto'>lock</span>" : "";
        const activeClass = idx === pageIndex ? "bg-primary-container text-on-primary-container font-bold border-l-4 border-primary" : "text-on-surface-variant hover:bg-surface-container-low";

        const tocItem = document.createElement('li');
        tocItem.className = `flex items-center gap-2 px-3 py-2.5 rounded-lg text-label-md transition-colors cursor-pointer select-none ${activeClass}`;
        tocItem.innerHTML = `<span class="material-symbols-outlined text-[18px]">menu_book</span> Bab ${idx + 1} ${lockIcon}`;
        tocItem.addEventListener('click', () => {
          loadChapterPage(idx);
        });
        readerToc.appendChild(tocItem);
      });
    }

    // Render Teks Konten
    if (readerChapterTitle) {
      readerChapterTitle.textContent = pageIndex === 0 ? "Pendahuluan & Pengantar" : `Bab ${pageIndex}: ${currentReaderBook.title.split(":")[0]}`;
    }

    if (readerChapterText) {
      readerChapterText.innerHTML = "";
      const textBlock = currentReaderBook.pages[pageIndex];
      // Tulis sebagai paragraf yang indah
      const paragraphs = textBlock.split(". ").map(p => p.trim() + ".");
      paragraphs.forEach(pText => {
        if (pText.length > 2) {
          const p = document.createElement('p');
          p.className = "mb-sm indent-sm text-justify";
          p.textContent = pText;
          readerChapterText.appendChild(p);
        }
      });
    }

    // Update Progres & Navigasi Buttons
    if (readerPageIndicator) {
      readerPageIndicator.textContent = `Bab ${pageIndex + 1} dari ${currentReaderBook.pages.length}`;
    }

    if (readerPrevBtn) {
      readerPrevBtn.disabled = pageIndex === 0;
      readerPrevBtn.style.opacity = pageIndex === 0 ? 0.4 : 1;
    }

    if (readerNextBtn) {
      readerNextBtn.disabled = pageIndex === currentReaderBook.pages.length - 1;
      readerNextBtn.style.opacity = pageIndex === currentReaderBook.pages.length - 1 ? 0.4 : 1;
    }
  }

  // Prev / Next Page click handlers
  if (readerPrevBtn) {
    readerPrevBtn.addEventListener('click', () => {
      if (currentReadingPageIndex > 0) {
        loadChapterPage(currentReadingPageIndex - 1);
      }
    });
  }

  if (readerNextBtn) {
    readerNextBtn.addEventListener('click', () => {
      if (currentReaderBook && currentReadingPageIndex < currentReaderBook.pages.length - 1) {
        loadChapterPage(currentReadingPageIndex + 1);
      }
    });
  }

  // C. LOGIKA HITUNG MUNDUR WAKTU MEMBACA (Basic)
  function startReadingTimer() {
    if (readingTimerInterval) return;

    readingTimerInterval = setInterval(() => {
      timerMsRemaining -= 100;

      if (timerMsRemaining <= 0) {
        timerMsRemaining = 0;
        clearInterval(readingTimerInterval);
        readingTimerInterval = null;
        lockReaderByTimer();
      }

      // Update timer countdown text
      if (readerTimerCountdown) {
        const displaySec = (timerMsRemaining / 1000).toFixed(1);
        readerTimerCountdown.textContent = `${displaySec}s`;

        // Tambah visual dramatis berkedip merah saat sisa waktu <= 10 detik
        if (timerMsRemaining <= 10000) {
          readerTimerContainer.className = "flex items-center gap-xs px-3 py-1.5 rounded-full bg-error-container text-error border border-error/20 font-label-md text-label-md font-bold animate-pulse-soft";
          readerTimerCountdown.className = "font-mono tracking-widest font-extrabold text-error";
        } else {
          readerTimerContainer.className = "flex items-center gap-xs px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-500 border border-orange-500/20 font-label-md text-label-md font-bold";
          readerTimerCountdown.className = "font-mono tracking-widest font-extrabold text-orange-600 dark:text-orange-500";
        }
      }

    }, 100);
  }

  // Kunci Pembaca saat Sesi Habis
  function lockReaderByTimer() {
    if (readerLockedOverlay) readerLockedOverlay.classList.remove('hidden');

    const lockTitle = document.getElementById('locked-overlay-title');
    const lockDesc = document.getElementById('locked-overlay-desc');
    if (lockTitle) lockTitle.textContent = "Waktu Membaca Gratis Habis 👑";
    if (lockDesc) lockDesc.innerHTML = "Waktu membaca gratis 60 detik Anda telah selesai. Aktivasi keanggotaan <strong>BridgePass Premium</strong> untuk membaca tanpa batasan waktu sepuasnya!";

    if (readingTimerInterval) {
      clearInterval(readingTimerInterval);
      readingTimerInterval = null;
    }
  }

  // Kembali ke katalog saat ditolak
  if (readerLockedCloseBtn) {
    readerLockedCloseBtn.addEventListener('click', closeEbookReader);
  }

  // ==========================================
  // LOGIKA KODE REFERRAL BRIDGEPASS PREMIUM
  // ==========================================
  const bpModal = document.getElementById('bridgepass-modal');
  const bpBackdrop = document.getElementById('bp-backdrop');
  const bpCloseBtn = document.getElementById('close-bridgepass-modal');
  const bpTabInfo = document.getElementById('bp-tab-info');
  const bpTabReferral = document.getElementById('bp-tab-referral');
  const bpContentInfo = document.getElementById('bp-content-info');
  const bpContentReferral = document.getElementById('bp-content-referral');
  const bpToReferralBtn = document.getElementById('bp-to-referral-btn');
  const bpReferralInput = document.getElementById('bp-referral-input');
  const bpReferralError = document.getElementById('bp-referral-error');
  const bpReferralSuccess = document.getElementById('bp-referral-success');
  const bpSubmitReferral = document.getElementById('bp-submit-referral');

  // Buka Modal BridgePass dari manapun (termasuk Reader)
  window.openBridgePassModal = function () {
    if (bpModal) {
      bpModal.classList.remove('hidden');
      bpModal.classList.add('flex');
    }
    switchBPTab('info');
    updateBridgePassUI();
  };

  function closeBridgePassModal() {
    if (bpModal) {
      bpModal.classList.add('hidden');
      bpModal.classList.remove('flex');
    }
  }

  if (bpCloseBtn) bpCloseBtn.addEventListener('click', closeBridgePassModal);
  if (bpBackdrop) bpBackdrop.addEventListener('click', closeBridgePassModal);

  // Upgrade buttons trigger
  const ebookUpgradeBannerBtn = document.getElementById('ebook-upgrade-cta-btn');
  if (ebookUpgradeBannerBtn) {
    ebookUpgradeBannerBtn.addEventListener('click', () => {
      const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';
      if (!isPremium) openBridgePassModal();
    });
  }

  if (readerUpgradeBtn) {
    readerUpgradeBtn.addEventListener('click', () => {
      openBridgePassModal();
    });
  }

  // Fungsi Tukar Tab Modal
  function switchBPTab(tabName) {
    if (tabName === 'info') {
      if (bpTabInfo) {
        bpTabInfo.className = "flex-1 py-3 font-label-md text-label-md font-bold text-primary border-b-2 border-primary transition-colors bg-surface-container-lowest";
      }
      if (bpTabReferral) {
        bpTabReferral.className = "flex-1 py-3 font-label-md text-label-md text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors bg-surface-container-low";
      }
      if (bpContentInfo) bpContentInfo.classList.remove('hidden');
      if (bpContentReferral) bpContentReferral.classList.add('hidden');
    } else if (tabName === 'referral') {
      if (bpTabReferral) {
        bpTabReferral.className = "flex-1 py-3 font-label-md text-label-md font-bold text-primary border-b-2 border-primary transition-colors bg-surface-container-lowest";
      }
      if (bpTabInfo) {
        bpTabInfo.className = "flex-1 py-3 font-label-md text-label-md text-on-surface-variant border-b-2 border-transparent hover:text-primary transition-colors bg-surface-container-low";
      }
      if (bpContentReferral) bpContentReferral.classList.remove('hidden');
      if (bpContentInfo) bpContentInfo.classList.add('hidden');
    }
  }

  if (bpTabInfo) bpTabInfo.addEventListener('click', () => switchBPTab('info'));
  if (bpTabReferral) bpTabReferral.addEventListener('click', () => switchBPTab('referral'));
  if (bpToReferralBtn) bpToReferralBtn.addEventListener('click', () => switchBPTab('referral'));

  // Update UI Modal BridgePass
  function updateBridgePassUI() {
    const isPremium = localStorage.getItem('rb_bridgepass') === 'premium';
    const bpModalTier = document.getElementById('bp-modal-tier');
    const bpModalIcon = document.getElementById('bp-modal-icon');
    const bpPremiumNotice = document.getElementById('bp-premium-notice');
    const bpReferralForm = document.getElementById('bp-referral-form');

    if (bpModalTier) bpModalTier.textContent = isPremium ? 'Member Premium' : 'Member Basic';
    if (bpModalIcon) bpModalIcon.style.color = isPremium ? '#006c49' : '#004ac6';

    if (isPremium) {
      if (bpPremiumNotice) bpPremiumNotice.classList.remove('hidden');
      if (bpReferralForm) bpReferralForm.classList.add('hidden');
    } else {
      if (bpPremiumNotice) bpPremiumNotice.classList.add('hidden');
      if (bpReferralForm) bpReferralForm.classList.remove('hidden');
    }
  }

  // Validasi Kode Referral
  if (bpSubmitReferral) {
    bpSubmitReferral.addEventListener('click', () => {
      const code = bpReferralInput.value.trim().toUpperCase();
      bpReferralError.classList.add('hidden');
      bpReferralSuccess.classList.add('hidden');

      if (code === 'SMNGTAFN') {
        // Upgrade Sukses!
        localStorage.setItem('rb_bridgepass', 'premium');
        bpReferralSuccess.classList.remove('hidden');
        bpReferralSuccess.classList.add('flex');
        bpReferralInput.value = "";
        bpReferralInput.disabled = true;
        bpSubmitReferral.disabled = true;

        updateBridgePassUI();
        updateEbookBannerUI();
        renderEbooks();

        // JIKA sedang membaca E-Book gratis, langsung buka kunci secara instan!
        if (currentReaderBook) {
          // Buka Status Premium di Reader Header
          if (readerTimerContainer) readerTimerContainer.classList.add('hidden');
          if (readerPremiumStatus) {
            readerPremiumStatus.classList.remove('hidden');
            readerPremiumStatus.classList.add('flex');
          }
          isTimerActive = false;
          if (readingTimerInterval) {
            clearInterval(readingTimerInterval);
            readingTimerInterval = null;
          }

          // Segera muat ulang halaman saat ini (membuka blur / kunci)
          loadChapterPage(currentReadingPageIndex);
        }

        // Tampilkan toast keberhasilan singkat
        setTimeout(() => {
          alert("Selamat! Anda sudah berhasil mengaktifkan BridgePass Premium!");
          closeBridgePassModal();
        }, 1200);

      } else {
        bpReferralError.classList.remove('hidden');
        bpReferralError.classList.add('flex');
        bpReferralInput.classList.add('border-error');
        setTimeout(() => bpReferralInput.classList.remove('border-error'), 1500);
      }
    });
  }

  // ==========================================
  // INJECT CONFIRM UNTUK MARKETPLACE CHECKOUT
  // ==========================================
  // (Sinkronisasi dengan task lain bila diperlukan)

});

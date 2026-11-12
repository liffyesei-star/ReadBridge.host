// main.js - Script Interaktif Utama untuk ReadBridge
// Mengelola Eksplorasi Buku, Tulisan Literasi (Creator Write), dan Diskusi

let books = [];
const marketplaceBooks = [];

// Data Tulisan Literasi
const literacyArticles = [
  {
    id: 1,
    type: 'article',
    title: 'Kenapa Membaca 15 Menit Sehari Bisa Mengubah Cara Kita Belajar',
    author: '@NadiaLiterasi',
    publishDate: '28 Juni 2026',
    editedDate: '29 Juni 2026',
    readTime: '5 menit baca',
    upvotes: '2.4k',
    comments: 86,
    xp: 120,
    topics: ['#KebiasaanMembaca', '#BelajarMandiri', '#Produktivitas'],
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=1200',
    imageCredit: 'Foto oleh Blaz Photo via Unsplash',
    excerpt:
      'Literasi tidak selalu dimulai dari target besar. Kebiasaan pendek yang konsisten membantu otak mengenali pola, membangun kosakata, dan memperluas cara kita menyusun argumen.',
    sources: [
      'National Literacy Trust - Reading for pleasure research overview',
      'OECD - Reading performance and learning habits'
    ]
  },
  {
    id: 2,
    type: 'article',
    title: 'Cara Menulis Ulasan Buku yang Tidak Sekadar Bagus atau Jelek',
    author: '@AksaraRuang',
    publishDate: '27 Juni 2026',
    editedDate: null,
    readTime: '7 menit baca',
    upvotes: '980',
    comments: 42,
    xp: 150,
    topics: ['#UlasanBuku', '#CreatorWrite', '#Komunitas'],
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    imageCredit: 'Foto oleh Green Chameleon via Unsplash',
    excerpt:
      'Ulasan yang kuat punya konteks, bukti, dan posisi pembaca. Artikel ini membedah struktur sederhana agar opini terasa jernih dan bisa dibalas dengan diskusi yang sehat.',
    sources: [
      'Purdue OWL - Writing a book review',
      'ReadBridge Community Guide - Etika berdiskusi'
    ]
  },
  {
    id: 3,
    type: 'article',
    title: 'Membaca Data Populer: Jangan Langsung Percaya Grafik yang Viral',
    author: '@RakaData',
    publishDate: '25 Juni 2026',
    editedDate: '26 Juni 2026',
    readTime: '6 menit baca',
    upvotes: '1.7k',
    comments: 63,
    xp: 180,
    topics: ['#LiterasiData', '#BerpikirKritis', '#Sumber'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    imageCredit: 'Foto oleh Luke Chesser via Unsplash',
    excerpt:
      'Grafik bisa membantu pemahaman, tapi juga bisa menyesatkan. Kenali skala, sampel, konteks, dan sumber sebelum menyimpulkan sebuah klaim.',
    sources: [
      'Data Literacy Project - Essential skills',
      'UNESCO - Media and information literacy resources'
    ]
  }
];

// Data Diskusi
const discussions = [
  {
    id: 1,
    type: 'discussion',
    title: 'Rekomendasi novel fiksi sejarah Indonesia?',
    author: '@SastraWangi',
    timeAgo: '2 jam yang lalu',
    upvotes: '1.2k',
    comments: 45,
    content:
      'Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.',
    tags: ['#Fiksi', '#Sejarah']
  },
  {
    id: 2,
    type: 'discussion',
    title: 'Bedah Buku: Atomic Habits karya James Clear',
    author: '@ProduktivitasTinggi',
    timeAgo: '1 hari yang lalu',
    upvotes: '850',
    comments: 120,
    content:
      "Mari kita diskusikan bab 3 dari Atomic Habits. Bagaimana kalian mengimplementasikan 'Make it Obvious' dalam rutinitas harian kalian?",
    tags: ['#BedahBuku', '#SelfImprovement']
  },
  {
    id: 3,
    type: 'discussion',
    title: 'Tips merangkum buku non-fiksi dengan efektif',
    author: '@PejuangBelajar',
    timeAgo: '5 jam yang lalu',
    upvotes: '3.4k',
    comments: 210,
    content:
      'Ada yang punya metode pencatatan (seperti Zettelkasten atau Cornell Notes) yang paling efektif saat membaca buku non-fiksi?',
    tags: ['#CatatanBaca', '#TipsBelajar']
  },
  {
    id: 4,
    type: 'discussion',
    title: 'Buku fiksi sains yang mind-blowing?',
    author: '@SciFiNerd',
    timeAgo: '3 hari yang lalu',
    upvotes: '500',
    comments: 80,
    content:
      'Ada saran buku fiksi sains yang konsepnya segar dan mengajak berpikir kritis? Baru selesai baca Dune dan butuh referensi sejenis.',
    tags: ['#SciFi', '#RekomendasiBuku']
  },
  {
    id: 5,
    type: 'discussion',
    title: 'Bagaimana cara konsisten membaca buku setiap hari?',
    author: '@PembacaPemula',
    timeAgo: '1 minggu yang lalu',
    upvotes: '2.1k',
    comments: 150,
    content:
      'Saya sering beli buku tapi jarang selesai dibaca. Selalu ada saja alasan buat berhenti. Minta tips supaya bisa konsisten baca setiap hari.',
    tags: ['#TipsMembaca', '#Produktivitas']
  }
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

function showMainToast(message) {
  const toast = document.createElement('div');
  toast.className =
    'fixed bottom-6 right-6 z-[9999] bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-lg font-label-md text-sm flex items-center gap-2 border border-slate-700 transition-opacity duration-300';
  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined text-[18px] text-emerald-400';
  icon.textContent = 'check_circle';
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(icon);
  toast.appendChild(text);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

window.readbridgeData = {
  books,
  literacyArticles,
  getCreatorWriteArticles,
  discussions,
  marketplaceBooks
};

const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const apiBaseUrl =
  localStorage.getItem('rb_api_base_url') ||
  (isLocalFrontend ? 'http://localhost:5001' : 'https://readbridge-backend-2whx.onrender.com');

async function loadBooksFromApi() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/books?limit=100`);
    const data = await response.json();
    if (data.success && data.data) {
      books = data.data.map((b) => {
        let badge = null;
        try {
          const parsedTags = typeof b.tags === 'string' ? JSON.parse(b.tags) : b.tags;
          if (Array.isArray(parsedTags) && parsedTags.length > 0) {
            badge = parsedTags[0].replace(/^#/, '');
          }
        } catch (e) {}

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
          reviewer: 'Pembaca Terverifikasi',
          abstract: b.deskripsi || '',
          isDb: true
        };
      });
      window.readbridgeData.books = books;
    }
  } catch (err) {
    console.warn('Failed to load books from backend API in main.js:', err);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Handle Notification Mark All Read if on notifikasi.html
  const markAllReadBtn = document.getElementById('mark-all-read');
  const notificationCards = document.querySelectorAll('.notification-card.unread');

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', function () {
      notificationCards.forEach((card) => {
        card.classList.remove('unread');
        const dot = card.querySelector('.unread-dot');
        if (dot) dot.style.display = 'none';
        const contentArea = card.querySelector('.flex-grow');
        if (contentArea) contentArea.classList.add('opacity-80');
      });

      const navBadge = document.querySelector('header .bg-error');
      if (navBadge) navBadge.style.display = 'none';
      showMainToast('Semua notifikasi telah ditandai sebagai dibaca.');
    });
  }

  //Targeted bookmark & share handler without intrusive global alert() popups
  document.addEventListener('click', function (e) {
    if (
      e.target.closest('#profile-menu-container') ||
      e.target.tagName.toLowerCase() === 'input' ||
      e.target.tagName.toLowerCase() === 'select'
    ) {
      return;
    }

    const clickable = e.target.closest('button');
    if (!clickable) return;

    const icon = clickable.querySelector('.material-symbols-outlined');
    if (!icon) return;
    const iconName = icon.textContent.trim();

    if (iconName === 'bookmark_add' && clickable.innerText.trim() === 'bookmark_add') {
      e.preventDefault();
      e.stopPropagation();
      icon.textContent = 'bookmark_added';
      showMainToast('Disimpan ke koleksi Anda.');
    } else if (iconName === 'bookmark_added' && clickable.innerText.trim() === 'bookmark_added') {
      e.preventDefault();
      e.stopPropagation();
      icon.textContent = 'bookmark_add';
      showMainToast('Dihapus dari koleksi Anda.');
    }
  });

  // Eksplor Grid & Filter Logic
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultGrid = document.getElementById('book-grid');
  const resultMessage = document.getElementById('result-message');

  const tabBuku = document.getElementById('tab-buku');
  const tabTulisan = document.getElementById('tab-tulisan');

  if (!resultGrid) return;

  let currentActiveTab = 'buku';

  loadBooksFromApi().then(() => {
    if (currentActiveTab === 'buku') {
      renderData(books, 'buku');
    }
  });

  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  function renderData(data, type) {
    resultGrid.innerHTML = '';

    if (data.length === 0) {
      resultGrid.innerHTML = `<p class="col-span-full text-center text-on-surface-variant font-body-md py-lg">Tidak ada ${escapeHTML(type)} yang cocok dengan pencarian atau filter Anda.</p>`;
    } else {
      data.forEach((item) => {
        let cardHTML = '';

        if (type === 'buku') {
          const safeTitle = escapeHTML(item.title);
          const safeAuthor = escapeHTML(item.author);
          const safeBadge = item.badge ? escapeHTML(item.badge) : '';
          const safeImage = item.image ? escapeHTML(item.image) : '';
          const safeRating = escapeHTML(item.rating);
          const safeReviews = escapeHTML(item.reviews);

          const badgeHTML = safeBadge
            ? `<div class="absolute top-2 right-2 bg-secondary text-on-secondary px-2 py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 shadow-sm"><span class="material-symbols-outlined text-[14px]">verified</span> ${safeBadge}</div>`
            : '';
          const imageHTML = safeImage
            ? `<img alt="${safeTitle}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${safeImage}" onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex';"/><div style="display:none" class="w-full h-full flex items-center justify-center bg-surface-variant"><span class="material-symbols-outlined text-[64px] text-outline-variant">menu_book</span></div>`
            : `<div class="w-full h-full flex items-center justify-center bg-surface-variant group-hover:scale-105 transition-transform duration-500"><span class="material-symbols-outlined text-[64px] text-outline-variant">menu_book</span></div>`;

          cardHTML = `
            <a href="detail.html?id=${encodeURIComponent(item.id)}" class="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer">
              <div class="h-48 w-full bg-surface-container-high relative overflow-hidden">
                ${imageHTML}
                ${badgeHTML}
              </div>
              <div class="p-md flex flex-col flex-grow">
                <h3 class="font-title-lg text-title-lg text-on-surface line-clamp-2 leading-tight mb-xs font-bold">${safeTitle}</h3>
                <p class="font-label-sm text-label-sm text-on-surface-variant mb-sm">${safeAuthor}</p>
                <div class="flex items-center gap-xs mb-auto">
                  <span class="material-symbols-outlined text-amber-500 text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  <span class="font-label-sm text-label-sm font-bold text-on-surface">${safeRating}</span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">(${safeReviews})</span>
                </div>
                <div class="mt-md pt-sm border-t border-outline-variant/30 flex justify-between items-center">
                  <span class="font-headline-md text-headline-md text-primary font-bold">${formatRupiah(item.price)}</span>
                  <button type="button" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" aria-label="Simpan ke koleksi"><span class="material-symbols-outlined text-[18px]">bookmark_add</span></button>
                </div>
              </div>
            </a>
          `;
        } else if (type === 'tulisan') {
          const safeTitle = escapeHTML(item.title);
          const safeAuthor = escapeHTML(item.author);
          const safePublishDate = escapeHTML(item.publishDate);
          const safeEditedDate = escapeHTML(item.editedDate);
          const safeReadTime = escapeHTML(item.readTime);
          const safeExcerpt = escapeHTML(item.excerpt);
          const safeImageCredit = escapeHTML(item.imageCredit);
          const topicsHTML = (item.topics || [])
            .map(
              (topic) =>
                `<span class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm">${escapeHTML(topic)}</span>`
            )
            .join('');
          const editedHTML = item.editedDate
            ? `<span class="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></span><span>Diedit ${safeEditedDate}</span>`
            : '';
          const sourcesHTML = (item.sources || [])
            .slice(0, 2)
            .map((source) => `<li>${escapeHTML(source)}</li>`)
            .join('');

          cardHTML = `
            <article class="bg-surface-container-lowest col-span-full rounded-xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                <a href="detail-tulisan.html?id=${encodeURIComponent(item.id)}" class="block h-56 lg:h-full bg-surface-container-high overflow-hidden">
                  <img alt="${safeTitle}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${escapeHTML(item.coverImage)}">
                </a>
                <div class="p-lg flex flex-col gap-md">
                  <div class="flex flex-wrap items-center justify-between gap-sm">
                    <div class="flex flex-wrap gap-2">${topicsHTML}</div>
                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm font-bold">
                      <span class="material-symbols-outlined text-[16px]">bolt</span> +${escapeHTML(item.xp)} XP
                    </span>
                  </div>
                  <div class="flex flex-col gap-sm">
                    <a href="detail-tulisan.html?id=${encodeURIComponent(item.id)}" class="group">
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
                  <div class="border-l-4 border-primary bg-surface-container-low px-md py-sm rounded-r-lg">
                    <p class="font-label-sm text-label-sm text-on-surface font-bold mb-xs">Sumber Referensi</p>
                    <ul class="list-disc list-inside font-label-sm text-label-sm text-on-surface-variant space-y-1">${sourcesHTML}</ul>
                  </div>
                  <div class="flex flex-wrap items-center justify-between gap-sm pt-sm border-t border-outline-variant/30">
                    <p class="font-label-sm text-label-sm text-on-surface-variant">${safeImageCredit}</p>
                    <div class="flex items-center gap-sm text-on-surface">
                      <a href="detail-tulisan.html?id=${encodeURIComponent(item.id)}" class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-container-low transition-colors font-label-md text-label-md">
                        <span class="material-symbols-outlined text-[20px]">arrow_upward</span> ${escapeHTML(item.upvotes)}
                      </a>
                      <a href="detail-tulisan.html?id=${encodeURIComponent(item.id)}#comments" class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-surface-container-low transition-colors font-label-md text-label-md">
                        <span class="material-symbols-outlined text-[20px]">chat_bubble</span> ${escapeHTML(item.comments)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        } else if (type === 'diskusi') {
          const tagsHTML = (item.tags || [])
            .map(
              (tag) =>
                `<span class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm">${escapeHTML(tag)}</span>`
            )
            .join('');

          cardHTML = `
            <article class="bg-surface-container-lowest col-span-full rounded-2xl p-lg flex flex-col gap-md shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm">
                  <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-on-surface-variant">person</span></div>
                  <div class="flex flex-col"><span class="font-bold text-on-surface text-label-md">${escapeHTML(item.author)}</span><span class="text-on-surface-variant">${escapeHTML(item.timeAgo)}</span></div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <a href="detail-diskusi.html?id=${encodeURIComponent(item.id)}" class="group"><h2 class="font-title-lg text-title-lg text-on-surface font-bold leading-tight cursor-pointer group-hover:text-primary">${escapeHTML(item.title)}</h2></a>
                <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-relaxed">${escapeHTML(item.content)}</p>
              </div>
              <div class="flex gap-2 mt-1">${tagsHTML}</div>
            </article>
          `;
        }

        resultGrid.innerHTML += cardHTML;
      });
    }

    if (resultMessage) {
      const label = type === 'tulisan' ? 'Tulisan Literasi' : 'Buku';
      resultMessage.textContent = `Menampilkan ${data.length} hasil untuk ${label}`;
    }
  }

  renderData(books, 'buku');

  function switchTab(selectedTabStr) {
    currentActiveTab = selectedTabStr;

    [tabBuku, tabTulisan].filter(Boolean).forEach((tab) => {
      tab.className =
        'font-title-lg text-title-lg text-on-surface-variant hover:text-primary transition-colors pb-2 px-2 shrink-0 select-none';
    });

    let activeElement;
    let dataToRender = [];

    if (selectedTabStr === 'buku') {
      activeElement = tabBuku;
      dataToRender = books;
    } else if (selectedTabStr === 'tulisan') {
      activeElement = tabTulisan;
      dataToRender = getCreatorWriteArticles();
    }

    if (activeElement) {
      activeElement.className =
        'font-title-lg text-title-lg text-primary border-b-2 border-primary pb-2 px-2 transition-colors shrink-0 font-bold';
    }

    const filterBuku = document.getElementById('filter-buku');
    const filterTulisan = document.getElementById('filter-tulisan');

    if (filterBuku) {
      filterBuku.classList.add('hidden');
      filterBuku.classList.remove('block');
    }
    if (filterTulisan) {
      filterTulisan.classList.add('hidden');
      filterTulisan.classList.remove('block');
    }

    if (selectedTabStr === 'buku' && filterBuku) {
      filterBuku.classList.remove('hidden');
      filterBuku.classList.add('block');
    } else if (selectedTabStr === 'tulisan' && filterTulisan) {
      filterTulisan.classList.remove('hidden');
      filterTulisan.classList.add('block');
    }

    if (searchInput) searchInput.value = '';
    renderData(dataToRender, selectedTabStr);
  }

  if (tabBuku) tabBuku.addEventListener('click', () => switchTab('buku'));
  if (tabTulisan) tabTulisan.addEventListener('click', () => switchTab('tulisan'));

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      const keyword = searchInput.value.trim().toLowerCase();

      let sourceData = currentActiveTab === 'tulisan' ? getCreatorWriteArticles() : books;
      if (keyword === '') {
        renderData(sourceData, currentActiveTab);
        return;
      }

      const filteredData = sourceData.filter((item) => {
        if (currentActiveTab === 'buku') {
          return (
            (item.title || '').toLowerCase().includes(keyword) ||
            (item.author || '').toLowerCase().includes(keyword) ||
            (item.category || '').toLowerCase().includes(keyword)
          );
        } else if (currentActiveTab === 'tulisan') {
          return (
            (item.title || '').toLowerCase().includes(keyword) ||
            (item.excerpt || '').toLowerCase().includes(keyword) ||
            (item.author || '').toLowerCase().includes(keyword) ||
            (item.topics || []).join(' ').toLowerCase().includes(keyword)
          );
        }
        return false;
      });

      renderData(filteredData, currentActiveTab);
    });

    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }

  const applyFilterBtn = document.getElementById('apply-filter-btn');
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (currentActiveTab === 'tulisan') {
        const selectedTopics = Array.from(
          document.querySelectorAll('[data-topic-filter]:checked')
        ).map((input) => input.value);
        const filteredArticles = getCreatorWriteArticles().filter((article) => {
          if (selectedTopics.length === 0) return true;
          return (article.topics || []).some((topic) =>
            selectedTopics.includes(topic.replace('#', ''))
          );
        });
        renderData(filteredArticles, 'tulisan');
      } else if (currentActiveTab === 'buku') {
        const filterContainer = document.getElementById('filter-buku');
        const checkedCategories = filterContainer
          ? Array.from(filterContainer.querySelectorAll('input[type="checkbox"]:checked')).map((cb) =>
              cb.parentElement.textContent.trim().toLowerCase()
            )
          : [];
        const minRatingChecked = filterContainer
          ? filterContainer.querySelector('input[type="radio"]:checked')
          : null;

        const filteredBooks = books.filter((b) => {
          const catMatch =
            checkedCategories.length === 0 ||
            checkedCategories.some(
              (c) =>
                (b.category || '').toLowerCase().includes(c) ||
                c.includes((b.category || '').toLowerCase())
            );
          const ratingMatch = !minRatingChecked || Number(b.rating || 4.5) >= 4.0;
          return catMatch && ratingMatch;
        });
        renderData(filteredBooks, 'buku');
      }
    });
  }
});

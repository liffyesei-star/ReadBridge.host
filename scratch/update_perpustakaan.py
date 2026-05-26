import re

with open('perpustakaan.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add Custom Styles for Modal (if not exists)
styles = """
<style>
/* Library Modal Animations & Styles */
.modal-overlay {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}
.modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
.modal-content {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-overlay.active .modal-content {
    transform: translateY(0) scale(1);
    opacity: 1;
}

/* Scrollbar styling for modal */
.modal-body::-webkit-scrollbar {
    width: 8px;
}
.modal-body::-webkit-scrollbar-track {
    background: transparent;
}
.modal-body::-webkit-scrollbar-thumb {
    background-color: var(--outline-variant, #c3c6d7);
    border-radius: 20px;
}
</style>
"""
if "/* Library Modal Animations & Styles */" not in html:
    html = html.replace('</head>', styles + '\n</head>')


# 2. Update Left Sidebar (QR Code & Status Kunjungan)
old_sidebar_regex = r'<!-- Left Sidebar: BridgePass -->.*?<!-- Right Content: Perpustakaan Mitra -->'
new_sidebar = """<!-- Left Sidebar: BridgePass -->
<aside class="w-full lg:w-80 shrink-0 space-y-lg">
    <div class="bg-primary text-on-primary rounded-xl p-lg shadow-lg relative overflow-hidden flex flex-col h-[420px]">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary-fixed opacity-10 rounded-bl-full"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-primary-fixed opacity-10 rounded-tr-full"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
                <h2 class="font-title-lg text-title-lg font-bold">BridgePass</h2>
                <p class="font-label-md text-label-md opacity-90 mt-1">Akses Digital Perpustakaan</p>
            </div>
            
            <a href="https://youtu.be/dQw4w9WgXcQ?si=p8519C4BVa1i1nK8" target="_blank" title="Scan QR Code" class="bg-surface-container-lowest p-4 rounded-lg self-center mt-auto mb-auto w-48 h-48 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
                <!-- Working QR Code targeting the YouTube link -->
                <img alt="BridgePass QR Code" class="w-full h-full object-cover" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fyoutu.be%2FdQw4w9WgXcQ%3Fsi%3Dp8519C4BVa1i1nK8"/>
            </a>
            <p class="text-center text-xs opacity-70 mt-1 mb-2">Klik atau Scan QR Code</p>

            <div class="mt-auto">
                <p class="font-body-md text-body-md font-semibold rb-username-fill">Budi Santoso</p>
                <p class="font-label-sm text-label-sm opacity-80">ID: RB-2024-0891</p>
                <div class="mt-2 flex items-center gap-2">
                    <span class="inline-flex items-center gap-1 bg-secondary text-on-secondary px-2 py-1 rounded-full font-label-sm text-label-sm">
                        <span class="material-symbols-outlined text-[14px]">verified</span> Aktif
                    </span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Visit Log Teaser in Sidebar -->
    <div class="bg-surface-container-lowest border border-surface-variant rounded-xl p-md shadow-sm">
        <h3 class="font-label-md text-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">history</span> Log Kunjungan
        </h3>
        
        <div class="space-y-4 mb-4">
            <div class="flex items-start justify-between border-b border-surface-variant pb-3">
                <div>
                    <p class="font-label-md text-label-md font-bold text-on-surface">Perpustakaan Nasional RI</p>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">Kemarin, 14:30 WIB</p>
                </div>
                <span class="text-secondary font-label-sm text-label-sm font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md">+50 XP</span>
            </div>
            <div class="flex items-start justify-between border-b border-surface-variant pb-3">
                <div>
                    <p class="font-label-md text-label-md font-bold text-on-surface">Perpusda Cikini</p>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">12 Mei 2026</p>
                </div>
                <span class="text-secondary font-label-sm text-label-sm font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md">+30 XP</span>
            </div>
            <div class="flex items-start justify-between">
                <div>
                    <p class="font-label-md text-label-md font-bold text-on-surface">Pusat Literasi Jakarta</p>
                    <p class="font-label-sm text-label-sm text-on-surface-variant">08 Mei 2026</p>
                </div>
                <span class="text-secondary font-label-sm text-label-sm font-bold bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md">+40 XP</span>
            </div>
        </div>
        
        <button class="w-full text-center text-primary font-label-sm text-label-sm font-bold hover:bg-surface-container-high py-2 rounded-lg transition-colors" onclick="openVisitLogModal()">Lihat Riwayat Lengkap</button>
    </div>
</aside>
<!-- Right Content: Perpustakaan Mitra -->"""
html = re.sub(old_sidebar_regex, new_sidebar, html, flags=re.DOTALL)


# 3. Update the Bento Grid Libraries
old_grid_regex = r'<!-- Bento Grid Layout for Libraries -->.*?<!-- Load More -->'
new_grid = """<!-- Bento Grid Layout for Libraries -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter" id="libraries-grid">
    <!-- Generated dynamically via JS -->
</div>
<!-- Load More -->"""
html = re.sub(old_grid_regex, new_grid, html, flags=re.DOTALL)


# 4. Inject Modals and JS Data
# Modals HTML
modals_html = """
<!-- ================= MODALS ================= -->

<!-- Modal: Library Details -->
<div id="library-modal" class="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 hidden">
    <div class="modal-content bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        
        <!-- Header Image -->
        <div class="relative h-48 md:h-64 shrink-0">
            <img id="modal-lib-image" class="w-full h-full object-cover" src="" alt="Library Image">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <button onclick="closeLibraryModal()" class="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-10">
                <span class="material-symbols-outlined">close</span>
            </button>

            <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                    <span id="modal-lib-badge" class="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm font-bold mb-2 shadow-sm">Mitra</span>
                    <h2 id="modal-lib-title" class="text-3xl font-extrabold text-white leading-tight">Nama Perpustakaan</h2>
                    <p id="modal-lib-location" class="text-white/80 font-body-md flex items-center gap-1 mt-1">
                        <span class="material-symbols-outlined text-[18px]">location_on</span> Lokasi
                    </p>
                </div>
                <div class="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                    <span class="material-symbols-outlined text-primary text-[24px]" style="font-variation-settings: 'FILL' 1;">star</span>
                    <div>
                        <p id="modal-lib-rating" class="font-bold text-on-surface text-lg leading-none">4.8</p>
                        <p id="modal-lib-reviews-count" class="font-label-sm text-on-surface-variant text-[10px]">342 ulasan</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scrollable Body -->
        <div class="modal-body overflow-y-auto p-4 md:p-6 flex flex-col gap-8 flex-grow">
            
            <!-- Facilities & Info -->
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-grow space-y-4">
                    <h3 class="font-title-lg font-bold text-on-surface">Tentang Perpustakaan</h3>
                    <p id="modal-lib-desc" class="text-on-surface-variant font-body-md leading-relaxed">Deskripsi perpustakaan.</p>
                    
                    <h4 class="font-label-md font-bold text-on-surface mt-4">Fasilitas Tersedia</h4>
                    <div id="modal-lib-facilities" class="flex flex-wrap gap-2">
                        <!-- Facilities injected here -->
                    </div>
                </div>
                
                <!-- Klub Perpustakaan Card -->
                <div class="w-full md:w-[320px] shrink-0">
                    <div class="bg-primary-container/10 border border-primary/20 rounded-xl p-5 shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center">
                                <span class="material-symbols-outlined">groups</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-on-surface">Klub Perpustakaan</h4>
                                <p class="text-xs text-on-surface-variant" id="modal-lib-members">1.2k Anggota</p>
                            </div>
                        </div>
                        <p class="text-sm text-on-surface-variant mb-4">Gabung dengan komunitas baca lokal dan ikuti event seru setiap minggunya.</p>
                        <button class="w-full bg-primary text-white font-bold py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm" onclick="alert('Berhasil bergabung dengan Klub Perpustakaan ini!')">Gabung Klub</button>
                        
                        <div class="mt-4 border-t border-outline-variant/30 pt-4">
                            <h5 class="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">event</span> Agenda Mendatang
                            </h5>
                            <ul id="modal-lib-events" class="space-y-3">
                                <!-- Events injected here -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Visual Reviews Section -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-title-lg font-bold text-on-surface">Ulasan Pengunjung</h3>
                    <button class="text-primary font-bold text-sm hover:underline">Tulis Ulasan</button>
                </div>
                <div id="modal-lib-reviews" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Reviews injected here -->
                </div>
            </div>
            
        </div>
    </div>
</div>

<!-- Modal: Visit Log -->
<div id="visit-log-modal" class="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 hidden">
    <div class="modal-content bg-surface-container-lowest w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        <div class="bg-surface px-6 py-4 border-b border-surface-variant flex items-center justify-between shrink-0">
            <h2 class="text-xl font-extrabold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">history</span> Riwayat Kunjungan
            </h2>
            <button onclick="closeVisitLogModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="modal-body overflow-y-auto p-6 space-y-6">
            <div class="bg-primary/10 rounded-xl p-4 flex items-center justify-between border border-primary/20">
                <div>
                    <p class="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Total XP Kunjungan</p>
                    <p class="text-3xl font-black text-primary mt-1">1,420 XP</p>
                </div>
                <span class="material-symbols-outlined text-[48px] text-primary/30">emoji_events</span>
            </div>
            
            <div class="relative pl-4 border-l-2 border-surface-variant space-y-6">
                <!-- Log Item 1 -->
                <div class="relative">
                    <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                    <p class="font-bold text-on-surface">Perpustakaan Nasional RI</p>
                    <p class="text-xs text-on-surface-variant mb-1">Kemarin, 14:30 WIB</p>
                    <span class="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded">+50 XP</span>
                </div>
                <!-- Log Item 2 -->
                <div class="relative">
                    <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                    <p class="font-bold text-on-surface">Perpusda Cikini</p>
                    <p class="text-xs text-on-surface-variant mb-1">12 Mei 2026, 10:15 WIB</p>
                    <span class="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded">+30 XP</span>
                </div>
                <!-- Log Item 3 -->
                <div class="relative">
                    <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                    <p class="font-bold text-on-surface">Pusat Literasi Jakarta</p>
                    <p class="text-xs text-on-surface-variant mb-1">08 Mei 2026, 13:00 WIB</p>
                    <span class="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded">+40 XP</span>
                </div>
                <!-- Log Item 4 -->
                <div class="relative">
                    <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
                    <p class="font-bold text-on-surface">Ruang Baca UI</p>
                    <p class="text-xs text-on-surface-variant mb-1">20 April 2026, 09:00 WIB</p>
                    <span class="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded">+45 XP</span>
                </div>
                <!-- Log Item 5 -->
                <div class="relative">
                    <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
                    <p class="font-bold text-on-surface">Perpustakaan Nasional RI</p>
                    <p class="text-xs text-on-surface-variant mb-1">15 April 2026, 11:20 WIB</p>
                    <span class="inline-block px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[10px] rounded">+50 XP</span>
                </div>
            </div>
        </div>
    </div>
</div>
"""
if "<!-- ================= MODALS ================= -->" not in html:
    html = html.replace('<!-- Footer -->', modals_html + '\n<!-- Footer -->')


# 5. Inject Script with Libraries Data and Logic
script_data = """
<script>
// --- Data Perpustakaan ---
const libraries = [
    {
        id: 1,
        title: "Perpustakaan Nasional RI",
        badge: "Mitra Premium",
        location: "Jl. Medan Merdeka Selatan, Jakarta",
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviewsCount: 342,
        facilities: [
            { icon: "ac_unit", text: "AC Sentral" },
            { icon: "wifi", text: "WiFi 100Mbps" },
            { icon: "chair", text: "Ruang Baca Luas" },
            { icon: "coffee", text: "Kafe" }
        ],
        description: "Perpustakaan Nasional Republik Indonesia adalah perpustakaan tertinggi di dunia. Menawarkan koleksi buku yang sangat lengkap dengan fasilitas super nyaman, cocok untuk riset, belajar, maupun sekadar membaca santai.",
        members: "5.4k Anggota",
        events: [
            { date: "Besok, 14:00", title: "Bedah Buku: Sejarah Nusantara" },
            { date: "Jumat, 10:00", title: "Workshop Menulis Esai" }
        ],
        reviews: [
            {
                name: "@RinaBelajar", role: "Mahasiswa UI", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&fit=crop",
                text: "Tempat favorit buat nugas akhir pekan! Colokannya banyak dan WiFi-nya kenceng parah. Vibes belajarnya dapet banget."
            },
            {
                name: "@BudiReader", role: "Peneliti", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&fit=crop",
                text: "Koleksi jurnal fisiknya luar biasa lengkap. Ruang baca di lantai 21 sangat tenang dengan pemandangan Monas."
            }
        ]
    },
    {
        id: 2,
        title: "Perpusda Cikini",
        badge: "Mitra",
        location: "Kompleks TIM, Cikini, Menteng",
        image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        reviewsCount: 128,
        facilities: [
            { icon: "ac_unit", text: "AC" },
            { icon: "wifi", text: "WiFi Gratis" },
            { icon: "local_cafe", text: "Kantin TIM" },
            { icon: "music_note", text: "Area Seni" }
        ],
        description: "Terletak di dalam kawasan Taman Ismail Marzuki, perpustakaan ini tidak hanya menawarkan buku, tapi juga suasana seni yang kental. Sangat estetis dan nyaman.",
        members: "2.1k Anggota",
        events: [
            { date: "Sabtu, 15:00", title: "Diskusi Puisi Sore" },
            { date: "Minggu, 09:00", title: "Klub Buku Anak" }
        ],
        reviews: [
            {
                name: "@SeniKata", role: "Penulis", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=400&fit=crop",
                text: "Sambil nyari inspirasi nulis puisi, view-nya estetik banget! Banyak buku sastra yang langka ditemui."
            },
            {
                name: "@ArsitekMuda", role: "Desainer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1585776269991-88f5a703d73b?w=400&fit=crop",
                text: "Arsitekturnya gila sih keren abis. Tempatnya cozy, abis baca bisa langsung jalan keliling TIM."
            }
        ]
    },
    {
        id: 3,
        title: "Pusat Literasi Jakarta",
        badge: "Mitra",
        location: "Jl. Sudirman, Jakarta Selatan",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        reviewsCount: 204,
        facilities: [
            { icon: "meeting_room", text: "Ruang Diskusi" },
            { icon: "computer", text: "PC Publik" },
            { icon: "local_parking", text: "Parkir Luas" }
        ],
        description: "Pusat literasi modern yang berada di jantung kota Jakarta. Fasilitas komputer publik dan ruang diskusi kedap suara menjadikannya lokasi ideal untuk kerja kelompok.",
        members: "1.8k Anggota",
        events: [
            { date: "Senin, 16:00", title: "Tech & Book: Koding Bareng" }
        ],
        reviews: [
            {
                name: "@DevLife", role: "Programmer", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&fit=crop",
                text: "Ruang diskusinya mantap buat meeting tim atau pair programming. PC publiknya juga cepet."
            }
        ]
    },
    {
        id: 4,
        title: "Ruang Baca UI",
        badge: "Akademik",
        location: "Kampus UI Depok",
        image: "https://images.unsplash.com/photo-1621217524950-71172813589b?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviewsCount: 890,
        facilities: [
            { icon: "menu_book", text: "Koleksi Jurnal" },
            { icon: "nature", text: "Pemandangan Danau" },
            { icon: "wifi", text: "Eduroam" }
        ],
        description: "Perpustakaan Universitas Indonesia (The Crystal of Knowledge) adalah fasilitas akademik terkemuka dengan pemandangan danau yang menenangkan.",
        members: "12k Anggota",
        events: [
            { date: "Rabu, 13:00", title: "Pelatihan Sitasi Mendeley" }
        ],
        reviews: [
            {
                name: "@AnakUI", role: "Mahasiswa Akhir", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=400&fit=crop",
                text: "Rumah kedua selama ngerjain skripsi. Kalau penat tinggal liat ke arah danau, stres langsung ilang (dikit)."
            }
        ]
    },
    {
        id: 5,
        title: "Taman Bacaan Masyarakat",
        badge: "Komunitas",
        location: "Bintaro Sektor 7, Tangsel",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        reviewsCount: 85,
        facilities: [
            { icon: "child_care", text: "Kids Corner" },
            { icon: "park", text: "Outdoor Seating" },
            { icon: "volunteer_activism", text: "Buku Donasi" }
        ],
        description: "Sebuah inisiatif komunitas lokal untuk meningkatkan minat baca anak-anak dan remaja di area Bintaro. Suasana kekeluargaan sangat kental di sini.",
        members: "850 Anggota",
        events: [
            { date: "Minggu, 16:00", title: "Mendongeng Bersama Anak" }
        ],
        reviews: [
            {
                name: "@BundaAyu", role: "Ibu Rumah Tangga", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop",
                photo: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&fit=crop",
                text: "Tempat yang luar biasa buat bawa anak-anak pas weekend. Mereka bisa main sekaligus diajarin cinta buku."
            }
        ]
    }
];

// --- Render Grid ---
function renderLibraries() {
    const grid = document.getElementById('libraries-grid');
    if(!grid) return;
    
    grid.innerHTML = libraries.map(lib => `
        <article class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer" onclick="openLibraryModal(${lib.id})">
            <div class="h-48 relative overflow-hidden group">
                <img alt="${lib.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${lib.image}"/>
                <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div class="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full font-label-sm text-label-sm font-bold text-primary shadow-sm flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span> ${lib.rating}
                </div>
            </div>
            <div class="p-md flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-2 gap-2">
                    <h3 class="font-title-lg text-title-lg font-bold text-on-surface line-clamp-1">${lib.title}</h3>
                    <span class="font-label-sm text-label-sm ${lib.badge.includes('Premium') ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'} px-2 py-1 rounded-md shrink-0">${lib.badge}</span>
                </div>
                <p class="font-body-md text-body-md text-on-surface-variant mb-4 flex items-center gap-1 truncate">
                    <span class="material-symbols-outlined text-[16px]">location_on</span> ${lib.location}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${lib.facilities.slice(0,3).map(f => `
                        <span class="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2 py-1 rounded-md font-label-sm text-label-sm border border-outline-variant">
                            <span class="material-symbols-outlined text-[14px]">${f.icon}</span> ${f.text}
                        </span>
                    `).join('')}
                </div>
                <div class="mt-auto pt-4 border-t border-surface-variant flex items-center justify-between">
                    <div class="flex items-center gap-1 text-on-surface-variant">
                        <span class="material-symbols-outlined text-[18px]">forum</span>
                        <span class="font-label-sm text-label-sm font-semibold">${lib.reviewsCount} Ulasan</span>
                    </div>
                    <button class="text-primary font-label-md text-label-md font-bold hover:underline decoration-primary underline-offset-4">Lihat Detail</button>
                </div>
            </div>
        </article>
    `).join('');
}

// --- Modal Logic ---
function openLibraryModal(id) {
    const lib = libraries.find(l => l.id === id);
    if(!lib) return;
    
    document.getElementById('modal-lib-image').src = lib.image;
    document.getElementById('modal-lib-title').textContent = lib.title;
    document.getElementById('modal-lib-badge').textContent = lib.badge;
    document.getElementById('modal-lib-location').innerHTML = `<span class="material-symbols-outlined text-[18px]">location_on</span> ${lib.location}`;
    document.getElementById('modal-lib-rating').textContent = lib.rating;
    document.getElementById('modal-lib-reviews-count').textContent = `${lib.reviewsCount} ulasan`;
    document.getElementById('modal-lib-desc').textContent = lib.description;
    document.getElementById('modal-lib-members').textContent = lib.members;
    
    // Facilities
    document.getElementById('modal-lib-facilities').innerHTML = lib.facilities.map(f => `
        <span class="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-label-sm font-semibold border border-outline-variant">
            <span class="material-symbols-outlined text-[18px] text-primary">${f.icon}</span> ${f.text}
        </span>
    `).join('');
    
    // Events
    document.getElementById('modal-lib-events').innerHTML = lib.events.length ? lib.events.map(e => `
        <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
            <div>
                <p class="text-[11px] font-bold text-primary mb-0.5">${e.date}</p>
                <p class="text-sm font-medium text-on-surface leading-tight">${e.title}</p>
            </div>
        </li>
    `).join('') : '<p class="text-sm text-on-surface-variant">Belum ada agenda terdekat.</p>';
    
    // Reviews with photos
    document.getElementById('modal-lib-reviews').innerHTML = lib.reviews.map(r => `
        <div class="bg-surface rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-3">
            <div class="flex items-center gap-2">
                <img src="${r.avatar}" class="w-8 h-8 rounded-full object-cover">
                <div>
                    <p class="font-bold text-sm text-on-surface leading-none">${r.name}</p>
                    <p class="text-[10px] text-on-surface-variant">${r.role}</p>
                </div>
            </div>
            <p class="text-sm text-on-surface-variant italic">"${r.text}"</p>
            <div class="h-32 w-full rounded-lg overflow-hidden mt-1">
                <img src="${r.photo}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer">
            </div>
        </div>
    `).join('');
    
    const modal = document.getElementById('library-modal');
    modal.classList.remove('hidden');
    // small delay to allow display block to apply before opacity transition
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeLibraryModal() {
    const modal = document.getElementById('library-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function openVisitLogModal() {
    const modal = document.getElementById('visit-log-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeVisitLogModal() {
    const modal = document.getElementById('visit-log-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const libModal = document.getElementById('library-modal');
    const logModal = document.getElementById('visit-log-modal');
    
    if (e.target === libModal) {
        closeLibraryModal();
    }
    if (e.target === logModal) {
        closeVisitLogModal();
    }
});

document.addEventListener('DOMContentLoaded', renderLibraries);
</script>
"""
if "// --- Data Perpustakaan ---" not in html:
    html = html.replace('</body>', script_data + '\n</body>')


with open('perpustakaan.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("perpustakaan.html successfully updated!")

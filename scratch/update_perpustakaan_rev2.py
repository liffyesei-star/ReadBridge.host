import re

with open('perpustakaan.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update QR Code section to be blurred
old_qr_section = r'<a href="https://youtu.be/dQw4w9WgXcQ\?si=p8519C4BVa1i1nK8" target="_blank" title="Scan QR Code" class="bg-surface-container-lowest p-4 rounded-lg self-center mt-auto mb-auto w-48 h-48 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">\s*<!-- Working QR Code targeting the YouTube link -->\s*<img alt="BridgePass QR Code" class="w-full h-full object-cover" src="https://api.qrserver.com/v1/create-qr-code/\?size=150x150&data=https%3A%2F%2Fyoutu.be%2FdQw4w9WgXcQ%3Fsi%3Dp8519C4BVa1i1nK8"/>\s*</a>\s*<p class="text-center text-xs opacity-70 mt-1 mb-2">Klik atau Scan QR Code</p>\s*<div class="mt-auto">\s*<p class="font-body-md text-body-md font-semibold rb-username-fill">Budi Santoso</p>\s*<p class="font-label-sm text-label-sm opacity-80">ID: RB-2024-0891</p>\s*<div class="mt-2 flex items-center gap-2">\s*<span class="inline-flex items-center gap-1 bg-secondary text-on-secondary px-2 py-1 rounded-full font-label-sm text-label-sm">\s*<span class="material-symbols-outlined text-\[14px\]">verified</span> Aktif\s*</span>\s*</div>\s*</div>'

new_qr_section = """<div class="relative flex flex-col h-full justify-between" id="qr-container">
                <!-- Blurred Content -->
                <div id="qr-blur-area" class="blur-md transition-all duration-300 pointer-events-none select-none flex flex-col items-center">
                    <div class="bg-surface-container-lowest p-4 rounded-lg w-48 h-48 flex items-center justify-center shadow-md mb-2">
                        <img alt="BridgePass QR Code" class="w-full h-full object-cover" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fyoutu.be%2FdQw4w9WgXcQ%3Fsi%3Dp8519C4BVa1i1nK8"/>
                    </div>
                    <div class="text-center w-full mt-4">
                        <p class="font-body-md text-body-md font-semibold rb-username-fill">Budi Santoso</p>
                        <p class="font-label-sm text-label-sm opacity-80">ID: RB-2024-0891</p>
                        <div class="mt-2 flex justify-center items-center gap-2">
                            <span class="inline-flex items-center gap-1 bg-secondary text-on-secondary px-2 py-1 rounded-full font-label-sm text-label-sm">
                                <span class="material-symbols-outlined text-[14px]">verified</span> Aktif
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Unblur Button Overlay -->
                <div id="qr-overlay" class="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer" onclick="unblurQR()">
                    <div class="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-black/80 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">visibility</span> Tampilkan QR
                    </div>
                </div>

                <!-- Clickable QR Link (Hidden initially) -->
                <a id="qr-link" href="https://youtu.be/dQw4w9WgXcQ?si=p8519C4BVa1i1nK8" target="_blank" class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 z-30 hidden cursor-pointer" title="Buka YouTube"></a>
            </div>
            
            <script>
            function unblurQR() {
                document.getElementById('qr-blur-area').classList.remove('blur-md', 'pointer-events-none', 'select-none');
                document.getElementById('qr-overlay').classList.add('hidden');
                document.getElementById('qr-link').classList.remove('hidden');
            }
            </script>"""

html = re.sub(old_qr_section, new_qr_section, html, flags=re.DOTALL)


# 2. Update Filter and Peta Buttons
old_buttons = r'<button class="bg-surface-container-high text-on-surface px-4 py-2 rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">\s*<span class="material-symbols-outlined text-\[18px\]">tune</span> Filter\s*</button>\s*<button class="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm">\s*<span class="material-symbols-outlined text-\[18px\]">map</span> Peta\s*</button>'

new_buttons = """<div class="relative">
                        <button onclick="document.getElementById('filter-dropdown').classList.toggle('hidden')" class="bg-surface-container-high text-on-surface px-4 py-2 rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">tune</span> Filter
                        </button>
                        <!-- Filter Dropdown -->
                        <div id="filter-dropdown" class="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg hidden z-50 flex flex-col py-2">
                            <button onclick="filterLibs('all')" class="text-left px-4 py-2 hover:bg-surface-variant text-sm font-semibold">Semua Kategori</button>
                            <button onclick="filterLibs('Mitra Premium')" class="text-left px-4 py-2 hover:bg-surface-variant text-sm font-semibold">Mitra Premium</button>
                            <button onclick="filterLibs('Mitra')" class="text-left px-4 py-2 hover:bg-surface-variant text-sm font-semibold">Mitra Reguler</button>
                            <button onclick="filterLibs('Akademik')" class="text-left px-4 py-2 hover:bg-surface-variant text-sm font-semibold">Akademik</button>
                            <button onclick="filterLibs('Komunitas')" class="text-left px-4 py-2 hover:bg-surface-variant text-sm font-semibold">Komunitas</button>
                        </div>
                        <script>
                            function filterLibs(category) {
                                document.getElementById('filter-dropdown').classList.add('hidden');
                                const cards = document.querySelectorAll('#libraries-grid article');
                                cards.forEach(card => {
                                    if (category === 'all') {
                                        card.style.display = 'flex';
                                    } else {
                                        const badge = card.querySelector('span.bg-surface-container-high, span.bg-secondary-container').textContent;
                                        if (badge.includes(category)) {
                                            card.style.display = 'flex';
                                        } else {
                                            card.style.display = 'none';
                                        }
                                    }
                                });
                            }
                        </script>
                    </div>
                    <button onclick="openMapModal()" class="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">map</span> Peta
                    </button>"""

html = re.sub(old_buttons, new_buttons, html)


# 3. Add Map Modal
map_modal = """<!-- Modal: Map View -->
<div id="map-modal" class="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 hidden">
    <div class="modal-content bg-surface-container-lowest w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        <div class="bg-surface px-6 py-4 border-b border-surface-variant flex items-center justify-between shrink-0 z-10 shadow-sm">
            <h2 class="text-xl font-extrabold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">map</span> Peta Persebaran Perpustakaan Mitra
            </h2>
            <button onclick="closeMapModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="relative flex-grow bg-surface-variant w-full h-full overflow-hidden">
            <!-- Dummy Map Image -->
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover opacity-70 scale-105" alt="Map">
            
            <!-- Map Overlay UI to look like a real map -->
            <div class="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
            
            <!-- Dummy Map Pins -->
            <div class="absolute top-[30%] left-[40%] flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-transform drop-shadow-md">
                <div class="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Perpustakaan Nasional RI</div>
                <span class="material-symbols-outlined text-primary text-[36px]" style="font-variation-settings: 'FILL' 1;">location_on</span>
            </div>
            
            <div class="absolute top-[45%] left-[45%] flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-transform drop-shadow-md">
                <div class="bg-secondary text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Perpusda Cikini</div>
                <span class="material-symbols-outlined text-secondary text-[36px]" style="font-variation-settings: 'FILL' 1;">location_on</span>
            </div>

            <div class="absolute top-[60%] left-[30%] flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-transform drop-shadow-md">
                <div class="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Pusat Literasi Jakarta</div>
                <span class="material-symbols-outlined text-primary text-[36px]" style="font-variation-settings: 'FILL' 1;">location_on</span>
            </div>

            <div class="absolute bottom-[20%] right-[30%] flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-transform drop-shadow-md">
                <div class="bg-secondary text-white text-xs font-bold px-2 py-1 rounded shadow-md mb-1">Ruang Baca UI</div>
                <span class="material-symbols-outlined text-secondary text-[36px]" style="font-variation-settings: 'FILL' 1;">location_on</span>
            </div>
        </div>
    </div>
</div>
"""
html = html.replace('<!-- ================= MODALS ================= -->', '<!-- ================= MODALS ================= -->\n' + map_modal)

map_js = """
function openMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}
"""

html = html.replace('function closeVisitLogModal() {', map_js + '\nfunction closeVisitLogModal() {')
html = html.replace('if (e.target === logModal) {', 'if (e.target === logModal) {\n        closeVisitLogModal();\n    }\n    const mapModal = document.getElementById(\'map-modal\');\n    if (e.target === mapModal) {\n        closeMapModal();\n    }\n    if (e.target === logModal) {')


with open('perpustakaan.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("perpustakaan.html successfully updated with rev2!")

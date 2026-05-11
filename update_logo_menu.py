import os, re

# Mengambil semua file yang berekstensi .html di direktori saat ini
files = [f for f in os.listdir('.') if f.endswith('.html')]

# Skrip JavaScript yang akan disuntikkan ke dalam setiap file HTML
# Skrip ini bertugas untuk membuat dropdown menu secara dinamis pada logo "ReadBridge"
script_to_inject = """
<script id="dynamic-logo-menu">
document.addEventListener("DOMContentLoaded", function() {
    // Mencari elemen header atau nav utama di dalam dokumen
    const headerOrNav = document.querySelector('header, nav');
    
    // Jika header/nav ditemukan dan menu belum pernah ditambahkan sebelumnya
    if (headerOrNav && !document.getElementById('logo-menu-container')) {
        
        // Menggunakan TreeWalker untuk mencari teks spesifik "ReadBridge" di dalam elemen header
        const treeWalker = document.createTreeWalker(headerOrNav, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                // Memfilter hanya node teks yang nilainya sama persis dengan 'ReadBridge'
                return node.nodeValue.trim() === 'ReadBridge' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        
        const logoTextNode = treeWalker.nextNode();
        
        // Jika teks logo ditemukan, kita akan memodifikasi elemen pembungkusnya (misal: <a> atau <span>)
        if (logoTextNode) {
            const logoEl = logoTextNode.parentElement;
            
            // Mencegah duplikasi jika logo sudah dimodifikasi
            if (logoEl.id === 'logo-btn' || logoEl.querySelector('#logo-btn')) return;

            // Membuat container (pembungkus) utama untuk logo dan dropdown menu
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.cursor = 'pointer';
            wrapper.id = 'logo-menu-container';
            
            // Menyisipkan wrapper sebelum logo, lalu memasukkan logo ke dalam wrapper
            logoEl.parentNode.insertBefore(wrapper, logoEl);
            wrapper.appendChild(logoEl);
            
            // Menambahkan ikon panah ke bawah (expand_more) pada logo
            logoEl.id = 'logo-btn';
            logoEl.style.display = 'flex';
            logoEl.style.alignItems = 'center';
            logoEl.style.gap = '4px';
            logoEl.innerHTML = 'ReadBridge <span class="material-symbols-outlined text-[20px]">expand_more</span>';
            
            // Membuat elemen kotak dropdown menu
            const dropdown = document.createElement('div');
            dropdown.id = 'logo-dropdown';
            dropdown.className = 'absolute left-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 overflow-hidden hidden flex-col z-50';
            
            // Daftar tautan menu navigasi
            const links = [
                { href: 'index.html', icon: 'home', text: 'Beranda' },
                { href: 'eksplor.html', icon: 'library_books', text: 'Eksplor Koleksi' },
                { href: 'sewa.html', icon: 'menu_book', text: 'Perpustakaan & Sewa' },
                { href: 'marketplace.html', icon: 'storefront', text: 'Marketplace' },
                { href: 'komunitas.html', icon: 'forum', text: 'Komunitas' },
                { href: 'tentang-kami.html', icon: 'info', text: 'Tentang Kami' }
            ];
            
            // Melakukan perulangan untuk setiap tautan dan memasukkannya ke dalam dropdown
            links.forEach(l => {
                const a = document.createElement('a');
                a.href = l.href;
                a.className = 'px-4 py-3 hover:bg-surface-container-low transition-colors font-label-md text-[14px] text-on-surface flex items-center gap-3 font-medium';
                a.innerHTML = `<span class="material-symbols-outlined text-[20px] text-on-surface-variant">${l.icon}</span> ${l.text}`;
                dropdown.appendChild(a);
            });
            
            // Memasukkan dropdown ke dalam wrapper
            wrapper.appendChild(dropdown);
            
            // Event listener untuk membuka/menutup dropdown saat logo diklik
            logoEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
                dropdown.classList.toggle('flex');
            });
            
            // Event listener untuk menutup dropdown saat area luar logo diklik
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !logoEl.contains(e.target)) {
                    dropdown.classList.add('hidden');
                    dropdown.classList.remove('flex');
                }
            });
        }
    }
});
</script>
</body>
"""

# Proses iterasi/perulangan untuk setiap file HTML
for f in files:
    # Membaca isi file HTML
    with open(f, 'r') as file:
        content = file.read()
    
    # Mengecek apakah skrip sudah disuntikkan sebelumnya
    # Jika belum ada ID "dynamic-logo-menu", maka kita akan melakukan injeksi
    if 'id="dynamic-logo-menu"' not in content:
        # Mengganti tag penutup </body> dengan skrip + tag </body> menggunakan Regex
        new_content = re.sub(r'</body>', script_to_inject, content, count=1, flags=re.IGNORECASE)
        
        # Menyimpan (menulis) ulang perubahan ke dalam file HTML tersebut
        with open(f, 'w') as file:
            file.write(new_content)
        
        # Menampilkan log keberhasilan ke terminal
        print(f'Injected script into {f}')


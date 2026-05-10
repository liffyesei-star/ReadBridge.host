import os, re

files = [f for f in os.listdir('.') if f.endswith('.html')]

script_to_inject = """
<script id="dynamic-logo-menu">
document.addEventListener("DOMContentLoaded", function() {
    // Inject Logo Menu
    const headerOrNav = document.querySelector('header, nav');
    if (headerOrNav && !document.getElementById('logo-menu-container')) {
        const treeWalker = document.createTreeWalker(headerOrNav, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                return node.nodeValue.trim() === 'ReadBridge' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });
        const logoTextNode = treeWalker.nextNode();
        if (logoTextNode) {
            const logoEl = logoTextNode.parentElement;
            
            if (logoEl.id === 'logo-btn' || logoEl.querySelector('#logo-btn')) return;

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.cursor = 'pointer';
            wrapper.id = 'logo-menu-container';
            
            logoEl.parentNode.insertBefore(wrapper, logoEl);
            wrapper.appendChild(logoEl);
            
            logoEl.id = 'logo-btn';
            logoEl.style.display = 'flex';
            logoEl.style.alignItems = 'center';
            logoEl.style.gap = '4px';
            logoEl.innerHTML = 'ReadBridge <span class="material-symbols-outlined text-[20px]">expand_more</span>';
            
            const dropdown = document.createElement('div');
            dropdown.id = 'logo-dropdown';
            dropdown.className = 'absolute left-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 overflow-hidden hidden flex-col z-50';
            
            const links = [
                { href: 'index.html', icon: 'home', text: 'Beranda' },
                { href: 'eksplor.html', icon: 'library_books', text: 'Eksplor Koleksi' },
                { href: 'sewa.html', icon: 'menu_book', text: 'Perpustakaan & Sewa' },
                { href: 'marketplace.html', icon: 'storefront', text: 'Marketplace' },
                { href: 'komunitas.html', icon: 'forum', text: 'Komunitas' },
                { href: 'tentang-kami.html', icon: 'info', text: 'Tentang Kami' }
            ];
            
            links.forEach(l => {
                const a = document.createElement('a');
                a.href = l.href;
                a.className = 'px-4 py-3 hover:bg-surface-container-low transition-colors font-label-md text-[14px] text-on-surface flex items-center gap-3 font-medium';
                a.innerHTML = `<span class="material-symbols-outlined text-[20px] text-on-surface-variant">${l.icon}</span> ${l.text}`;
                dropdown.appendChild(a);
            });
            
            wrapper.appendChild(dropdown);
            
            logoEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
                dropdown.classList.toggle('flex');
            });
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

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if 'id="dynamic-logo-menu"' not in content:
        new_content = re.sub(r'</body>', script_to_inject, content, count=1, flags=re.IGNORECASE)
        with open(f, 'w') as file:
            file.write(new_content)
        print(f'Injected script into {f}')


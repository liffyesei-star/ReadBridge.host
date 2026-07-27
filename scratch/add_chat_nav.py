import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'pesan.html']

target = '''<a href="notifikasi.html" class="flex items-center justify-center p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
        <span class="material-symbols-outlined">notifications</span>
      </a>'''

replacement = '''<a href="pesan.html" class="flex items-center justify-center p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative">
        <span class="material-symbols-outlined">chat</span>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface hidden"></span>
      </a>
      <a href="notifikasi.html" class="flex items-center justify-center p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
        <span class="material-symbols-outlined">notifications</span>
      </a>'''

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if target in content:
        content = content.replace(target, replacement)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        # try regex for more flexible match
        pattern = re.compile(r'<a href="notifikasi.html"[^>]*>\s*<span class="material-symbols-outlined"[^>]*>notifications</span>\s*</a>')
        if pattern.search(content):
            def repl(m):
                return replacement
            content = pattern.sub(repl, content)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Regex updated {f}")

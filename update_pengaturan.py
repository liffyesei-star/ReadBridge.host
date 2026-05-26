# Project: ReadBridge
# Author: Liffy Sei / Affan
# Date: May 2026
# Role: Lead Developer & UI/UX Designer

import os
import re
import glob

# Pola regex untuk mencari link Pengaturan di dropdown
# Mengubah href="#" menjadi href="pengaturan.html" asalkan isinya ada teks "Pengaturan" dan icon "settings"
pengaturan_pattern = re.compile(r'<a\s+href="#"([^>]*>\s*<span[^>]*>settings</span>\s*Pengaturan\s*</a>)')

# Script Dark Mode untuk diinjeksi setelah tag <head>
dark_mode_script = """
    <script>
        if (localStorage.getItem('rb_theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    </script>"""

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Update link Pengaturan
    content = pengaturan_pattern.sub(r'<a href="pengaturan.html"\1', content)

    # 2. Inject Dark Mode Script jika belum ada
    if "rb_theme" not in content and "<head>" in content.lower():
        # Cari tag <head> secara case-insensitive
        head_pattern = re.compile(r'(<head>)', re.IGNORECASE)
        content = head_pattern.sub(r'\1' + dark_mode_script, content, count=1)

    # Tulis ulang jika ada perubahan
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Berhasil mengupdate: {filepath}")
    else:
        print(f"⚡ Tidak ada perubahan: {filepath}")

def main():
    directory = "."
    html_files = glob.glob(os.path.join(directory, "*.html"))
    
    print(f"Memproses {len(html_files)} file HTML...")
    for file in html_files:
        # Abaikan pengaturan.html karena itu file baru kita yang sudah sempurna
        if os.path.basename(file) == "pengaturan.html":
            continue
        process_html_file(file)
    print("Selesai!")

if __name__ == "__main__":
    main()

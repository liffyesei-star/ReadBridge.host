import os, re

files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace the text of the link that has href="sewa.html" (or similar) inside <nav> or header
    # We can just look for <a ... href="sewa.html"...>...</a>
    # and change href="sewa.html" to href="perpustakaan.html"
    # and text to "Perpustakaan"
    # To preserve classes, we can use regex
    
    def replace_link(match):
        # match.group(0) is the entire <a> tag
        tag = match.group(0)
        # replace href="sewa.html" with href="perpustakaan.html"
        tag = re.sub(r'href="sewa\.html"', 'href="perpustakaan.html"', tag)
        # replace the text content before </a>
        tag = re.sub(r'>[^<]+</a>', '>Perpustakaan</a>', tag)
        return tag

    new_content = re.sub(r'<a[^>]+href="sewa\.html"[^>]*>.*?</a>', replace_link, content, flags=re.IGNORECASE | re.DOTALL)
    
    # Also handle href="marketplace.html" -> might need to ensure it says "Marketplace"
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated nav in {f}")


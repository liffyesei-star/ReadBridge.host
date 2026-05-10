import os
import re

directory = '.'
pattern = re.compile(r'<a href="[^"]*"([^>]*)>\s*<span class="material-symbols-outlined text-\[20px\]">person</span> Detail Akun')

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = pattern.sub(r'<a href="profile.html"\1>\n                                <span class="material-symbols-outlined text-[20px]">person</span> Detail Akun', content)
        
        # fix indentation if needed, but the original capture \1 is just the rest of attributes
        # let's be more precise:
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")

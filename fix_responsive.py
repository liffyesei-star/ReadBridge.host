# Project: ReadBridge
# Author: Liffy Sei / Affan
# Date: May 2026
# Role: Lead Developer & UI/UX Designer

import os
import glob

def replace_in_files(pattern, replacement):
    for filepath in glob.glob("*.html"):
        with open(filepath, 'r') as f:
            content = f.read()
        
        new_content = content.replace(pattern, replacement)
        
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")

# Fix large padding on mobile
replace_in_files('px-margin', 'px-4 md:px-margin')

# Fix grid cols to be responsive
replace_in_files('grid-cols-2 md:grid-cols-4', 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4')
replace_in_files('grid-cols-2 lg:grid-cols-4', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')

# Fix large fonts
replace_in_files('text-display-lg', 'text-[32px] md:text-display-lg leading-tight')
replace_in_files('text-headline-lg', 'text-[24px] md:text-headline-lg leading-tight')
replace_in_files('text-headline-md', 'text-[20px] md:text-headline-md leading-tight')

# Fix flex in headers/footers overlapping
replace_in_files('flex items-center justify-between px-4 md:px-margin', 'flex flex-wrap items-center justify-between px-4 md:px-margin gap-2')


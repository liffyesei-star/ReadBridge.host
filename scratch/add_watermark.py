import os
from datetime import datetime

# Author name (You can change this if needed)
AUTHOR_NAME = "Liffy Sei / Affan"
ROLE = "Lead Developer & UI/UX Designer"
PROJECT_NAME = "ReadBridge"
DATE = datetime.now().strftime("%B %Y")

HTML_HEADER = f"""<!--
  Project: {PROJECT_NAME}
  Author: {AUTHOR_NAME}
  Date: {DATE}
  Role: {ROLE}
-->
"""

CSS_JS_HEADER = f"""/*
  Project: {PROJECT_NAME}
  Author: {AUTHOR_NAME}
  Date: {DATE}
  Role: {ROLE}
*/
"""

PY_HEADER = f"""# Project: {PROJECT_NAME}
# Author: {AUTHOR_NAME}
# Date: {DATE}
# Role: {ROLE}

"""

def add_header(file_path, header):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Avoid adding header twice
    if f"Project: {PROJECT_NAME}" in content:
        print(f"Skipping (Header already exists): {file_path}")
        return

    # Special handling for HTML to ensure it goes after <!DOCTYPE html> if present
    if file_path.endswith('.html') and content.strip().lower().startswith("<!doctype html>"):
        parts = content.split(">", 1)
        if len(parts) == 2:
            new_content = parts[0] + ">\n" + header + parts[1]
        else:
            new_content = header + content
    else:
        new_content = header + content

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Watermark added to: {file_path}")

def main():
    root_dir = "."
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip hidden directories like .git and scratch dir
        if "/." in dirpath or "/scratch" in dirpath:
            continue
            
        for file in filenames:
            file_path = os.path.join(dirpath, file)
            
            if file.endswith('.html'):
                add_header(file_path, HTML_HEADER)
            elif file.endswith('.css') or file.endswith('.js'):
                add_header(file_path, CSS_JS_HEADER)
            elif file.endswith('.py'):
                add_header(file_path, PY_HEADER)

if __name__ == "__main__":
    main()

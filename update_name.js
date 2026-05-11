const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const scriptToInject = `
<script>
document.addEventListener("DOMContentLoaded", function() {
    const savedName = localStorage.getItem('rb_username');
    if (savedName) {
        const els = document.querySelectorAll('span.text-on-surface, p.text-on-surface, h1, h2, h3, h4, h5, h6');
        for (let i = 0; i < els.length; i++) {
            if (els[i].textContent.trim() === 'Siswa Indonesia') {
                els[i].textContent = savedName;
            }
        }
    }
});
</script>
</body>`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    if (!content.includes('savedName = localStorage.getItem')) {
        content = content.replace('</body>', scriptToInject);
        fs.writeFileSync(path.join(dir, file), content);
        console.log("Updated " + file);
    }
});

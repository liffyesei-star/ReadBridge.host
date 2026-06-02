const fs = require('fs');
const html = fs.readFileSync('pusat-bantuan.html', 'utf-8');
const scripts = html.match(/<script>(.*?)<\/script>/gs);
if(scripts && scripts.length > 0) {
    const lastScript = scripts[scripts.length - 1].replace(/<\/?script>/g, '');
    try {
        new Function(lastScript);
        console.log("Syntax is valid!");
    } catch(e) {
        console.error("Syntax Error: ", e);
    }
}

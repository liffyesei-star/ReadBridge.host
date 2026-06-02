const fs = require('fs');
const html = fs.readFileSync('pusat-bantuan.html', 'utf-8');
const scriptMatch = html.match(/<script>(.*?)<\/script>/s);
if(scriptMatch) {
    try {
        new Function(scriptMatch[1]);
        console.log("Syntax is valid!");
    } catch(e) {
        console.error("Syntax Error: ", e);
    }
}

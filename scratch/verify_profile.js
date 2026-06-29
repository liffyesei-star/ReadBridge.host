const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'profile.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 1;

while ((match = scriptRegex.exec(htmlContent)) !== null) {
  const scriptContent = match[1].trim();
  if (scriptContent) {
    try {
      new vm.Script(scriptContent);
      console.log(`Script ${scriptIndex} compiled successfully.`);
    } catch (e) {
      console.error(`Script ${scriptIndex} compilation failed:`, e);
      process.exit(1);
    }
  }
  scriptIndex++;
}

console.log("All script blocks verified successfully!");
process.exit(0);

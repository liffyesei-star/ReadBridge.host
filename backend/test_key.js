const fetch = require('node-fetch');
async function test() {
  require('dotenv').config();
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi');
  }
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiKey 
    },
    body: JSON.stringify({ 
      contents: [{ parts: [{ text: "halo" }] }], 
      generationConfig: { temperature: 0.7, maxOutputTokens: 250 } 
    })
  });
  const text = await resp.text();
  console.log("Status:", resp.status);
  console.log("Body:", text);
}
test();

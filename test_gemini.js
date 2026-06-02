const fetch = require('node-fetch');
async function test() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY || 'fake';
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: "halo" }] }], 
        generationConfig: { temperature: 0.7, maxOutputTokens: 250 } 
      })
    });
    const data = await resp.json();
    console.log(data);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();

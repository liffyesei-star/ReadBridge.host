const express = require("express");
const router = express.Router();

const FALLBACK_REPLY = "Maaf, sistem AI sedang mengalami gangguan sementara. Untuk bantuan cepat, silakan email bantuan@readbridge.id dengan detail masalah dan tangkapan layar.";

/**
 * POST /api/helpdesk/chat
 * Endpoint untuk memproses percakapan pengguna dengan AI Helpdesk.
 */
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!message) {
    return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong" });
  }

  // Jika tidak ada API Key, fallback sementara
  if (!geminiKey || geminiKey === 'YOUR_API_KEY_HERE' || geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.json({ 
      success: true, 
      reply: "Maaf, sistem AI sedang offline karena API Key belum dikonfigurasi. Silakan email bantuan@readbridge.id untuk pertanyaan lebih lanjut." 
    });
  }

  const systemPrompt = `Anda adalah "ReadBridge AI", asisten customer service yang ramah, sopan, dan solutif untuk platform buku digital "ReadBridge".
Platform ini memiliki fitur: perpustakaan digital, peminjaman buku bulanan, transaksi via Midtrans, komunitas (klub diskusi), dan fitur poin.
Jawab pertanyaan pengguna secara ringkas, jelas, dan menggunakan bahasa Indonesia yang baik (boleh santai tapi profesional). 
Jangan pernah menyebutkan bahwa Anda adalah sebuah bahasa AI buatan Google/OpenAI, tetap perankan karakter "ReadBridge AI". 
Gunakan *asterisk* ganda untuk huruf tebal bila perlu.

Pertanyaan Pengguna: "${message}"`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: systemPrompt }] }], 
        generationConfig: { temperature: 0.7, maxOutputTokens: 250 } 
      })
    });
    const data = await resp.json();

    if (!resp.ok) {
      console.error("Gemini API error:", resp.status, JSON.stringify(data));
      return res.json({ success: true, reply: FALLBACK_REPLY });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (reply) {
      return res.json({ success: true, reply });
    }

    console.error("Gemini response missing reply:", JSON.stringify(data));
    return res.json({ success: true, reply: FALLBACK_REPLY });
  } catch(e) { 
    console.error("Gemini Error:", e); 
    return res.json({ success: true, reply: FALLBACK_REPLY });
  }
});

module.exports = router;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ reply: 'MIMI ready - POST bestie! 💜' });
  }
  try {
    const { message, jenjang, kelas, mapel, mode } = req.body || {};
    if (!message) return res.status(200).json({ reply: 'pesan kosong bestie 😅' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return res.status(200).json({ reply: 'aduh GEMINI_API_KEY belum di set di Vercel - Settings > Environment Variables ya bestie! 😅' });
    }

    const isMath = (mapel||'').toLowerCase().includes('matematika') || (mapel||'').toLowerCase().includes('mtk');
    const isCurhat = mode === 'curhat' || /capek|sedih|galau|curhat|stress/i.test(message);

    let prompt = `Kamu MIMI V11 - Guru SD-SMA - By Met - Sumber buku.kemendikdasmen.go.id 7 buku 1976 hal - Jenjang ${jenjang} Kelas ${kelas} Mapel ${mapel} - 3 Peran: Guru, Asisten, Teman Curhat - Aturan: No kunci langsung! Hanya cara clue kisi analogi! Sumber Bab Hal! Bahasa cute + cool, bestie mager suntuk healing spill slay vibes santuy - `;

    if (isCurhat) prompt += `MODE CURHAT: empatik, peluk virtual, sapaan pendek 15 kata max variatif!`;
    else if (isMath) prompt += `MODE MTK: WAJIB 3 Langkah 3 Opsi A B C!`;
    else prompt += `MODE MAPEL: clue kisi sumber analogi hack hafal!`;

    prompt += `\nUser: ${message}\nMIMI:`;

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9, maxOutputTokens: 800 } })
    });
    const data = await r.json();
    if (!data.candidates) return res.status(200).json({ reply: `Gemini error: ${data.error?.message||'cek API key'} 😅` });
    const reply = data.candidates[0]?.content?.parts[0]?.text || 'coba lagi ya bestie! 😅';
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: `aduh error ${e.message} 😅 cek ENV GEMINI_API_KEY!` });
  }
}

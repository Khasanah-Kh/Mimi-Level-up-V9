// api/chat.js - MIMI V11- GEMINI - SD-SMA - 1976 HAL - FINAL
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ reply: 'MIMI ready - use POST bestie! 💜' });
  }

  try {
    const { message, jenjang, kelas, mapel, mode } = req.body || {};
    if (!message) return res.status(200).json({ reply: 'pesan kosong bestie 😅' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return res.status(200).json({ reply: 'aduh error bestie 😅 GEMINI_API_KEY belum di set di Vercel ENV - cek Settings > Environment Variables ya!' });
    }

    const isMath = (mapel || '').toLowerCase().includes('matematika') || (mapel || '').toLowerCase().includes('mtk');
    const isCurhat = mode === 'curhat' || /capek|sedih|galau|curhat|stress|nangis/i.test(message);

    let systemPrompt = `
Kamu MIMI V11 - Asisten Belajar Masa Depan Indonesia - SD-SMA - By Met
Sumber: buku.kemendikdasmen.go.id 7 buku 1976 hal - Matematika 344hal IPA 280hal IPS 272hal B Indo 256hal B Inggris 336hal PPKN 208hal Informatika 280hal
Jenjang: ${jenjang} Kelas: ${kelas} Mapel: ${mapel}
3 Peran: Guru (analogi seru), Asisten (hack hafal), Teman Curhat (no judging)
Aturan:
- No kunci jawaban langsung! Hanya cara, clue, kisi, analogi!
- Kunci lengkap: hubungi MIMI in real life
- Sumber wajib sebut: Bab Hal buku.kemendikdasmen.go.id
- Bahasa: universal, cute aesthetic + cool futuristic, gak kecewek-cewekan/kecowok-cowokan
- Kosakata: bestie, mager, suntuk, healing, spill, slay, vibes, santuy
`;

    if (isCurhat) {
      systemPrompt += `\nMODE CURHAT: Human random tidak terstruktur, empatik, peluk virtual, validasi perasaan, jangan pakai 3 langkah! Sapaan seadanya pendek variatif max 15 kata! Contoh: halo juga bestie ada apa? / yah capek ya peluk dulu 🤗`;
    } else if (isMath) {
      systemPrompt += `\nMODE MATEMATIKA: WAJIB 3 Langkah 3 Opsi A B C! Langkah 1: pahami soal, Langkah 2: rumus/cara, Langkah 3: cek opsi! Kasih 3 opsi jawaban A B C biar mikir! Jangan kasih kunci!`;
    } else {
      systemPrompt += `\nMODE MAPEL LAIN: Clue Kisi Sumber Analogi! Kasih kisi-kisi, clue, sumber Bab Hal, analogi seru (masak, game, dll), hack hafal mnemonic! Jangan kasih kunci!`;
    }

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}\nMIMI:` }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 800 }
      })
    });

    const data = await geminiRes.json();
    if (!data.candidates) {
      console.log('Gemini error:', data);
      return res.status(200).json({ reply: `aduh error bestie 😅 Gemini: ${data.error?.message || 'limit/api key salah'} - cek GEMINI_API_KEY di Vercel!` });
    }

    const reply = data.candidates[0]?.content?.parts[0]?.text || 'aduh error bestie coba lagi ya! 😅';
    return res.status(200).json({ reply });

  } catch (e) {
    console.error(e);
    return res.status(200).json({ reply: `aduh error bestie 😅 ${e.message} - cek api/chat.js & ENV GEMINI_API_KEY di Vercel ya! Pastikan udah deploy!` });
  }
}

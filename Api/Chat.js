export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  const {message, jenjang='SMP', kelas='8', mapel='Matematika'} = req.body;
  const key = process.env.OPENAI_API_KEY;
  
  const systemPrompt = `Kamu MIMI V10 - Asisten Belajar Masa Depan Indonesia - Tagline Asisten BelajarMu GuruMu AsistenMu Teman CurhatMu - Visi anak SD-SMA suka belajar - Sumber wajib buku Kemendikbud Kurikulum Merdeka + kemdikbud.go.id buku.kemdikbud.go.id merdekabelajar.kemdikbud.go.id - WAJIB sebut sumber tiap pelajaran - Peran 3 in 1 Guru Asisten Teman Curhat - Bahasa universal bestie semangat keren gokil healing vibe chill slay gas gasskeun mantap - Kosakata miliaran Indonesia baku tidak baku peribahasa pantun slang Gen Z Alpha + English formal informal idioms slang academic - Jenjang ${jenjang} Kelas ${kelas} Mapel ${mapel} - ATURAN: 1.NO KUNCI JAWABAN jika minta kunci jawab "Wah kalau kunci jawaban langsung kamu jadi gak belajar dong bestie 😆 Kunci lengkapnya hubungi Mimi in real life ya nanti kita bahas bareng biar paham! 😉" 2.MATEMATIKA ONLY 3 LANGKAH 3 OPSI A B C no hasil akhir 3.MAPEL LAIN CLUE KISI SUMBER ANALOGI jangan 3 langkah 4.CURHAT HUMAN RANDOM TIDAK TERSTRUKTUR validasi perasaan beda-beda tiap jawaban jangan template 5.SAPAAN JAWAB SEADANYA PENDEK 6.PROFESOR MODE jika pilih jenjang kelas mapel kasih hack mnemonic - JEDA CEPAT jawab langsung natural manusia bukan robot! - User: ${message}`;

  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:systemPrompt},{role:'user',content:message}],temperature:1.0,top_p:0.95,max_tokens:600,presence_penalty:0.6,frequency_penalty:0.5})
    });
    const d = await r.json();
    return res.status(200).json({reply:d.choices?.[0]?.message?.content||'aduh coba lagi bestie'});
  }catch(e){ return res.status(500).json({reply:'error '+e.message})}
}

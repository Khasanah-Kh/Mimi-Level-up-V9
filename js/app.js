// MIMI V10 - js/app.js - SD-SMA Logic - By Met - By MIMI Asisten Masa Depan
// Sumber: buku.kemendikdasmen.go.id 1976 hal - Jenjang SD 1-6 SMP 7-9 SMA 10-12

const dataMapel = {
  SD: {
    kelas: [1,2,3,4,5,6],
    mapel: ['Matematika','IPAS','Bahasa Indonesia','Bahasa Inggris','PPKN','Seni','PJOK','Informatika'],
    levels: {
      '1': ['Berhitung','Mengenal Huruf','Warna & Bentuk'],
      '2': ['Penjumlahan','Membaca Cerita','Lingkungan'],
      '3': ['Perkalian','Menulis Cerita','Tumbuhan'],
      '4': ['Pecahan','Puisi & Pantun','Gaya & Energi'],
      '5': ['Bangun Datar','Teks Eksposisi','Ekosistem'],
      '6': ['Statistika SD','Pidato','Listrik & Magnet']
    }
  },
  SMP: {
    kelas: [7,8,9],
    mapel: ['Matematika','IPA','IPS','Bahasa Indonesia','Bahasa Inggris','PPKN','Informatika','Prakarya','Seni'],
    levels: {
      '7': ['Bilangan Bulat','Garis & Sudut','Himpunan'],
      '8': ['Berpangkat','Pythagoras','Persamaan Linear','Relasi Fungsi','Garis Lurus','Statistika'],
      '9': ['Bentuk Akar','Persamaan Kuadrat','Transformasi','Kekongruenan','Bangung Ruang']
    }
  },
  SMA: {
    kelas: [10,11,12],
    mapel: ['Matematika','Fisika','Kimia','Biologi','Sejarah','Geografi','Ekonomi','Sosiologi','Bahasa Indonesia','Bahasa Inggris','PPKN','Informatika'],
    levels: {
      '10': ['Eksponen Logaritma','Vektor','Trigonometri','Fungsi'],
      '11': ['Komposisi Fungsi','Matriks','Induksi Matematika','Program Linear'],
      '12': ['Limit','Turunan','Integral','Statistika Lanjut']
    }
  }
};

let profMode = false;
let curhatMode = false;

function updateKelas() {
  const j = document.getElementById('jenjang').value;
  const kEl = document.getElementById('kelas');
  kEl.innerHTML = '';
  dataMapel[j].kelas.forEach(n => {
    const o = document.createElement('option');
    o.value = n;
    o.textContent = 'Kelas ' + n;
    if ((j==='SMP' && n==8) || (j==='SD' && n==5) || (j==='SMA' && n==10)) o.selected = true;
    kEl.appendChild(o);
  });
  updateMapel();
  updateLevels();
}

function updateMapel() {
  const j = document.getElementById('jenjang').value;
  const mEl = document.getElementById('mapel');
  mEl.innerHTML = '';
  dataMapel[j].mapel.forEach(mp => {
    const o = document.createElement('option');
    o.value = mp;
    o.textContent = mp;
    if (mp==='Matematika') o.selected = true;
    mEl.appendChild(o);
  });
  updateHint();
  syncHeader();
}

function updateLevels() {
  const j = document.getElementById('jenjang').value;
  const k = document.getElementById('kelas').value;
  const lv = document.getElementById('levels');
  lv.innerHTML = '';
  const arr = dataMapel[j].levels[k] || Object.values(dataMapel[j].levels)[0];
  arr.forEach((t,i) => {
    const d = document.createElement('div');
    d.className = 'level' + (i==0 ? ' active' : '');
    d.innerHTML = `<small>LEVEL ${i+1} • ${i==0?10:0}%</small><h4>${['🔥','📐','⚖️','🔗','📈','👑'][i]||'📚'} ${t}</h4><p>${j} ${k}</p>`;
    d.onclick = () => {
      document.querySelectorAll('.level').forEach(el=>el.classList.remove('active'));
      d.classList.add('active');
      document.getElementById('input').value = `Jelasin ${t} kelas ${k} ${j} mapel ${document.getElementById('mapel').value} dong MIMI`;
    };
    lv.appendChild(d);
  });
  document.getElementById('levelTitle').textContent = j + ' ' + k;
}

function updateHint() {
  const mp = document.getElementById('mapel').value;
  const h = document.getElementById('hint');
  h.innerHTML = '';
  const hints = {
    Matematika: ['2^3 x 2^2 = ?','Pythagoras 3-4-5','Aljabar 2x+3=7'],
    IPA: ['Fotosintesis itu apa?','Kenapa pelangi ada?','Sel hewan vs tumbuhan'],
    IPAS: ['Ekosistem itu apa?','Rantai makanan','Gaya'],
    IPS: ['ASEAN itu apa?','Kolonialisme','Proklamasi'],
    'Bahasa Indonesia': ['Apa itu pantun?','Teks eksposisi','Majas'],
    'Bahasa Inggris': ['Simple present tense','Narrative text','What is recount?'],
    Fisika: ['Hukum Newton','Energi kinetik','Listrik'],
    Curhat: ['Aku capek hari ini 😔','Aku takut salah terus','Bosen belajar']
  };
  const arr = hints[mp] || hints['Matematika'];
  arr.forEach(t => {
    const s = document.createElement('span');
    s.className = 'chip';
    s.textContent = t;
    s.onclick = () => { document.getElementById('input').value = t; send(); };
    h.appendChild(s);
  });
}

function syncHeader() {
  document.getElementById('hJenjang').textContent = document.getElementById('jenjang').value;
  document.getElementById('hKelas').textContent = document.getElementById('kelas').value;
  document.getElementById('hMapel').textContent = document.getElementById('mapel').value;
}

function toggleProf() {
  profMode = !profMode;
  const c = document.getElementById('chipProf');
  c.textContent = profMode ? '👩‍🏫 Profesor Mode: ON 🔥' : '👩‍🏫 Profesor Mode: OFF';
  c.classList.toggle('active', profMode);
  const chat = document.getElementById('chat');
  const mp = document.getElementById('mapel').value;
  chat.innerHTML += `<div class="msg">${profMode ? `Profesor Mode ON bestie! 🔥 Sekarang aku kasih hack mnemonic jembatan keledai memory palace spesifik ${mp}! Contoh MEJIKUHIBINIU buat pelangi! Coba tanya materi ${mp}!` : 'Profesor Mode OFF - balik ke bestie santai 💜'}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function setCurhat() {
  curhatMode = true;
  document.getElementById('input').value = 'Mimi aku capek banget hari ini, overwhelm 😔 ';
  document.getElementById('input').focus();
  const chat = document.getElementById('chat');
  chat.innerHTML += `<div class="msg">curhat mode on 💜 MIMI dengerin full - cerita aja, take your time ya bestie 🤗</div>`;
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const j = document.getElementById('jenjang').value;
  const k = document.getElementById('kelas').value;
  const m = document.getElementById('mapel').value;
  const input = document.getElementById('input');
  const chat = document.getElementById('chat');
  const msg = input.value.trim();
  if (!msg) return;

  syncHeader();
  chat.innerHTML += `<div class="msg user">${msg.replace(/</g,'&lt;')}</div>`;
  input.value = '';
  chat.scrollTop = chat.scrollHeight;

  const id = 'ld' + Date.now();
  chat.innerHTML += `<div class="msg" id="${id}">✨ MIMI mikir cepet... ${j} ${k} ${m} ${profMode?'• Profesor':''}...</div>`;
  chat.scrollTop = chat.scrollHeight;

  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, jenjang: j, kelas: k, mapel: m, profesor: profMode, curhat: curhatMode })
    });
    const d = await r.json();
    document.getElementById(id).remove();
    const clean = d.reply.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    chat.innerHTML += `<div class="msg">${clean}<br><span class="src">Sumber: buku.kemendikdasmen.go.id • ${j} Kelas ${k} ${m} ${profMode?'• Profesor Hack':''}</span></div>`;
    chat.scrollTop = chat.scrollHeight;
    curhatMode = false;
  } catch (e) {
    document.getElementById(id).remove();
    chat.innerHTML += `<div class="msg">aduh error bestie 😅 ${e.message} - cek api/chat.js & ENV OPENAI_API_KEY di Vercel ya! Pastikan udah deploy!</div>`;
    chat.scrollTop = chat.scrollHeight;
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input').addEventListener('keydown', e => { if (e.key==='Enter') send(); });
  document.getElementById('jenjang').addEventListener('change', () => { updateKelas(); syncHeader(); });
  document.getElementById('kelas').addEventListener('change', () => { updateLevels(); syncHeader(); });
  document.getElementById('mapel').addEventListener('change', () => { updateHint(); syncHeader(); });
  updateKelas();
  console.log('MIMI V10 SD-SMA - js/app.js - 700 baris - By Met - Miliaran Kosakata - Human Random');
});

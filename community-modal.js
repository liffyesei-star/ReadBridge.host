/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
// JavaScript terpusat untuk Fitur Modal Diskusi dan Feed Komunitas

const STORAGE_KEY = 'readbridge_community_posts_v2';
const DRAFT_KEY   = 'readbridge_draft';

window.activeFeedTab = 'Semua';
window.activeTrendingTag = 'Semua';

const TOPIC_DETAILS = {
  '#UTBK2024': {
    title: '#UTBK2024',
    stats: '5.4k Postingan • Sangat Populer 🔥',
    desc: 'Topik seputar persiapan ujian masuk perguruan tinggi negeri tahun 2024. Berisi latihan soal, informasi jadwal, tips belajar mandiri, dan sharing seputar jurusan impian.'
  },
  '#UTBK': {
    title: '#UTBK',
    stats: '4.8k Postingan • Populer 🔥',
    desc: 'Semua hal seputar UTBK SNBT, materi tes potensi kognitif, penalaran matematika, dan literasi bahasa.'
  },
  '#ReviewBuku': {
    title: '#ReviewBuku',
    stats: '3.2k Postingan • Populer 🔥',
    desc: 'Ulasan jujur, rekomendasi, dan bedah isi buku fiksi maupun non-fiksi oleh anggota komunitas.'
  },
  '#FiksiRemaja': {
    title: '#FiksiRemaja',
    stats: '1.8k Postingan • Menanjak 📈',
    desc: 'Kumpulan diskusi seputar cerita romansa remaja, novel fiksi sekolah, dan persahabatan.'
  },
  '#Fiksi': {
    title: '#Fiksi',
    stats: '2.5k Postingan • Populer 🔥',
    desc: 'Diskusi novel fantasi, sci-fi, fiksi sejarah, dan karya-karya fiksi imajinatif lainnya.'
  },
  '#Sastra': {
    title: '#Sastra',
    stats: '1.5k Postingan • Menanjak 📈',
    desc: 'Apresiasi puisi, prosa klasik, novel sastra pemenang penghargaan, dan analisis gaya kepenulisan.'
  }
};

// Seed data
const defaultPosts = [
  // PECINTA FIKSI POSTS
  { id:'fiksi-1', username:'@SastraWangi', isCurrentUser:false, waktu:'2 jam yang lalu',
    judul:'Rekomendasi novel fiksi sejarah Indonesia yang wajib dibaca sebelum lulus SMA?',
    isi:'Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.',
    tags:['#Fiksi','#Sejarah'], votes:1200, komentar:2, destination: 'Pecinta Fiksi',
    commentsList: [
      { username: '@KutuBuku', text: 'Bumi Manusia karya Pramoedya Ananta Toer wajib banget!', waktu: '1 jam yang lalu' },
      { username: '@PecintaSastra', text: 'Laut Bercerita juga bagus banget kak.', waktu: '30 menit yang lalu' }
    ]
  },
  { id:'fiksi-2', username:'@BookNerd', isCurrentUser:false, waktu:'4 jam yang lalu',
    judul:'Review buku Cantik Itu Luka karya Eka Kurniawan. Ada yang udah baca?',
    isi:'Baru selesai baca semalem dan mindblowing banget! Alurnya maju mundur tapi gak bikin bingung. Tokoh Dewi Ayu bener-bener ikonik. Ada yang mau bahas endingnya?',
    tags:['#ReviewBuku','#Sastra'], votes:890, komentar:1, destination: 'Pecinta Fiksi',
    commentsList: [
      { username: '@PecintaSastra', text: 'Masterpiece sih itu! Realisme magisnya kerasa banget.', waktu: '2 jam yang lalu' }
    ]
  },
  { id:'fiksi-3', username:'@HujanBulanJuni', isCurrentUser:false, waktu:'1 hari yang lalu',
    judul:'Diskusi: Kenapa ending novel "Hujan" karya Tere Liye bikin nyesek?',
    isi:'Udah baca Hujan berkali-kali tapi tetep aja mewek di akhir. Menurut kalian keputusan Lail buat hapus ingatan itu egois ga sih?',
    tags:['#TereLiye','#DiskusiFiksi'], votes:2100, komentar:0, destination: 'Pecinta Fiksi',
    commentsList: []
  },
  { id:'fiksi-4', username:'@TokyoReader', isCurrentUser:false, waktu:'2 hari yang lalu',
    judul:'Nyari teman baca bareng (buddy read) buku-buku Haruki Murakami',
    isi:'Lagi pengen maraton baca Norwegian Wood sama Kafka on the Shore. Ada yang mau join buddy read biar bisa diskusi bareng tiap minggunya?',
    tags:['#BuddyRead','#Murakami'], votes:450, komentar:0, destination: 'Pecinta Fiksi',
    commentsList: []
  },
  { id:'fiksi-5', username:'@PenaSenja', isCurrentUser:false, waktu:'3 hari yang lalu',
    judul:'Puisi vs Prosa, kalian lebih suka baca yang mana saat lagi galau?',
    isi:'Biasanya pelarian kalau lagi sedih pada baca puisi yang singkat tapi ngena, atau tenggelam di cerita prosa yang panjang?',
    tags:['#Puisi','#Prosa'], votes:1500, komentar:0, destination: 'Pecinta Fiksi',
    commentsList: []
  },

  // PEJUANG SNBT POSTS
  { id:'snbt-1', username:'@PejuangKampus', isCurrentUser:false, waktu:'5 jam yang lalu',
    judul:'Tips jitu ningkatin nilai TryOut UTBK Literasi Bahasa Indonesia!',
    isi:'Gais, share dong tips kalian buat ngerjain soal PBM sama PPU. Nilai TO ku stuck terus di 500-an.',
    tags:['#UTBK','#TipsBelajar'], votes:850, komentar:1, destination: 'Pejuang SNBT',
    commentsList: [
      { username: '@AnakRajin', text: 'Banyakin baca artikel opini aja kak, biar terbiasa baca teks panjang.', waktu: '2 jam yang lalu' }
    ]
  },
  { id:'snbt-2', username:'@MathGenius', isCurrentUser:false, waktu:'6 jam yang lalu',
    judul:'Soal PK (Pengetahuan Kuantitatif) tahun lalu susah banget, ada bocoran materi yang sering keluar?',
    isi:'Aku denger-denger matriks sama peluang selalu keluar tiap tahun. Bener ga sih? Ada yang punya rekapan materi PK yang wajib dikuasain?',
    tags:['#PK','#Matematika'], votes:1120, komentar:0, destination: 'Pejuang SNBT',
    commentsList: []
  },
  { id:'snbt-3', username:'@CalonMaba', isCurrentUser:false, waktu:'12 jam yang lalu',
    judul:'Strategi memilih jurusan di SNBT 2024 biar ga salah langkah',
    isi:'Masih bingung nentuin pilihan 1 sama pilihan 2. Lebih baik pilih jurusan impian di PTN top untuk pilihan 1, terus pilihan 2 yang realistis, atau gimana ya strateginya?',
    tags:['#Strategi','#PilihJurusan'], votes:3400, komentar:2, destination: 'Pejuang SNBT',
    commentsList: [
      { username: '@SiswaIndonesia', text: 'Saran aku pilihan 1 harus yang paling kamu pengen, pilihan 2 yang peluang masuknya lebih gede buat cadangan.', waktu: '10 jam yang lalu' },
      { username: '@AlumniSukses', text: 'Betul, pastikan passing grade pilihan 2 di bawah pilihan 1 ya.', waktu: '8 jam yang lalu' }
    ]
  },
  { id:'snbt-4', username:'@Ambiskuh', isCurrentUser:false, waktu:'1 hari yang lalu',
    judul:'Minta rekomendasi channel YouTube buat belajar Penalaran Matematika dong',
    isi:'Lagi butuh banget referensi buat belajar PM dari nol. Kadang ngerasa basic math-nya masih kurang kuat. Kasih tau channel favorit kalian!',
    tags:['#Rekomendasi','#PM'], votes:670, komentar:0, destination: 'Pejuang SNBT',
    commentsList: []
  },
  { id:'snbt-5', username:'@TukangOverthinking', isCurrentUser:false, waktu:'2 hari yang lalu',
    judul:'H-30 UTBK, mental mulai down. Gimana cara kalian jaga motivasi belajar?',
    isi:'Makin deket hari H malah makin males belajar dan overthinking takut ga lolos. Kalian biasanya ngapain kalau lagi di fase burnout gini?',
    tags:['#MentalHealth','#Motivasi'], votes:4200, komentar:0, destination: 'Pejuang SNBT',
    commentsList: []
  },
  {
    id: 'snbt-tutor-1',
    username: '@PakAgusPratama',
    role: 'Master Tutor',
    isCurrentUser: false,
    waktu: '1 jam yang lalu',
    judul: '🔥 [Eksklusif] Rangkuman Literasi Bahasa Indonesia & Bocoran Soal HOTS SNBT 2024',
    isi: 'Halo para pejuang SNBT 2024! Sebagai tutor literasi kalian di ReadBridge, bapak membagikan rangkuman materi penting serta latihan soal HOTS Literasi Bahasa Indonesia yang sering keluar di tryout maupun UTBK asli. Silakan unduh PDF-nya di bawah ini untuk belajar mandiri. Tetap semangat, masa depan menanti kalian di PTN impian!',
    tags: ['#UTBK', '#LiterasiIndo', '#TryoutSNBT'],
    votes: 4520,
    komentar: 3,
    destination: 'Pejuang SNBT',
    attachment: {
      name: 'Rangkuman_Lit_Indo_SNBT.pdf',
      size: '2.4 MB',
      type: 'Dokumen PDF',
      url: 'Rangkuman_Lit_Indo_SNBT.html'
    },
    commentsList: [
      { username: '@SiswaIndonesia', text: 'Wah makasih banyak Pak Agus! Rangkumannya lengkap banget, ngebantu buat review cepat sebelum TO besok.', waktu: '30 menit yang lalu' },
      { username: '@Ambiskuh', text: 'Keren bapak, latihan soal HOTS-nya ada pembahasannya juga! Izin unduh ya Pak.', waktu: '20 menit yang lalu' },
      { username: '@CalonMaba', text: 'Terima kasih banyak pak, semoga jadi amal jariyah 🙏', waktu: '10 menit yang lalu' }
    ]
  }
];

window.openAttachment = function(url, autoDownload) {
  if (autoDownload) {
    window.open(url + '?download=1', '_blank');
  } else {
    window.open(url, '_blank');
  }
};

let apiPosts = [];
let apiPostsFetched = false;

window.fetchPostsFromAPI = async function() {
  try {
    const token = localStorage.getItem('rb_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    // Add sorting parameter based on active tab
    const sortParam = (window.activeFeedTab === 'Trending') ? 'terpopuler' : 'terbaru';
    const res = await fetch(`https://readbridge-backend-2whx.onrender.com/api/community/diskusi?sort=${sortParam}`, { headers });
    const json = await res.json();
    if (json.success && json.data) {
      apiPosts = json.data.map(d => ({
        id: d.id,
        username: d.nama_user || 'Anonim',
        avatar: d.foto_profil,
        isCurrentUser: d.user_id == localStorage.getItem('rb_uid') || false,
        waktu: d.created_at,
        judul: d.judul,
        isi: d.konten,
        tags: [],
        votes: d.total_likes,
        komentar: d.total_balasan,
        destination: d.club_id ? 'Club' : 'Public Feed',
        commentsList: []
      }));
      apiPostsFetched = true;
    }
  } catch(e) {
    console.error(e);
  }
}

function getPosts(){
  if (!apiPostsFetched) return [];
  return apiPosts;
}

function savePosts(p){ 
  // No longer used for saving to localStorage, but we keep it to update local cache
  apiPosts = p;
}
function formatVotes(n){ return n>=1000?(n/1000).toFixed(1).replace('.0','')+'k':String(n); }
function formatWaktu(s){
  if(!s||s.includes('jam')||s.includes('hari')) return s;
  const d=Date.now()-new Date(s).getTime(), m=Math.floor(d/60000), h=Math.floor(d/3600000), dy=Math.floor(d/86400000);
  if(m<1)return'Baru saja'; if(h<1)return`${m} menit yang lalu`; if(dy<1)return`${h} jam yang lalu`; return`${dy} hari yang lalu`;
}
function getAvatarForUser(u){
  if(u==='@SiswaIndonesia') return"https://lh3.googleusercontent.com/aida-public/AB6AXuBPWVVaGXkWQMBFLEpn-ySDPe0WKEHOcwl3-OYRAtEikh9crzUun0qzUObSdGEHcwvyc9jFEAKphqQYxPEF9eMC8210T0_jOuDtMLTPukgg3X-9OTaAg4uNqzd-daKojg_muON5j9-f8PktO1QuJ2ZZvMj_rRpSkPkMgO8kDbq4mh_-TUjzZjgOpSVcYmdxgdhYj3iSrmcEISU8czkDBS4sF8INQet-of3Y1HG2QqWAKwfvS0FNmOGGbu9A8s8TO9MszaYnlZjY5F4";
  return`https://api.dicebear.com/9.x/avataaars/svg?seed=${u.replace('@','')}&backgroundColor=e5eeff`;
}

function renderPostCard(p){
  const tags=(p.tags||[]).map(t=>`<span onclick="window.showTrendingTopicDetail('${t}')" class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm cursor-pointer hover:bg-primary hover:text-on-primary transition-colors">${t}</span>`).join('');
  const badge = p.isCurrentUser
    ? `<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2 tracking-wider">Anda Author</span>`
    : (p.role
        ? `<span class="bg-primary-container text-on-primary-container text-[10px] font-bold px-2.5 py-0.5 rounded-full ml-2 tracking-wider inline-flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px] font-bold">verified</span>${p.role}</span>`
        : `<span class="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2 tracking-wider">Author</span>`
      );
  const trendingBadge = (window.activeFeedTab === 'Trending')
    ? `<span class="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2 tracking-wider flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px] animate-pulse">local_fire_department</span>Trending</span>`
    : '';
  const avatar=p.avatar||getAvatarForUser(p.username);
  const destBadge = p.destination ? `<span class="text-on-surface-variant/50 mx-2">•</span><span class="text-primary font-bold text-[11px] uppercase tracking-wider">${p.destination}</span>` : '';
  const editedBadge = p.isEdited ? `<span class="text-on-surface-variant/60 text-[11px] ml-2 italic">(Telah diedit)</span>` : '';
  
  let pollHTML = '';
  if (p.poll && p.poll.length > 0) {
    const isLegacy = typeof p.poll[0] === 'string';
    const pollData = isLegacy ? p.poll.map(opt => ({ text: opt, count: 0, votedBy: [] })) : p.poll;
    const hasVoted = pollData.some(opt => opt.votedBy.includes(CURRENT_USER_PROFILE));
    const totalVotes = pollData.reduce((sum, opt) => sum + opt.count, 0);
    
    pollHTML = '<div class="mt-3 flex flex-col gap-2">';
    if (hasVoted) {
      pollHTML += pollData.map((opt) => {
        const percent = totalVotes > 0 ? Math.round((opt.count / totalVotes) * 100) : 0;
        const isMyVote = opt.votedBy.includes(CURRENT_USER_PROFILE);
        return `
          <div class="relative w-full bg-surface-container-lowest rounded-lg border ${isMyVote ? 'border-primary' : 'border-outline-variant/30'} overflow-hidden">
            <div class="absolute top-0 left-0 bottom-0 bg-primary/20 transition-all duration-1000" style="width: ${percent}%;"></div>
            <div class="relative px-3 py-2 flex justify-between items-center z-10 text-[14px]">
              <span class="font-semibold ${isMyVote ? 'text-primary' : 'text-on-surface'}">${opt.text} ${isMyVote ? '<span class="material-symbols-outlined text-[14px] align-middle ml-1">check_circle</span>' : ''}</span>
              <span class="font-bold text-on-surface-variant">${percent}%</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      pollHTML += pollData.map((opt, i) => `
        <div class="flex items-center gap-2">
          <input type="radio" name="poll-${p.id}" id="poll-${p.id}-${i}" onchange="window.submitPollVote('${p.id}', ${i})" class="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant focus:ring-primary focus:ring-2 cursor-pointer">
          <label for="poll-${p.id}-${i}" class="text-on-surface text-[14px] flex-1 bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer">${opt.text}</label>
        </div>
      `).join('');
    }
    pollHTML += `<p class="text-on-surface-variant/60 text-[12px] ml-1 mt-1">${totalVotes} suara</p></div>`;
  }

  let attachmentHTML = '';
  if (p.attachment) {
    attachmentHTML = `
      <div class="mt-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between hover:bg-surface-container/60 transition-all cursor-pointer group" onclick="window.openAttachment('${p.attachment.url}', true)">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
          <div class="text-left">
            <h4 class="font-bold text-on-surface text-sm group-hover:text-primary transition-colors flex items-center gap-1">
              ${p.attachment.name}
              <span class="bg-green-500/10 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Ready to Download</span>
            </h4>
            <p class="text-xs text-on-surface-variant/80">${p.attachment.size} • ${p.attachment.type}</p>
          </div>
        </div>
        <button onclick="event.stopPropagation(); window.openAttachment('${p.attachment.url}', true)" class="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-full hover:bg-primary/95 transition-all shadow-sm">
          <span class="material-symbols-outlined text-[16px]">download</span> Unduh
        </button>
      </div>
    `;
  }

  const isTrending = (window.activeFeedTab === 'Trending');
  return`<article data-post-id="${p.id}" class="bg-surface-container-lowest rounded-2xl p-lg flex flex-col gap-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-outline-variant/20 hover:-translate-y-0.5 ${isTrending ? 'border-l-4 border-l-amber-500/85 bg-gradient-to-r from-amber-500/[0.01] to-transparent' : ''}">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm">
        <img src="${avatar}" alt="${p.username}" class="w-10 h-10 rounded-full object-cover border border-outline-variant/50 bg-surface-container-high"/>
        <div class="flex flex-col"><div class="flex items-center"><span class="font-bold text-on-surface text-label-md">${p.username}</span>${badge}${trendingBadge}${destBadge}</div><span class="text-on-surface-variant/80">${formatWaktu(p.waktu)}${editedBadge}</span></div>
      </div>
      <div class="relative">
        <button onclick="window.togglePostMenu(event, '${p.id}')" class="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors"><span class="material-symbols-outlined">more_horiz</span></button>
        <div id="post-menu-${p.id}" class="hidden absolute right-0 top-full mt-1 bg-white border border-outline-variant/30 rounded-xl shadow-lg w-40 z-10 flex-col py-1 overflow-hidden">
          ${p.isCurrentUser 
            ? `<button class="text-left px-4 py-2 hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">share</span> Bagikan</button>
               <button onclick="window.editPost('${p.id}')" class="text-left px-4 py-2 hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center gap-2 w-full"><span class="material-symbols-outlined text-[18px]">edit</span> Edit</button>
               <button onclick="window.deletePost('${p.id}')" class="text-left px-4 py-2 hover:bg-red-50 text-error text-sm font-semibold flex items-center gap-2 w-full"><span class="material-symbols-outlined text-[18px]">delete</span> Hapus</button>`
            : `<button class="text-left px-4 py-2 hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">share</span> Bagikan</button>
               <button class="text-left px-4 py-2 hover:bg-surface-container text-on-surface text-sm font-semibold flex items-center gap-2 w-full"><span class="material-symbols-outlined text-[18px]">flag</span> Laporkan</button>`
          }
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <a href="detail-diskusi.html?id=${p.id}" class="group"><h2 class="font-title-lg text-title-lg text-on-surface font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer">${p.judul}</h2></a>
      <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">${p.isi}</p>
      ${pollHTML}
      ${attachmentHTML}
    </div>
    ${tags?`<div class="flex flex-wrap gap-2 mt-1">${tags}</div>`:''}
    <div class="flex gap-4 mt-2 pt-4 border-t border-outline-variant/30 text-on-surface-variant items-center justify-between">
      <div class="flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-1 border border-outline-variant/20">
        <button onclick="ubahVote('${p.id}',1)" class="hover:text-primary hover:bg-surface-container-high p-1.5 rounded-full transition-colors"><span class="material-symbols-outlined text-[20px]">arrow_upward</span></button>
        <span id="vote-${p.id}" class="font-label-md text-label-md font-bold px-2 text-on-surface">${formatVotes(p.votes)}</span>
        <button onclick="ubahVote('${p.id}',-1)" class="hover:text-error hover:bg-surface-container-high p-1.5 rounded-full transition-colors"><span class="material-symbols-outlined text-[20px]">arrow_downward</span></button>
      </div>
      <div class="flex gap-2">
        <button onclick="window.toggleComments('${p.id}')" class="flex items-center gap-sm hover:bg-surface-container-low px-4 py-2 rounded-full transition-colors font-label-md text-label-md text-on-surface"><span class="material-symbols-outlined text-[20px]">chat_bubble</span> <span id="komentar-count-${p.id}">${p.komentar}</span></button>
        <button class="flex items-center gap-sm hover:bg-surface-container-low px-4 py-2 rounded-full transition-colors font-label-md text-label-md text-on-surface"><span class="material-symbols-outlined text-[20px]">bookmark</span> Simpan</button>
      </div>
    </div>
    
    <!-- Comments Section -->
    <div id="comments-section-${p.id}" class="hidden flex-col gap-4 mt-4 pt-4 border-t border-outline-variant/30">
      <div id="comments-list-${p.id}" class="flex flex-col gap-3">
        ${(p.commentsList||[]).map(c => {
          let cBadge = '';
          if (c.username === p.username && c.username === CURRENT_USER_PROFILE) cBadge = `<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 tracking-wider">Anda Author</span>`;
          else if (c.username === p.username) cBadge = `<span class="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 tracking-wider">Author</span>`;
          else if (c.username === CURRENT_USER_PROFILE) cBadge = `<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 tracking-wider">Anda</span>`;
          
          return `
          <div class="flex gap-3 text-sm">
            <img src="${c.avatar || getAvatarForUser(c.username)}" alt="${c.username}" class="w-8 h-8 rounded-full border border-outline-variant/50 bg-surface-container-high"/>
            <div class="bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-2xl rounded-tl-none flex-1 shadow-sm">
              <div class="flex items-center gap-2 mb-1"><span class="font-bold text-on-surface text-[13px]">${c.username}</span>${cBadge}<span class="text-on-surface-variant/60 text-[11px]">${formatWaktu(c.waktu)}</span></div>
              <p class="text-on-surface-variant text-[14px] leading-relaxed">${c.text}</p>
            </div>
          </div>
        `}).join('')}
      </div>
      <div class="flex gap-3 items-center mt-2">
        <img src="${getAvatarForUser('@SiswaIndonesia')}" alt="User" class="w-8 h-8 rounded-full border border-outline-variant/50"/>
        <div class="flex-1 relative">
          <input type="text" id="input-comment-${p.id}" placeholder="Tulis komentar..." class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2.5 text-[14px] focus:ring-1 focus:ring-primary focus:border-primary outline-none pr-12 transition-all" onkeypress="if(event.key==='Enter') window.addComment('${p.id}')"/>
          <button onclick="window.addComment('${p.id}')" class="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  </article>`;
}

async function renderAllPosts(){
  const feed=document.getElementById('community-feed');
  if(!feed) return;
  
  if (!apiPostsFetched) {
     feed.innerHTML = '<p class="text-center py-8 text-on-surface-variant font-label-md animate-pulse">Memuat diskusi dari server...</p>';
     await window.fetchPostsFromAPI();
  }

  // Ambil tipe halaman (Public Feed, Pejuang SNBT, Pecinta Fiksi)
  let currentPageFilter = null;
  if (document.title.includes('Klub Pejuang SNBT')) currentPageFilter = 'Pejuang SNBT';
  else if (document.title.includes('Klub Pecinta Fiksi')) currentPageFilter = 'Pecinta Fiksi';

  let postsList = getPosts();
  
  // Filter by Page/Club
  if (currentPageFilter) {
    postsList = postsList.filter(p => p.destination === currentPageFilter);
  }
  
  // Jika tab Trending aktif
  if (window.activeFeedTab === 'Trending') {
    // Filter berdasarkan Kategori (jika ada tag terpilih)
    if (window.activeTrendingTag && window.activeTrendingTag !== 'Semua') {
      postsList = postsList.filter(p => (p.tags || []).some(t => t.toLowerCase() === window.activeTrendingTag.toLowerCase()));
    }
  }

  feed.innerHTML = postsList.length > 0 
    ? postsList.map(renderPostCard).join('') 
    : '<p class="text-center text-on-surface-variant font-label-md py-8">Belum ada diskusi di sini. Jadilah yang pertama!</p>';
}

window.ubahVote = async function(id,delta){
  const token = localStorage.getItem('rb_token');
  if (!token) {
    alert("Silakan login untuk memberikan like/vote");
    window.location.href = 'login.html';
    return;
  }
  try {
    const res = await fetch(`https://readbridge-backend-2whx.onrender.com/api/community/diskusi/${id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const posts=getPosts(), p=posts.find(x=>x.id===id);
      if(p){ 
         p.votes=Math.max(0,(p.votes||0)+delta); 
         const el=document.getElementById(`vote-${id}`); if(el)el.textContent=formatVotes(p.votes); 
      }
    }
  } catch(e) {
    console.error("Gagal like", e);
  }
}

window.togglePostMenu = function(e, id) {
  e.stopPropagation();
  const menus = document.querySelectorAll('[id^="post-menu-"]');
  menus.forEach(m => {
    if (m.id !== `post-menu-${id}`) {
      m.classList.add('hidden');
      m.classList.remove('flex');
    }
  });
  const menu = document.getElementById(`post-menu-${id}`);
  if (menu) {
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) menu.classList.add('flex');
    else menu.classList.remove('flex');
  }
};

window.deletePost = async function(id) {
  alert("Penghapusan postingan belum didukung di versi ini.");
};

// Global click to close post menus
document.addEventListener('click', () => {
  const menus = document.querySelectorAll('[id^="post-menu-"]');
  menus.forEach(m => {
    m.classList.add('hidden');
    m.classList.remove('flex');
  });
});

window.toggleComments = function(id) {
  const sec = document.getElementById(`comments-section-${id}`);
  if(sec) sec.classList.toggle('hidden');
  if(sec && !sec.classList.contains('hidden')) sec.classList.add('flex');
  else if(sec) sec.classList.remove('flex');
};

window.addComment = async function(id) {
  const input = document.getElementById(`input-comment-${id}`);
  const text = input.value.trim();
  if(!text) return;

  const token = localStorage.getItem('rb_token');
  if (!token) {
    alert("Silakan login untuk membalas");
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`https://readbridge-backend-2whx.onrender.com/api/community/diskusi/${id}/balasan`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ konten: text })
    });
    
    if (res.ok) {
      const posts = getPosts();
      const p = posts.find(x => x.id === id);
      if(p) {
        p.commentsList = p.commentsList || [];
        p.commentsList.push({ username: CURRENT_USER_PROFILE, text, waktu: new Date().toISOString() });
        p.komentar = (p.komentar || 0) + 1;

        const isPostAuthor = (CURRENT_USER_PROFILE === p.username);
        const newBadge = isPostAuthor 
          ? `<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 tracking-wider">Anda Author</span>` 
          : `<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 tracking-wider">Anda</span>`;

        // Update UI directly for seamless experience
        const list = document.getElementById(`comments-list-${id}`);
        if(list) {
          list.insertAdjacentHTML('beforeend', `
            <div class="flex gap-3 text-sm">
              <img src="${getAvatarForUser(CURRENT_USER_PROFILE)}" alt="${CURRENT_USER_PROFILE}" class="w-8 h-8 rounded-full border border-outline-variant/50 bg-surface-container-high"/>
              <div class="bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-2xl rounded-tl-none flex-1 shadow-sm">
                <div class="flex items-center gap-2 mb-1"><span class="font-bold text-on-surface text-[13px]">${CURRENT_USER_PROFILE}</span>${newBadge}<span class="text-on-surface-variant/60 text-[11px]">Baru saja</span></div>
                <p class="text-on-surface-variant text-[14px] leading-relaxed">${text}</p>
              </div>
            </div>
          `);
        }
        const countEl = document.getElementById(`komentar-count-${id}`);
        if(countEl) countEl.textContent = p.komentar;
        input.value = '';
      }
    } else {
      alert("Gagal menambahkan komentar.");
    }
  } catch(e) {
    console.error(e);
  }
};

const JOINED_CLUBS = [
  { name: 'Pejuang SNBT', icon: 'school', link: 'club.html', notifications: 3 },
  { name: 'Pecinta Fiksi', icon: 'menu_book', link: 'club-pecinta-fiksi.html', notifications: 0 }
];

function renderJoinedClubs() {
  const container = document.getElementById('joined-clubs-list');
  if(!container) return;
  container.innerHTML = JOINED_CLUBS.map(c => {
    const badge = c.notifications > 0 ? `<span class="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">${c.notifications}</span>` : '';
    const isActive = document.title.includes(c.name) ? 'bg-secondary-container text-on-secondary-container font-bold' : '';
    return `<a href="${c.link}" class="flex items-center gap-sm px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors font-label-md text-label-md group ${isActive}">
      <span class="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">${c.icon}</span> ${c.name} ${badge}
    </a>`;
  }).join('');
}

function renderActivityFeed() {
  const container = document.getElementById('activity-feed');
  if (!container) return;
  
  const posts = getPosts();
  let activities = [];
  
  posts.forEach(p => {
    if (p.isCurrentUser) {
      activities.push({
        type: 'post',
        waktu: p.waktu,
        html: `
          <div class="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-xl shadow-sm flex items-start gap-3">
            <span class="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">edit_document</span>
            <div>
              <p class="text-on-surface text-[14px]">Anda membuat diskusi baru: <span class="font-bold">"${p.judul}"</span></p>
              <p class="text-on-surface-variant/60 text-[12px] mt-1">${formatWaktu(p.waktu)}</p>
            </div>
          </div>
        `
      });
    }
    if (p.commentsList) {
      p.commentsList.forEach(c => {
        if (c.username === CURRENT_USER_PROFILE || c.username === '@SiswaIndonesia') {
          activities.push({
            type: 'comment',
            waktu: c.waktu,
            html: `
              <div class="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-xl shadow-sm flex items-start gap-3">
                <span class="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-full">chat_bubble</span>
                <div>
                  <p class="text-on-surface text-[14px]">Anda mengomentari diskusi <span class="font-bold line-clamp-1">"${p.judul}"</span></p>
                  <p class="text-on-surface-variant/80 text-[13px] bg-surface-container-low p-2 rounded mt-1 line-clamp-2 italic">"${c.text}"</p>
                  <p class="text-on-surface-variant/60 text-[12px] mt-1">${formatWaktu(c.waktu)}</p>
                </div>
              </div>
            `
          });
        }
      });
    }
  });

  if (activities.length === 0) {
    container.innerHTML = `<div class="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant/20 shadow-sm"><p class="text-on-surface-variant font-label-md text-center py-4">Belum ada aktivitas yang terekam.</p></div>`;
    return;
  }
  
  // Sort activities by reverse order to show newest (approximate)
  activities.reverse();
  container.innerHTML = activities.map(a => a.html).join('');
}

function setupTabs() {
  const tabs = document.querySelectorAll('.club-tab');
  if (tabs.length === 0) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all
      tabs.forEach(t => {
        t.classList.remove('font-bold', 'text-primary', 'border-b-2', 'border-primary');
        t.classList.add('text-on-surface-variant');
      });
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      
      // Activate clicked
      tab.classList.remove('text-on-surface-variant');
      tab.classList.add('font-bold', 'text-primary', 'border-b-2', 'border-primary');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.remove('hidden');
      
      // If it's aktivitas, render it
      if (tab.dataset.tab === 'aktivitas') {
        renderActivityFeed();
      }
    });
  });
}

// INJEKSI MODAL HTML KE DALAM BODY
document.addEventListener('DOMContentLoaded', () => {
  const modalHTML = `
  <div id="modal-diskusi" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
    <div id="modal-dialog" class="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden transition-all duration-300" style="max-height:92vh; height: auto;">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 cursor-move" id="modal-header-drag">
        <h2 class="font-bold text-[22px] text-slate-900 flex items-center gap-2">
          Buat Diskusi Baru
        </h2>
        <div class="flex items-center gap-1">
          <button id="modal-maximize-btn" title="Perbesar/Perkecil" class="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <span class="material-symbols-outlined text-[20px]">fullscreen</span>
          </button>
          <button id="modal-close-btn" class="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 custom-scrollbar">

        <!-- Kirim ke destination selector -->
        <div>
          <p class="text-slate-500 text-[13px] font-semibold mb-2">Kirim ke mana?</p>
          <div class="flex flex-wrap gap-2" id="destination-pills">
            <button data-dest="Public Feed" class="dest-pill flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary">
              <span class="material-symbols-outlined text-[16px]">public</span> Public Feed
            </button>
            <button data-dest="Pejuang SNBT" class="dest-pill flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary">
              <span class="material-symbols-outlined text-[16px]">school</span> Pejuang SNBT
            </button>
            <button data-dest="Pecinta Fiksi" class="dest-pill flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors bg-white text-slate-700 border-slate-200 hover:border-primary hover:text-primary">
              <span class="material-symbols-outlined text-[16px]">menu_book</span> Pecinta Fiksi
            </button>
          </div>
        </div>

        <!-- Title input -->
        <input id="input-judul" type="text" maxlength="120"
          placeholder="Judul Diskusi..."
          class="w-full text-[24px] font-bold text-slate-800 placeholder-slate-300 bg-transparent border-none outline-none resize-none leading-tight py-2 focus:ring-0 px-0"/>

        <!-- Rich Text Editor -->
        <div class="border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[200px]">
          <!-- Toolbar -->
          <div class="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
            <button id="fmt-bold" title="Bold" class="fmt-btn p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-600 font-bold text-sm w-8 h-8 flex items-center justify-center">B</button>
            <button id="fmt-italic" title="Italic" class="fmt-btn p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-600 italic text-sm w-8 h-8 flex items-center justify-center">I</button>
            <div class="w-px h-5 bg-slate-200 mx-1"></div>
            <button id="fmt-ul" title="Bullet List" class="fmt-btn p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-600 w-8 h-8 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
            <button id="fmt-ol" title="Numbered List" class="fmt-btn p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-600 w-8 h-8 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">format_list_numbered</span>
            </button>
            <div class="w-px h-5 bg-slate-200 mx-1"></div>
            <button id="fmt-quote" title="Blockquote" class="fmt-btn p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-600 w-8 h-8 flex items-center justify-center text-lg font-serif leading-none">"</button>
          </div>
          <!-- Content editable area -->
          <div id="editor-content" contenteditable="true"
            class="flex-1 px-4 py-4 text-slate-700 text-[15px] leading-relaxed outline-none bg-white focus:bg-blue-50/20 transition-colors min-h-[150px]"
            style="word-break:break-word;"
            data-placeholder="Apa yang ingin kamu bahas hari ini?"></div>
        </div>

        <!-- Tag input -->
        <div class="mt-2">
          <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tambahkan Tag</p>
          <div class="flex flex-wrap items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all bg-white">
            <span class="text-slate-400 text-[15px] font-bold">#</span>
            <input id="input-tag-new" type="text" placeholder="Ketik tag..."
              class="flex-1 min-w-[100px] outline-none text-[14px] text-slate-700 bg-transparent placeholder-slate-400 border-none focus:ring-0 p-0"/>
            <div id="tag-chips" class="flex flex-wrap gap-1.5"></div>
          </div>
        </div>

        <!-- Draft notification area -->
        <div id="draft-banner" class="hidden flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2 text-[13px] font-semibold mt-2">
          <span class="material-symbols-outlined text-[18px]">edit_note</span>
          <span>Draft tersimpan · <button id="btn-load-draft" class="underline hover:no-underline">Muat kembali</button></span>
          <button id="btn-delete-draft" class="ml-auto hover:text-amber-900 transition-colors"><span class="material-symbols-outlined text-[16px]">close</span></button>
        </div>

        <p id="form-error" class="text-red-500 text-[13px] font-semibold hidden">Judul dan isi diskusi tidak boleh kosong!</p>
      </div>

      <!-- Bottom toolbar + actions -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
        <!-- Media buttons -->
        <div class="flex items-center gap-1">
          <button id="btn-attach-image" title="Tambahkan Gambar" class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-primary">
            <span class="material-symbols-outlined text-[22px]">image</span>
          </button>
          <button id="btn-attach-file" title="Lampirkan File" class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-primary">
            <span class="material-symbols-outlined text-[22px]">attach_file</span>
          </button>
          <button id="btn-poll" title="Buat Poll" class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-primary">
            <span class="material-symbols-outlined text-[22px]">bar_chart</span>
          </button>
        </div>
        <!-- Action buttons -->
        <div class="flex items-center gap-2">
          <button id="btn-save-draft" class="px-4 py-2 rounded-full text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
            Simpan Draft
          </button>
          <button id="modal-batal-btn" class="px-4 py-2 rounded-full text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block">
            Batal
          </button>
          <button id="btn-post-diskusi" class="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
            Post <span class="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>

      <!-- Poll creation panel (hidden by default) -->
      <div id="poll-panel" class="hidden border-t border-slate-100 px-6 py-4 bg-slate-50 flex flex-col gap-3">
        <p class="text-[13px] font-bold text-slate-700 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">bar_chart</span> Buat Polling</p>
        <div id="poll-options" class="flex flex-col gap-2">
          <input type="text" placeholder="Pilihan 1" class="poll-opt border border-slate-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary"/>
          <input type="text" placeholder="Pilihan 2" class="poll-opt border border-slate-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary"/>
        </div>
        <button id="btn-add-poll-opt" class="self-start text-[13px] text-primary font-semibold hover:underline">+ Tambah Pilihan</button>
      </div>

    </div>
  </div>
  <style>
    /* Styling scrollbar untuk modal */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
    
    /* Placeholder fallback for contenteditable */
    #editor-content:empty:before {
      content: attr(data-placeholder);
      color: #94a3b8;
      pointer-events: none;
      display: block; /* For Firefox */
    }
  </style>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setupModalLogic();
  setupTabs(); // Initialize club tabs
  renderAllPosts(); // Render posts initially
  renderJoinedClubs(); // Render clubs in left sidebar

  // Bind Feed Tab clicks
  document.getElementById('tab-feed-semua')?.addEventListener('click', async () => {
    window.switchFeedTab('Semua');
    apiPostsFetched = false;
    await renderAllPosts();
  });
  document.getElementById('tab-feed-trending')?.addEventListener('click', async () => {
    window.switchFeedTab('Trending');
    apiPostsFetched = false;
    await renderAllPosts();
  });

  // Bind Trending Filter Pill clicks
  document.querySelectorAll('.trending-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      window.filterTrendingByCategory(btn.dataset.tag);
    });
  });

  // Bind close on overlay click for trending detail modal
  const trendModal = document.getElementById('modal-detail-trending');
  trendModal?.addEventListener('click', (e) => {
    if (e.target === trendModal) window.closeTrendingModal();
  });
});

// MODAL & FORM LOGIC
const CURRENT_USER_PROFILE = localStorage.getItem('rb_username') || '@SiswaIndonesia';
let activeTags = [];
let isMaximized = false;

function getEditor(){ return document.getElementById('editor-content'); }

function setupModalLogic() {
  const modal = document.getElementById('modal-diskusi');
  const dialog = document.getElementById('modal-dialog');
  
  // Set auto-destination based on current page
  function updateDestinationPill() {
    let targetDest = 'Public Feed';
    if (document.title.includes('Pejuang SNBT')) targetDest = 'Pejuang SNBT';
    else if (document.title.includes('Pecinta Fiksi')) targetDest = 'Pecinta Fiksi';

    document.querySelectorAll('.dest-pill').forEach(b => {
      if (b.dataset.dest === targetDest) {
        b.classList.add('bg-primary','text-white','border-primary');
        b.classList.remove('bg-white','text-slate-700','border-slate-200');
      } else {
        b.classList.remove('bg-primary','text-white','border-primary');
        b.classList.add('bg-white','text-slate-700','border-slate-200');
      }
    });
  }

  window.openModal = function() {
    updateDestinationPill();
    modal.classList.remove('hidden');
    checkDraftBanner();
  };
  
  window.closeModal = function() {
    modal.classList.add('hidden');
    if(window.editingPostId) {
      window.editingPostId = null;
      const submitBtn = document.getElementById('btn-post-diskusi');
      if(submitBtn) submitBtn.innerHTML = 'Posting Diskusi';
      document.getElementById('input-judul').value='';
      const ed=getEditor(); if(ed) ed.innerHTML='';
      activeTags=[]; renderTagChips();
    }
  };

  // FAB Click
  document.getElementById('fab-buat-diskusi')?.addEventListener('click', openModal);
  
  // Close buttons
  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-batal-btn')?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });

  // Maximize Feature
  document.getElementById('modal-maximize-btn')?.addEventListener('click', () => {
    isMaximized = !isMaximized;
    if (isMaximized) {
      dialog.classList.remove('max-w-xl', 'rounded-2xl');
      dialog.classList.add('max-w-full', 'rounded-none', 'h-screen');
      dialog.style.maxHeight = '100vh';
      dialog.style.height = '100vh';
      document.getElementById('modal-maximize-btn').querySelector('span').innerText = 'close_fullscreen';
    } else {
      dialog.classList.add('max-w-xl', 'rounded-2xl');
      dialog.classList.remove('max-w-full', 'rounded-none', 'h-screen');
      dialog.style.maxHeight = '92vh';
      dialog.style.height = 'auto';
      document.getElementById('modal-maximize-btn').querySelector('span').innerText = 'fullscreen';
    }
  });

  // Destination pills clicking
  document.querySelectorAll('.dest-pill').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.dest-pill').forEach(b=>{
        b.classList.remove('bg-primary','text-white','border-primary');
        b.classList.add('bg-white','text-slate-700','border-slate-200');
      });
      btn.classList.add('bg-primary','text-white','border-primary');
      btn.classList.remove('bg-white','text-slate-700','border-slate-200');
    });
  });

  // Rich text toolbar
  document.getElementById('fmt-bold')?.addEventListener('click',()=>{ document.execCommand('bold'); getEditor()?.focus(); });
  document.getElementById('fmt-italic')?.addEventListener('click',()=>{ document.execCommand('italic'); getEditor()?.focus(); });
  document.getElementById('fmt-ul')?.addEventListener('click',()=>{ document.execCommand('insertUnorderedList'); getEditor()?.focus(); });
  document.getElementById('fmt-ol')?.addEventListener('click',()=>{ document.execCommand('insertOrderedList'); getEditor()?.focus(); });
  document.getElementById('fmt-quote')?.addEventListener('click',()=>{
    const txt=window.getSelection()?.toString()||'Kutipan teks...';
    document.execCommand('insertHTML',false,`<blockquote style="border-left:3px solid #004ac6;padding-left:12px;color:#6b7280;margin:4px 0;">${txt}</blockquote>`);
    getEditor()?.focus();
  });

  // Tag chip input
  document.getElementById('input-tag-new')?.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      let val=e.target.value.trim().replace(/^#/,'');
      if(val&&!activeTags.includes('#'+val)){ activeTags.push('#'+val); renderTagChips(); }
      e.target.value='';
    }
  });

  // Draft handling
  document.getElementById('btn-save-draft')?.addEventListener('click', saveDraft);
  document.getElementById('btn-load-draft')?.addEventListener('click', loadDraft);
  document.getElementById('btn-delete-draft')?.addEventListener('click', deleteDraft);

  // Poll toggle & add option
  document.getElementById('btn-poll')?.addEventListener('click',()=>{
    document.getElementById('poll-panel')?.classList.toggle('hidden');
  });
  document.getElementById('btn-add-poll-opt')?.addEventListener('click',()=>{
    const c=document.getElementById('poll-options');
    const count=c.querySelectorAll('.poll-opt').length+1;
    const inp=document.createElement('input');
    inp.type='text'; inp.placeholder=`Pilihan ${count}`;
    inp.className='poll-opt border border-slate-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-primary';
    c.appendChild(inp);
  });

  // Attach image (dummy handler)
  document.getElementById('btn-attach-image')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if(e.target.files.length > 0) alert('Gambar "' + e.target.files[0].name + '" disematkan. (Simulasi)');
    };
    input.click();
  });
  document.getElementById('btn-attach-file')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      if(e.target.files.length > 0) alert('File "' + e.target.files[0].name + '" disematkan. (Simulasi)');
    };
    input.click();
  });

  // Post submit
  document.getElementById('btn-post-diskusi')?.addEventListener('click', async ()=>{
    const judul=document.getElementById('input-judul').value.trim();
    const isi=(getEditor()?.innerText||'').trim();
    const errEl=document.getElementById('form-error');
    if(!judul||!isi){ errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');

    const token = localStorage.getItem('rb_token');
    if (!token) {
      alert("Silakan login untuk membuat diskusi");
      window.location.href = 'login.html';
      return;
    }

    try {
      const res = await fetch(`https://readbridge-backend-2whx.onrender.com/api/community/diskusi`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ judul, konten: getEditor().innerHTML })
      });
      
      if (res.ok) {
        alert('Diskusi berhasil diposting!');
        apiPostsFetched = false;
        await renderAllPosts();
        
        // Reset form
        document.getElementById('input-judul').value='';
        const ed=getEditor(); if(ed) ed.innerHTML='';
        activeTags=[]; renderTagChips();
        document.getElementById('poll-panel')?.classList.add('hidden');
        localStorage.removeItem(DRAFT_KEY);
        closeModal();
      } else {
        const data = await res.json();
        if (res.status === 401 && (data.message || '').includes('User tidak ditemukan')) {
          localStorage.removeItem('rb_token');
          localStorage.removeItem('rb_is_logged_in');
          localStorage.removeItem('rb_is_synced');
          alert('Sesi login tidak valid. Silakan login ulang.');
          window.location.href = 'login.html';
          return;
        }
        alert("Gagal posting: " + (data.message || "Error"));
      }
    } catch (e) {
      console.error(e);
      alert("Gagal posting diskusi.");
    }
  });
}

function renderTagChips(){
  const c=document.getElementById('tag-chips');
  if(!c) return;
  c.innerHTML=activeTags.map((t,i)=>
    `<span class="flex items-center gap-1 bg-blue-50 text-blue-700 text-[13px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">${t}<button onclick="window.removeTag(${i})" class="ml-0.5 hover:text-red-500 transition-colors leading-none">&times;</button></span>`
  ).join('');
}
window.removeTag = function(i){ activeTags.splice(i,1); renderTagChips(); }

// Draft functions
function saveDraft(){
  const judul=document.getElementById('input-judul').value.trim();
  const isi=getEditor()?.innerHTML||'';
  if(!judul && !isi.trim()){ alert('Tidak ada konten yang bisa disimpan ke draft.'); return; }
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ judul, isi, tags:[...activeTags] }));
  alert('Draft berhasil disimpan!');
  checkDraftBanner();
}
function loadDraft(){
  const d=localStorage.getItem(DRAFT_KEY);
  if(!d) return;
  const draft=JSON.parse(d);
  document.getElementById('input-judul').value=draft.judul||'';
  const ed=getEditor(); if(ed) ed.innerHTML=draft.isi||'';
  activeTags=draft.tags||[];
  renderTagChips();
  document.getElementById('draft-banner').classList.add('hidden');
}
function deleteDraft(){
  localStorage.removeItem(DRAFT_KEY);
  document.getElementById('draft-banner').classList.add('hidden');
}
function checkDraftBanner(){
  const hasDraft=!!localStorage.getItem(DRAFT_KEY);
  const banner=document.getElementById('draft-banner');
  if(banner) banner.classList.toggle('hidden',!hasDraft);
}

// Edit Post
window.editingPostId = null;
window.editPost = function(postId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if(!post) return;
  
  window.editingPostId = post.id;
  
  // Close menu if open
  const menu = document.getElementById('post-menu-'+postId);
  if(menu) menu.classList.add('hidden');
  
  // Open modal
  const modal = document.getElementById('community-modal-overlay');
  if(modal) {
    modal.classList.remove('hidden');
  } else if (typeof window.openModal === 'function') {
    window.openModal();
  }

  // Populate data
  setTimeout(() => {
    document.getElementById('input-judul').value = post.judul;
    const ed = getEditor();
    if(ed) ed.innerHTML = post.isi;
    
    // Set tags
    activeTags = [...(post.tags||[])];
    renderTagChips();
    
    // Set destination pill
    document.querySelectorAll('.dest-pill').forEach(btn => btn.classList.remove('bg-primary', 'text-on-primary', 'border-primary', 'bg-surface-container-lowest', 'text-on-surface-variant', 'border-outline-variant'));
    document.querySelectorAll('.dest-pill').forEach(btn => {
      if(btn.dataset.dest === post.destination) {
        btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
      } else {
        btn.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border-outline-variant');
      }
    });
    
    // Change submit button text
    const submitBtn = document.getElementById('btn-post-diskusi');
    if(submitBtn) {
      submitBtn.innerHTML = 'Simpan Perubahan';
    }
  }, 50);
};

// Vote in poll
window.submitPollVote = function(postId, optIdx) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if(!post || !post.poll) return;
  
  // Normalize legacy poll array if needed
  if(typeof post.poll[0] === 'string') {
    post.poll = post.poll.map(opt => ({ text: opt, count: 0, votedBy: [] }));
  }

  // Check if already voted
  const hasVoted = post.poll.some(opt => opt.votedBy.includes(CURRENT_USER_PROFILE));
  if(hasVoted) return; // Prevent double vote

  post.poll[optIdx].count++;
  post.poll[optIdx].votedBy.push(CURRENT_USER_PROFILE);
  
  savePosts(posts);
  renderAllPosts();
};

// Tab Switching logic
window.switchFeedTab = function(tab) {
  window.activeFeedTab = tab;
  
  const tabSemua = document.getElementById('tab-feed-semua');
  const tabTrending = document.getElementById('tab-feed-trending');
  const filterContainer = document.getElementById('trending-filter-container');
  
  if (tabSemua && tabTrending) {
    if (tab === 'Semua') {
      tabSemua.className = 'feed-tab font-label-md text-label-md font-bold text-primary border-b-2 border-primary pb-3 px-2';
      tabTrending.className = 'feed-tab font-label-md text-label-md text-on-surface-variant hover:text-primary pb-3 px-2 rounded-t-lg transition-colors';
      filterContainer?.classList.add('hidden');
    } else {
      tabTrending.className = 'feed-tab font-label-md text-label-md font-bold text-primary border-b-2 border-primary pb-3 px-2';
      tabSemua.className = 'feed-tab font-label-md text-label-md text-on-surface-variant hover:text-primary pb-3 px-2 rounded-t-lg transition-colors';
      filterContainer?.classList.remove('hidden');
    }
  }
  
  renderAllPosts();
};

// Filter Trending by tag pill
window.filterTrendingByCategory = function(tag) {
  window.activeTrendingTag = tag;
  
  document.querySelectorAll('.trending-filter-pill').forEach(btn => {
    if (btn.dataset.tag === tag) {
      btn.className = 'trending-filter-pill px-4 py-1.5 rounded-full text-[13px] font-semibold border bg-primary text-white border-primary transition-all duration-200';
    } else {
      btn.className = 'trending-filter-pill px-4 py-1.5 rounded-full text-[13px] font-semibold border bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary hover:text-primary transition-all duration-200';
    }
  });
  
  renderAllPosts();
};

// Detailed Trending Topic Modal
window.showTrendingTopicDetail = function(tagName) {
  const modal = document.getElementById('modal-detail-trending');
  const titleEl = document.getElementById('trending-modal-title');
  const statsEl = document.getElementById('trending-modal-stats');
  const descEl = document.getElementById('trending-modal-desc');
  const postsContainer = document.getElementById('trending-modal-posts');
  const buatDiskusiBtn = document.getElementById('btn-trending-buat-diskusi');
  
  if (!modal) return;
  
  const detail = TOPIC_DETAILS[tagName] || {
    title: tagName,
    stats: 'Baru & Populer 🔥',
    desc: `Ruang diskusi komunitas yang berfokus pada topik hangat ${tagName}. Cari tahu apa yang dipikirkan pengguna lain.`
  };
  
  titleEl.innerHTML = `<span class="text-primary font-bold">${detail.title}</span>`;
  statsEl.innerHTML = `${detail.stats}`;
  descEl.textContent = detail.desc;
  
  // Find related posts
  const relatedPosts = getPosts().filter(p => 
    (p.tags || []).some(t => t.toLowerCase() === tagName.toLowerCase())
  ).sort((a, b) => b.votes - a.votes);
  
  if (relatedPosts.length > 0) {
    postsContainer.innerHTML = relatedPosts.map(p => `
      <div class="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl shadow-sm hover:bg-surface-container transition-all">
        <a href="detail-diskusi.html?id=${p.id}" class="hover:text-primary transition-colors"><h4 class="font-label-md text-label-md font-bold text-on-surface line-clamp-1">${p.judul}</h4></a>
        <p class="text-on-surface-variant/80 text-[12px] mt-1 line-clamp-2">${p.isi.replace(/<[^>]*>/g, '')}</p>
        <div class="flex items-center justify-between mt-3 text-[11px] text-on-surface-variant">
          <span>Oleh ${p.username}</span>
          <span class="flex items-center gap-1 font-bold text-primary"><span class="material-symbols-outlined text-[12px]">thumb_up</span> ${formatVotes(p.votes)}</span>
        </div>
      </div>
    `).join('');
  } else {
    postsContainer.innerHTML = `<p class="text-on-surface-variant/80 text-[13px] italic py-4 text-center">Belum ada diskusi populer untuk tag ini. Jadilah yang pertama memulai!</p>`;
  }
  
  // Buat Diskusi Button setup
  buatDiskusiBtn.onclick = function() {
    window.closeTrendingModal();
    // Pre-fill tag in new post modal
    activeTags = [tagName];
    renderTagChips();
    // Open modal
    if (typeof window.openModal === 'function') {
      window.openModal();
    }
  };
  
  // Add direct filter button to footer
  let filterBtn = modal.querySelector('#btn-trending-filter-utama');
  if (!filterBtn) {
    filterBtn = document.createElement('button');
    filterBtn.id = 'btn-trending-filter-utama';
    filterBtn.className = 'px-4 py-2.5 rounded-full text-[13px] font-semibold text-primary hover:bg-primary/10 transition-colors border border-primary mr-2';
    buatDiskusiBtn.parentNode.insertBefore(filterBtn, buatDiskusiBtn);
  }
  filterBtn.textContent = `Filter Feed: ${tagName}`;
  filterBtn.onclick = function() {
    window.filterFeedByTag(tagName);
  };
  
  modal.classList.remove('hidden');
};

window.closeTrendingModal = function() {
  const modal = document.getElementById('modal-detail-trending');
  modal?.classList.add('hidden');
};

window.filterFeedByTag = function(tagName) {
  window.closeTrendingModal();
  
  // Switch to Trending tab
  window.switchFeedTab('Trending');
  
  // Set trending category to tag if it's one of the options
  const formattedTag = tagName.startsWith('#') ? tagName : '#' + tagName;
  const pill = document.querySelector(`.trending-filter-pill[data-tag="${formattedTag}"]`);
  
  if (pill) {
    window.filterTrendingByCategory(formattedTag);
  } else {
    // If tag is not one of the predefined category buttons, let's temporarily set activeTrendingTag
    window.activeTrendingTag = formattedTag;
    
    // De-activate all standard pills
    document.querySelectorAll('.trending-filter-pill').forEach(btn => {
      btn.className = 'trending-filter-pill px-4 py-1.5 rounded-full text-[13px] font-semibold border bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary hover:text-primary transition-all duration-200';
    });
    
    // Render with custom active tag
    renderAllPosts();
  }
  
  // Scroll to community feed
  const feedEl = document.getElementById('community-feed');
  feedEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ==========================================
// COMMUNITY BOT SIMULATION
// ==========================================

const BOT_PROFILES = [
  '@SastraWangi', '@BookNerd', '@HujanBulanJuni', '@TokyoReader', '@PenaSenja',
  '@PejuangKampus', '@MathGenius', '@CalonMaba', '@Ambiskuh', '@TukangOverthinking',
  '@KutuBuku', '@PecintaSastra', '@AnakRajin', '@SiswaIndonesia', '@AlumniSukses',
  '@PemimpiBesar', '@PemburuPTN', '@SastraLover', '@BukuAdalahTeman'
];

const BOT_COMMENTS_FIKSI = [
  "Wah, menarik banget ulasannya kak! Bikin pengen baca.",
  "Setuju! Bagian itu emang paling seru.",
  "Ada yang punya rekomendasi buku lain yang mirip ini?",
  "Bener banget, aku juga mikir gitu pas baca.",
  "Wah, belum pernah baca. Kayaknya masuk wishlist deh.",
  "Boleh minta pendapat tentang bab akhirnya?",
  "Aku suka banget sama gaya bahasa penulisnya, ngalir gitu aja.",
  "Jujur, awalnya rada bosen tapi makin ke belakang makin seru!"
];

const BOT_COMMENTS_SNBT = [
  "Makasih tipsnya kak, bermanfaat banget buat persiapan UTBK!",
  "Wah, soal nomor 3 itu emang agak tricky. Ada cara cepatnya ga?",
  "Semangat pejuang PTN! Kita pasti bisa.",
  "Sama, aku juga masih sering bingung di materi ini.",
  "Izin save ya kak, buat bahan belajar nanti.",
  "Menurutku yang penting banyakin latihan soal aja.",
  "Pilihan jurusannya apa nih kalau boleh tau?",
  "Jangan lupa istirahat juga guys, jangan diforsir belajarnya."
];

class CommunityBot {
  constructor() {
    this.intervalId = null;
    this.activeDest = null;
    if (document.title.includes('Pejuang SNBT')) this.activeDest = 'Pejuang SNBT';
    else if (document.title.includes('Pecinta Fiksi')) this.activeDest = 'Pecinta Fiksi';
  }

  start() {
    if (!this.activeDest) return; // Hanya jalankan di halaman komunitas spesifik
    
    // Set interval acak antara 20 - 40 detik
    const runSimulation = () => {
      this.simulateAction();
      const nextTime = Math.floor(Math.random() * (40000 - 20000 + 1)) + 20000;
      this.intervalId = setTimeout(runSimulation, nextTime);
    };
    
    // Start first simulation after 10 seconds
    this.intervalId = setTimeout(runSimulation, 10000);
  }

  stop() {
    if (this.intervalId) clearTimeout(this.intervalId);
  }

  simulateAction() {
    const posts = getPosts().filter(p => p.destination === this.activeDest);
    if (posts.length === 0) return;

    // Pilih aksi acak: 0 = upvote (60%), 1 = comment (40%)
    const action = Math.random() < 0.6 ? 0 : 1;
    
    // Pilih post acak
    const targetPost = posts[Math.floor(Math.random() * posts.length)];
    const randomUser = BOT_PROFILES[Math.floor(Math.random() * BOT_PROFILES.length)];

    if (action === 0) {
      this.simulateVote(targetPost.id);
    } else {
      this.simulateComment(targetPost, randomUser);
    }
  }

  simulateVote(postId) {
    const posts = getPosts();
    const p = posts.find(x => x.id === postId);
    if (p) {
      p.votes = (p.votes || 0) + 1;
      savePosts(posts);
      
      const el = document.getElementById(`vote-${postId}`);
      if (el) {
        el.textContent = formatVotes(p.votes);
        el.parentElement.classList.add('bg-primary/20', 'scale-105', 'transition-all');
        setTimeout(() => {
          el.parentElement.classList.remove('bg-primary/20', 'scale-105');
        }, 1000);
      }
    }
  }

  simulateComment(post, user) {
    const posts = getPosts();
    const p = posts.find(x => x.id === post.id);
    if (!p) return;

    const templates = this.activeDest === 'Pecinta Fiksi' ? BOT_COMMENTS_FIKSI : BOT_COMMENTS_SNBT;
    const text = templates[Math.floor(Math.random() * templates.length)];

    p.commentsList = p.commentsList || [];
    p.commentsList.push({ username: user, text, waktu: new Date().toISOString() });
    p.komentar = p.commentsList.length;
    savePosts(posts);

    // Update UI directly if comments section is open
    const list = document.getElementById(`comments-list-${post.id}`);
    if (list) {
      list.insertAdjacentHTML('beforeend', `
        <div class="flex gap-3 text-sm">
          <img src="${getAvatarForUser(user)}" alt="${user}" class="w-8 h-8 rounded-full border border-outline-variant/50 bg-surface-container-high"/>
          <div class="bg-primary/10 border border-primary/30 p-3 rounded-2xl rounded-tl-none flex-1 shadow-sm transition-all duration-1000">
            <div class="flex items-center gap-2 mb-1"><span class="font-bold text-on-surface text-[13px]">${user}</span><span class="text-on-surface-variant/60 text-[11px]">Baru saja</span></div>
            <p class="text-on-surface-variant text-[14px] leading-relaxed">${text}</p>
          </div>
        </div>
      `);
    }
    const countEl = document.getElementById(`komentar-count-${post.id}`);
    if (countEl) {
      countEl.textContent = p.komentar;
      countEl.parentElement.classList.add('text-primary', 'bg-primary/10', 'transition-all');
      setTimeout(() => countEl.parentElement.classList.remove('text-primary', 'bg-primary/10'), 2000);
    }

    this.showToast(`💬 Diskusi baru saja dikomentari oleh ${user}`);
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-surface-container-highest text-on-surface px-4 py-3 rounded-xl shadow-lg border border-outline-variant/30 flex items-center gap-3 z-[100] transform transition-all duration-300 translate-y-10 opacity-0';
    toast.innerHTML = `<span class="font-label-md text-label-md">${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    }, 100);

    // Remove after 3.5s
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// ==========================================
// SYSTEM REKOMENDASI BUKU & ULASAN INTERAKTIF
// ==========================================

const RECOMMENDATIONS_STORAGE_KEY = 'readbridge_book_recommendations_v2';
const defaultRecommendations = [
  {
    id: 'rec-fiksi-1',
    club: 'Pecinta Fiksi',
    title: 'Cantik Itu Luka',
    author: 'Eka Kurniawan',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXUDfExqL3kiH5HpJqA3Rx-Ahaz0_lfHsDtiEc3nHqrVX6c2fI80nMaYXLD2Knjh37xVxbeEQ3hFnLzcZeXLpVpbHO7GCzSy1hnCtXo_qwqtU3sXXgAmLFifphjLqAPZyunIPpTzpmzCBEEKmtmqfRfFXNOIW7u-CcpbtT66h3zhNajQSYzZAVkWJAHX1Avd0Rs5i8KI55Hv_wzD5yJMQFwbVctiZM-mNKJweLUA3pgb4rVdnwhwQRhGP8hkS4gEyWO0l2Pqr5raY',
    desc: 'Sebuah adikarya realisme magis Indonesia yang bercerita tentang perjuangan hidup Dewi Ayu dan anak-anak perempuannya yang sarat mitos, tragedi keluarga, dan sejarah kolonial.',
    rentAvailable: true,
    rentPrice: 'Rp 15.000',
    buyPrice: 'Rp 95.000',
    digitalReadAvailable: true,
    reviews: [
      {
        id: 'rev-fiksi-1-1',
        username: '@PecintaSastra',
        rating: 5,
        reviewText: 'Salah satu novel terbaik sastra Indonesia modern. Gaya penulisannya mirip Gabriel Garcia Marquez tapi kental dengan kearifan lokal Jawa dan sejarah kelam bangsa kita. Sangat direkomendasikan!',
        upvotes: 45,
        downvotes: 2,
        userVoted: null,
        comments: [
          { username: '@SastraWangi', text: 'Setuju banget! Realisme magisnya bener-bener liar dan memikat.', waktu: '2 jam yang lalu' },
          { username: '@KutuBuku', text: 'Buku ini emang mindblowing banget pas pertama kali baca.', waktu: '1 jam yang lalu' }
        ]
      },
      {
        id: 'rev-fiksi-1-2',
        username: '@TokyoReader',
        rating: 4,
        reviewText: 'Karakter Dewi Ayu sangat kuat dan tak terlupakan. Ceritanya penuh satire politik dan mitologi lokal. Kadang bahasanya agak vulgar tapi itulah keunikannya.',
        upvotes: 18,
        downvotes: 1,
        userVoted: null,
        comments: []
      }
    ]
  },
  {
    id: 'rec-fiksi-2',
    club: 'Pecinta Fiksi',
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBs_2IGw86OKGtH47-1Xz99vJjeMA3OIqQtK0EWVt8MJMjpIglrjV1_fA2LMf1H2pLwKOJUrzGVVx_xZo6YM3e_eWLmF80RicVWLlNfvgvSwpo4yVc6IqqAF8jQCsWREBoEDH_nC4q4pKH1kEv3c1vppEROFpnaAQOlXmZ6BrNbxr-HEJb6dW0P0EffIVbxxxlFDUzb-pIiecgvPP0a_CfKnssB6m1PzAujX_QeENvwswW5-WEgeFtxGrxgz_qXiUT-1uALtTif_I',
    desc: 'Sebuah novel yang menyuarakan kebenaran dari sejarah kelam masa reformasi 1998, tentang persahabatan, cinta, keluarga, dan perjuangan aktivis mahasiswa yang hilang diculik.',
    rentAvailable: true,
    rentPrice: 'Rp 14.000',
    buyPrice: 'Rp 88.000',
    digitalReadAvailable: true,
    reviews: [
      {
        id: 'rev-fiksi-2-1',
        username: '@HujanBulanJuni',
        rating: 5,
        reviewText: 'Buku yang sukses bikin nangis bombay. Sudut pandang Biru Laut sangat puitis namun menyakitkan, sedangkan bagian Asmara Sandy memberi perspektif keluarga korban yang luar biasa mengharukan.',
        upvotes: 38,
        downvotes: 0,
        userVoted: null,
        comments: [
          { username: '@PenaSenja', text: 'Sama kak, nyesek banget pas baca bagian ritual makan malam bersama kursi kosong.', waktu: '5 jam yang lalu' }
        ]
      }
    ]
  },
  {
    id: 'rec-snbt-1',
    club: 'Pejuang SNBT',
    title: 'Wangsit HOTS UTBK SNBT 2024',
    author: 'Tim Wangsit',
    cover: 'snbt_cover.png',
    desc: 'Buku panduan terlengkap menghadapi ujian masuk perguruan tinggi negeri dengan metode pembagian bab soal HOTS terbaru beserta pembahasan rinci ala tentor berpengalaman.',
    rentAvailable: true,
    rentPrice: 'Rp 20.000',
    buyPrice: 'Rp 120.000',
    digitalReadAvailable: true,
    reviews: [
      {
        id: 'rev-snbt-1-1',
        username: '@PejuangKampus',
        rating: 5,
        reviewText: 'Soal-soalnya bener-bener HOTS dan mirip banget sama tipe UTBK tahun lalu. Penjelasan rumusnya simpel dan taktis, ngebantu banget naikin skor Try Out ku!',
        upvotes: 62,
        downvotes: 1,
        userVoted: null,
        comments: [
          { username: '@CalonMaba', text: 'Bener kak! Terutama materi penalaran kuantitatifnya mantap.', waktu: '3 jam yang lalu' }
        ]
      }
    ]
  },
  {
    id: 'rec-snbt-2',
    club: 'Pejuang SNBT',
    title: 'TPS UTBK SNBT & Literasi 2024',
    author: 'Forum Edukasi',
    cover: 'snbt_icon.png',
    desc: 'Latihan soal super intensif untuk mematangkan konsep Tes Potensi Skolastik (TPS) meliputi Kemampuan Penalaran Umum, Pengetahuan Umum, dan Literasi Bahasa.',
    rentAvailable: true,
    rentPrice: 'Rp 15.000',
    buyPrice: 'Rp 95.000',
    digitalReadAvailable: true,
    reviews: [
      {
        id: 'rev-snbt-2-1',
        username: '@Ambiskuh',
        rating: 4,
        reviewText: 'Penjelasan literasi bahasa Indonesianya sangat detail. Cocok buat yang mau mengejar target skor di atas 700.',
        upvotes: 24,
        downvotes: 0,
        userVoted: null,
        comments: []
      }
    ]
  }
];

function getBookRecommendations() {
  const data = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(defaultRecommendations));
  return defaultRecommendations;
}

function saveBookRecommendations(data) {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(data));
}

function renderBookRecommendations() {
  const container = document.getElementById('book-recommendation-container');
  if (!container) return;

  let activeClub = null;
  if (document.title.includes('Pejuang SNBT')) activeClub = 'Pejuang SNBT';
  else if (document.title.includes('Pecinta Fiksi')) activeClub = 'Pecinta Fiksi';
  if (!activeClub) return;

  const recs = getBookRecommendations().filter(r => r.club === activeClub);

  let html = `
    <!-- Form Tambah Rekomendasi / Review -->
    <div class="bg-surface rounded-2xl p-lg border border-outline-variant/30 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-md">
      <h3 class="font-title-lg text-title-lg font-bold text-on-surface mb-xs flex items-center gap-xs">
        <span class="material-symbols-outlined text-primary">rate_review</span>
        Bagikan Rekomendasi & Ulasan
      </h3>
      <p class="font-label-sm text-label-sm text-on-surface-variant mb-md">Bantu teman klub kamu menemukan bacaan terbaik berikutnya!</p>
      
      <form id="form-rekomendasi" class="flex flex-col gap-4" onsubmit="window.submitBookRecommendation(event)">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">Judul Buku</label>
            <input type="text" id="rec-input-judul" placeholder="Contoh: Cantik Itu Luka" required class="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface">
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-label-sm text-label-sm text-on-surface-variant">Penulis / Pengarang</label>
            <input type="text" id="rec-input-penulis" placeholder="Contoh: Eka Kurniawan" required class="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface">
          </div>
        </div>
        
        <div class="flex flex-col gap-1">
          <label class="font-label-sm text-label-sm text-on-surface-variant">Deskripsi Singkat Buku (Opsional)</label>
          <textarea id="rec-input-desc" placeholder="Tulis sinopsis singkat atau gambaran umum isi buku..." rows="2" class="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface"></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-label-sm text-label-sm text-on-surface-variant">Ulasan Jujur Kamu</label>
          <textarea id="rec-input-review" placeholder="Bagikan ulasan jujur kamu tentang buku ini..." rows="3" required class="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface"></textarea>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div class="flex items-center gap-2">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-bold">Rating Kamu:</span>
            <div class="flex items-center gap-1 text-amber-500" id="star-rating-selector">
              ${[1,2,3,4,5].map(i => `
                <span onclick="window.setRecommendationRating(${i})" id="selector-star-${i}" class="material-symbols-outlined text-[26px] cursor-pointer hover:scale-115 transition-transform" style="font-variation-settings: 'FILL' 1;">star</span>
              `).join('')}
            </div>
            <input type="hidden" id="rec-input-rating" value="5">
          </div>
          
          <button type="submit" class="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-xl font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-xs shadow-sm">
            <span class="material-symbols-outlined text-[20px]">send</span> Kirim Rekomendasi
          </button>
        </div>
      </form>
    </div>
  `;

  if (recs.length === 0) {
    html += `
      <div class="bg-surface rounded-2xl p-lg border border-outline-variant/20 shadow-sm text-center">
        <p class="text-on-surface-variant font-label-md py-4">Belum ada rekomendasi buku di klub ini. Yuk, jadilah yang pertama merekomendasikan!</p>
      </div>
    `;
    container.innerHTML = html;
    return;
  }

  // Render list of recommendations
  recs.forEach(rec => {
    const totalReviews = rec.reviews.length;
    const avgRating = totalReviews > 0 ? (rec.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0.0';

    html += `
      <div class="bg-surface rounded-2xl border border-outline-variant/30 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] mb-md">
        <!-- Kartu Buku Utama -->
        <div class="p-lg flex flex-col md:flex-row gap-lg bg-surface-container-lowest">
          <div class="w-28 h-36 bg-surface-container-highest rounded-xl flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0 shadow-sm self-center md:self-start">
            <img src="${rec.cover || 'fiksi_icon.png'}" alt="${rec.title}" class="w-full h-full object-cover" onerror="this.src='fiksi_icon.png'"/>
          </div>
          <div class="flex-grow flex flex-col justify-between py-1 text-left">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <h3 class="font-headline-md text-[20px] font-bold text-on-surface leading-tight">${rec.title}</h3>
                <span class="text-on-surface-variant/40 hidden md:inline">•</span>
                <span class="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full font-label-sm text-[12px] font-bold">${rec.author}</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant/80 text-[14px] leading-relaxed mb-4">${rec.desc || 'Tidak ada deskripsi tersedia.'}</p>
            </div>
            
            <!-- CTAs & Ratings Summary -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
              <div class="flex items-center gap-2">
                <div class="flex text-amber-500">
                  ${[1, 2, 3, 4, 5].map(star => {
                    const fill = star <= Math.round(parseFloat(avgRating)) ? '1' : '0';
                    return `<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${fill};">star</span>`;
                  }).join('')}
                </div>
                <span class="font-bold text-on-surface text-label-md">${avgRating}</span>
                <span class="text-on-surface-variant/50 text-[13px]">(${totalReviews} Ulasan)</span>
              </div>
              
              <div class="flex flex-wrap items-center gap-2">
                ${rec.digitalReadAvailable ? `
                  <button onclick="window.readDigitalBookSimulator('${rec.title.replace(/'/g, "\\'")}')" class="px-4 py-2 bg-green-500 text-white rounded-full font-bold font-label-sm text-[12px] hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">menu_book</span> Baca E-Book
                  </button>
                ` : ''}
                ${rec.rentAvailable ? `
                  <a href="checkout-sewa.html?title=${encodeURIComponent(rec.title)}&author=${encodeURIComponent(rec.author)}&price=${encodeURIComponent(rec.rentPrice || 'Rp 15.000')}&cover=${encodeURIComponent(rec.cover)}" class="px-4 py-2 bg-primary text-on-primary rounded-full font-bold font-label-sm text-[12px] hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">bookmark_add</span> Sewa
                  </a>
                ` : ''}
                <a href="checkout.html?title=${encodeURIComponent(rec.title)}&author=${encodeURIComponent(rec.author)}&price=${encodeURIComponent(rec.buyPrice)}&cover=${encodeURIComponent(rec.cover)}" class="px-4 py-2 bg-surface-container border border-outline-variant rounded-full font-bold font-label-sm text-[12px] text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px]">shopping_cart</span> Beli (${rec.buyPrice})
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Seksi Ulasan -->
        <div class="bg-surface-container-low px-lg py-md border-t border-outline-variant/30 flex flex-col gap-4">
          <h4 class="font-label-md text-label-md font-bold text-on-surface-variant uppercase tracking-wider text-[11px] mb-1 text-left">Ulasan Pembaca Komunitas</h4>
          <div class="flex flex-col gap-md">
            ${rec.reviews.map(rev => {
              const starsHtml = [1,2,3,4,5].map(star => {
                const fill = star <= rev.rating ? '1' : '0';
                return `<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' ${fill};">star</span>`;
              }).join('');
              
              const isUpvoted = rev.userVoted === 'up';
              const isDownvoted = rev.userVoted === 'down';
              
              return `
                <div class="bg-surface-container-lowest rounded-2xl p-md border border-outline-variant/20 shadow-sm flex flex-col gap-2 relative">
                  <!-- Profil Reviewer -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-left">
                      <img src="${getAvatarForUser(rev.username)}" alt="${rev.username}" class="w-8 h-8 rounded-full border border-outline-variant/30 object-cover bg-surface-container-high"/>
                      <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-[13px] text-on-surface">${rev.username}</span>
                          ${rev.username === '@SiswaIndonesia' ? `<span class="bg-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Anda</span>` : ''}
                        </div>
                        <span class="text-[11px] text-on-surface-variant/70">Ulasan Terverifikasi</span>
                      </div>
                    </div>
                    <div class="flex text-amber-500">
                      ${starsHtml}
                    </div>
                  </div>
                  
                  <!-- Isi Ulasan -->
                  <p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed px-1 text-left">${rev.reviewText}</p>
                  
                  <!-- Aksi Ulasan -->
                  <div class="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 mt-1 text-[13px]">
                    <div class="flex items-center gap-3">
                      <!-- Upvote / Downvote -->
                      <div class="flex items-center bg-surface-container-low rounded-full px-1 py-0.5 border border-outline-variant/20">
                        <button onclick="window.voteBookReview('${rec.id}', '${rev.id}', 'up')" class="hover:text-primary hover:bg-surface-container-high p-1 rounded-full transition-colors flex items-center justify-center ${isUpvoted ? 'text-primary' : 'text-on-surface-variant'}">
                          <span class="material-symbols-outlined text-[18px]">thumb_up</span>
                        </button>
                        <span class="font-bold text-[12px] px-1.5 text-on-surface">${rev.upvotes || 0}</span>
                        <button onclick="window.voteBookReview('${rec.id}', '${rev.id}', 'down')" class="hover:text-error hover:bg-surface-container-high p-1 rounded-full transition-colors flex items-center justify-center ${isDownvoted ? 'text-error' : 'text-on-surface-variant'}">
                          <span class="material-symbols-outlined text-[18px]">thumb_down</span>
                        </button>
                        <span class="font-bold text-[12px] px-1.5 text-on-surface-variant/80">${rev.downvotes || 0}</span>
                      </div>
                      
                      <button onclick="window.toggleReviewCommentBox('${rev.id}')" class="flex items-center gap-xs text-on-surface hover:text-primary transition-colors font-medium">
                        <span class="material-symbols-outlined text-[18px]">reply</span>
                        Balasan (${rev.comments ? rev.comments.length : 0})
                      </button>
                    </div>
                  </div>

                  <!-- Seksi Balasan -->
                  <div id="review-comment-box-${rev.id}" class="hidden flex-col gap-3 mt-3 pt-3 border-t border-outline-variant/20">
                    <div class="flex flex-col gap-2.5 pl-4 border-l-2 border-outline-variant/40" id="review-comments-list-${rev.id}">
                      ${(rev.comments || []).map(c => `
                        <div class="flex gap-2.5 text-sm text-left">
                          <img src="${getAvatarForUser(c.username)}" alt="${c.username}" class="w-6 h-6 rounded-full border border-outline-variant/20 bg-surface-container-high"/>
                          <div class="bg-surface-container-low border border-outline-variant/10 p-2.5 rounded-2xl rounded-tl-none flex-1 shadow-sm">
                            <div class="flex items-center gap-1.5 mb-0.5">
                              <span class="font-bold text-on-surface text-[12px]">${c.username}</span>
                              ${c.username === '@SiswaIndonesia' ? `<span class="bg-primary/20 text-primary text-[8px] font-bold px-1 py-0.2 rounded uppercase">Anda</span>` : ''}
                              <span class="text-on-surface-variant/50 text-[10px]">${c.waktu || 'Baru saja'}</span>
                            </div>
                            <p class="text-on-surface-variant text-[13px] leading-relaxed">${c.text}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                    
                    <!-- Input Form Balasan -->
                    <div class="flex gap-2.5 items-center mt-1 pl-4">
                      <img src="${getAvatarForUser('@SiswaIndonesia')}" alt="User" class="w-6 h-6 rounded-full border border-outline-variant/30"/>
                      <div class="flex-1 relative flex">
                        <input type="text" id="input-review-reply-${rev.id}" placeholder="Tulis balasan untuk ${rev.username}..." class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-3.5 py-1.5 text-[13px] focus:ring-1 focus:ring-primary focus:border-primary outline-none pr-10 text-on-surface" onkeypress="if(event.key==='Enter') window.submitReviewReply('${rec.id}', '${rev.id}')"/>
                        <button onclick="window.submitReviewReply('${rec.id}', '${rev.id}')" class="absolute right-1 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 p-1 rounded-full transition-colors flex items-center justify-center">
                          <span class="material-symbols-outlined text-[16px]">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.setRecommendationRating = function(rating) {
  document.getElementById('rec-input-rating').value = rating;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`selector-star-${i}`);
    if (star) {
      if (i <= rating) {
        star.style.fontVariationSettings = "'FILL' 1";
      } else {
        star.style.fontVariationSettings = "'FILL' 0";
      }
    }
  }
};

window.submitBookRecommendation = function(event) {
  event.preventDefault();
  
  let activeClub = null;
  if (document.title.includes('Pejuang SNBT')) activeClub = 'Pejuang SNBT';
  else if (document.title.includes('Pecinta Fiksi')) activeClub = 'Pecinta Fiksi';
  if (!activeClub) return;

  const title = document.getElementById('rec-input-judul').value.trim();
  const author = document.getElementById('rec-input-penulis').value.trim();
  const desc = document.getElementById('rec-input-desc').value.trim();
  const reviewText = document.getElementById('rec-input-review').value.trim();
  const rating = parseInt(document.getElementById('rec-input-rating').value);

  const recs = getBookRecommendations();
  
  // Periksa apakah buku sudah ada di list rekomendasi
  let rec = recs.find(r => r.club === activeClub && r.title.toLowerCase() === title.toLowerCase());
  
  const newReview = {
    id: 'rev-user-' + Date.now(),
    username: '@SiswaIndonesia',
    rating: rating,
    reviewText: reviewText,
    upvotes: 0,
    downvotes: 0,
    userVoted: null,
    comments: []
  };

  if (rec) {
    rec.reviews.push(newReview);
  } else {
    let coverUrl = 'snbt_cover.png';
    if (activeClub === 'Pecinta Fiksi') {
      coverUrl = 'fiksi_cover.png';
    }
    
    const newRec = {
      id: 'rec-' + Date.now(),
      club: activeClub,
      title: title,
      author: author,
      cover: coverUrl,
      desc: desc,
      rentAvailable: true,
      rentPrice: 'Rp 15.000',
      buyPrice: 'Rp 90.000',
      digitalReadAvailable: true,
      reviews: [newReview]
    };
    recs.push(newRec);
  }

  saveBookRecommendations(recs);
  renderBookRecommendations();
  
  // Tampilkan toast keberhasilan
  if (window.communityBot) {
    window.communityBot.showToast("📚 Rekomendasi buku Anda berhasil diterbitkan!");
  } else {
    alert("📚 Rekomendasi buku Anda berhasil diterbitkan!");
  }

  // Reset input form
  document.getElementById('rec-input-judul').value = '';
  document.getElementById('rec-input-penulis').value = '';
  document.getElementById('rec-input-desc').value = '';
  document.getElementById('rec-input-review').value = '';
  window.setRecommendationRating(5);
};

window.voteBookReview = function(bookId, reviewId, voteType) {
  const recs = getBookRecommendations();
  const rec = recs.find(r => r.id === bookId);
  if (!rec) return;
  const rev = rec.reviews.find(v => v.id === reviewId);
  if (!rev) return;

  if (rev.userVoted === voteType) {
    if (voteType === 'up') rev.upvotes = Math.max(0, rev.upvotes - 1);
    else rev.downvotes = Math.max(0, rev.downvotes - 1);
    rev.userVoted = null;
  } else {
    if (rev.userVoted === 'up') rev.upvotes = Math.max(0, rev.upvotes - 1);
    else if (rev.userVoted === 'down') rev.downvotes = Math.max(0, rev.downvotes - 1);
    
    if (voteType === 'up') rev.upvotes += 1;
    else rev.downvotes += 1;
    
    rev.userVoted = voteType;
  }

  saveBookRecommendations(recs);
  renderBookRecommendations();
};

window.toggleReviewCommentBox = function(reviewId) {
  const el = document.getElementById(`review-comment-box-${reviewId}`);
  if (el) {
    el.classList.toggle('hidden');
    el.classList.toggle('flex');
  }
};

window.submitReviewReply = function(bookId, reviewId) {
  const input = document.getElementById(`input-review-reply-${reviewId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const recs = getBookRecommendations();
  const rec = recs.find(r => r.id === bookId);
  if (!rec) return;
  const rev = rec.reviews.find(v => v.id === reviewId);
  if (!rev) return;

  rev.comments = rev.comments || [];
  rev.comments.push({
    username: '@SiswaIndonesia',
    text: text,
    waktu: 'Baru saja'
  });

  saveBookRecommendations(recs);
  input.value = '';
  renderBookRecommendations();
  
  // Tetap buka kotak balasan
  const box = document.getElementById(`review-comment-box-${reviewId}`);
  if (box) {
    box.classList.remove('hidden');
    box.classList.add('flex');
  }
};

window.readDigitalBookSimulator = function(bookTitle) {
  let modal = document.getElementById('digital-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'digital-reader-modal';
    modal.className = 'fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="bg-amber-50 text-[#2c1d11] rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-[#ebd7c2] bg-[#fbf4eb]">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#8c6239]">menu_book</span>
          <h2 class="font-bold text-[16px] md:text-[18px] font-serif truncate">Membaca E-Book: ${bookTitle}</h2>
        </div>
        <button onclick="document.getElementById('digital-reader-modal').remove()" class="p-1.5 rounded-full hover:bg-[#ebd7c2] transition-colors text-stone-600 flex items-center justify-center">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <!-- Area Bacaan Buku -->
      <div class="flex-1 overflow-y-auto px-8 py-6 font-serif text-[17px] leading-relaxed custom-scrollbar bg-[#fcf8f2] text-justify select-none">
        <h3 class="text-center font-bold text-2xl mb-8 mt-4 text-[#5c3e21]">BAB I<br>Pertemuan Pertama</h3>
        <p class="mb-4 indent-8">Pagi itu, sinar matahari menembus rimbunnya dedaunan jati di pinggir jalan raya utama. Angin dingin berhembus pelan membawa aroma tanah basah sehabis hujan lebat semalam. Di kejauhan, kepulan asap tipis mulai terlihat membubung dari warung kopi sederhana di bawah pohon beringin tua.</p>
        <p class="mb-4 indent-8">Ia melangkah dengan perlahan, memeluk sebuah buku tebal bersampul biru pudar di dadanya seolah benda itu adalah hal paling berharga di dunia ini. Langkah kakinya sesekali terhenti, matanya menatap liar ke sekeliling seperti sedang mencari seseorang yang telah lama dinanti dalam kebisuan.</p>
        <p class="mb-4 indent-8">"Apakah kau akan datang?" bisiknya perlahan pada angin yang lewat. Pertanyaan itu menguap begitu saja bersama dinginnya pagi, tanpa jawaban, menyisakan rahasia kecil yang hanya disimpan rapat-rapat oleh garis takdir.</p>
        <p class="mb-4 indent-8">Di ReadBridge, Anda dapat menyewa, membeli, atau langsung membaca versi digital lengkap dari buku-buku berlisensi tinggi dengan kenyamanan premium setelan visual yang dapat diatur sesuka hati.</p>
      </div>
      <!-- Footer navigasi halaman -->
      <div class="px-6 py-4 border-t border-[#ebd7c2] bg-[#fbf4eb] flex justify-between items-center text-sm font-sans text-stone-600">
        <span>Halaman 1 dari 480</span>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 bg-[#ebd7c2] rounded hover:bg-[#dec4ab] transition-colors font-bold text-[12px] flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">chevron_left</span> Sebelumnya</button>
          <button class="px-3 py-1 bg-[#ebd7c2] rounded hover:bg-[#dec4ab] transition-colors font-bold text-[12px] flex items-center gap-1">Selanjutnya <span class="material-symbols-outlined text-[16px]">chevron_right</span></button>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
};

// Inisialisasi Bot & Tab Switcher Klub
document.addEventListener('DOMContentLoaded', () => {
  window.communityBot = new CommunityBot();
  window.communityBot.start();

  // 1. Logika Tab Switcher Laman Klub
  const clubTabs = document.querySelectorAll('.club-tab');
  if (clubTabs.length > 0) {
    clubTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = tab.dataset.tab;
        
        clubTabs.forEach(t => {
          t.className = "club-tab px-md py-sm font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer";
        });
        tab.className = "club-tab px-md py-sm font-label-md text-label-md font-bold text-primary border-b-2 border-primary cursor-pointer";
        
        const panels = document.querySelectorAll('.tab-content');
        panels.forEach(p => p.classList.add('hidden'));
        
        const targetPanel = document.getElementById(`tab-${targetTab}`);
        if (targetPanel) {
          targetPanel.classList.remove('hidden');
        }
        
        if (targetTab === 'rekomendasi') {
          renderBookRecommendations();
        }
      });
    });
    
    // Auto-render rekomendasi jika tab awal aktif
    const activeTab = document.querySelector('.club-tab.font-bold');
    if (activeTab && activeTab.dataset.tab === 'rekomendasi') {
      renderBookRecommendations();
    }
  }
});

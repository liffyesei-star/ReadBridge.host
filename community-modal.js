// JavaScript terpusat untuk Fitur Modal Diskusi dan Feed Komunitas

const STORAGE_KEY = 'readbridge_community_posts_v2';
const DRAFT_KEY   = 'readbridge_draft';

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
  }
];

function getPosts(){
  const s=localStorage.getItem(STORAGE_KEY);
  if(s) return JSON.parse(s);
  savePosts(defaultPosts); return defaultPosts;
}
function savePosts(p){ localStorage.setItem(STORAGE_KEY,JSON.stringify(p)); }
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
  const tags=(p.tags||[]).map(t=>`<span class="bg-surface-container-high text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm cursor-pointer hover:bg-primary hover:text-on-primary transition-colors">${t}</span>`).join('');
  const badge=p.isCurrentUser
    ?`<span class="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2 tracking-wider">Anda Author</span>`
    :`<span class="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2 tracking-wider">Author</span>`;
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

  return`<article data-post-id="${p.id}" class="bg-surface-container-lowest rounded-2xl p-lg flex flex-col gap-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow border border-outline-variant/20">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-sm text-on-surface-variant font-label-sm text-label-sm">
        <img src="${avatar}" alt="${p.username}" class="w-10 h-10 rounded-full object-cover border border-outline-variant/50 bg-surface-container-high"/>
        <div class="flex flex-col"><div class="flex items-center"><span class="font-bold text-on-surface text-label-md">${p.username}</span>${badge}${destBadge}</div><span class="text-on-surface-variant/80">${formatWaktu(p.waktu)}${editedBadge}</span></div>
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

function renderAllPosts(){
  const feed=document.getElementById('community-feed');
  if(!feed) return;
  
  // Ambil tipe halaman (Public Feed, Pejuang SNBT, Pecinta Fiksi)
  let currentPageFilter = null;
  if (document.title.includes('Klub Pejuang SNBT')) currentPageFilter = 'Pejuang SNBT';
  else if (document.title.includes('Klub Pecinta Fiksi')) currentPageFilter = 'Pecinta Fiksi';
  // Jika komunitas.html (Public Feed), tampilkan semua

  const posts = getPosts().filter(p => {
    if (!currentPageFilter) return true; // Tampilkan semua di Public Feed
    return p.destination === currentPageFilter || p.destination === 'Public Feed'; // Di dalam klub, tampilkan post klub tsbt + post publik jika relevan (opsional, kita tampilkan saja yang spesifik klub)
  });
  
  const filteredPosts = currentPageFilter ? getPosts().filter(p => p.destination === currentPageFilter) : getPosts();

  feed.innerHTML = filteredPosts.length > 0 ? filteredPosts.map(renderPostCard).join('') : '<p class="text-center text-on-surface-variant font-label-md py-8">Belum ada diskusi di sini.</p>';
}

function ubahVote(id,delta){
  const posts=getPosts(), p=posts.find(x=>x.id===id);
  if(p){ p.votes=Math.max(0,(p.votes||0)+delta); savePosts(posts);
    const el=document.getElementById(`vote-${id}`); if(el)el.textContent=formatVotes(p.votes); }
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

window.deletePost = function(id) {
  if(confirm("Apakah Anda yakin ingin menghapus diskusi ini?")) {
    const posts = getPosts().filter(p => p.id !== id);
    savePosts(posts);
    renderAllPosts();
  }
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

window.addComment = function(id) {
  const input = document.getElementById(`input-comment-${id}`);
  const text = input.value.trim();
  if(!text) return;

  const posts = getPosts();
  const p = posts.find(x => x.id === id);
  if(p) {
    p.commentsList = p.commentsList || [];
    p.commentsList.push({ username: CURRENT_USER_PROFILE, text, waktu: new Date().toISOString() });
    p.komentar = p.commentsList.length;
    savePosts(posts);

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
  document.getElementById('btn-post-diskusi')?.addEventListener('click',()=>{
    const judul=document.getElementById('input-judul').value.trim();
    const isi=(getEditor()?.innerText||'').trim();
    const errEl=document.getElementById('form-error');
    if(!judul||!isi){ errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');

    const activeDestEl=document.querySelector('.dest-pill.bg-primary');
    const destLabel=activeDestEl ? activeDestEl.dataset.dest : 'Public Feed';

    const pollOpts = Array.from(document.querySelectorAll('.poll-opt'))
                          .map(inp => inp.value.trim())
                          .filter(v => v);
    const poll = (document.getElementById('poll-panel') && !document.getElementById('poll-panel').classList.contains('hidden') && pollOpts.length >= 2) ? 
      pollOpts.map(opt => ({ text: opt, count: 0, votedBy: [] })) : null;

    const posts=getPosts(); 
    
    if (window.editingPostId) {
      const idx = posts.findIndex(px => px.id === window.editingPostId);
      if(idx !== -1) {
        posts[idx].judul = judul;
        posts[idx].isi = getEditor().innerHTML;
        posts[idx].tags = [...activeTags];
        posts[idx].destination = destLabel;
        if(poll) posts[idx].poll = poll; // Or preserve existing if not changed, but here we just overwrite
        posts[idx].isEdited = true;
      }
      window.editingPostId = null;
      document.getElementById('btn-post-diskusi').innerHTML = 'Posting Diskusi';
      alert('Diskusi berhasil diupdate!');
    } else {
      const newPost={
        id:'post-'+Date.now(), username:CURRENT_USER_PROFILE, isCurrentUser:true,
        waktu:new Date().toISOString(), judul, isi: getEditor().innerHTML, tags:[...activeTags],
        votes:0, komentar:0, destination:destLabel, poll
      };
      posts.unshift(newPost);
      alert('Diskusi berhasil diposting ke ' + destLabel);
    }
    
    savePosts(posts); 
    renderAllPosts();

    // Reset form
    document.getElementById('input-judul').value='';
    const ed=getEditor(); if(ed) ed.innerHTML='';
    activeTags=[]; renderTagChips();
    document.getElementById('poll-panel')?.classList.add('hidden');
    
    // Clear draft if posted
    localStorage.removeItem(DRAFT_KEY);
    closeModal();
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

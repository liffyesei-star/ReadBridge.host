/**
 * profile-modal.js
 * Komponen Global: Kartu Profil Cepat (Pop-up Modal)
 * ─────────────────────────────────────────────────
 * Import file ini di halaman mana saja untuk mengaktifkan fitur
 * klik-foto-profil → munculkan kartu modal → kirim pesan / tambah teman.
 *
 * Cara pakai:
 *   1. Tambahkan <script src="profile-modal.js"></script> di halaman.
 *   2. Tandai elemen avatar yang bisa diklik dengan atribut:
 *        data-profile-uid="USER_ID"
 *        data-profile-name="Nama Lengkap"
 *        data-profile-avatar="URL_FOTO"
 *        data-profile-status="active|offline"
 *      Contoh:
 *        <img src="..." class="w-10 h-10 rounded-full"
 *             data-profile-uid="UID123"
 *             data-profile-name="Alex Bhaskara"
 *             data-profile-avatar="https://ui-avatars.com/api/?name=Alex+B"
 *             data-profile-status="active">
 *
 *   3. Atau panggil secara manual: showProfileModal(uid, name, avatarUrl, status)
 */

(function () {
  'use strict';

  // ── 1. Inject Modal HTML ──
  const MODAL_HTML = `
  <div id="global-profile-modal" class="fixed inset-0 z-[200] hidden items-center justify-center p-4" style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
    <div id="global-profile-overlay" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0" onclick="closeProfileModal()"></div>
    <div id="global-profile-card" class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[24px] shadow-2xl relative z-10 scale-95 opacity-0 transition-all duration-300 overflow-hidden border border-slate-200/40 dark:border-slate-700/40">
      <!-- Banner -->
      <div class="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-60"></div>
      </div>
      <!-- Close -->
      <button onclick="closeProfileModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors backdrop-blur-md cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
      <!-- Content -->
      <div class="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
        <div class="relative -mt-12 mb-2">
          <img id="modal-profile-avatar" src="" class="w-[88px] h-[88px] rounded-full border-4 border-white dark:border-slate-900 object-cover bg-slate-100 shadow-lg">
          <div id="modal-profile-status" class="absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm"></div>
        </div>

        <h2 id="modal-profile-name" class="text-lg font-black text-slate-900 dark:text-white leading-tight mt-1">Nama</h2>
        <p id="modal-profile-username" class="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">@username</p>
        <p id="modal-profile-status-text" class="text-[11px] text-slate-400 mb-4 flex items-center gap-1"></p>

        <div class="flex gap-2 w-full">
          <button onclick="checkAndSendDM()" id="modal-btn-dm" class="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">chat</span> Kirim Pesan
          </button>
          <button onclick="toggleAddFriend()" id="modal-btn-friend" class="w-12 h-[42px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-xl flex items-center justify-center transition-all cursor-pointer" title="Tambah Teman">
            <span class="material-symbols-outlined text-[20px]">person_add</span>
          </button>
        </div>

        <div id="modal-privacy-warning" class="hidden mt-3 w-full text-left bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-3 py-2">
          <p class="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">lock</span>
            <span id="modal-privacy-text">Pengguna ini membatasi DM hanya untuk teman.</span>
          </p>
        </div>
      </div>
    </div>
  </div>`;

  // Only inject if not already present
  if (!document.getElementById('global-profile-modal')) {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
  }

  // ── 2. Modal Functions ──
  window.showProfileModal = function (uid, name, avatarUrl, status) {
    const modal = document.getElementById('global-profile-modal');
    const overlay = document.getElementById('global-profile-overlay');
    const card = document.getElementById('global-profile-card');

    document.getElementById('modal-profile-name').innerText = name;
    document.getElementById('modal-profile-username').innerText = '@' + name.toLowerCase().replace(/\s+/g, '');
    document.getElementById('modal-profile-avatar').src = avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=e0f2fe&color=0284c7';

    // Status indicator
    const statusDot = document.getElementById('modal-profile-status');
    const statusText = document.getElementById('modal-profile-status-text');
    if (status === 'active') {
      statusDot.className = 'absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm';
      statusText.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online sekarang';
    } else {
      statusDot.className = 'absolute bottom-1 right-1 w-5 h-5 bg-slate-400 rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm';
      statusText.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span> Offline';
    }

    // Store target info
    card.dataset.targetUid = uid || '';
    card.dataset.targetName = name || '';

    // Reset state
    document.getElementById('modal-privacy-warning').classList.add('hidden');
    const friendBtn = document.getElementById('modal-btn-friend');
    const friendIcon = friendBtn.querySelector('.material-symbols-outlined');
    friendIcon.textContent = 'person_add';
    friendBtn.title = 'Tambah Teman';

    // Show
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    });
  };

  window.closeProfileModal = function () {
    const modal = document.getElementById('global-profile-modal');
    const overlay = document.getElementById('global-profile-overlay');
    const card = document.getElementById('global-profile-card');

    overlay.classList.add('opacity-0');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }, 300);
  };

  window.checkAndSendDM = function () {
    const card = document.getElementById('global-profile-card');
    const targetName = card.dataset.targetName;
    const targetUid = card.dataset.targetUid;

    // For demo: "Sarah" has Close Friends Only
    if (targetName && targetName.includes('Sarah')) {
      document.getElementById('modal-privacy-warning').classList.remove('hidden');
      document.getElementById('modal-privacy-text').innerText = targetName + ' membatasi pesan hanya untuk Teman Dekat.';
      return;
    }

    window.location.href = 'pesan.html?to=' + encodeURIComponent(targetUid) + '&name=' + encodeURIComponent(targetName);
  };

  window.toggleAddFriend = function () {
    const btn = document.getElementById('modal-btn-friend');
    const icon = btn.querySelector('.material-symbols-outlined');

    if (icon.textContent === 'person_add') {
      icon.textContent = 'check';
      btn.classList.add('bg-green-50', 'text-green-600', 'border-green-300');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'border-slate-200');
      btn.title = 'Permintaan Terkirim';
    } else {
      icon.textContent = 'person_add';
      btn.classList.remove('bg-green-50', 'text-green-600', 'border-green-300');
      btn.classList.add('bg-slate-100', 'text-slate-600', 'border-slate-200');
      btn.title = 'Tambah Teman';
    }
  };

  // ── 3. Auto-bind data-profile-* Avatars ──
  function bindClickableAvatars() {
    const avatars = document.querySelectorAll('[data-profile-uid]');
    avatars.forEach(el => {
      if (el.dataset._profileBound) return;
      el.dataset._profileBound = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        showProfileModal(
          this.dataset.profileUid,
          this.dataset.profileName,
          this.dataset.profileAvatar,
          this.dataset.profileStatus || 'offline'
        );
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindClickableAvatars);
  } else {
    bindClickableAvatars();
  }

  // Observe for dynamically added avatars
  const observer = new MutationObserver(bindClickableAvatars);
  observer.observe(document.body, { childList: true, subtree: true });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProfileModal();
  });

})();

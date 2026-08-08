/**
 * profile-card.js
 * Sistem global untuk menampilkan Card Profile melayang saat avatar diklik.
 * Menyediakan tombol akses cepat untuk mengirim Direct Message (DM).
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject HTML Modal ke dalam Body
    const modalHTML = `
    <!-- Global Profile Card Modal -->
    <div id="global-profile-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div id="global-profile-card" class="bg-surface dark:bg-on-background w-[90%] max-w-sm rounded-3xl overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300 relative border border-outline-variant/30">
            <!-- Close Button -->
            <button onclick="closeProfileCard()" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10">
                <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
            
            <!-- Header Cover -->
            <div class="h-24 bg-gradient-to-r from-primary to-tertiary w-full"></div>
            
            <!-- Profile Info -->
            <div class="px-6 pb-6 pt-0 relative flex flex-col items-center -mt-12">
                <div class="w-24 h-24 rounded-full border-4 border-surface dark:border-on-background overflow-hidden bg-surface-container shadow-md mb-3">
                    <img id="gpc-avatar" src="https://i.pravatar.cc/150" alt="Avatar" class="w-full h-full object-cover">
                </div>
                
                <h3 id="gpc-name" class="font-display-lg text-xl font-bold text-on-surface dark:text-white leading-tight">Nama Pengguna</h3>
                <p id="gpc-username" class="text-sm font-label-md text-on-surface-variant dark:text-slate-400 mb-4">@username</p>
                
                <div class="flex items-center gap-4 text-xs font-label-md text-on-surface-variant dark:text-slate-300 mb-6 w-full justify-center border-y border-outline-variant/20 py-3">
                    <div class="flex flex-col items-center">
                        <span class="font-bold text-on-surface dark:text-white">128</span>
                        <span>Teman</span>
                    </div>
                    <div class="w-px h-8 bg-outline-variant/30"></div>
                    <div class="flex flex-col items-center">
                        <span class="font-bold text-on-surface dark:text-white">Lvl 12</span>
                        <span>Explorer</span>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex w-full gap-3">
                    <button onclick="viewProfile()" class="flex-1 py-3 bg-primary text-white rounded-xl font-bold font-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">person</span> Profil
                    </button>
                    <button onclick="startDM()" class="flex-1 py-3 bg-surface-container-high dark:bg-slate-800 text-on-surface dark:text-white rounded-xl font-bold font-label-md hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span class="material-symbols-outlined text-[18px]">chat</span> Chat
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
});

// Variabel global sementara untuk menyimpan data target chat
let currentTargetData = null;

// Fungsi Global untuk memanggil Card
window.showProfileCard = function(element, name, username, avatarSrc, targetUid) {
    const modal = document.getElementById('global-profile-modal');
    const card = document.getElementById('global-profile-card');
    
    // Default UID jika tidak diberikan (fallback menggunakan username)
    const uid = targetUid || username.replace('@', '');
    
    let resolvedAvatar = avatarSrc;
    if(!resolvedAvatar && element && element.querySelector('img')) {
        resolvedAvatar = element.querySelector('img').src;
    }
    if(!resolvedAvatar) {
        resolvedAvatar = "https://i.pravatar.cc/150";
    }

    // Set Data UI
    document.getElementById('gpc-name').innerText = name || "Pengguna ReadBridge";
    document.getElementById('gpc-username').innerText = username || "@user";
    document.getElementById('gpc-avatar').src = resolvedAvatar;
    
    // Simpan data target
    currentTargetData = {
        uid: uid,
        name: name || "Pengguna ReadBridge",
        avatar: resolvedAvatar
    };
    
    // Animate In
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Trigger reflow
    void modal.offsetWidth;
    
    modal.classList.remove('opacity-0');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
}

window.closeProfileCard = function() {
    const modal = document.getElementById('global-profile-modal');
    const card = document.getElementById('global-profile-card');
    
    // Animate Out
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        currentTargetData = null;
    }, 300);
}

// Navigasi ke Pesan dengan Data URL
window.startDM = function() {
    if (currentTargetData) {
        // Enkode parameter agar aman di URL
        const params = new URLSearchParams({
            to: currentTargetData.uid,
            name: currentTargetData.name,
            avatar: currentTargetData.avatar
        });
        window.location.href = 'pesan.html?' + params.toString();
    } else {
        window.location.href = 'pesan.html';
    }
}

// Navigasi ke Profil dengan Data URL
window.viewProfile = function() {
    if (currentTargetData) {
        const params = new URLSearchParams({
            uid: currentTargetData.uid,
            name: currentTargetData.name,
            avatar: currentTargetData.avatar
        });
        window.location.href = 'profile.html?' + params.toString();
    } else {
        window.location.href = 'profile.html';
    }
}

// Tutup modal jika area luar diklik
document.addEventListener('click', (e) => {
    const modal = document.getElementById('global-profile-modal');
    const card = document.getElementById('global-profile-card');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.target === modal) {
            closeProfileCard();
        }
    }
});

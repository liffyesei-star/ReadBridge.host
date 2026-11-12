/**
 * ReadBridge — Unified UI Header & Navigation Sync
 * Tanggung Jawab: Menjaga konsistensi Top App Bar, status autentikasi,
 * menu toko/kreator, dan aksesibilitas di seluruh halaman aplikasi.
 */
function getApiBaseUrl() {
  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  return (
    localStorage.getItem('rb_api_base_url') ||
    (isLocalHost ? 'http://localhost:5001' : 'https://readbridge-backend-2whx.onrender.com')
  );
}

function normalizeHeaderShell() {
  // 1. Remove any legacy dynamic logo dropdown hijackers
  const legacyLogoMenu = document.getElementById('dynamic-logo-menu');
  if (legacyLogoMenu) legacyLogoMenu.remove();
  const logoDropdown = document.getElementById('logo-dropdown');
  if (logoDropdown) logoDropdown.remove();

  const header = document.querySelector('header');
  if (!header) return;

  // 2. Fix non-standard Tailwind classes ("docked full-width") into sticky top-0 w-full
  if (header.classList.contains('docked') || header.classList.contains('full-width')) {
    header.classList.remove('docked', 'full-width');
    header.classList.add('sticky', 'top-0', 'w-full', 'z-50');
  }

  // 3. Ensure the ReadBridge brand logo always links cleanly to index.html
  const brandCandidates = header.querySelectorAll('a, span');
  brandCandidates.forEach((el) => {
    const text = (el.textContent || '').replace(/expand_more/g, '').trim();
    if (text === 'ReadBridge') {
      // Remove any injected expand_more icon inside logo
      el.querySelectorAll('.material-symbols-outlined').forEach((icon) => {
        if (icon.textContent.trim() === 'expand_more') icon.remove();
      });

      if (el.tagName.toLowerCase() === 'a') {
        el.href = 'index.html';
      } else if (el.parentElement && el.parentElement.tagName.toLowerCase() !== 'a') {
        const anchor = document.createElement('a');
        anchor.href = 'index.html';
        anchor.className = el.className + ' hover:opacity-90 transition-opacity';
        anchor.textContent = 'ReadBridge';
        el.replaceWith(anchor);
      }
    }
  });

  // 4. Synchronize active state on desktop & mobile primary navigation links
  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const routeGroupMap = {
    'index.html': 'index.html',
    '': 'index.html',
    'eksplor.html': 'eksplor.html',
    'detail-tulisan.html': 'eksplor.html',
    'creator-write.html': 'eksplor.html',
    'marketplace.html': 'marketplace.html',
    'detail.html': 'marketplace.html',
    'buka-toko.html': 'marketplace.html',
    'dashboard-seller.html': 'marketplace.html',
    'komunitas.html': 'komunitas.html',
    'detail-diskusi.html': 'komunitas.html',
    'club.html': 'komunitas.html',
    'club-detail.html': 'komunitas.html',
    'leaderboard.html': 'komunitas.html',
    'perpustakaan.html': 'perpustakaan.html'
  };
  const activeNavHref = routeGroupMap[currentFile] || currentFile;

  const navLinks = header.querySelectorAll('nav a[href]');
  navLinks.forEach((link) => {
    const href = (link.getAttribute('href') || '').split('?')[0].toLowerCase();
    if (!['index.html', 'eksplor.html', 'marketplace.html', 'komunitas.html', 'perpustakaan.html'].includes(href)) {
      return;
    }
    const isMobile = !!link.closest('#mobile-menu-drawer');
    if (isMobile) return;

    if (href === activeNavHref) {
      link.classList.remove('text-slate-600', 'dark:text-slate-400', 'text-on-surface-variant', 'font-medium');
      link.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold', 'border-b-2', 'border-blue-600', 'pb-0.5');
    } else {
      link.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold', 'border-b-2', 'border-blue-600', 'pb-0.5', 'text-primary', 'border-primary');
      link.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:text-blue-600', 'dark:hover:text-blue-400', 'font-medium', 'transition-colors');
    }
  });
}

function injectCreatorWriteMenu() {
  const dropdowns = document.querySelectorAll('[id^="profile-dropdown"]');
  dropdowns.forEach((dropdown) => {
    if (dropdown.querySelector('a[href="creator-write.html"]')) return;

    const link = document.createElement('a');
    link.href = 'creator-write.html';
    link.className =
      'flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface';
    link.innerHTML =
      '<span class="material-symbols-outlined text-[20px]">edit_square</span> Creator Write';

    const logoutLink = Array.from(dropdown.querySelectorAll('a')).find((item) =>
      /log\s*out|keluar/i.test(item.textContent)
    );
    if (logoutLink) {
      dropdown.insertBefore(link, logoutLink);
    } else {
      dropdown.appendChild(link);
    }
  });
}

function removeSellerMenuLinks(dropdown) {
  dropdown
    .querySelectorAll(".rb-seller-menu, a[href='buka-toko.html'], a[href='dashboard-seller.html']")
    .forEach((el) => {
      el.remove();
    });
}

function injectSellerMenu(dropdown, hasToko) {
  const logOutLink = Array.from(dropdown.querySelectorAll('a')).find(
    (a) => /login\.html/i.test(a.getAttribute('href') || '') || /log\s*out|keluar/i.test(a.textContent)
  );
  removeSellerMenuLinks(dropdown);

  const link = document.createElement('a');
  link.className =
    'rb-seller-menu flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors font-label-md text-label-md text-on-surface';

  if (hasToko) {
    link.href = 'dashboard-seller.html';
    link.innerHTML = '<span class="material-symbols-outlined text-[20px]">storefront</span> Toko Saya';
  } else {
    link.href = 'buka-toko.html';
    link.innerHTML = '<span class="material-symbols-outlined text-[20px]">add_business</span> Buka Toko';
  }

  if (logOutLink) dropdown.insertBefore(link, logOutLink);
  else dropdown.appendChild(link);
}

function bindLogoutLinks() {
  document.querySelectorAll('#profile-dropdown a, #profile-dropdown-nav a').forEach((a) => {
    if (/log\s*out|keluar/i.test(a.textContent) && !a.dataset.rbLogoutBound) {
      a.dataset.rbLogoutBound = 'true';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('rb_token');
        localStorage.removeItem('rb_user');
        localStorage.removeItem('rb_profile_pic');
        localStorage.removeItem('rb_username');
        localStorage.removeItem('rb_is_logged_in');
        localStorage.removeItem('rb_has_toko');
        window.location.href = 'login.html';
      });
    }
  });
}

function updateMarketplaceSellerPortal(hasToko) {
  const portal = document.getElementById('rb-seller-portal-link');
  if (!portal) return;

  if (hasToko) {
    portal.href = 'dashboard-seller.html';
    portal.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">storefront</span> Toko Saya';
  } else {
    portal.href = 'buka-toko.html';
    portal.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">add_business</span> Buka Toko';
  }
}

async function fetchHasToko(token) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/toko`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      const hasToko = !!data.has_toko;
      localStorage.setItem('rb_has_toko', hasToko ? 'true' : 'false');
      return hasToko;
    }
    return localStorage.getItem('rb_has_toko') === 'true';
  } catch (err) {
    return localStorage.getItem('rb_has_toko') === 'true';
  }
}

function applySellerMenus(token) {
  const cached = localStorage.getItem('rb_has_toko');
  if (cached !== null) {
    const hasCached = cached === 'true';
    document.querySelectorAll('#profile-dropdown, #profile-dropdown-nav').forEach((dropdown) => {
      injectSellerMenu(dropdown, hasCached);
    });
    updateMarketplaceSellerPortal(hasCached);
  }

  fetchHasToko(token).then((hasToko) => {
    document.querySelectorAll('#profile-dropdown, #profile-dropdown-nav').forEach((dropdown) => {
      injectSellerMenu(dropdown, hasToko);
    });
    updateMarketplaceSellerPortal(hasToko);
  });
}

export function syncHeader() {
  normalizeHeaderShell();

  const isLoggedIn = localStorage.getItem('rb_is_logged_in') === 'true';
  const token = localStorage.getItem('rb_token');

  const navGuest = document.getElementById('nav-guest');
  const navUser = document.getElementById('nav-user');
  const profileMenuContainer =
    document.getElementById('profile-menu-container') ||
    document.getElementById('profile-menu-container-nav');

  // Sync Guest/User Top Nav visibility
  if (navGuest && navUser) {
    if (isLoggedIn && token) {
      navGuest.classList.add('hidden');
      navUser.classList.remove('hidden');
      navUser.classList.add('flex');
    } else {
      navGuest.classList.remove('hidden');
      navGuest.classList.add('flex');
      navUser.classList.add('hidden');
      navUser.classList.remove('flex');
    }
  } else if (profileMenuContainer) {
    const parent = profileMenuContainer.parentElement;
    if (isLoggedIn && token) {
      profileMenuContainer.classList.remove('hidden');
      const oldGuestBtn = parent.querySelector('.rb-dynamic-guest-btn');
      if (oldGuestBtn) oldGuestBtn.remove();
    } else {
      profileMenuContainer.classList.add('hidden');
      if (!parent.querySelector('.rb-dynamic-guest-btn')) {
        const guestBtn = document.createElement('a');
        guestBtn.href = 'login.html';
        guestBtn.className =
          'rb-dynamic-guest-btn bg-primary text-on-primary font-label-md text-label-md px-5 py-2 rounded-full hover:bg-surface-tint transition-colors flex items-center justify-center font-bold shadow-sm';
        guestBtn.textContent = 'Masuk';
        parent.insertBefore(guestBtn, profileMenuContainer);
      }
    }
  }

  // Update Avatar, Usernames, and Menus
  if (isLoggedIn && token) {
    injectCreatorWriteMenu();
    bindLogoutLinks();

    let savedPic = localStorage.getItem('rb_profile_pic');
    let savedName = localStorage.getItem('rb_username');

    if (!savedPic || !savedName) {
      try {
        const userObj = JSON.parse(localStorage.getItem('rb_user'));
        if (userObj) {
          if (!savedPic) savedPic = userObj.foto_profil;
          if (!savedName) savedName = userObj.nama || userObj.username;
        }
      } catch (e) {}
    }

    if (savedPic) {
      document
        .querySelectorAll('#profile-avatar-btn img, #profile-avatar-btn-nav img, #nav-avatar')
        .forEach((img) => {
          img.src = savedPic;
        });
    }

    if (savedName) {
      document.querySelectorAll('#profile-dropdown, #profile-dropdown-nav').forEach((dropdown) => {
        const usernameEl = dropdown.querySelector(
          'p.text-on-surface.font-bold, p.font-bold.truncate, #nav-username'
        );
        if (usernameEl) usernameEl.textContent = savedName;
      });
    }

    applySellerMenus(token);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncHeader);
} else {
  syncHeader();
}

/**
 * ReadBridge — UI Header Sync
 * Tanggung Jawab: Update navigasi/header berdasarkan status login dan izin toko.
 */
import { getApiBaseUrl } from '../auth/api.js';

function injectCreatorWriteMenu() {
  const dropdowns = document.querySelectorAll('[id^="profile-dropdown"]');
  dropdowns.forEach(dropdown => {
    if (dropdown.querySelector('a[href="creator-write.html"]')) return;
    
    const link = document.createElement("a");
    link.href = "creator-write.html";
    link.className = "flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface";
    link.innerHTML = '<span class="material-symbols-outlined text-[20px]">edit_square</span> Creator Write';

    const logoutLink = Array.from(dropdown.querySelectorAll("a")).find(item => /log\s*out/i.test(item.textContent));
    if (logoutLink) {
      dropdown.insertBefore(link, logoutLink);
    } else {
      dropdown.appendChild(link);
    }
  });
}

function removeSellerMenuLinks(dropdown) {
  dropdown.querySelectorAll(".rb-seller-menu, a[href='buka-toko.html'], a[href='dashboard-seller.html']").forEach(el => {
    el.remove();
  });
}

function injectSellerMenu(dropdown, hasToko) {
  const logOutLink = Array.from(dropdown.querySelectorAll("a")).find(a => 
    /login\.html/i.test(a.getAttribute("href") || "") && /log\s*out/i.test(a.textContent)
  );
  removeSellerMenuLinks(dropdown);

  const link = document.createElement("a");
  link.className = "rb-seller-menu flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors font-label-md text-label-md text-on-surface";

  if (hasToko) {
    link.href = "dashboard-seller.html";
    link.innerHTML = '<span class="material-symbols-outlined text-[20px]">storefront</span> Toko Saya';
  } else {
    link.href = "buka-toko.html";
    link.innerHTML = '<span class="material-symbols-outlined text-[20px]">add_business</span> Buka Toko';
  }

  if (logOutLink) dropdown.insertBefore(link, logOutLink);
  else dropdown.appendChild(link);
}

function updateMarketplaceSellerPortal(hasToko) {
  const portal = document.getElementById("rb-seller-portal-link");
  if (!portal) return;
  
  if (hasToko) {
    portal.href = "dashboard-seller.html";
    portal.innerHTML = '<span class="material-symbols-outlined text-[18px]">storefront</span> Toko Saya / Berjualan';
  } else {
    portal.href = "buka-toko.html";
    portal.innerHTML = '<span class="material-symbols-outlined text-[18px]">add_business</span> Buka Toko';
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
      localStorage.setItem("rb_has_toko", hasToko ? "true" : "false");
      return hasToko;
    }
    return localStorage.getItem("rb_has_toko") === "true";
  } catch (err) {
    console.warn("[ReadBridge UI] Cek toko error:", err.message);
    return localStorage.getItem("rb_has_toko") === "true";
  }
}

function applySellerMenus(token) {
  const cached = localStorage.getItem("rb_has_toko");
  if (cached !== null) {
    const hasCached = cached === "true";
    document.querySelectorAll("#profile-dropdown, #profile-dropdown-nav").forEach(dropdown => {
      injectSellerMenu(dropdown, hasCached);
    });
    updateMarketplaceSellerPortal(hasCached);
  }

  // Fetch from backend for freshness
  fetchHasToko(token).then(hasToko => {
    document.querySelectorAll("#profile-dropdown, #profile-dropdown-nav").forEach(dropdown => {
      injectSellerMenu(dropdown, hasToko);
    });
    updateMarketplaceSellerPortal(hasToko);
  });
}

export function syncHeader() {
  const isLoggedIn = localStorage.getItem("rb_is_logged_in") === "true";
  const token = localStorage.getItem("rb_token");
  
  const navGuest = document.getElementById("nav-guest");
  const navUser = document.getElementById("nav-user");
  const profileMenuContainer = document.getElementById("profile-menu-container") || document.getElementById("profile-menu-container-nav");

  // Sync Guest/User Top Nav visibility
  if (navGuest && navUser) {
    if (isLoggedIn && token) {
      navGuest.classList.add("hidden");
      navUser.classList.remove("hidden");
      navUser.classList.add("flex");
    } else {
      navGuest.classList.remove("hidden");
      navGuest.classList.add("flex");
      navUser.classList.add("hidden");
      navUser.classList.remove("flex");
    }
  } else if (profileMenuContainer) {
    const parent = profileMenuContainer.parentElement;
    if (isLoggedIn && token) {
      profileMenuContainer.classList.remove("hidden");
      const oldGuestBtn = parent.querySelector(".rb-dynamic-guest-btn");
      if (oldGuestBtn) oldGuestBtn.remove();
    } else {
      profileMenuContainer.classList.add("hidden");
      if (!parent.querySelector(".rb-dynamic-guest-btn")) {
        const guestBtn = document.createElement("a");
        guestBtn.href = "login.html";
        guestBtn.className = "rb-dynamic-guest-btn bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-full hover:bg-surface-tint transition-colors flex items-center justify-center";
        guestBtn.style.padding = "8px 24px";
        guestBtn.style.borderRadius = "9999px";
        guestBtn.textContent = "Mulai Baca";
        parent.insertBefore(guestBtn, profileMenuContainer);
      }
    }
  }

  // Update Avatar and Usernames
  if (isLoggedIn && token) {
    injectCreatorWriteMenu();

    const savedPic = localStorage.getItem("rb_profile_pic");
    const savedName = localStorage.getItem("rb_username");
    
    if (savedPic) {
      document.querySelectorAll("#profile-avatar-btn img, #profile-avatar-btn-nav img, #nav-avatar").forEach(img => {
        img.src = savedPic;
      });
    }

    if (savedName) {
      document.querySelectorAll("#profile-dropdown, #profile-dropdown-nav").forEach(dropdown => {
        const usernameEl = dropdown.querySelector("p.text-on-surface.font-bold, p.font-bold.truncate, #nav-username");
        if (usernameEl) usernameEl.textContent = savedName;
      });
    }

    applySellerMenus(token);
  }
}

// Auto init saat DOM loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", syncHeader);
} else {
  syncHeader();
}

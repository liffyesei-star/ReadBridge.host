/** Logout ReadBridge — memanggil rb-auth.js */
const AUTH_MODULE = "./rb-auth.js?v=1";

function clearLocalAuthFallback() {
  localStorage.setItem("rb_explicit_logout", "true");
  [
    "rb_token",
    "rb_is_logged_in",
    "rb_is_synced",
    "rb_username",
    "rb_email",
    "rb_uid",
    "rb_profile_pic",
    "rb_user_email",
    "rb_login_in_progress",
  ].forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("rb_google_busy");
}

window.rbLogout = async function rbLogout(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    const mod = await import(AUTH_MODULE);
    await mod.logoutReadBridge();
  } catch (err) {
    console.warn("[ReadBridge] logout fallback:", err);
    clearLocalAuthFallback();
  }
  window.location.href = "login.html";
};

document.addEventListener(
  "click",
  (event) => {
    const link = event.target.closest('a[href*="login.html"]');
    if (!link || !/log\s*out/i.test(link.textContent)) return;
    event.preventDefault();
    event.stopPropagation();
    if (link.getAttribute("data-rb-logout-handled") === "1") return;
    link.setAttribute("data-rb-logout-handled", "1");
    rbLogout(event);
  },
  true
);

// Dynamic Prototype & Sandbox Mode Warnings Injection
(function injectWarning() {
  function initWarning() {
    // Prevent duplicate injections
    if (document.getElementById("rb-warning-styles")) return;

    // 1. CSS Styles injection
    const style = document.createElement("style");
    style.id = "rb-warning-styles";
    style.textContent = `
      /* Banner Styles */
      .rb-warning-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 10px 24px;
        background-color: #fffbeb;
        border-bottom: 1px solid #fde68a;
        color: #b45309;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 600;
        text-align: center;
        position: relative;
        z-index: 100000;
        transition: all 0.3s ease;
      }
      .dark .rb-warning-banner {
        background-color: #78350f;
        border-bottom: 1px solid #92400e;
        color: #fef3c7;
      }
      .rb-warning-banner .rb-close-btn {
        background: none;
        border: none;
        color: currentColor;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
        line-height: 1;
      }
      .rb-warning-banner .rb-close-btn:hover {
        opacity: 1;
      }

      /* Modal Overlay */
      .rb-warning-modal-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200000;
        opacity: 0;
        transition: opacity 0.4s ease;
        padding: 16px;
      }
      .rb-warning-modal-overlay.active {
        opacity: 1;
      }

      /* Modal Content Box */
      .rb-warning-modal-box {
        background-color: #ffffff;
        color: #0f172a;
        width: 100%;
        max-width: 520px;
        padding: 32px;
        border-radius: 24px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        border: 1px solid rgba(226, 232, 240, 0.8);
      }
      .dark .rb-warning-modal-box {
        background-color: #1e293b;
        color: #f8fafc;
        border: 1px solid rgba(51, 65, 85, 0.8);
      }
      .rb-warning-modal-overlay.active .rb-warning-modal-box {
        transform: scale(1);
      }

      .rb-warning-modal-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 16px 0;
        color: #d97706;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dark .rb-warning-modal-title {
        color: #fbbf24;
      }
      .rb-warning-modal-text {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 20px;
        opacity: 0.9;
      }
      .rb-warning-modal-list {
        list-style: none;
        padding: 0;
        margin: 0 0 28px 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .rb-warning-modal-list li {
        font-size: 14px;
        line-height: 1.5;
        padding-left: 8px;
        position: relative;
      }
      .rb-warning-modal-btn {
        width: 100%;
        padding: 14px 24px;
        background-color: #2563eb;
        color: #ffffff;
        border: none;
        border-radius: 9999px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
      }
      .rb-warning-modal-btn:hover {
        background-color: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
      }
      .rb-warning-modal-btn:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // 2. Render Banner
    // Check if banner is closed in sessionStorage
    if (!sessionStorage.getItem("rb_banner_closed")) {
      const banner = document.createElement("div");
      banner.className = "rb-warning-banner";
      banner.innerHTML = `
        <span>⚠️ <strong>Mode Sandbox:</strong> Website ini adalah prototype uji coba. Transaksi & produk bersifat simulasi.</span>
        <button type="button" class="rb-close-btn" aria-label="Tutup" onclick="this.parentElement.remove(); sessionStorage.setItem('rb_banner_closed', 'true');">×</button>
      `;
      // Prepend to body
      document.body.insertBefore(banner, document.body.firstChild);
    }

    // 3. Render Modal (One-time per session)
    if (!sessionStorage.getItem("rb_warning_seen")) {
      const overlay = document.createElement("div");
      overlay.className = "rb-warning-modal-overlay";
      
      const modalBox = document.createElement("div");
      modalBox.className = "rb-warning-modal-box";
      modalBox.innerHTML = `
        <h3 class="rb-warning-modal-title">⚠️ Pemberitahuan Penting (Prototype)</h3>
        <p class="rb-warning-modal-text">
          Selamat datang di <strong>ReadBridge</strong>. Harap diperhatikan bahwa website ini dibangun sebagai media <strong>prototype uji coba</strong> dan belum beroperasi secara komersial/nyata.
        </p>
        <ul class="rb-warning-modal-list">
          <li>📦 <strong>Produk Uji Coba:</strong> Seluruh katalog buku, jurnal, dan produk lainnya hanyalah konten simulasi untuk demonstrasi fitur.</li>
          <li>💳 <strong>Transaksi Sandbox:</strong> Proses pembayaran, sewa, beli, dan checkout di website ini hanya bersifat simulasi dan tidak memungut biaya/transaksi riil.</li>
          <li>🛠️ <strong>Masih Dikembangkan:</strong> Beberapa fitur sedang disempurnakan dan terus disinkronisasi ke server pengembangan.</li>
        </ul>
        <button type="button" class="rb-warning-modal-btn">Saya Mengerti & Setuju</button>
      `;
      
      overlay.appendChild(modalBox);
      document.body.appendChild(overlay);
      
      // Trigger animation
      setTimeout(() => overlay.classList.add("active"), 50);
      
      const dismissBtn = modalBox.querySelector(".rb-warning-modal-btn");
      dismissBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        sessionStorage.setItem("rb_warning_seen", "true");
        setTimeout(() => overlay.remove(), 400); // Wait for transition to finish
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWarning);
  } else {
    initWarning();
  }
})();

// Dynamic synchronization of header auth state, user details, and profile dropdown setup
(function syncHeaderAndDropdown() {
  function initHeaderAndDropdown() {
    const isLoggedIn = localStorage.getItem("rb_is_logged_in") === "true";
    const token = localStorage.getItem("rb_token");
    
    const navGuest = document.getElementById("nav-guest");
    const navUser = document.getElementById("nav-user");
    const profileMenuContainer = document.getElementById("profile-menu-container") || document.getElementById("profile-menu-container-nav");

    // 1. Synchronize Guest / Logged In header layout
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
      // For pages without nav-guest/nav-user containers, show/hide profile container dynamically
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

    // 2. Setup Logged-In User Details (Avatar and Name)
    if (isLoggedIn && token) {
      const savedPic = localStorage.getItem("rb_profile_pic");
      const savedName = localStorage.getItem("rb_username");
      
      const avatarImgs = document.querySelectorAll("#profile-avatar-btn img, #profile-avatar-btn-nav img, #nav-avatar");
      avatarImgs.forEach(img => {
        if (savedPic && img.src !== savedPic) {
          img.src = savedPic;
        }
      });

      const dropdowns = document.querySelectorAll("#profile-dropdown, #profile-dropdown-nav");
      dropdowns.forEach(dropdown => {
        const usernameEl = dropdown.querySelector("p.text-on-surface.font-bold, p.font-bold.truncate, #nav-username");
        if (usernameEl && savedName) {
          usernameEl.textContent = savedName;
        }

        // Avoid duplicate "Toko Saya" links
        if (dropdown.querySelector("a[href='dashboard-seller.html']")) return;

        const sellerLink = document.createElement("a");
        sellerLink.href = "dashboard-seller.html";
        sellerLink.className = "flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors font-label-md text-label-md text-on-surface";
        sellerLink.innerHTML = `<span class="material-symbols-outlined text-[20px]">storefront</span> Toko Saya`;

        // Find Log Out link (normally contains logout or log out text)
        const logOutLink = Array.from(dropdown.querySelectorAll("a")).find(a => 
          /logout/i.test(a.href) || /log\s*out/i.test(a.textContent)
        );

        if (logOutLink) {
          dropdown.insertBefore(sellerLink, logOutLink);
        } else {
          dropdown.appendChild(sellerLink);
        }
      });
    }

    // 3. Setup Dropdown Toggling Event Listeners (Universal mobile/desktop support)
    const btn = document.querySelector("#profile-avatar-btn, #profile-avatar-btn-nav");
    const dropdown = document.querySelector("#profile-dropdown, #profile-dropdown-nav");
    if (btn && dropdown) {
      if (btn.getAttribute("data-toggle-attached") !== "1") {
        btn.setAttribute("data-toggle-attached", "1");
        
        // Use pointer events or click for robust mobile touch response
        const toggleDropdown = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isHidden = dropdown.classList.contains("hidden");
          if (isHidden) {
            dropdown.classList.remove("hidden");
            dropdown.classList.add("flex");
          } else {
            dropdown.classList.add("hidden");
            dropdown.classList.remove("flex");
          }
        };

        btn.addEventListener("click", toggleDropdown);
      }
    }

    // Click outside to close active dropdowns
    if (document.body.getAttribute("data-outside-click-attached") !== "1") {
      document.body.setAttribute("data-outside-click-attached", "1");
      document.addEventListener("click", (e) => {
        const activeDropdowns = document.querySelectorAll("#profile-dropdown:not(.hidden), #profile-dropdown-nav:not(.hidden)");
        activeDropdowns.forEach(drop => {
          const avatarBtn = document.querySelector("#profile-avatar-btn, #profile-avatar-btn-nav");
          if (!drop.contains(e.target) && (!avatarBtn || !avatarBtn.contains(e.target))) {
            drop.classList.add("hidden");
            drop.classList.remove("flex");
          }
        });
      });
    }
  }

  // Execute on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderAndDropdown);
  } else {
    initHeaderAndDropdown();
  }
})();

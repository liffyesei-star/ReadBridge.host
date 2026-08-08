// js/auth.js
// Mengelola autentikasi pengguna secara lokal menggunakan JWT

const API_URL = (['localhost', '127.0.0.1'].includes(window.location.hostname)) 
  ? 'http://localhost:5001/api/auth' 
  : 'https://readbridge-backend-2whx.onrender.com/api/auth';

const Auth = {
  // Setup loading state di tombol
  setLoading: (btn, isLoading, text = 'Proses...') => {
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> ${text}`;
      btn.disabled = true;
      btn.classList.add('opacity-70', 'cursor-not-allowed');
    } else {
      btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
      btn.disabled = false;
      btn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
  },

  // Tampilkan notifikasi toast/alert
  showMessage: (msg, type = 'error') => {
    // Kita buat elemen toast sederhana di body
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-lg text-white font-label-md transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2`;
    toast.style.backgroundColor = type === 'error' ? '#BA1A1A' : '#146C2E';
    toast.innerHTML = `<span class="material-symbols-outlined">${type === 'error' ? 'error' : 'check_circle'}</span> ${msg}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.replace('translate-y-0', '-translate-y-10');
      toast.classList.replace('opacity-100', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Menyimpan token
  setToken: (token, user) => {
    localStorage.setItem('rb_token', token);
    localStorage.setItem('rb_user', JSON.stringify(user));
    if (user && user.foto_profil) localStorage.setItem('rb_profile_pic', user.foto_profil);
    if (user && (user.nama || user.username)) localStorage.setItem('rb_username', user.nama || user.username);
    localStorage.setItem('rb_is_logged_in', 'true');
  },

  // Mendapatkan token
  getToken: () => {
    return localStorage.getItem('rb_token');
  },

  // Mendapatkan user info
  getUser: () => {
    try {
      const user = localStorage.getItem('rb_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Cek status login
  isLoggedIn: () => {
    return !!Auth.getToken();
  },

  // Login
  login: async (email, password, btn) => {
    Auth.setLoading(btn, true, 'Sedang masuk...');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        Auth.setToken(data.token, data.user);
        Auth.showMessage('Login berhasil!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
      } else {
        throw new Error(data.message || 'Login gagal');
      }
    } catch (err) {
      Auth.showMessage(err.message, 'error');
    } finally {
      Auth.setLoading(btn, false);
    }
  },

  // Register
  register: async (nama, email, password, btn) => {
    Auth.setLoading(btn, true, 'Mendaftarkan...');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        Auth.setToken(data.token, data.user);
        Auth.showMessage('Registrasi berhasil!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
      } else {
        throw new Error(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      Auth.showMessage(err.message, 'error');
    } finally {
      Auth.setLoading(btn, false);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_user');
    localStorage.removeItem('rb_profile_pic');
    localStorage.removeItem('rb_username');
    localStorage.removeItem('rb_is_logged_in');
    window.location.href = 'login.html';
  },

  // Melindungi halaman (redirect ke login jika belum login)
  protectRoute: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  // Redirect jika sudah login (dipakai di halaman login/register)
  redirectIfLoggedIn: () => {
    if (Auth.isLoggedIn()) {
      window.location.href = 'index.html';
    }
  },
  
  // Mengupdate UI berdasarkan status login
  updateUI: () => {
    const user = Auth.getUser();
    const loginBtn = document.getElementById('btn-login-nav');
    const profileMenu = document.getElementById('profile-menu-container');
    
    if (user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (profileMenu) {
        profileMenu.classList.remove('hidden');
        const nameEl = document.getElementById('nav-user-name');
        if (nameEl) nameEl.textContent = user.nama || user.username || 'User';
      }

      const displayName = user.nama || user.username || 'Pengguna';

      // Global text replacement for "Siswa Indonesia" (Decoy data fix)
      const textEls = document.querySelectorAll('span.text-on-surface, p.text-on-surface, p.truncate, h1, h2, h3, h4, h5, h6, .rb-username-fill');
      for (let i = 0; i < textEls.length; i++) {
          if (textEls[i].textContent.trim() === 'Siswa Indonesia') {
              textEls[i].textContent = displayName;
          }
      }

      // Sync avatar on nav header (if any element has an avatar class or id)
      const navAvatars = document.querySelectorAll('#profile-menu-container img, #profile-menu-container-nav img, .nav-user-avatar, #profile-avatar-btn img, #profile-avatar-btn-nav img');
      if (user.foto_profil) {
          navAvatars.forEach(img => img.src = user.foto_profil);
      }

      // Sync specific inputs (e.g. for pengaturan.html and checkout.html)
      const inputNama = document.getElementById('input-nama');
      if (inputNama && inputNama.value === 'Siswa Indonesia') inputNama.value = displayName;
      else if (inputNama && !inputNama.value) inputNama.value = displayName;
      
      const inputUsername = document.getElementById('input-username');
      if (inputUsername && (!inputUsername.value || inputUsername.value === '')) inputUsername.value = user.username || '';
      
      const inputEmail = document.getElementById('input-email-settings');
      if (inputEmail && (!inputEmail.value || inputEmail.value === 'nama@email.com')) inputEmail.value = user.email || '';
      
      const avatarPreview = document.getElementById('avatar-preview');
      if (avatarPreview && user.foto_profil) avatarPreview.src = user.foto_profil;

    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (profileMenu) profileMenu.classList.add('hidden');
    }
  },

  async googleLogin(firebaseToken) {
    try {
      const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: firebaseToken })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal login via Google');
      }

      this.setToken(data.token, data.user);
      return data;
    } catch (error) {
      console.error('API Google Login Error:', error);
      throw error;
    }
  }
};

window.Auth = Auth;

// Otomatis update UI saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    if (window.Auth && window.Auth.updateUI) {
        window.Auth.updateUI();
    }
});

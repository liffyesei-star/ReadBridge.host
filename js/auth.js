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
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (profileMenu) profileMenu.classList.add('hidden');
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

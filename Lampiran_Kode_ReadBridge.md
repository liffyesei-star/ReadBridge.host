# Lampiran Kode Utama Proyek ReadBridge & Penjelasannya

Dokumen ini berisi rincian kode-kode terpenting (inti) yang menyusun fungsionalitas interaktif *ReadBridge* di sisi klien (browser), beserta dokumentasi fungsi dari setiap baris kodenya.

---

## 1. `community-modal.js` - Sistem Diskusi Komunitas
File ini mengendalikan semua aktivitas di halaman Komunitas, termasuk membuat postingan baru, memberikan suara (upvote/downvote), dan memberikan komentar.

### Cuplikan Kode Penting (Render Post):
```javascript
// Fungsi untuk mem-format jumlah vote agar lebih mudah dibaca (misal: 1500 jadi 1.5k)
function formatVotes(votes) {
  if (votes >= 1000) return (votes / 1000).toFixed(1) + 'k';
  return votes;
}

// Fungsi untuk menambah/mengurangi vote pada sebuah postingan
window.ubahVote = function(postId, delta) {
  // 1. Cari letak indeks postingan di memori (state.posts) berdasarkan ID
  const pIndex = state.posts.findIndex(p => p.id === postId);
  if (pIndex === -1) return; // Keluar jika post tidak ditemukan

  // 2. Cegah agar nilai vote tidak bisa kurang dari 0
  if (state.posts[pIndex].votes + delta < 0) return;

  // 3. Tambahkan delta (+1 atau -1) ke data vote saat ini
  state.posts[pIndex].votes += delta;
  
  // 4. Temukan elemen HTML yang menampilkan angka vote, dan ubah nilainya
  const vEl = document.getElementById(`vote-${postId}`);
  if (vEl) {
    vEl.textContent = formatVotes(state.posts[pIndex].votes);
  }
};
```
**Kegunaan**: 
Kode ini adalah implementasi sistem interaksi pengguna (mirip Reddit). Ketika tombol tanda panah atas/bawah diklik, fungsi `ubahVote` akan dipanggil, mengubah data mentah (array state.posts), dan secara *real-time* mengubah angka di layar tanpa memuat ulang (refresh) halaman.

---

## 2. `main.js` - Sistem Keranjang Belanja & Transaksi (Marketplace)
Berisi logika utama untuk pengelolaan produk (buku), keranjang belanja (cart), hingga simulasi *checkout*.

### Cuplikan Kode Penting (Manajemen Cart):
```javascript
// Array global sementara untuk menampung item keranjang
window.cart = [];

// Fungsi untuk memasukkan buku ke keranjang
window.addToCart = function(id, title, price, type) {
  // 1. Cek apakah buku ini sudah ada di dalam keranjang
  const existingItem = window.cart.find(item => item.id === id && item.type === type);
  
  if (existingItem) {
    // 2. Jika sudah ada, jangan tambahkan lagi, beritahu pengguna
    alert("Item sudah ada di keranjang Anda!");
    return;
  }
  
  // 3. Tambahkan item baru ke array cart
  window.cart.push({
    id: id,
    title: title,
    price: price,
    type: type // 'beli' atau 'sewa'
  });
  
  // 4. Perbarui indikator angka di tombol keranjang layar
  window.updateCartBadge();
  alert(title + " berhasil ditambahkan ke keranjang!");
};

// Fungsi menghitung dan memperbarui angka (badge) di ikon keranjang
window.updateCartBadge = function() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.innerText = window.cart.length; // Mengambil total jumlah isi array
  }
};
```
**Kegunaan**: 
Ini merupakan inti dari fitur *e-commerce/marketplace* pada ReadBridge. Ia menangani alur *Create* (menambah item baru ke dalam *state* / keranjang belanja), lengkap dengan validasi duplikasi.

---

## 3. Sistem Injeksi Navigasi Dinamis (Dynamic Logo Menu)
Kode ini ditanamkan di hampir setiap file HTML untuk memastikan Menu Navigasi Logo bisa berfungsi secara konsisten tanpa menulis ulang elemen dropdown panjang secara manual.

### Cuplikan Kode Penting:
```javascript
// Berjalan otomatis saat halaman web selesai dimuat (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", function() {
    // Mencari elemen Header/Nav utama
    const headerOrNav = document.querySelector('header, nav');
    
    // ... [Kode pencarian teks Logo ReadBridge] ...
    
    if (logoTextNode) {
        const logoEl = logoTextNode.parentElement;
        
        // 1. Membuat bungkus div (container) secara dinamis via JavaScript
        const wrapper = document.createElement('div');
        wrapper.id = 'logo-menu-container';
        
        // 2. Menyelipkan logo ke dalam wrapper
        logoEl.parentNode.insertBefore(wrapper, logoEl);
        wrapper.appendChild(logoEl);
        
        // 3. Membuat dropdown menu tersembunyi
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute hidden flex-col ...'; // menggunakan kelas Tailwind
        
        // 4. Tambahkan event listener saat logo di klik -> buka/tutup dropdown
        logoEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('hidden'); // Memutarbalikkan status hidden
            dropdown.classList.toggle('flex');
        });
    }
});
```
**Kegunaan**: 
Agar platform web ini terasa lebih konsisten (DRY - *Don't Repeat Yourself*). Ketimbang *copy-paste* ratusan baris menu HTML ke 15 file berbeda, sistem cukup membuat elemen *Dropdown Navigasi* secara mandiri menggunakan manipulasi DOM (Document Object Model) via JavaScript.

---

## 4. `update_name.js` - Mock Autentikasi Klien (Local Storage)
File ini bertanggung jawab mengatur identitas *user session* di browser karena aplikasi ini belum memiliki database terpusat (Back-End).

### Cuplikan Kode Penting:
```javascript
document.addEventListener("DOMContentLoaded", function() {
    // 1. Cek isi localStorage browser dengan kata kunci 'rb_username'
    const savedName = localStorage.getItem('rb_username');
    
    if (savedName) {
        // 2. Cari semua elemen berkelas 'rb-username-fill' di halaman saat ini
        const els = document.querySelectorAll('.rb-username-fill');
        
        // 3. Ubah seluruh teks pada elemen tersebut dengan nama yang tersimpan
        for (let i = 0; i < els.length; i++) {
            els[i].textContent = savedName;
        }
    }
});
```
**Kegunaan**:
Fungsi ini menyimulasikan pengalaman "Sudah Login". Saat pengguna melakukan pendaftaran di `register.html` atau masuk di `login.html`, namanya akan disimpan menggunakan `localStorage.setItem('rb_username', nama)`. Kode ini lalu akan menarik nama tersebut di halaman profil atau beranda agar terlihat interaktif dan personal.

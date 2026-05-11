# Dokumentasi Fitur Utama (Core Features) ReadBridge

Dokumen ini merangkum 4 (empat) fitur utama yang paling esensial dalam aplikasi ReadBridge. Setiap fitur dilengkapi dengan cuplikan kodenya, penjelasan cara kerja, dan komponen apa saja yang terlibat.

---

## 1. Fitur Keranjang Belanja Dinamis (Dynamic Cart)

**Deskripsi Fitur:**
Pengguna dapat menambahkan buku ke dalam keranjang (baik untuk dibeli maupun disewa) langsung dari halaman utama tanpa perlu memuat ulang (*refresh*) halaman. Terdapat notifikasi dan lencana (badge) angka yang langsung berubah (*real-time*).

**Komponen yang Terlibat:**
- HTML: Tombol "Tambah ke Keranjang" & Ikon Keranjang dengan ID `cart-badge`.
- JavaScript: File `main.js` (array `window.cart`).

**Kode & Komentar:**
```javascript
// Array global sementara untuk menampung item keranjang
window.cart = [];

// Fungsi untuk memasukkan buku ke keranjang
window.addToCart = function(id, title, price, type) {
  // Mengecek apakah buku ini (dengan tipe yang sama) sudah ada di dalam keranjang
  const existingItem = window.cart.find(item => item.id === id && item.type === type);
  
  // Mencegah duplikasi barang di keranjang
  if (existingItem) {
    alert("Item sudah ada di keranjang Anda!");
    return;
  }
  
  // Jika belum ada, masukkan buku baru ke array cart
  window.cart.push({
    id: id,
    title: title,
    price: price,
    type: type // Menandai apakah buku ini 'beli' atau 'sewa'
  });
  
  // Memanggil fungsi untuk memperbarui angka di ikon keranjang
  window.updateCartBadge();
  alert(title + " berhasil ditambahkan ke keranjang!");
};

// Fungsi menghitung dan memperbarui angka (badge) di ikon keranjang
window.updateCartBadge = function() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.innerText = window.cart.length; // Mengambil total jumlah buku
  }
};
```

**Cara Kerja:**
Saat tombol "Tambah" ditekan, fungsi `addToCart` dipanggil sambil membawa data buku (id, judul, dll). Sistem mengecek array `cart`. Jika lolos cek, data dimasukkan (`push`). Kemudian, fungsi pembantu `updateCartBadge` mencari elemen HTML ber-ID `cart-badge` dan mengganti angkanya sesuai panjang array saat ini.

---

## 2. Fitur Interaksi Komunitas (Upvote / Forum)

**Deskripsi Fitur:**
Di dalam halaman komunitas/klub fiksi, pengguna bisa berinteraksi layaknya di forum sosial (seperti Reddit). Pengguna bisa menambah (`+1`) atau mengurangi (`-1`) perolehan *vote* pada sebuah postingan diskusi.

**Komponen yang Terlibat:**
- HTML: Tombol panah atas/bawah & Span teks jumlah vote (ex: `<span id="vote-post1">120</span>`).
- JavaScript: File `community-modal.js`.

**Kode & Komentar:**
```javascript
// Fungsi untuk menambah/mengurangi vote pada sebuah postingan
window.ubahVote = function(postId, delta) {
  // 1. Cari letak indeks postingan di memori (state.posts) berdasarkan ID
  const pIndex = state.posts.findIndex(p => p.id === postId);
  if (pIndex === -1) return; // Batal jika post tidak ditemukan

  // 2. Cegah agar nilai vote tidak bisa kurang dari 0
  if (state.posts[pIndex].votes + delta < 0) return;

  // 3. Modifikasi data mentah vote di memori (+1 atau -1)
  state.posts[pIndex].votes += delta;
  
  // 4. Cari elemen HTML yang menampilkan angka vote, dan ubah teksnya secara real-time
  const vEl = document.getElementById(`vote-${postId}`);
  if (vEl) {
    // Fungsi formatVotes akan mengubah angka ribuan jadi misal '1.2k'
    vEl.textContent = formatVotes(state.posts[pIndex].votes);
  }
};
```

**Cara Kerja:**
Fungsi `ubahVote` dipanggil oleh tombol HTML melalui `onclick="ubahVote('ID_POST', 1)"`. Skrip ini mengidentifikasi postingan spesifik dari sebuah array raksasa menggunakan ID. Jika ditemukan, angkanya dijumlahkan. Terakhir, skrip menembak elemen HTML ber-ID spesifik `vote-[ID_POST]` dan menyuntikkan angka yang baru.

---

## 3. Fitur Simulasi Login / Sesi Pengguna Lokal

**Deskripsi Fitur:**
Meskipun web ini berbasis Front-End dan tidak terhubung ke server database (Backend), web tetap bisa mengenali nama pengguna yang baru saja mendaftar (*register*) atau *login*, lalu menampilkannya di Dashboard secara dinamis.

**Komponen yang Terlibat:**
- Web API: `localStorage` (penyimpanan sementara bawaan browser).
- JavaScript: File `update_name.js`.

**Kode & Komentar:**
```javascript
// Berjalan otomatis saat halaman web selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    // 1. Mengambil nama pengguna yang tersimpan di memori browser
    const savedName = localStorage.getItem('rb_username');
    
    // 2. Jika nama pengguna ditemukan (artinya sudah "Login")
    if (savedName) {
        // 3. Cari SEMUA elemen di halaman yang memiliki kelas 'rb-username-fill'
        const els = document.querySelectorAll('.rb-username-fill');
        
        // 4. Ganti teks asli HTML dengan nama pengguna yang tersimpan
        for (let i = 0; i < els.length; i++) {
            els[i].textContent = savedName;
        }
    }
});
```

**Cara Kerja:**
Saat *User* berhasil register, sistem melakukan `localStorage.setItem('rb_username', 'Nama User')`. Saat *User* berpindah ke halaman lain (misalnya halaman Detail Akun), file `update_name.js` segera membaca `localStorage`. Jika ada namanya, semua sapaan generik seperti "Halo, Pembaca" akan langsung diganti seketika dengan nama asli pengguna tanpa bantuan server.

---

## 4. Fitur Navigasi Dinamis Terpusat (Dropdown Logo)

**Deskripsi Fitur:**
Membuat satu buah menu navigasi *dropdown* yang menempel pada Logo ReadBridge. Alih-alih di-copy-paste secara manual ke dalam kode HTML di 15 halaman berbeda, fitur ini disuntikkan secara terpusat agar perbaikannya mudah.

**Komponen yang Terlibat:**
- HTML: Tag `<header>` atau `<nav>`.
- Python & JavaScript: Skrip injeksi `update_logo_menu.py`.

**Kode & Komentar:**
```javascript
// Bagian dari script yang disuntikkan oleh update_logo_menu.py
document.addEventListener("DOMContentLoaded", function() {
    const headerOrNav = document.querySelector('header, nav');
    
    // Syarat: Ada header dan menu belum pernah dibuat sebelumnya
    if (headerOrNav && !document.getElementById('logo-menu-container')) {
        
        // (Logika pencarian logo 'ReadBridge' dihilangkan demi peringkasan)
        
        if (logoTextNode) {
            const logoEl = logoTextNode.parentElement;
            
            // 1. Membuat elemen kotak dropdown menu via JavaScript
            const dropdown = document.createElement('div');
            dropdown.className = 'absolute hidden flex-col bg-white shadow-lg ...';
            
            // 2. Memasukkan tautan-tautan menu ke dalam dropdown
            dropdown.innerHTML = `
                <a href="index.html">Beranda</a>
                <a href="eksplor.html">Eksplor Koleksi</a>
                <a href="marketplace.html">Marketplace</a>
            `;
            
            // 3. Event listener: Ketika logo diklik, tampilkan / sembunyikan dropdown
            logoEl.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('hidden');
                dropdown.classList.toggle('flex');
            });
            
            // Menempelkan dropdown di sebelah logo
            logoEl.parentNode.appendChild(dropdown);
        }
    }
});
```

**Cara Kerja:**
Ini memanfaatkan manipulasi *Document Object Model* (DOM). Saat web terbuka, kode JS memindai layar untuk mencari kata "ReadBridge" di atas (header). Setelah ketemu, JS secara ghaib (*on the fly*) membangun kotak HTML berisikan menu navigasi, menyembunyikannya, dan hanya memunculkannya ketika teks logo tersebut ditekan oleh mouse (melalui metode `classList.toggle('hidden')`).

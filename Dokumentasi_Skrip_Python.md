# Dokumentasi Skrip Python: `update_logo_menu.py`

File `update_logo_menu.py` adalah sebuah program otomatisasi (skrip) kecil yang ditulis dalam bahasa Python. Program ini dibuat untuk memecahkan masalah redundansi (penulisan kode yang berulang-ulang) pada antarmuka pengguna (*User Interface*) ReadBridge.

## Mengapa Skrip ini Dibutuhkan?
Proyek ReadBridge terdiri dari banyak file HTML (sekitar 15+ file). Jika kita ingin membuat menu navigasi baru di bawah logo (seperti dropdown yang menampilkan Beranda, Eksplor, Perpustakaan, dll), kita harus mengedit atau *copy-paste* kode HTML panjang tersebut ke dalam ke-15 file secara manual. Jika nanti ada satu tautan yang berubah, kita harus mengubah ke-15 file tersebut lagi secara manual.

Untuk mengatasi ini, `update_logo_menu.py` digunakan sebagai injektor otomatis.

## Cara Kerja (Penjelasan Kode Utama)

Skrip ini secara garis besar melakukan 3 hal:
1. **Mencari File**: Mencari seluruh file berakhiran `.html` di dalam direktori.
2. **Membuat Elemen Logika Navigasi**: Mendeklarasikan skrip JavaScript (teks menu dinamis).
3. **Menyuntikkan (Inject)**: Menyelipkan skrip tersebut ke bagian paling bawah struktur dokumen HTML (`</body>`).

### Penjelasan Bagian-bagian Kodenya:

```python
# MENGAMBIL FILE
files = [f for f in os.listdir('.') if f.endswith('.html')]
```
**Maksudnya:** Program melihat daftar seluruh file di folder saat ini (seperti `index.html`, `login.html`), lalu menyaringnya sehingga hanya file berekstensi HTML yang dimasukkan ke dalam daftar (array) untuk diproses.

---

```javascript
// MEMBUAT DROPDOWN MENU
const dropdown = document.createElement('div');
dropdown.id = 'logo-dropdown';
dropdown.className = 'absolute left-0 top-full mt-2 w-56 bg-surface-container-lowest ...';
```
**Maksudnya:** Di dalam *script* JavaScript yang akan disuntikkan, kita meminta browser untuk membuat kotak pembungkus (*div*) baru yang akan berfungsi sebagai Menu *Dropdown* yang melayang (*absolute*). Kelas Tailwind yang disematkan akan memberikan warna latar, bayangan, lengkungan sudut (border-radius), dan menjadikannya tersembunyi (hidden) pada kondisi awal.

---

```javascript
// DAFTAR TAUTAN
const links = [
    { href: 'index.html', icon: 'home', text: 'Beranda' },
    { href: 'eksplor.html', icon: 'library_books', text: 'Eksplor Koleksi' },
    // ... tautan lainnya
];

// PERULANGAN TAUTAN
links.forEach(l => {
    const a = document.createElement('a');
    a.href = l.href;
    a.innerHTML = `<span class="material-symbols-outlined">${l.icon}</span> ${l.text}`;
    dropdown.appendChild(a);
});
```
**Maksudnya:** Daripada menulis tag `<a>` berulang-ulang di HTML, kita menyimpan daftar tautannya di sebuah Array sederhana. Lalu, JavaScript akan melakukan perulangan `forEach`. Untuk setiap item, ia akan membuat tag `<a>`, memasukkan URL `href`, ikon material, teksnya, dan menyisipkannya (*appendChild*) ke dalam menu *dropdown* yang tadi dibuat.

---

```javascript
// INTERAKSI PENGGUNA
logoEl.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
    dropdown.classList.toggle('flex');
});
```
**Maksudnya:** Ini adalah *Event Listener* yang mengawasi logo "ReadBridge". Ketika pengguna **mengklik logo**, fungsi ini akan mencegah perilaku bawaan tautan (supaya tidak pindah halaman secara instan) dengan `preventDefault`. Kemudian, ia akan menukar (*toggle*) kelas CSS dari `hidden` menjadi `flex` (dan sebaliknya) sehingga menu akan muncul jika tertutup, dan tertutup jika sedang muncul.

---

```python
# PROSES PENYUNTIKAN (INJEKSI)
if 'id="dynamic-logo-menu"' not in content:
    new_content = re.sub(r'</body>', script_to_inject, content, count=1, flags=re.IGNORECASE)
    with open(f, 'w') as file:
        file.write(new_content)
```
**Maksudnya:** Python membaca isi setiap file HTML. Sebelum disuntikkan, ia memastikan bahwa skrip belum pernah dimasukkan sebelumnya dengan mengecek `id="dynamic-logo-menu"`. Jika belum ada, fungsi *Regex* (`re.sub`) akan mencari letak tag penutup `</body>` di file tersebut, dan menggantinya dengan Skrip JavaScript yang diikuti kembali dengan tag `</body>`. Terakhir, Python menimpa isi file HTML lama dengan versi yang sudah disuntikkan.

# Dokumentasi Proyek Ujian Tengah Semester (UTS)
**Nama StartUp:** ReadBridge
**Deskripsi:** ReadBridge adalah platform ekosistem literasi digital (StartUp web berbasis Front-End) yang menghubungkan pembaca, penulis, perpustakaan mitra, dan komunitas. Platform ini interaktif, dibangun menggunakan HTML, CSS (Tailwind), dan JavaScript, serta mampu mengelola data secara dinamis di sisi klien (browser) menggunakan manipulasi DOM dan `localStorage`.

---

## A. Penjelasan Singkat Alur Program (CRUD Data Buku)

Dalam mendemonstrasikan kemampuan aplikasi dalam mengelola data secara dinamis di sisi *client* (browser), dokumentasi ini mengambil contoh **Modul Pengelolaan Data Buku (Koleksi / Marketplace)**. Modul ini memiliki 4 alur utama:

1. **Menampilkan Data (Read):** Saat halaman dimuat, program membaca data dari penyimpanan lokal (`localStorage`). Jika ada, data diproses melalui perulangan untuk menghasilkan elemen HTML secara dinamis dan ditampilkan ke layar.
```javascript
function readBuku() {
    // Membaca data dari Local Storage, jika kosong buat array baru
    let dataBuku = JSON.parse(localStorage.getItem('buku_db')) || [];
    const container = document.getElementById('daftar-buku');
    container.innerHTML = ''; // Kosongkan daftar sebelum dirender ulang

    if (dataBuku.length === 0) {
        container.innerHTML = '<p>Belum ada data buku.</p>';
        return;
    }

    // Melakukan perulangan untuk merender data ke HTML
    dataBuku.forEach(buku => {
        container.innerHTML += `
            <div class="card">
                <h3>${buku.judul}</h3>
                <p>Penulis: ${buku.penulis}</p>
                <button onclick="editBuku(${buku.id})">Edit</button>
                <button onclick="hapusBuku(${buku.id})">Hapus</button>
            </div>
        `;
    });
}
```

2. **Menambah Data (Create):** Pengguna memasukkan data melalui form. Program menangkap input tersebut, melakukan validasi, membuat objek data baru dengan ID unik, menyimpannya, lalu memperbarui layar.
```javascript
function tambahBuku(judulInput, penulisInput) {
    if (!judulInput || !penulisInput) {
        alert("Judul dan Penulis tidak boleh kosong!");
        return;
    }

    let dataBuku = JSON.parse(localStorage.getItem('buku_db')) || [];
    
    // Membuat objek buku baru dengan ID unik (timestamp)
    let bukuBaru = {
        id: Date.now(),
        judul: judulInput,
        penulis: penulisInput
    };

    // Tambahkan ke array dan simpan kembali ke memori
    dataBuku.push(bukuBaru);
    localStorage.setItem('buku_db', JSON.stringify(dataBuku));
    
    readBuku(); // Refresh tampilan
    alert("Buku berhasil ditambahkan!");
}
```

3. **Mengubah Data (Update):** Program mencari data berdasarkan ID. Setelah pengguna selesai mengubah data, program memperbarui nilainya pada array di memori dan menyegarkan tampilan.
```javascript
function simpanEdit(idTarget, judulBaru, penulisBaru) {
    let dataBuku = JSON.parse(localStorage.getItem('buku_db')) || [];
    
    // Mencari posisi index buku yang akan diedit
    let index = dataBuku.findIndex(buku => buku.id === idTarget);
    
    if (index !== -1) {
        // Mengubah nilai yang lama dengan yang baru
        dataBuku[index].judul = judulBaru;
        dataBuku[index].penulis = penulisBaru;
        
        // Simpan pembaruan ke storage
        localStorage.setItem('buku_db', JSON.stringify(dataBuku));
        readBuku(); // Refresh tampilan
        alert("Data buku berhasil diubah!");
    }
}
```

4. **Menghapus Data (Delete):** Program menampilkan konfirmasi penghapusan. Jika disetujui, program menghapus data berdasarkan ID dari memori (`localStorage`) dan menyegarkan tampilan.
```javascript
function hapusBuku(idTarget) {
    let konfirmasi = confirm("Apakah Anda yakin ingin menghapus buku ini?");
    
    if (konfirmasi) {
        let dataBuku = JSON.parse(localStorage.getItem('buku_db')) || [];
        
        // Menyaring data agar hanya menyisakan buku yang TIDAK memiliki idTarget
        let dataBukuBaru = dataBuku.filter(buku => buku.id !== idTarget);
        
        // Simpan data yang sudah dihapus tersebut kembali ke storage
        localStorage.setItem('buku_db', JSON.stringify(dataBukuBaru));
        readBuku(); // Refresh tampilan
        alert("Buku berhasil dihapus!");
    }
}
```

---

## B. Flowchart CRUD (Create, Read, Update, Delete)

*(Catatan: Flowchart di bawah direpresentasikan menggunakan standar diagram Mermaid. Anda dapat melihatnya melalui Markdown Viewer atau ekstensi Mermaid di IDE).*

```mermaid
flowchart TD
    %% Simbol Standar:
    %% Oval (Terminal) = Start/End
    %% Jajargenjang (Input/Output) = Input Data/Tampil Data
    %% Persegi Panjang (Proses) = Proses internal
    %% Belah Ketupat (Decision) = Kondisi Ya/Tidak

    Start([Start]) --> Tampil[/"Tampilkan Halaman Utama & Tampilkan Data Buku (Read)"/]
    Tampil --> Pilihan{"Pilih Aksi?"}

    %% Alur Menambah Data (Create)
    Pilihan -- Tambah --> InputAdd[/"Input Data Buku Baru (Judul, Penulis)"/]
    InputAdd --> CekInputAdd{"Apakah Data Valid?"}
    CekInputAdd -- Tidak --> PesanErrorAdd[/"Tampilkan Pesan Error"/]
    PesanErrorAdd --> InputAdd
    CekInputAdd -- Ya --> ProsesAdd["Buat ID unik, Simpan data ke Array / localStorage"]
    ProsesAdd --> Refresh1["Perbarui Tampilan (Tampil Data)"]
    Refresh1 --> Pilihan

    %% Alur Mengubah Data (Update)
    Pilihan -- Edit --> InputEditID[/"Pilih ID Buku yang akan diubah"/]
    InputEditID --> TampilEdit[/"Tampilkan Data Lama di Form"/]
    TampilEdit --> InputUpdate[/"Input Perubahan Data"/]
    InputUpdate --> CekInputEdit{"Apakah Data Valid?"}
    CekInputEdit -- Tidak --> PesanErrorEdit[/"Tampilkan Pesan Error"/]
    PesanErrorEdit --> InputUpdate
    CekInputEdit -- Ya --> ProsesEdit["Perbarui Data di Array / localStorage berdasarkan ID"]
    ProsesEdit --> Refresh2["Perbarui Tampilan (Tampil Data)"]
    Refresh2 --> Pilihan

    %% Alur Menghapus Data (Delete)
    Pilihan -- Hapus --> InputDelID[/"Pilih ID Buku yang akan dihapus"/]
    InputDelID --> ConfirmDel{"Konfirmasi Hapus?"}
    ConfirmDel -- Tidak --> Pilihan
    ConfirmDel -- Ya --> ProsesDel["Hapus Data dari Array / localStorage berdasarkan ID"]
    ProsesDel --> Refresh3["Perbarui Tampilan (Tampil Data)"]
    Refresh3 --> Pilihan

    %% Selesai
    Pilihan -- Keluar --> Selesai([End])
```

---

## C. Pseudocode

Berikut adalah Pseudocode yang merepresentasikan logika alur kerja aplikasi di sisi *client* (JavaScript).

```text
// INISIALISASI
SET data_buku = BACA_DARI_LOCAL_STORAGE("buku") JIKA KOSONG MAKA []

// FUNGSI MENAMPILKAN DATA (READ)
FUNCTION TampilkanData()
    BERSIHKAN tampilan_tabel
    IF panjang data_buku == 0 THEN
        TAMPILKAN "Belum ada data buku"
    ELSE
        FOR EACH buku IN data_buku
            BUAT elemen_baris_HTML dengan data buku.judul, buku.penulis
            TAMBAHKAN tombol_edit dengan ID buku
            TAMBAHKAN tombol_hapus dengan ID buku
            MASUKKAN elemen_baris_HTML ke tampilan_tabel
        END FOR
    END IF
END FUNCTION

// FUNGSI MENAMBAH DATA (CREATE)
FUNCTION TambahData(input_judul, input_penulis)
    IF input_judul == KOSONG ATAU input_penulis == KOSONG THEN
        TAMPILKAN "Error: Data tidak boleh kosong"
        RETURN
    END IF

    SET id_baru = HASILKAN_ID_UNIK()
    SET buku_baru = { id: id_baru, judul: input_judul, penulis: input_penulis }
    
    TAMBAHKAN buku_baru KEDALAM data_buku
    SIMPAN_KE_LOCAL_STORAGE("buku", data_buku)
    
    PANGGIL TampilkanData()
    TAMPILKAN "Buku berhasil ditambahkan"
END FUNCTION

// FUNGSI MENGUBAH DATA (UPDATE)
FUNCTION UbahData(id_target, input_judul_baru, input_penulis_baru)
    IF input_judul_baru == KOSONG ATAU input_penulis_baru == KOSONG THEN
        TAMPILKAN "Error: Data tidak boleh kosong"
        RETURN
    END IF

    FOR EACH buku IN data_buku
        IF buku.id == id_target THEN
            buku.judul = input_judul_baru
            buku.penulis = input_penulis_baru
            BREAK // Keluar dari loop
        END IF
    END FOR
    
    SIMPAN_KE_LOCAL_STORAGE("buku", data_buku)
    PANGGIL TampilkanData()
    TAMPILKAN "Data buku berhasil diubah"
END FUNCTION

// FUNGSI MENGHAPUS DATA (DELETE)
FUNCTION HapusData(id_target)
    SET konfirmasi = TANYA_PENGGUNA("Apakah Anda yakin ingin menghapus buku ini?")
    
    IF konfirmasi == BENAR THEN
        CARI letak indeks buku DENGAN id == id_target DALAM data_buku
        HAPUS elemen dari data_buku PADA indeks tersebut
        
        SIMPAN_KE_LOCAL_STORAGE("buku", data_buku)
        PANGGIL TampilkanData()
        TAMPILKAN "Buku berhasil dihapus"
    END IF
END FUNCTION

// JALANKAN SAAT HALAMAN DIMUAT
PANGGIL TampilkanData()
```

---
**Keterangan Simbol Flowchart yang Digunakan:**
*   **Terminal (Oval):** Digunakan untuk menandai awal (Start) dan akhir (End) dari program.
*   **Input/Output (Jajargenjang):** Menunjukkan interaksi dengan antarmuka (User Interface), seperti mengisi form input, menampilkan tabel data, atau memunculkan pesan error di layar.
*   **Proses (Persegi Panjang):** Menggambarkan proses internal di memori/JavaScript, seperti menyimpan data ke `localStorage`, mencari ID di dalam Array, atau membuat ID unik.
*   **Decision (Belah Ketupat):** Digunakan untuk pengecekan kondisi logika bersyarat (*If-Else*), misalnya memvalidasi apakah input kosong, atau konfirmasi penghapusan data.

---

## D. Teknologi yang Digunakan

Proyek web ReadBridge dibangun menggunakan *Tech Stack* (tumpukan teknologi) berbasis pengembangan antarmuka sisi klien (*Front-End Client Side*). Berikut rincian fungsi dan implementasinya:

### 1. HTML5 (HyperText Markup Language)
*   **Peran:** Kerangka dan Struktur Dasar
*   **Fungsi:** Menyusun elemen-elemen halaman web seperti *header*, daftar navigasi, form input, tabel, teks, dan struktur *modal* (pop-up).
*   **Implementasi:** Digunakan pada seluruh dokumen (lebih dari 15 file `.html` seperti `index.html`, `profile.html`, `marketplace.html`). 

### 2. Tailwind CSS (via CDN)
*   **Peran:** *Styling* (Pewarnaan & Tata Letak) dan *UI/UX Framework*
*   **Fungsi:** Memperindah tampilan kerangka HTML agar terlihat profesional, modern (contoh: *Bento-Grid layout*), interaktif (efek *hover* & transisi), serta **Responsif** (tampilan menyesuaikan ukuran layar HP, tablet, maupun laptop secara otomatis).
*   **Implementasi:** Diaplikasikan langsung di dalam file HTML menggunakan pemanggilan *utility-class* bawaan Tailwind. (Contoh: `<div class="flex items-center bg-surface-container rounded-xl p-4">`).

### 3. Vanilla JavaScript (ES6)
*   **Peran:** Interaktivitas dan Logika *Browser*
*   **Fungsi:** Mengendalikan sistem *dropdown*, perhitungan harga keranjang belanja, menampung klik pengguna (*event listener*), validasi form, dan memanipulasi elemen layar tanpa me-refresh halaman (DOM Manipulation).
*   **Implementasi:** Diterapkan melalui file skrip eksternal seperti `main.js`, `community-modal.js`, dan `update_name.js`, maupun melalui skrip *inline* di akhir dokumen HTML.

### 4. Web Storage API (`localStorage`)
*   **Peran:** Penyimpanan Data Klien Sementara (Pengganti *Database*)
*   **Fungsi:** Menyimpan jejak aktivitas atau data masukan pengguna agar tidak hilang meskipun halaman di-*refresh* atau di-*close*. Sangat krusial untuk membuat web terasa hidup tanpa menggunakan peladen (*server-side backend* seperti PHP/MySQL).
*   **Implementasi:** Digunakan untuk memalsukan fitur *Login* (menyimpan data profil nama akun), simulasi menyimpan status keranjang belanja, serta simulasi fitur penambahan koleksi buku (*CRUD*). (Contoh: `localStorage.setItem('rb_username', 'Nama User')`).

### 5. Python (Opsional / *Development Utility*)
*   **Peran:** Otomatisasi Pekerjaan *Developer* (Injeksi Skrip)
*   **Fungsi:** Membantu pengembang web menghindari pengetikan ulang (*copy-paste*) kode secara manual ke puluhan file HTML yang berbeda jika terjadi pembaruan fitur (misalnya pembaruan *dropdown* menu navigasi).
*   **Implementasi:** Dibuat secara khusus pada file `update_logo_menu.py` yang akan menyisir semua file HTML dan menyuntikkan (meng-*inject*) elemen menu dinamis secara serentak. File ini bukan untuk pengguna (*user*), melainkan sebagai alat bantu efisiensi kerja pengembang (*developer*).

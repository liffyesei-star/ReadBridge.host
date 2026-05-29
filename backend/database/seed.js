/*
  Project: ReadBridge
  Author: Liffy Sei / Affan
  Date: May 2026
  Role: Lead Developer & UI/UX Designer
*/
// database/seed.js
// Jalankan: node database/seed.js
require("dotenv").config();
const db = require("../config/db");

const seedData = async () => {
  console.log("🌱 Mulai seed data...");

  // Enable foreign key checks bypass for clean reset
  await db.execute("SET FOREIGN_KEY_CHECKS = 0;");
  
  console.log("🧹 Mengosongkan data lama...");
  await db.execute("TRUNCATE TABLE ulasan;");
  await db.execute("TRUNCATE TABLE wishlist;");
  await db.execute("TRUNCATE TABLE diskusi_balasan;");
  await db.execute("TRUNCATE TABLE diskusi_likes;");
  await db.execute("TRUNCATE TABLE diskusi;");
  await db.execute("TRUNCATE TABLE buku;");
  await db.execute("TRUNCATE TABLE jurnal;");
  await db.execute("TRUNCATE TABLE ebook;");
  
  // Re-enable foreign key checks
  await db.execute("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("✅ Data katalog lama berhasil dikosongkan");

  // ===================== USER DUMMY (ADMIN) =====================
  // Untuk kreator diskusi
  await db.execute(`
    INSERT IGNORE INTO users (id, nama, email, role, bio, poin, level, aktif)
    VALUES (1, 'Admin ReadBridge', 'admin@readbridge.co.id', 'admin', 'Administrator Sistem ReadBridge', 9999, 'Maestro Literasi', 1)
  `);
  console.log("✅ User admin berhasil di-ensure");

  // ===================== BUKU =====================
  const imgBuku = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuApdMuG3pfOyT45TKpszN-u5p7r1oX9aiBChHWVTMo8VwUuEphgMhzpdAVa4XEQpZgD9IzJG6lf6kLV-3_KyV2Y8PhhfVooBF5YOwubgF5cNUseZ3PO8xTKJhXlKUP1gy2iST0n3WfZ5Y-zSZc2N4U1MdOXpaGoEZxPol1ENCfUOSB93pADkccu3bQ9B5QiG7OOYNM2BCYhg_aSSthqVW92EJ5szvP_eH-k4fUC_PaP2UYVB7I8gYczOUTVuEZ2kmq3eKKyUT1kS0A",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB20mW314sFNPWzvOF_CpCAdw90Y-mmknLvC9JBPb4pHHUZvNYmJ3F-UINSXQJtThnhYkgaP_QQGIxBna--xCuCu0CluusyF76_N8MtPIwXsZir4uO-c4IIpHxoYLGKwlQtyPP-dVZhMhY3c1RDKtMi3VAe6a75GbvBbo8ZMvLKgNwkNmruPktKKfe7ANWZeg_DU7TAPtBiHzLIhkuqz6RzQZ2dSbOO4_O4i59rXDaBIJ3MLzGhGjILnoORo94tk44T0EXa98DflJQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAg98F8GBT94G18yXH1uJ6fy4JRWjmxgKXmQhYgrtegNNTXHYW5BGOwziIRv0wfUgKRNwhklaPrqi0rvwAURNdudCZ6-R0Jo6hrZK0U-oEpB5_MRI3qAQDdZXePtT1cYpe5x1rOLbbh0vjHBJKsUiVuPSRACz9WRyCvaEZz6XFvSy-2aJAY7pIgjQ4kSmvxEFrNzc2fvsu_8Yr2fo0nmD4AMmH9cmxCwdDf707SUvQz1wY7koa43wp2OQJBOrwTWPdQudK0DeuZdFI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhnYOkX0t3qAzr0mWIbwz5yb3J-3pjarDKs9pacF9zCQ94DO-XoCcqxBiOkrG3PxYhMx_zCHTezkvWjWkc2DBIsPmGjbXwTmBxLk-SVMCzbNfIGcE3iKYP6UqSqm5QwwwSHf8Uqmf_cBHcJk_HTTkxCTfsXBlqNJ8GJ5iPcOuHEqwr2JqhHCdEEVtkkM3PeMaPXTj9L1R9ILP_P8k3x01D76RW0DKuGkQJ6PpxgAzm623v2hKOUWdzDjEQy5KfC57nxFS1lqOnAno",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-_RYEy2W-mlbDtgm-aWh_I8at6APxU8q_BWedJb-9DvV3FnEltycsFwigAD9jsw-f0q6RYDyhGmPKlz82nIh4gBwuH8KrgnBcPWPRp886P14WiPkOWjs5qD1zydVp23FU8MwQGBwXksuGsD0Tl4-P-nbl8dWjTWP_7vtIWTxNppoufJvMR_Ij2CDGXPIL8-NapWPIKUen1_d4A3GZXPaf03R0BpHJlorBfwdLMeWgsEL_6j1MbyqsUGqJch02LrozviiYUdBWtdo"
  ];

  const buku = [
    { id: 1, judul: "Sejarah Nasional Indonesia Jilid 1", penulis: "Marwati Djoened Poesponegoro", kategori: 2, harga: 85000, rating: 4.8, ulasan: 124, cover: imgBuku[0], tags: ["Populer"] },
    { id: 2, judul: "Pengantar Ilmu Sejarah", penulis: "Kuntowijoyo", kategori: 2, harga: 65000, rating: 4.6, ulasan: 89, cover: imgBuku[1], tags: [] },
    { id: 3, judul: "Nusantara: Sejarah Indonesia", penulis: "Bernard H.M. Vlekke", kategori: 2, harga: 120000, rating: 4.9, ulasan: 215, cover: imgBuku[2], tags: ["Edisi Terbatas"] },
    { id: 4, judul: "Sapiens: Riwayat Singkat Umat Manusia", penulis: "Yuval Noah Harari", kategori: 2, harga: 105000, rating: 4.8, ulasan: 532, cover: imgBuku[3], tags: [] },
    { id: 5, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: 1, harga: 110000, rating: 4.9, ulasan: 840, cover: imgBuku[4], tags: ["Klasik"] },
    { id: 6, judul: "Atomic Habits", penulis: "James Clear", kategori: 8, harga: 95000, rating: 4.9, ulasan: 1024, cover: imgBuku[0], tags: ["Bestseller"] },
    { id: 7, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: 1, harga: 75000, rating: 4.7, ulasan: 678, cover: imgBuku[1], tags: [] },
    { id: 8, judul: "Cantik Itu Luka", penulis: "Eka Kurniawan", kategori: 1, harga: 90000, rating: 4.8, ulasan: 450, cover: imgBuku[2], tags: ["Trending"] },
    { id: 9, judul: "Laut Bercerita", penulis: "Leila S. Chudori", kategori: 1, harga: 100000, rating: 4.9, ulasan: 800, cover: imgBuku[3], tags: [] },
    { id: 10, judul: "Filosofi Teras", penulis: "Henry Manampiring", kategori: 8, harga: 80000, rating: 4.8, ulasan: 1200, cover: imgBuku[4], tags: ["Populer"] },
    { id: 11, judul: "Pulang", penulis: "Leila S. Chudori", kategori: 1, harga: 90000, rating: 4.7, ulasan: 420, cover: imgBuku[0], tags: [] },
    { id: 12, judul: "Kosmos", penulis: "Carl Sagan", kategori: 2, harga: 150000, rating: 4.9, ulasan: 310, cover: imgBuku[1], tags: ["Edisi Terbatas"] },
  ];

  for (const b of buku) {
    const slug = b.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 9999);
    const hargaSewa = Math.floor(b.harga * 0.15);
    await db.execute(
      `INSERT INTO buku (id, judul, slug, penulis_nama, kategori_id, harga_beli, harga_sewa, bisa_beli, bisa_sewa, rating, total_ulasan, cover_url, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?)`,
      [b.id, b.judul, slug, b.penulis, b.kategori, b.harga, hargaSewa, b.rating, b.ulasan, b.cover, JSON.stringify(b.tags)]
    );
  }
  console.log(`✅ ${buku.length} buku berhasil di-seed`);

  // ===================== JURNAL =====================
  const jurnal_data = [
    { id: 1, judul: "Jurnal Sejarah: Dinamika Politik Indonesia Pasca Reformasi", penulis: "Dr. Anhar Gonggong", universitas: "Universitas Indonesia", tahun: 2020, unduhan: 1205, rating: 4.8, kategori: "Sosial Humaniora", akses: "Open Access", ulasan: 156, abstrak: "Analisis komprehensif mengenai pergeseran peta kekuatan politik dan dampaknya terhadap kebijakan publik dari tahun 1998 hingga 2020." },
    { id: 2, judul: "Studi Literatur: Pengaruh Literasi Digital di Era Society 5.0", penulis: "Prof. Rhenald Kasali", universitas: "Universitas Gadjah Mada", tahun: 2022, unduhan: 854, rating: 4.7, kategori: "Pendidikan", akses: "Open Access", ulasan: 92, abstrak: "Mengkaji bagaimana peningkatan literasi digital berkontribusi pada kesiapan masyarakat menghadapi disrupsi teknologi di era Society 5.0." },
    { id: 3, judul: "Jurnal Ilmu Komputer: Implementasi AI pada Sistem Perpustakaan", penulis: "Dr. Romi Satria Wahono", universitas: "Institut Teknologi Bandung", tahun: 2023, unduhan: 432, rating: 4.9, kategori: "Sains & Teknologi", akses: "Exclusive Access", ulasan: 310, abstrak: "Penerapan algoritma machine learning untuk rekomendasi buku dan optimasi sistem klasifikasi perpustakaan digital." },
    { id: 4, judul: "Dampak Perubahan Iklim Terhadap Ekonomi Pertanian", penulis: "Dr. Emil Salim", universitas: "Institut Pertanian Bogor", tahun: 2021, unduhan: 678, rating: 4.6, kategori: "Sains & Teknologi", akses: "Open Access", ulasan: 88, abstrak: "Kajian empiris mengenai penurunan hasil panen akibat anomali cuaca di wilayah Jawa Barat selama satu dekade terakhir." },
    { id: 5, judul: "Inovasi Pembelajaran Daring Selama Pandemi", penulis: "Prof. Anita Lie", universitas: "Universitas Katolik Widya Mandala", tahun: 2021, unduhan: 1500, rating: 4.8, kategori: "Pendidikan", akses: "Open Access", ulasan: 420, abstrak: "Evaluasi efektivitas berbagai platform e-learning dalam menjaga kualitas pendidikan selama masa pembatasan sosial berskala besar." },
    { id: 6, judul: "Pengembangan Vaksin Nasional: Tantangan dan Peluang", penulis: "Dr. Amin Soebandrio", universitas: "Lembaga Eijkman", tahun: 2022, unduhan: 920, rating: 4.5, kategori: "Sains & Teknologi", akses: "Exclusive Access", ulasan: 115, abstrak: "Tinjauan mendalam mengenai proses riset dan pengembangan vaksin Merah Putih di Indonesia." },
    { id: 7, judul: "Perkembangan Arsitektur Tropis Modern", penulis: "Prof. Eko Purwanto", universitas: "Universitas Tarumanagara", tahun: 2019, unduhan: 345, rating: 4.7, kategori: "Sains & Teknologi", akses: "Open Access", ulasan: 67, abstrak: "Eksplorasi desain bangunan yang responsif terhadap iklim tropis dengan pendekatan estetika modern dan material lokal." },
    { id: 8, judul: "Etika Artificial Intelligence dalam Layanan Kesehatan", penulis: "Dr. Setiawan Dalimunthe", universitas: "Fakultas Kedokteran UI", tahun: 2023, unduhan: 512, rating: 4.9, kategori: "Sains & Teknologi", akses: "Exclusive Access", ulasan: 210, abstrak: "Diskusi mengenai batasan moral, privasi data pasien, dan tanggung jawab hukum dalam penerapan AI di rumah sakit." },
  ];

  for (const j of jurnal_data) {
    await db.execute(
      `INSERT INTO jurnal (id, judul, penulis_nama, universitas, tahun_terbit, total_unduhan, rating, kategori, akses, total_ulasan, abstrak)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [j.id, j.judul, j.penulis, j.universitas, j.tahun, j.unduhan, j.rating, j.kategori, j.akses, j.ulasan, j.abstrak]
    );
  }
  console.log(`✅ ${jurnal_data.length} jurnal berhasil di-seed`);

  // ===================== EBOOK =====================
  const ebooks = [
    {
      id: 501,
      title: "Atomic Habits: Perubahan Kecil Yang Memberikan Hasil Luar Biasa",
      author: "James Clear",
      category: "Pengembangan Diri",
      rating: 4.9,
      reviews: 2450,
      readingTime: "5 menit",
      isPremium: 0,
      isMonthlySpecial: 0,
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Pendahuluan: Kekuatan Perubahan 1%. Sangat mudah untuk melebih-lebihkan pentingnya satu momen penting dan meremehkan nilai membuat perbaikan kecil setiap hari. Terlalu sering, kita meyakinkan diri sendiri bahwa kesuksesan besar membutuhkan tindakan besar. Baik itu menurunkan berat badan, membangun bisnis, menulis buku, memenangkan kejuaraan, atau mencapai tujuan lainnya, kita menekan diri kita untuk membuat beberapa perbaikan yang mengguncang bumi yang akan dibicarakan semua orang. Sementara itu, meningkatkan 1% mungkin tidak terlalu terlihat—bahkan kadang-kadang tidak terasa—tetapi itu bisa jauh lebih bermakna, terutama dalam jangka panjang.",
        "Bab 1: Mengapa Kebiasaan Kecil Membuat Perubahan Besar. Kebiasaan adalah bunga majemuk dari perbaikan diri. Sama seperti uang yang berlipat ganda melalui bunga majemuk, efek dari kebiasaan Anda berlipat ganda saat Anda mengulanginya. Efeknya tampak kecil pada hari tertentu, namun dampaknya selama berbulan-bulan dan bertahun-tahun bisa sangat luar biasa. Hanya ketika melihat kembali dua, lima, atau mungkin sepuluh tahun kemudian, nilai dari kebiasaan baik dan kerugian dari kebiasaan buruk menjadi sangat jelas.",
        "Bab 2: Identitas adalah Kunci Perubahan Perilaku. Mengapa begitu mudah mengulangi kebiasaan buruk dan begitu sulit membangun kebiasaan baik? Masalahnya bukan karena Anda tidak ingin berubah, tetapi karena sistem Anda salah. Anda tidak naik ke tingkat tujuan Anda; Anda jatuh ke tingkat sistem Anda. Kunci untuk perubahan yang bertahan lama bukanlah fokus pada apa yang ingin Anda capai, melainkan pada siapa Anda ingin menjadi. Identitas Anda muncul dari kebiasaan-kebiasaan Anda.",
        "Bab 3: Empat Hukum Perubahan Perilaku. Empat Hukum Perubahan Perilaku adalah seperangkat aturan sederhana yang dapat kita gunakan untuk membangun kebiasaan yang lebih baik. Mereka adalah: (1) menjadikannya terlihat, (2) menjadikannya menarik, (3) menjadikannya mudah, dan (4) menjadikannya memuaskan. Dalam bab ini, kita akan membahas cara menerapkan hukum-hukum ini untuk mendominasi kehidupan sehari-hari Anda dengan efektivitas luar biasa.",
        "Bab 4: Rahasia Mempertahankan Kebiasaan Baik. Kebiasaan baik akan bertahan lama jika memberikan kepuasan instan. Otak manusia berevolusi untuk memprioritaskan imbalan langsung daripada imbalan masa depan. Untuk mempertahankan kebiasaan baik, Anda harus menemukan cara untuk menambahkan sedikit kesenangan instan ke dalam rutinitas Anda. Ini adalah kunci pamungkas untuk menjadi tidak terhentikan."
      ]
    },
    {
      id: 502,
      title: "Laskar Pelangi (Edisi Digital)",
      author: "Andrea Hirata",
      category: "Novel & Fiksi",
      rating: 4.8,
      reviews: 1320,
      readingTime: "4 menit",
      isPremium: 0,
      isMonthlySpecial: 0,
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Sepuluh Anggota Baru. Pagi itu, matahari bersinar hangat di atas atap sekolah Muhammadiyah yang reyot di Belitong. Harun, seorang anak dengan senyum lebar yang tulus, berlari-lari kecil menuju halaman sekolah. Di dalam kelas, Bu Muslimah dan Pak Harfan menunggu dengan cemas. Mereka membutuhkan minimal sepuluh siswa agar sekolah tidak ditutup oleh pengawas sekolah. Detik-detik berlalu dengan menegangkan, sampai akhirnya Lintang dan ibunya datang dari kejauhan.",
        "Bab 2: Mimpi di Bawah Pohon Filicium. Di bawah rindangnya pohon filicium di halaman sekolah, kesepuluh anak yang kemudian dijuluki Laskar Pelangi itu sering berkumpul dan merajut mimpi-mimpi mereka. Lintang, sang jenius matematika pesisir, bercita-cita menjadi ilmuwan. Ikal bermimpi berkeliling dunia. Mahar dengan bakat seninya yang eksentrik selalu bernyanyi penuh imajinasi. Sekolah reyot itu tidak membatasi ketinggian mimpi mereka.",
        "Bab 3: Pertempuran Kecerdasan. Hari cerdas cermat sekabupaten Belitong tiba. Sekolah Muhammadiyah yang miskin harus berhadapan dengan sekolah PN Timah yang kaya dan berfasilitas lengkap. Ketegangan memuncak saat Lintang maju ke meja perlombaan. Dengan kecepatan berpikir yang luar biasa, Lintang melahap semua pertanyaan fisika dan matematika, membungkam keangkuhan lawan dan membawa kemenangan bersejarah.",
        "Bab 4: Badai Ujian Kehidupan. Kehidupan selalu memiliki caranya sendiri untuk menguji ketahanan mimpi. Badai melanda saat ayah Lintang, seorang nelayan miskin, meninggal di laut. Sebagai anak laki-laki tertua, Lintang harus meletakkan pensilnya dan bekerja untuk menghidupi adik-adiknya. Kejeniusannya harus tunduk pada kerasnya realitas ekonomi Belitong. Ini adalah momen patah hati terbesar bagi Laskar Pelangi.",
        "Bab 5: Epilog: Cahaya Bintang Belitong. Bertahun-tahun kemudian, Ikal berdiri di atas geladak kapal yang merapat di pelabuhan Eropa, mengenang masa-masa indahnya di Belitong. Laskar Pelangi mengajarkan kita bahwa kemiskinan tidak bisa membelenggu jiwa yang merdeka, dan bahwa pendidikan sejati lahir dari ketulusan guru seperti Bu Muslimah dan semangat juang yang tak pernah padam."
      ]
    },
    {
      id: 503,
      title: "Sapiens: Riwayat Singkat Umat Manusia",
      author: "Yuval Noah Harari",
      category: "Sains & Teknologi",
      rating: 4.9,
      reviews: 945,
      readingTime: "6 menit",
      isPremium: 1,
      isMonthlySpecial: 1,
      coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Revolusi Kognitif. Sekitar 70.000 tahun yang lalu, organisme yang termasuk dalam spesies Homo sapiens mulai membentuk struktur yang jauh lebih rumit yang disebut kebudayaan. Perkembangan kebudayaan berikutnya disebut sejarah. Tiga revolusi penting membentuk jalannya sejarah: Revolusi Kognitif memulai sejarah sekitar 70.000 tahun yang lalu. Revolusi Pertanian mempercepatnya sekitar 12.000 tahun yang lalu. Revolusi Ilmiah, yang baru berjalan 500 tahun lalu, sangat mungkin mengakhiri sejarah dan memulai sesuatu yang sama sekali berbeda.",
        "Bab 2: Pohon Pengetahuan. Apa yang begitu istimewa dari bahasa baru Sapiens yang memungkinkan kita menaklukkan dunia? Jawaban yang paling mungkin adalah bahwa bahasa kita unik karena memungkinkan kita berbicara tentang hal-hal yang sama sekali tidak ada secara fisik: mitos, legenda, dewa, dan konsep abstrak seperti negara atau uang. Kemampuan memercayai fiksi bersama ini memungkinkan ribuan orang asing bekerja sama secara fleksibel.",
        "Bab 3: Kehidupan Pemburu-Pengumpul. Sebelum Revolusi Pertanian, nenek moyang kita hidup sebagai pemburu-pengumpul. Mereka memiliki pengetahuan mendalam tentang tumbuhan, hewan, dan bentang alam di sekitar mereka untuk bertahan hidup. Meskipun hidup sederhana, studi menunjukkan mereka bekerja lebih sedikit jam dan menikmati diet yang lebih bervariasi daripada petani-petani berikutnya. Namun, kehidupan mereka juga keras dan penuh bahaya.",
        "Bab 4: Banjir Besar Hewan. Ketika Homo sapiens menyebar ke seluruh penjuru dunia, mereka membawa kepunahan massal bagi megafauna lokal. Di Australia, dalam waktu beberapa ribu tahun setelah kedatangan Sapiens, hampir semua mamalia raksasa seberat lebih dari 50 kg lenyap. Sapiens terbukti menjadi pembunuh ekologis paling mematikan dalam sejarah planet bumi, bahkan sebelum mereka mengenal logam atau mesin uap.",
        "Bab 5: Penyatuan Umat Manusia. Seiring berjalannya sejarah, kebudayaan manusia yang terfragmentasi perlahan-lahan menyatu menjadi satu desa global yang saling terhubung. Tiga tatanan universal yang menyatukan umat manusia adalah: tatanan moneter (uang), tatanan imperial (kekaisaran), dan tatanan agama universal. Hari ini, hampir semua manusia berbagi tatanan geopolitik, sains, dan pasar keuangan yang sama."
      ]
    },
    {
      id: 504,
      title: "Dunia Sophie (Edisi Digital)",
      author: "Jostein Gaarder",
      category: "Novel & Fiksi",
      rating: 4.8,
      reviews: 812,
      readingTime: "5 menit",
      isPremium: 1,
      isMonthlySpecial: 1,
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Taman Eden. Suatu sore sepulang sekolah, Sophie Amundsen menemukan sebuah surat misterius di kotak posnya. Surat itu tidak memiliki prangko maupun nama pengirim, hanya berisi selembar kertas dengan pertanyaan singkat: 'Siapakah kamu?'. Sophie menatap pertanyaan itu dengan bingung. Bagaimana seseorang bisa benar-benar menjawab siapa dirinya? Belum sempat ia merenung, surat kedua datang dengan pertanyaan: 'Dari mana datangnya dunia?'.",
        "Bab 2: Topi Pesulap. Surat-surat misterius itu berlanjut menjadi kursus filsafat tertulis dari seorang mentor misterius bernama Alberto Knox. Alberto menjelaskan bahwa filsuf sejati seperti anak kecil yang tidak pernah kehilangan rasa ingin tahunya tentang dunia. Dunia ini diibaratkan seperti seekor kelinci putih besar yang ditarik keluar dari topi pesulap. Kebanyakan orang dewasa bersarang dengan nyaman di bulu kelinci, sementara para filsuf merangkak naik untuk menatap mata sang pesulap.",
        "Bab 3: Filsuf Alam. Di Yunani Kuno, para filsuf pertama mencari bahan dasar dari segala sesuatu di alam. Thales memercayai air sebagai asal mula kehidupan. Anaximenes memercayai udara. Democritus melangkah lebih jauh dengan mengajukan teori atom: bagian-bagian tak terlihat yang kekal dan tak dapat dibagi, yang menyusun semua materi di alam semesta. Pemikiran rasional ini membebaskan manusia dari takhayul mitologi kuno.",
        "Bab 4: Socrates, Plato, dan Aristoteles. Tiga raksasa filsafat Athena mengubah arah pemikiran manusia. Socrates mengajarkan metode dialog kritis untuk melahirkan kebenaran. Plato memercayai dunia ide yang kekal di mana jiwa kita berasal, sedangkan dunia fisik hanyalah bayangan dari dunia ide tersebut. Aristoteles menentang Plato, menegaskan bahwa kebenaran ditemukan melalui observasi empiris di dunia nyata ini.",
        "Bab 5: Realitas Ilusi. Sophie perlahan-lahan menyadari bahwa kehidupannya sendiri mungkin tidak senyata yang ia duga. Petunjuk-petunjuk aneh bermunculan: kartu pos untuk seorang gadis bernama Hilde Møller Knag yang dikirim oleh ayahnya, seorang mayor PBB di Lebanon. Apakah Sophie benar-benar manusia hidup, ataukah ia hanyalah karakter fiksi dalam sebuah buku yang ditulis oleh sang Mayor untuk menghibur putrinya?"
      ]
    },
    {
      id: 505,
      title: "Filosofi Teras (E-Book Pengembangan Diri)",
      author: "Henry Manampiring",
      category: "Pengembangan Diri",
      rating: 4.9,
      reviews: 1890,
      readingTime: "5 menit",
      isPremium: 0,
      isMonthlySpecial: 0,
      coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Kekhawatiran Nasional. Kehidupan modern dipenuhi dengan kecemasan, mulai dari macetnya jalanan, kritikan netizen di media sosial, hingga kekhawatiran akan masa depan karir. Banyak dari kita membiarkan kebahagiaan kita ditentukan oleh faktor-faktor eksternal di luar kendali kita. Filosofi Teras (Stoikisme), sebuah mazhab filsafat Yunani kuno, menawarkan solusi praktis untuk menjaga kedamaian mental di tengah dunia yang kacau.",
        "Bab 2: Dikotomi Kendali. Prinsip terpenting dalam Stoikisme adalah Dikotomi Kendali: menyadari hal-hal yang ada di bawah kendali kita (pikiran, opini, tindakan kita) dan hal-hal yang tidak di bawah kendali kita (opini orang lain, cuaca, tindakan orang lain, hasil akhir). Kebahagiaan sejati hanya dicapai jika kita memfokuskan energi kita sepenuhnya pada apa yang bisa kita kendalikan, dan melepaskan kekhawatiran atas apa yang tidak bisa kita kendalikan.",
        "Bab 3: Mengelola Emosi Negatif. Stoikisme menegaskan bahwa emosi negatif seperti marah, cemas, atau sedih tidak disebabkan oleh peristiwa eksternal itu sendiri, melainkan oleh *penilaian* atau *interpretasi* kita terhadap peristiwa tersebut. Dengan menggunakan metode S-T-A-R (Stop, Think, Assess, Respond), kita dapat menunda respon emosional otomatis kita dan memilih tanggapan rasional yang bijak.",
        "Bab 4: Amor Fati: Mencintai Takdir. Seorang Stoik tidak hanya menerima kenyataan pahit, tetapi juga merangkul dan mencintainya sebagai bagian dari jalannya kehidupan (*Amor Fati*). Setiap rintangan atau kemalangan dipandang sebagai bahan bakar untuk melatih karakter kita menjadi lebih kuat. Kesulitan bukanlah penghambat, melainkan jalan itu sendiri.",
        "Bab 5: Kesimpulan: Menjadi Stoik Modern. Filosofi Teras bukan tentang menjadi manusia tanpa emosi layaknya robot, melainkan tentang memiliki emosi yang sehat dan ketangguhan mental (*tranquility*). Dengan mempraktikkan stoikisme dalam keseharian, kita dapat hidup bebas dari kecemasan berlebih dan menjadi versi terbaik dari diri kita sendiri."
      ]
    },
    {
      id: 506,
      title: "Mari Belajar Fisika Kurikulum Merdeka",
      author: "Prof. Yohanes Surya",
      category: "Buku Pelajaran",
      rating: 4.7,
      reviews: 142,
      readingTime: "4 menit",
      isPremium: 0,
      isMonthlySpecial: 0,
      coverImage: "https://images.unsplash.com/photo-1636466481862-345867098f36?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Bab 1: Pengukuran dan Besaran. Dalam fisika, pengukuran adalah membandingkan suatu besaran dengan besaran standar yang sejenis. Kita mengenal tujuh besaran pokok: panjang (meter), massa (kilogram), waktu (sekon), suhu (kelvin), kuat arus (ampere), intensitas cahaya (kandela), dan jumlah zat (mol). Ketepatan pengukuran sangat penting dalam eksperimen sains.",
        "Bab 2: Dinamika Gerak Lurus. Hukum Newton tentang gerak adalah fondasi dinamika klasik. Hukum I Newton menyatakan benda cenderung mempertahankan keadaannya (inersia). Hukum II Newton menyatakan percepatan sebanding dengan gaya bersih dan berbanding terbalik dengan massa. Hukum III Newton menyatakan setiap aksi selalu memicu reaksi yang sama besar dan berlawanan arah.",
        "Bab 3: Energi Terbarukan. Menghadapi krisis iklim global, transisi menuju energi terbarukan menjadi keharusan. Kita mempelajari konversi energi mekanik menjadi energi listrik menggunakan pembangkit listrik tenaga angin, hidro, dan surya. Efisiensi energi merupakan kunci masa depan bumi kita.",
        "Bab 4: Fluida Statis dan Dinamis. Tekanan hidrostatis bertambah seiring kedalaman fluida. Hukum Archimedes menyatakan gaya apung ke atas sama dengan berat fluida yang dipindahkan. Pada fluida dinamis, asas kontinuitas dan hukum Bernoulli menjelaskan mengapa pesawat terbang bisa mengudara dan bagaimana semprotan parfum bekerja.",
        "Bab 5: Fisika Modern dan Kuantum. Memasuki abad ke-20, fisika klasik gagal menjelaskan fenomena skala atom. Relativitas Einstein dan teori kuantum Planck mengubah cara pandang kita terhadap ruang, waktu, dan cahaya. Dualisme partikel-gelombang menyatakan cahaya bisa berperilaku sebagai gelombang sekaligus partikel (foton)."
      ]
    },
    {
      id: 507,
      title: "Detective Conan: Edisi Spesial Digital",
      author: "Gosho Aoyama",
      category: "Komik",
      rating: 4.8,
      reviews: 640,
      readingTime: "3 menit",
      isPremium: 1,
      isMonthlySpecial: 0,
      coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=300",
      pages: [
        "Halaman 1: Transformasi Shinichi Kudo. Shinichi Kudo adalah detektif SMA terkenal yang membantu polisi memecahkan kasus-kasus rumit. Suatu hari, saat menyelidiki transaksi mencurigakan oleh pria berjubah hitam di taman bermain, Shinichi diserang dari belakang. Ia dipaksa meminum racun eksperimental APTX 4869 yang sedang dikembangkan organisasi mereka.",
        "Halaman 2: Lahirnya Conan Edogawa. Alih-alih tewas, racun itu menyusutkan tubuh Shinichi menjadi seukuran anak SD kelas 1! Untuk menyembunyikan identitasnya agar tidak membahayakan orang-orang terdekatnya, Shinichi memakai kacamata ayahnya dan mengadopsi nama samaran Conan Edogawa (diambil dari sir Arthur Conan Doyle dan Rampo Edogawa).",
        "Halaman 3: Detektif Cilik Beraksi. Conan menumpang tinggal di rumah Ran Mouri dan ayahnya, Kogoro Mouri, seorang detektif swasta yang tidak kompeten. Dengan menggunakan alat-alat canggih ciptaan Profesor Agasa seperti dasi kupu-kupu pengubah suara dan jam tangan jarum bius, Conan diam-diam memecahkan kasus-kasus rumit atas nama Kogoro Tidur.",
        "Halaman 4: Misteri Organisasi Hitam. Conan terus mencari jejak organisasi hitam yang telah menyusutkannya. Ia bertemu dengan Ai Haibara (Sherry), mantan ilmuwan organisasi hitam yang menciptakan racun APTX 4869 dan menyusutkan dirinya sendiri demi melarikan diri dari kejaran organisasi kejam tersebut. Mereka kini bekerja sama untuk mengungkap konspirasi global.",
        "Halaman 5: Kebenaran Selalu Satu! Di hadapan pelaku kejahatan yang tidak bisa mengelak lagi, Conan (menggunakan suara Kogoro Mouri) memaparkan trik pembunuhan ruang tertutup yang sangat rapi. Melalui deduksi logis dan bukti ilmiah yang tak terbantahkan, Conan menegaskan prinsip hidupnya: 'Kebenaran hanya ada satu!'"
      ]
    }
  ];

  for (const eb of ebooks) {
    await db.execute(
      `INSERT INTO ebook (id, judul, penulis_nama, kategori, rating, total_ulasan, waktu_baca, is_premium, is_bulanan_special, cover_url, pages)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [eb.id, eb.title, eb.author, eb.category, eb.rating, eb.reviews, eb.readingTime, eb.isPremium, eb.isMonthlySpecial, eb.coverImage, JSON.stringify(eb.pages)]
    );
  }
  console.log(`✅ ${ebooks.length} ebooks berhasil di-seed`);

  // ===================== DISKUSI =====================
  const diskusi_data = [
    { judul: "Rekomendasi novel fiksi sejarah Indonesia?", konten: "Halo semuanya, ada yang punya rekomendasi novel fiksi yang berlatar belakang sejarah Indonesia? Aku lagi nyari bacaan buat nambah wawasan sekaligus hiburan.", likes: 1200 },
    { judul: "Bedah Buku: Atomic Habits karya James Clear", konten: "Mari kita diskusikan bab 3 dari Atomic Habits. Bagaimana kalian mengimplementasikan 'Make it Obvious' dalam rutinitas harian kalian?", likes: 850 },
    { judul: "Tips membaca jurnal berbahasa Inggris dengan cepat", konten: "Ada yang punya teknik atau tools AI yang bagus buat bantu mereview literatur jurnal bahasa inggris ngga? Mohon infonya ya kak.", likes: 3400 },
    { judul: "Buku fiksi sains yang mind-blowing?", konten: "Ada saran buku fiksi sains yang konsepnya fresh dan bikin mikir keras? Baru selesai baca Dune dan butuh sesuatu yang sejenis.", likes: 500 },
    { judul: "Bagaimana cara konsisten membaca buku?", konten: "Saya sering beli buku tapi jarang selesai dibaca. Selalu ada saja alasan buat berhenti. Minta tips dong supaya bisa konsisten baca setiap hari.", likes: 2100 },
    { judul: "Diskusi Jurnal: Pengaruh AI terhadap lapangan kerja", konten: "Baru saja baca jurnal terbaru dari MIT tentang otomasi. Menurut kalian, profesi apa saja yang akan paling terdampak dalam 5 tahun ke depan?", likes: 750 },
  ];

  for (const d of diskusi_data) {
    await db.execute(
      "INSERT INTO diskusi (user_id, judul, konten, total_likes) VALUES (1, ?, ?, ?)",
      [d.judul, d.konten, d.likes]
    ).catch((err) => {
      console.error(`⚠️ Gagal seed diskusi "${d.judul}":`, err.message);
    });
  }
  console.log(`✅ ${diskusi_data.length} diskusi berhasil di-seed`);

  console.log("\n🎉 Seed selesai! Database ReadBridge siap digunakan.\n");
  process.exit(0);
};

seedData().catch(err => {
  console.error("❌ Seed gagal:", err.message);
  process.exit(1);
});

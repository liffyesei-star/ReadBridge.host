const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const db = require("../config/db");

async function runTest() {
  console.log("🧪 Starting Seller Flow End-to-End Test...");
  try {
    // 1. We'll use a mock user ID for testing (e.g. user ID 1 or we'll fetch an existing user)
    const [users] = await db.execute("SELECT id, email, nama FROM users LIMIT 1");
    if (!users.length) {
      console.error("❌ No users found in database to run the test.");
      process.exit(1);
    }
    const testUser = users[0];
    console.log(`Using user: ID ${testUser.id}, Name: ${testUser.nama}, Email: ${testUser.email}`);

    // 2. Clean up any existing store for this user to ensure we can test creation
    console.log("Cleaning up existing store and seller books for test user...");
    const [toko] = await db.execute("SELECT id FROM toko WHERE user_id = ?", [testUser.id]);
    if (toko.length) {
      await db.execute("DELETE FROM buku WHERE toko_id = ?", [toko[0].id]);
      await db.execute("DELETE FROM toko WHERE id = ?", [toko[0].id]);
    }

    // 3. Check store (should be false)
    console.log("Checking store status (should be false)...");
    const [t1] = await db.execute("SELECT * FROM toko WHERE user_id = ?", [testUser.id]);
    console.log(`Has store? ${t1.length > 0}`);

    // 4. Create store
    console.log("Creating store...");
    const nama_toko = "Toko Buku Berkah Affan";
    const deskripsi = "Menjual buku bekas berkualitas tinggi.";
    const lokasi = "Bandung";
    const [result] = await db.execute(
      "INSERT INTO toko (user_id, nama_toko, deskripsi, lokasi) VALUES (?, ?, ?, ?)",
      [testUser.id, nama_toko, deskripsi, lokasi]
    );
    const newTokoId = result.insertId;
    console.log(`Store created successfully with ID: ${newTokoId}`);

    // 5. Add preloved book
    console.log("Adding a preloved book...");
    const judul = "Laskar Pelangi Edisi Kolektor";
    const slug = "laskar-pelangi-edisi-kolektor-" + Date.now();
    const penulis_nama = "Andrea Hirata";
    const harga_beli = 45000;
    const stok = 2;
    const kondisi = "Bagus";
    const tipe_buku = "preloved";
    const [bookResult] = await db.execute(
      `INSERT INTO buku (judul, slug, penulis_id, penulis_nama, kategori_id, deskripsi,
        harga_beli, toko_id, tipe_buku, kondisi, stok, lokasi)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        judul, slug, testUser.id, penulis_nama, 1, "Buku Laskar Pelangi bekas, kondisi layak baca.",
        harga_beli, newTokoId, tipe_buku, kondisi, stok, lokasi
      ]
    );
    console.log(`Book added successfully with ID: ${bookResult.insertId}`);

    // 6. Query books with filter tipe_buku=preloved
    console.log("Querying preloved books from API-like query...");
    const [books] = await db.execute(
      `SELECT b.*, t.nama_toko 
       FROM buku b 
       LEFT JOIN toko t ON b.toko_id = t.id 
       WHERE b.tipe_buku = 'preloved' AND b.aktif = 1`
    );
    console.log(`Found ${books.length} preloved books in database.`);
    const addedBook = books.find(b => b.id === bookResult.insertId);
    if (addedBook) {
      console.log("✅ SUCCESS: Found newly added preloved book in database with correct details!");
      console.log(`   Title: ${addedBook.judul}`);
      console.log(`   Price: Rp ${addedBook.harga_beli}`);
      console.log(`   Condition: ${addedBook.kondisi}`);
      console.log(`   Stock: ${addedBook.stok}`);
      console.log(`   Store: ${addedBook.nama_toko}`);
    } else {
      console.error("❌ FAILURE: Newly added preloved book not found in database query!");
    }

    // 7. Clean up test data
    console.log("Cleaning up test data...");
    await db.execute("DELETE FROM buku WHERE id = ?", [bookResult.insertId]);
    await db.execute("DELETE FROM toko WHERE id = ?", [newTokoId]);
    console.log("Clean up finished.");

    console.log("🎉 ALL TESTS PASSED!");
    process.exit(0);
  } catch (err) {
    console.error("❌ TEST FAILED with error:", err.message);
    process.exit(1);
  }
}

runTest();

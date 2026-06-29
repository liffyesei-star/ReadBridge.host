package com.readbridge.app.data.repository

import com.readbridge.app.data.local.BookDao
import com.readbridge.app.data.local.CartDao
import com.readbridge.app.data.local.ClubDao
import com.readbridge.app.data.local.PostDao
import com.readbridge.app.data.model.Book
import com.readbridge.app.data.model.CartItem
import com.readbridge.app.data.model.Club
import com.readbridge.app.data.model.Post
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

class ReadBridgeRepository(
    private val bookDao: BookDao,
    private val cartDao: CartDao,
    private val clubDao: ClubDao,
    private val postDao: PostDao
) {
    val allBooks: Flow<List<Book>> = bookDao.getAllBooks()
    val cartItems: Flow<List<CartItem>> = cartDao.getCartItems()
    val allClubs: Flow<List<Club>> = clubDao.getAllClubs()

    fun getPostsByClub(clubId: String): Flow<List<Post>> = postDao.getPostsByClub(clubId)

    suspend fun seedDatabaseIfEmpty() {
        val currentBooks = allBooks.first()
        if (currentBooks.isEmpty()) {
            // Seed Books
            val mockBooks = listOf(
                Book(
                    id = "book1",
                    title = "Laskar Pelangi",
                    author = "Andrea Hirata",
                    priceBuy = 85000.0,
                    priceRent = 5000.0,
                    rating = 4.8f,
                    reviewCount = 124,
                    coverUrl = "", // Empty triggers placeholder
                    category = "Fiksi",
                    description = "Kisah perjuangan anak-anak Belitung di sekolah dasar Muhammadiyah yang penuh dengan keterbatasan namun memiliki tekad luar biasa."
                ),
                Book(
                    id = "book2",
                    title = "Bumi",
                    author = "Tere Liye",
                    priceBuy = 95000.0,
                    priceRent = 6000.0,
                    rating = 4.7f,
                    reviewCount = 98,
                    coverUrl = "",
                    category = "Fiksi",
                    description = "Petualangan 3 sahabat di dunia paralel yang dipenuhi sihir dan teknologi canggih."
                ),
                Book(
                    id = "book3",
                    title = "Sukses SNBT Literasi Indonesia",
                    author = "Tim Edukasi",
                    priceBuy = 65000.0,
                    priceRent = 3000.0,
                    rating = 4.9f,
                    reviewCount = 312,
                    coverUrl = "",
                    category = "SNBT",
                    description = "Kumpulan latihan soal dan pembahasan literasi bahasa Indonesia untuk kelulusan SNBT 2026."
                ),
                Book(
                    id = "book4",
                    title = "Struktur Data & Algoritma",
                    author = "Dr. Budi Santoso",
                    priceBuy = 120000.0,
                    priceRent = 8000.0,
                    rating = 4.5f,
                    reviewCount = 42,
                    coverUrl = "",
                    category = "Akademik",
                    description = "Panduan fundamental pemrograman berorientasi objek serta analisis kompleksitas algoritma."
                )
            )
            bookDao.insertBooks(mockBooks)

            // Seed Clubs
            val mockClubs = listOf(
                Club("club1", "Pecinta Fiksi", "Wadah diskusi novel, cerpen, fiksi ilmiah, fantasi.", 1240, ""),
                Club("club2", "Pejuang SNBT", "Fokus belajar bersama menjawab soal SNBT UTBK.", 890, ""),
                Club("club3", "Teknologi & Coding", "Belajar logika algoritma, database, dan mobile programming.", 430, "")
            )
            clubDao.insertClubs(mockClubs)

            // Seed Forum Posts
            val mockPosts = listOf(
                Post(
                    id = "post1",
                    clubId = "club1",
                    author = "Affan",
                    authorAvatar = "",
                    title = "Apakah ending Tere Liye Bumi memuaskan?",
                    content = "Menurutku twist di bab terakhir itu keren banget! Tapi ada beberapa plot hole yang masih mengganjal. Bagaimana menurut kalian?",
                    timestamp = "2 jam yang lalu",
                    votes = 42,
                    commentCount = 15
                ),
                Post(
                    id = "post2",
                    clubId = "club1",
                    author = "Liffy",
                    authorAvatar = "",
                    title = "Rekomendasi novel fiksi sejarah lokal?",
                    content = "Lagi nyari bacaan yang mirip Gadis Kretek atau Amba. Ada saran penulis indie yang bagus?",
                    timestamp = "5 jam yang lalu",
                    votes = 18,
                    commentCount = 7
                ),
                Post(
                    id = "post3",
                    clubId = "club2",
                    author = "Andi",
                    authorAvatar = "",
                    title = "Tips lolos Penalaran Matematika SNBT 2026",
                    content = "Kuncinya ada di pemahaman aritmatika dasar dan pengerjaan soal cerita. Jangan cuma menghafal rumus cepat, ya!",
                    timestamp = "1 hari yang lalu",
                    votes = 156,
                    commentCount = 48
                )
            )
            postDao.insertPosts(mockPosts)
        }
    }

    suspend fun addToCart(item: CartItem) {
        cartDao.addToCart(item)
    }

    suspend fun removeFromCart(item: CartItem) {
        cartDao.removeFromCart(item)
    }

    suspend fun clearCart() {
        cartDao.clearCart()
    }

    suspend fun upvotePost(post: Post, delta: Int) {
        val newVotes = (post.votes + delta).coerceAtLeast(0)
        postDao.updatePost(post.copy(votes = newVotes))
    }

    suspend fun addPost(post: Post) {
        postDao.insertPost(post)
    }
}

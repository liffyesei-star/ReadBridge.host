package com.readbridge.app.data.local

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Update
import com.readbridge.app.data.model.Book
import com.readbridge.app.data.model.CartItem
import com.readbridge.app.data.model.Club
import com.readbridge.app.data.model.Post
import kotlinx.coroutines.flow.Flow

@Dao
interface BookDao {
    @Query("SELECT * FROM books")
    fun getAllBooks(): Flow<List<Book>>

    @Query("SELECT * FROM books WHERE id = :id")
    suspend fun getBookById(id: String): Book?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBooks(books: List<Book>)

    @Update
    suspend fun updateBook(book: Book)
}

@Dao
interface CartDao {
    @Query("SELECT * FROM cart_items")
    fun getCartItems(): Flow<List<CartItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun addToCart(item: CartItem)

    @Delete
    suspend fun removeFromCart(item: CartItem)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()
}

@Dao
interface ClubDao {
    @Query("SELECT * FROM clubs")
    fun getAllClubs(): Flow<List<Club>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClubs(clubs: List<Club>)
}

@Dao
interface PostDao {
    @Query("SELECT * FROM posts WHERE clubId = :clubId")
    fun getPostsByClub(clubId: String): Flow<List<Post>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPosts(posts: List<Post>)

    @Update
    suspend fun updatePost(post: Post)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPost(post: Post)
}

@Database(entities = [Book::class, CartItem::class, Club::class, Post::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun bookDao(): BookDao
    abstract fun cartDao(): CartDao
    abstract fun clubDao(): ClubDao
    abstract fun postDao(): PostDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "readbridge_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

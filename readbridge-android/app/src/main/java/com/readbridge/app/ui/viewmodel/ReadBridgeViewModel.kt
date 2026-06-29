package com.readbridge.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.readbridge.app.data.model.Book
import com.readbridge.app.data.model.CartItem
import com.readbridge.app.data.model.Club
import com.readbridge.app.data.model.Post
import com.readbridge.app.data.repository.ReadBridgeRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class ReadBridgeViewModel(
    private val repository: ReadBridgeRepository
) : ViewModel() {

    init {
        viewModelScope.launch {
            repository.seedDatabaseIfEmpty()
        }
    }

    val books: StateFlow<List<Book>> = repository.allBooks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cartItems: StateFlow<List<CartItem>> = repository.cartItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val clubs: StateFlow<List<Club>> = repository.allClubs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _currentUsername = MutableStateFlow("Pembaca Setia")
    val currentUsername: StateFlow<String> = _currentUsername.asStateFlow()

    private val _isDarkTheme = MutableStateFlow(false)
    val isDarkTheme: StateFlow<Boolean> = _isDarkTheme.asStateFlow()

    fun getPostsForClub(clubId: String): Flow<List<Post>> = repository.getPostsByClub(clubId)

    fun addToCart(book: Book, type: String) {
        viewModelScope.launch {
            val currentCart = cartItems.value
            val isDuplicate = currentCart.any { it.bookId == book.id && it.transactionType == type }
            if (!isDuplicate) {
                val price = if (type == "BUY") book.priceBuy else book.priceRent
                val cartItem = CartItem(
                    id = UUID.randomUUID().toString(),
                    bookId = book.id,
                    title = book.title,
                    coverUrl = book.coverUrl,
                    price = price,
                    transactionType = type
                )
                repository.addToCart(cartItem)
            }
        }
    }

    fun removeFromCart(item: CartItem) {
        viewModelScope.launch {
            repository.removeFromCart(item)
        }
    }

    fun clearCart() {
        viewModelScope.launch {
            repository.clearCart()
        }
    }

    fun upvotePost(post: Post) {
        viewModelScope.launch {
            repository.upvotePost(post, 1)
        }
    }

    fun downvotePost(post: Post) {
        viewModelScope.launch {
            repository.upvotePost(post, -1)
        }
    }

    fun createPost(clubId: String, title: String, content: String) {
        viewModelScope.launch {
            val newPost = Post(
                id = UUID.randomUUID().toString(),
                clubId = clubId,
                author = _currentUsername.value,
                authorAvatar = "",
                title = title,
                content = content,
                timestamp = "Baru saja",
                votes = 1,
                commentCount = 0
            )
            repository.addPost(newPost)
        }
    }

    fun login(username: String) {
        _currentUsername.value = username.ifBlank { "Pembaca Setia" }
    }

    fun logout() {
        _currentUsername.value = "Pembaca Setia"
    }

    fun toggleTheme() {
        _isDarkTheme.value = !_isDarkTheme.value
    }
}

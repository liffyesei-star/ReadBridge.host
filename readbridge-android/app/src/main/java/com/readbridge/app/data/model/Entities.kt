package com.readbridge.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "books")
data class Book(
    @PrimaryKey val id: String,
    val title: String,
    val author: String,
    val priceBuy: Double,
    val priceRent: Double,
    val rating: Float,
    val reviewCount: Int,
    val coverUrl: String,
    val category: String,
    val description: String,
    val isRented: Boolean = false,
    val isPurchased: Boolean = false
)

@Entity(tableName = "cart_items")
data class CartItem(
    @PrimaryKey val id: String,
    val bookId: String,
    val title: String,
    val coverUrl: String,
    val price: Double,
    val transactionType: String // "BUY" or "RENT"
)

@Entity(tableName = "clubs")
data class Club(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val memberCount: Int,
    val iconUrl: String
)

@Entity(tableName = "posts")
data class Post(
    @PrimaryKey val id: String,
    val clubId: String,
    val author: String,
    val authorAvatar: String,
    val title: String,
    val content: String,
    val timestamp: String,
    var votes: Int = 0,
    val commentCount: Int = 0
)

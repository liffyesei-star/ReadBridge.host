package com.readbridge.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector? = null) {
    object Auth : Screen("auth", "Masuk")
    object Home : Screen("home", "Beranda", Icons.Default.Home)
    object Marketplace : Screen("marketplace", "Koleksi", Icons.Default.Book)
    object Cart : Screen("cart", "Keranjang", Icons.Default.ShoppingCart)
    object Community : Screen("community", "Komunitas", Icons.Default.Forum)
    object Profile : Screen("profile", "Profil", Icons.Default.Person)
}

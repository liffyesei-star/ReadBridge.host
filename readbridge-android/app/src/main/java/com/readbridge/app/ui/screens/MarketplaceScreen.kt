package com.readbridge.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.readbridge.app.data.model.Book
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MarketplaceScreen(viewModel: ReadBridgeViewModel) {
    val books by viewModel.books.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Semua") }
    var selectedBookForDetails by remember { mutableStateOf<Book?>(null) }
    val context = LocalContext.current

    val categories = listOf("Semua", "Fiksi", "SNBT", "Akademik")

    val filteredBooks = books.filter { book ->
        val matchesSearch = book.title.contains(searchQuery, ignoreCase = true) ||
                book.author.contains(searchQuery, ignoreCase = true)
        val matchesCategory = selectedCategory == "Semua" || book.category.equals(selectedCategory, ignoreCase = true)
        matchesSearch && matchesCategory
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Cari judul buku atau penulis...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
            singleLine = true
        )

        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            categories.forEach { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { Text(category) }
                )
            }
        }

        if (filteredBooks.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = "Tidak ada buku yang cocok.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 150.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredBooks) { book ->
                    BookGridCard(book = book, onClick = { selectedBookForDetails = book })
                }
            }
        }
    }

    selectedBookForDetails?.let { book ->
        AlertDialog(
            onDismissRequest = { selectedBookForDetails = null },
            confirmButton = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ElevatedButton(
                        onClick = {
                            viewModel.addToCart(book, "RENT")
                            Toast.makeText(context, "${book.title} ditambah ke keranjang (Sewa)", Toast.LENGTH_SHORT).show()
                            selectedBookForDetails = null
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.elevatedButtonColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    ) {
                        Text("Sewa (Rp ${book.priceRent.toInt()}/bln)")
                    }

                    Button(
                        onClick = {
                            viewModel.addToCart(book, "BUY")
                            Toast.makeText(context, "${book.title} ditambah ke keranjang (Beli)", Toast.LENGTH_SHORT).show()
                            selectedBookForDetails = null
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Beli (Rp ${book.priceBuy.toInt()})")
                    }
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedBookForDetails = null }) {
                    Text("Kembali")
                }
            },
            title = {
                Text(text = book.title, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(text = "Penulis: ${book.author}", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFFB300), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "${book.rating} (${book.reviewCount} ulasan)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(text = book.description, fontSize = 13.sp, lineHeight = 18.sp)
                }
            }
        )
    }
}

@Composable
fun BookGridCard(book: Book, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Book,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(36.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = book.title,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = book.author,
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Rp ${book.priceBuy.toInt()}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary
                )
                Surface(
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = book.category,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}

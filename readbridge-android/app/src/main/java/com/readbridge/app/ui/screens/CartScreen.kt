package com.readbridge.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.readbridge.app.data.model.CartItem
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@Composable
fun CartScreen(viewModel: ReadBridgeViewModel) {
    val cartItems by viewModel.cartItems.collectAsState()
    var showInvoice by remember { mutableStateOf(false) }
    val context = LocalContext.current

    val totalPrice = cartItems.sumOf { it.price }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Keranjang Belanja",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        if (cartItems.isEmpty()) {
            Column(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Keranjang belanja Anda kosong.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(cartItems) { item ->
                    CartItemRow(item = item, onDeleteClick = { viewModel.removeFromCart(item) })
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surfaceVariant,
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Total Pembayaran", fontWeight = FontWeight.SemiBold)
                        Text(
                            text = "Rp ${totalPrice.toInt()}",
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            fontSize = 18.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { showInvoice = true },
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("Bayar Sekarang")
                    }
                }
            }
        }
    }

    if (showInvoice) {
        val tax = totalPrice * 0.1
        val finalPrice = totalPrice + tax

        AlertDialog(
            onDismissRequest = { showInvoice = false },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.clearCart()
                        Toast.makeText(context, "Pembayaran berhasil! Buku terdaftar di perpustakaan.", Toast.LENGTH_LONG).show()
                        showInvoice = false
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Konfirmasi Pembayaran")
                }
            },
            dismissButton = {
                TextButton(onClick = { showInvoice = false }) {
                    Text("Batalkan")
                }
            },
            title = {
                Text("Struk Pembayaran (Invoice)", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(text = "Detail Transaksi:", fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(bottom = 8.dp))
                    cartItems.forEach { item ->
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${item.title} (${if (item.transactionType == "BUY") "Beli" else "Sewa"})",
                                fontSize = 13.sp,
                                modifier = Modifier.weight(1f)
                            )
                            Text(text = "Rp ${item.price.toInt()}", fontSize = 13.sp)
                        }
                    }
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Subtotal", fontSize = 13.sp)
                        Text(text = "Rp ${totalPrice.toInt()}", fontSize = 13.sp)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "PPN (10%)", fontSize = 13.sp)
                        Text(text = "Rp ${tax.toInt()}", fontSize = 13.sp)
                    }
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Total Akhir", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(text = "Rp ${finalPrice.toInt()}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 15.sp)
                    }
                }
            }
        )
    }
}

@Composable
fun CartItemRow(item: CartItem, onDeleteClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Book,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = item.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = if (item.transactionType == "BUY") MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.secondaryContainer,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = if (item.transactionType == "BUY") "Beli" else "Sewa",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (item.transactionType == "BUY") MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSecondaryContainer,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Rp ${item.price.toInt()}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.secondary
                    )
                }
            }
            IconButton(onClick = onDeleteClick) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Hapus",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

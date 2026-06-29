package com.readbridge.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@Composable
fun ProfileScreen(
    viewModel: ReadBridgeViewModel,
    onLogout: () -> Unit
) {
    val username by viewModel.currentUsername.collectAsState()
    val isDarkTheme by viewModel.isDarkTheme.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.size(50.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = username,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Anggota Sejak Juni 2026",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 4.dp)
        )

        Spacer(modifier = Modifier.height(24.dp))

        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                ProfileStatItem("Buku Dibeli", "12")
                ProfileStatItem("Diskusi", "5")
                ProfileStatItem("Klub Diikuti", "3")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(8.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.DarkMode, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(text = "Mode Gelap", fontSize = 14.sp)
                    }
                    Switch(
                        checked = isDarkTheme,
                        onCheckedChange = { viewModel.toggleTheme() }
                    )
                }

                Divider(modifier = Modifier.padding(vertical = 4.dp))

                ProfileMenuItem(
                    icon = Icons.Default.Storefront,
                    title = "Dashboard Penjual (Buka Toko)",
                    onClick = { /* Simulated action */ }
                )

                Divider(modifier = Modifier.padding(vertical = 4.dp))

                ProfileMenuItem(
                    icon = Icons.Default.HelpOutline,
                    title = "Pusat Bantuan",
                    onClick = { /* Simulated action */ }
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = onLogout,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.error,
                contentColor = MaterialTheme.colorScheme.onError
            )
        ) {
            Icon(Icons.Default.Logout, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Keluar dari Akun")
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun ProfileStatItem(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.height(4.dp))
        Text(text = label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun ProfileMenuItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        color = Color.Transparent
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(imageVector = icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.width(16.dp))
            Text(text = title, fontSize = 14.sp)
        }
    }
}

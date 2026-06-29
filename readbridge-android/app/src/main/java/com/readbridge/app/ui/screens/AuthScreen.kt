package com.readbridge.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.readbridge.app.ui.viewmodel.ReadBridgeViewModel

@Composable
fun AuthScreen(
    onLoginSuccess: () -> Unit,
    viewModel: ReadBridgeViewModel = viewModel()
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "ReadBridge",
            fontSize = 36.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        Text(
            text = "Connecting Readers & Bookstore Community",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        Text(
            text = if (isRegisterMode) "Buat Akun Baru" else "Selamat Datang Kembali",
            fontSize = 20.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        if (isRegisterMode) {
            OutlinedTextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("Nama Lengkap") },
                modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                singleLine = true
            )
        }

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
            singleLine = true
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Kata Sandi") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            singleLine = true
        )

        if (errorText.isNotEmpty()) {
            Text(
                text = errorText,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(bottom = 16.dp),
                fontSize = 14.sp
            )
        }

        Button(
            onClick = {
                if (email.isBlank() || password.isBlank() || (isRegisterMode && username.isBlank())) {
                    errorText = "Mohon lengkapi semua kolom."
                    return@Button
                }
                
                val finalName = if (isRegisterMode) username else email.substringBefore("@")
                viewModel.login(finalName)
                onLoginSuccess()
            },
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text(if (isRegisterMode) "Daftar" else "Masuk")
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedButton(
            onClick = {
                viewModel.login("Google User")
                onLoginSuccess()
            },
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Text("Masuk dengan Google")
        }

        Spacer(modifier = Modifier.height(24.dp))

        TextButton(
            onClick = {
                isRegisterMode = !isRegisterMode
                errorText = ""
            }
        ) {
            Text(
                if (isRegisterMode) "Sudah punya akun? Masuk"
                else "Belum punya akun? Daftar gratis"
            )
        }
    }
}

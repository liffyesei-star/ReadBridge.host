# Ringkasan Fix: Login Google & Reset Password

## 🐛 Masalah yang Dihadapi

### 1. **Login Google di PWA Android Stuck**
- Masalahnya: Setelah user pilih akun Google, stuck di loading tanpa melanjut ke main menu
- Root Cause: Error handling kurang robust, timeout tidak optimal, fallback redirect tidak ada

### 2. **Reset Password "Email Tidak Terdaftar" padahal Akun Valid**
- Masalahnya: Akun lokal (email + password) bisa login tapi tidak bisa reset password (sistem bilang belum registered)
- Root Cause: Reset password hanya cek Firebase Authentication, padahal akun lokal hanya di MySQL database

---

## ✅ Solusi yang Diterapkan

### **Fix 1: Database Migration (Backend)**
Tambah kolom untuk menyimpan reset token:
```sql
-- File: backend/database/migrate_add_reset_token.sql
ALTER TABLE users 
ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_password_expires DATETIME DEFAULT NULL;
```

**Cara jalankan:**
```bash
cd backend
mysql -u root -p readbridge_db < database/migrate_add_reset_token.sql
```

---

### **Fix 2: Backend Endpoints (auth.js)**
Tambah dua endpoint baru:

#### `POST /api/auth/forgot-password`
- **Fungsi**: Kirim link reset password ke email
- **Input**: `{ email: "user@example.com" }`
- **Output**: Email dengan link reset (jika terdaftar)
- **Rate Limit**: 3x per jam

#### `POST /api/auth/reset-password`
- **Fungsi**: Ubah password menggunakan token dari email
- **Input**: `{ token: "xxx", newPassword: "yyy" }`
- **Validasi**: Token harus valid dan belum expired (1 jam)

**Requirement**: Install `nodemailer` di backend
```bash
cd backend
npm install nodemailer
```

**Setup Environment Variables** (`.env` di backend):
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Bukan password Gmail biasa, gunakan app password
FRONTEND_URL=https://your-domain.com  # Untuk link di email
```

---

### **Fix 3: Frontend Reset Password (reset-password.html)**
Ubah dari Firebase ke Backend API:
- **Tahap 1**: User masukkan email → kirim forgot-password request
- **Tahap 2**: User klik link dari email → form untuk password baru
- **Tahap 3**: Submit password baru → call reset-password endpoint

Fitur baru:
✅ Cek email di database MySQL (bukan Firebase)  
✅ Dua tahap process (request + reset)  
✅ Token validation dengan expiry  
✅ Better error messages  

---

### **Fix 4: Google Login Android PWA (google-login.html)**
Improvement untuk mengatasi stuck:

**Perubahan:**
1. ✅ **Timeout Global** (2 menit) - mencegah infinite loop
2. ✅ **Better Retry Logic** - retry lebih cepat (1.5s, 3s, 6s)
3. ✅ **Fallback Redirect** - jika sync gagal, tetap bisa login dengan Firebase token
4. ✅ **Better Logging** - console log untuk debugging di browser dev tools
5. ✅ **localStorage Sync Delay** - tunggu 500ms setelah save sebelum redirect
6. ✅ **Response Parsing** - handle error JSON parsing dengan baik
7. ✅ **Fallback Options** - tanya user sebelum force redirect

**Flow baru:**
```
1. User klik Google → signInWithRedirect()
   ↓
2. Redirect ke Google → pilih akun
   ↓
3. Balik ke halaman → getRedirectResult()
   ↓
4. Sync ke database (retry 4x)
   ├─ Sukses? → Save localStorage → Redirect ke minat/index
   └─ Gagal? → Tanya user → Bisa lanjut dgn fallback atau retry
```

**Debug:**
Buka DevTools (F12) → Console untuk melihat log:
- `[Sync Attempt 1]` - proses sync dimulai
- `[Sync Response 1]` - respons dari server
- `[Redirect]` - halaman tujuan

---

## 🚀 Deployment Steps

### 1. **Update Database** (Jika belum punya kolom reset token)
```bash
cd backend
mysql -u root -p readbridge_db < database/migrate_add_reset_token.sql
```

### 2. **Update Backend Dependencies**
```bash
cd backend
npm install nodemailer  # Jika belum ada
npm start  # Restart server
```

### 3. **Setup Email Configuration**
- Edit `.env` di backend folder
- Setup Gmail App Password (bukan password biasa)
- Set `FRONTEND_URL` sesuai domain

### 4. **Test**

#### Test Reset Password:
1. Buka `https://your-domain.com/reset-password.html`
2. Masukkan email akun lokal yang terdaftar
3. Cek email → klik link reset
4. Masukkan password baru
5. Klik "Atur Ulang Kata Sandi"
6. Coba login dengan password baru

#### Test Google Login di Android PWA:
1. Buka PWA di Android Chrome
2. Tap "Google Login"
3. Pilih akun → lihat loading overlay
4. Monitor console log (DevTools)
5. Seharusnya redirect ke minat.html atau index.html
6. Jika masih stuck, bisa click OK untuk fallback

---

## ⚙️ Troubleshooting

### Email tidak dikirim
- ✅ Cek `EMAIL_USER` dan `EMAIL_PASSWORD` di `.env`
- ✅ Pastikan Gmail App Password (bukan password biasa)
- ✅ Cek console backend untuk error log
- ✅ Test dengan `curl` ke endpoint
```bash
curl -X POST https://your-backend/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Google Login masih stuck
- ✅ Buka DevTools (F12) → Console → cari `[Sync...]` logs
- ✅ Lihat error message yang ditampilkan
- ✅ Check backend `/api/auth/sync` endpoint (POST test)
- ✅ Pastikan Firebase config di google-login.html benar
- ✅ Test di desktop browser dulu sebelum Android

### Token invalid/expired
- ✅ Token hanya berlaku 1 jam
- ✅ User harus klik link dari email dalam 1 jam
- ✅ Jika expired, user bisa request reset password lagi

---

## 📝 Files Yang Diubah

### Backend:
- ✅ `backend/routes/auth.js` - Tambah 2 endpoint baru
- ✅ `backend/database/migrate_add_reset_token.sql` - Migration baru

### Frontend:
- ✅ `reset-password.html` - Ubah dari Firebase ke backend
- ✅ `google-login.html` - Improve error handling & timeout

### Konfigurasi:
- ✅ `backend/.env` - Tambah email config

---

## 🔐 Security Notes

✅ Reset token di-hash sebelum disimpan di database  
✅ Token hanya berlaku 1 jam  
✅ Password di-hash dengan bcrypt sebelum disimpan  
✅ Rate limit 3x per jam untuk forgot-password  
✅ Rate limit 10x per 15 menit untuk login  

---

## 📞 Questions?

Jika ada masalah:
1. Cek console browser (F12)
2. Cek server logs di backend
3. Cek `.env` configuration
4. Cek database columns sudah ada atau belum

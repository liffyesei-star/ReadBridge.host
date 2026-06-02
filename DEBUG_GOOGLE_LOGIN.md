# 🔍 Google Login PWA Debug Guide

## ⚠️ Masalah: Login Google stuck, tidak redirect ke home

Setelah Firebase auth berhasil dan user pilih akun, user **stuck di loading page** atau **looping login** tanpa bisa masuk.

---

## 🚨 Diagnosa Cepat

### **Langkah 1: Buka Developer Console**
- **Desktop**: Tekan `F12` → buka tab **Console**
- **Android PWA**: 
  - Chrome: `chrome://inspect` → pilih PWA → open DevTools
  - Atau: Inspect element di halaman → Console tab

### **Langkah 2: Lakukan Login & Perhatikan Console Logs**

Cari logs yang dimulai dengan `[` - ini adalah breadcrumb trail:

```
[Init] Initializing Google Login handler
[Device Detection] isPWAorMobile: true
[Google Login Click] User initiating Google login
[Google Login] Calling signInWithRedirect...
[Redirect Check 1] Attempting to get redirect result...
[Redirect Check 1] Result: User found ← ATAU → No result yet
```

---

## 🛠️ Troubleshooting berdasarkan Logs

### **Scenario 1: Stuck di `[Google Login] Calling signInWithRedirect...`**
**Penyebab**: Firebase redirect tidak terjadi
**Solusi**:
- ✅ Cek apakah pop-up/redirect diblokir browser
- ✅ Di Android: pastikan Chrome updated ke versi terbaru
- ✅ Clear browser cache: **Settings → Storage → Clear site data**
- ✅ Test di desktop browser dulu

### **Scenario 2: `[Auth State Changed] User detected` tapi tidak redirect**
**Penyebab**: `getRedirectResult()` tidak menangkap hasil (PWA issue)
**Solusi**:
- ✅ Cek log `[Redirect Check X]` - apakah mencoba retry?
- ✅ Jika tidak ada log, berarti `handleRedirectResult()` tidak dipanggil
- ✅ Cek `[Redirect Check 5]` - jika masih `No result`, timeout terjadi

**Manual recovery**:
```javascript
// Buka DevTools console, jalankan:
localStorage.setItem('rb_is_logged_in', 'true');
localStorage.setItem('rb_username', 'Your Name');
localStorage.setItem('rb_email', 'your@email.com');
localStorage.setItem('rb_token', 'dummy_token');
window.location.href = 'index.html';
```

### **Scenario 3: Logs menunjukkan error di `/api/auth/sync`**
**Penyebab**: Backend sync gagal
**Solusi**:
- ✅ Cek backend running: `npm start`
- ✅ Cek `.env` file di backend - pastikan semua config ada
- ✅ Test endpoint manual:
```bash
# Terminal
curl -X POST https://readbridge-backend-2whx.onrender.com/api/auth/sync \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### **Scenario 4: `[Redirect Check 5] No result yet` → timeout**
**Penyebab**: PWA environment - `getRedirectResult()` tidak support with redirect
**Solusi**:
- ✅ Clear PWA cache: Settings → Apps → Chrome → Storage → Clear data
- ✅ Uninstall PWA, install ulang
- ✅ Test di desktop browser first
- ✅ Check Android Chrome version (harus > 90)

---

## 📊 Console Logs Explanation

| Log | Meaning | What to do |
|-----|---------|-----------|
| `[Device Detection] isPWAorMobile: true` | Running on PWA/Mobile | Expected untuk Android |
| `[Google Login] Calling signInWithRedirect...` | Firebase auth dimulai | Tunggu pop-up redirect |
| `[Redirect Check 1] Attempting...` | Checking untuk user result | OK |
| `[Redirect Check 1] Result: User found` | ✅ Firebase auth sukses | Should redirect next |
| `[Redirect Check 5] No result yet` | ❌ Cannot get result | PWA redirect issue |
| `[Auth Success] User detected` | Firebase onAuthStateChanged fired | User login terdeteksi |
| `[Sync Attempt 1] Calling /api/auth/sync` | Sync ke backend dimulai | Check backend |
| `[Sync Success] User synced` | ✅ Backend sync sukses | Proceed to redirect |
| `[Sync Failed 1] Error: timeout` | ❌ Backend offline/slow | Check backend connection |
| `[LocalStorage] All data saved` | ✅ Data saved locally | Good |
| `[Login Complete] Redirecting to index.html` | ✅ Final redirect | Page should load |

---

## 🔧 Advanced Debugging

### **Check localStorage after login attempt:**
```javascript
// DevTools console
Object.keys(localStorage).filter(k => k.startsWith('rb_')).forEach(k => {
    console.log(k, ':', localStorage.getItem(k));
});
```

**Expected output:**
```
rb_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
rb_is_logged_in: true
rb_username: Nama User
rb_email: user@example.com
rb_uid: xxxxxxxxx
rb_firebase_user_detected: true
```

### **Check sessionStorage:**
```javascript
// DevTools console
console.log('rb_google_login_pending:', sessionStorage.getItem('rb_google_login_pending'));
console.log('rb_login_in_progress:', localStorage.getItem('rb_login_in_progress'));
```

### **Check Firebase auth state:**
```javascript
// DevTools console (only works on google-login.html)
console.log('Current user:', auth.currentUser);
if (auth.currentUser) {
    auth.currentUser.getIdToken().then(token => {
        console.log('ID Token:', token.substring(0, 50) + '...');
    });
}
```

---

## 🔐 Network Debugging (Chrome DevTools)

### **1. Buka Network tab**
- F12 → **Network** tab
- Clear existing logs

### **2. Lakukan login**
- Click Google login button
- Perhatikan requests:

| Request | Expected Status | What it means |
|---------|-----------------|---------------|
| `google-login.html` | 200 | Page load OK |
| `__/auth/...` (Firebase) | 200 | Firebase redirect OK |
| `/api/auth/sync` | 200 OK | Backend sync sukses |
|                   | 401/403 | Token invalid |
|                   | 500 | Backend error |
|                   | No response | Timeout/Connection error |

### **3. Check Response untuk `/api/auth/sync`:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": 123,
    "email": "user@gmail.com",
    "firebase_uid": "xxxxx"
  }
}
```

---

## 💾 Service Worker Issue

### **Clear PWA Cache:**
```javascript
// DevTools console
caches.keys().then(names => {
    names.forEach(name => {
        caches.delete(name).then(() => console.log('Cleared:', name));
    });
});
```

### **Check Service Worker status:**
```javascript
// DevTools console
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => {
        console.log('SW state:', reg.installing?.state || reg.waiting?.state || reg.active?.state);
        console.log('SW scope:', reg.scope);
    });
});
```

---

## 📱 Android PWA Specific

### **Issue**: Redirect tidak terjadi di PWA
**Root cause**: `signInWithRedirect()` behavior berbeda di PWA environment

**Workaround**:
1. Clear PWA cache completely
2. Uninstall app from home screen
3. Reinstall PWA
4. Try login again

### **Check PWA mode:**
```javascript
// DevTools console
console.log('Standalone mode:', window.navigator.standalone);
console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches);
console.log('User Agent:', navigator.userAgent);
```

---

## ✅ Fix Checklist

- [ ] Logs menunjukkan `[Redirect Check X] Result: User found`
- [ ] Logs menunjukkan `[Sync Success]` (atau fallback sukses)
- [ ] Logs menunjukkan `[Login Complete] Redirecting to...`
- [ ] localStorage punya `rb_is_logged_in: true`
- [ ] Page redirect ke `index.html` atau `minat.html`
- [ ] User tidak stuck di loading overlay

---

## 🚨 Still Stuck?

1. **Collect all console logs** → Screenshot/copy all `[...]` logs
2. **Check backend logs** → Run: `npm start` dan lihat console
3. **Test basic connectivity** → Buka `/api/auth/sync` endpoint di browser
4. **Clear everything** → Uninstall PWA + Clear browser data + Restart
5. **Try desktop browser first** → Verify flow works di desktop
6. **Check internet connection** → Restart WiFi/cellular

---

## 📞 Report Issue

Ketika melaporkan issue, include:
- [ ] All `[...]` logs dari DevTools console
- [ ] Screenshot Network tab saat login
- [ ] Output dari localStorage check
- [ ] Backend logs (jika ada error)
- [ ] Device info (OS, browser, PWA vs browser)

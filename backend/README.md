# 📚 ReadBridge Backend API

Backend REST API untuk platform literasi digital **ReadBridge**.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (via `mysql2`)
- **Auth:** Firebase Admin SDK
- **Security:** Helmet, CORS, Rate Limiting

## Struktur Folder

```
readbridge-backend/
├── server.js              ← Entry point utama
├── package.json
├── .env.example           ← Template environment variables
├── config/
│   ├── db.js              ← Koneksi MySQL
│   └── firebase.js        ← Firebase Admin SDK
├── middleware/
│   └── auth.js            ← Verifikasi Firebase token
├── routes/
│   ├── auth.js            ← /api/auth
│   ├── books.js           ← /api/books
│   ├── journals.js        ← /api/journals
│   ├── transactions.js    ← /api/transactions
│   ├── community.js       ← /api/community
│   └── users.js           ← /api/users
├── database/
│   ├── schema.sql         ← Struktur tabel MySQL
│   └── seed.js            ← Data awal (buku, jurnal, diskusi)
└── DOKUMENTASI.md         ← Flowchart & Pseudocode lengkap
```

## Instalasi

### Prasyarat
- Node.js v18+
- MySQL 8.0+
- Akun Firebase (untuk Auth)

### Langkah Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup .env
cp .env.example .env
# Edit .env dengan kredensial Anda

# 3. Setup database
mysql -u root -p < database/schema.sql

# 4. Seed data awal
node database/seed.js

# 5. Jalankan
npm run dev    # Development
npm start      # Production
```

## Environment Variables

Lihat `.env.example` untuk daftar lengkap. Variable wajib:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`

## API Endpoints

Base URL: `http://localhost:5000`

| Endpoint | Deskripsi |
|----------|-----------|
| `POST /api/auth/sync` | Sinkronisasi akun Firebase |
| `GET /api/books` | Daftar buku + search/filter |
| `GET /api/books/:id` | Detail buku |
| `POST /api/transactions/beli` | Beli buku |
| `POST /api/transactions/sewa` | Sewa buku |
| `GET /api/community/diskusi` | Daftar diskusi |
| `GET /api/users/leaderboard` | Ranking pembaca |
| `GET /api/users/notifikasi` | Notifikasi user |

Dokumentasi lengkap di `DOKUMENTASI.md`

## Cara Pakai di Frontend

```javascript
// Setelah Firebase login berhasil:
const token = await firebase.auth().currentUser.getIdToken();

const response = await fetch('http://localhost:5000/api/books', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

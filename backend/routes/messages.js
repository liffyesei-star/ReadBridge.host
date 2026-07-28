const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// POST /api/messages/keys - Update public key user
router.post('/keys', verifyToken, async (req, res) => {
    try {
        const { publicKey } = req.body;
        if (!publicKey) return res.status(400).json({ success: false, message: 'Public key required' });

        await db.execute('UPDATE users SET public_key = ? WHERE id = ?', [publicKey, req.user.id]);
        res.json({ success: true, message: 'Public key disimpan.' });
    } catch (err) {
        console.error("Error save key:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/messages/keys/:friendId - Ambil public key teman
router.get('/keys/:friendId', verifyToken, async (req, res) => {
    try {
        const friendId = req.params.friendId;
        
        // Cek apakah benar-benar teman
        const [friends] = await db.execute(
            `SELECT * FROM friends WHERE 
             ((user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?))
             AND status = 'accepted'`,
            [req.user.id, friendId, friendId, req.user.id]
        );

        if (friends.length === 0) {
            return res.status(403).json({ success: false, message: 'Bukan teman.' });
        }

        const [users] = await db.execute('SELECT public_key FROM users WHERE id = ?', [friendId]);
        if (users.length === 0 || !users[0].public_key) {
            return res.status(404).json({ success: false, message: 'Public key tidak ditemukan.' });
        }

        res.json({ success: true, public_key: users[0].public_key });
    } catch (err) {
        console.error("Error get key:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/messages/history/:friendId - Ambil riwayat pesan
router.get('/history/:friendId', verifyToken, async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const [messages] = await db.execute(
            `SELECT * FROM messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)
             ORDER BY created_at ASC`,
            [req.user.id, friendId, friendId, req.user.id]
        );
        
        res.json({ success: true, data: messages });
    } catch (err) {
        console.error("Error get messages:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

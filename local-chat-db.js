/**
 * local-chat-db.js
 * Utilitas Penyimpanan Obrolan Lokal (IndexedDB)
 * Digunakan untuk mereplikasi arsitektur Local-First seperti WhatsApp Web.
 */

const LocalChatDB = {
    dbName: 'ReadBridgeChatDB',
    dbVersion: 1,
    db: null,

    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Buat object store untuk pesan
                if (!db.objectStoreNames.contains('messages')) {
                    const store = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                    // Index untuk mempercepat query
                    store.createIndex('chatId', 'chatId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("LocalChatDB (IndexedDB) berhasil diinisialisasi.");
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error("Gagal menginisialisasi IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        });
    },

    /**
     * Menyimpan pesan ke IndexedDB
     * @param {Object} messageObj - Objek pesan { senderId, receiverId, text, timestamp, isMine }
     */
    saveMessage: function(messageObj) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB tidak diinisialisasi");

            // chatId adalah ID teman obrolan
            const chatId = messageObj.isMine ? messageObj.receiverId : messageObj.senderId;
            const dataToSave = {
                ...messageObj,
                chatId: chatId.toString(), // ID Teman
            };

            const transaction = this.db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.add(dataToSave);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    /**
     * Mengambil riwayat pesan berdasarkan chatId (ID teman)
     * @param {String} chatId 
     * @returns {Promise<Array>}
     */
    getMessages: function(chatId) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB tidak diinisialisasi");

            const transaction = this.db.transaction(['messages'], 'readonly');
            const store = transaction.objectStore('messages');
            const index = store.index('chatId');
            const request = index.getAll(chatId.toString());

            request.onsuccess = (event) => {
                // Urutkan berdasarkan timestamp ASC
                let msgs = event.target.result;
                msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                resolve(msgs);
            };

            request.onerror = (e) => reject(e.target.error);
        });
    },

    /**
     * Menghapus semua riwayat pesan jika user logout/reset
     */
    clearAll: function() {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject("DB tidak diinisialisasi");
            const transaction = this.db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }
};

window.LocalChatDB = LocalChatDB;

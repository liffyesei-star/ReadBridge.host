/**
 * e2e-crypto.js
 * Pustaka Kriptografi Web Crypto API untuk ReadBridge E2EE
 * 
 * Menggunakan algoritma:
 * - ECDH (P-256) untuk pertukaran kunci
 * - AES-GCM (256-bit) untuk enkripsi/dekripsi
 */

const E2ECrypto = (function() {
    
    // Utilitas Base64 agar kunci publik bisa disimpan sebagai string di Firestore
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // 1. Generate Key Pair (Public & Private)
    async function generateKeyPair() {
        const keyPair = await window.crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" },
            true, 
            ["deriveKey", "deriveBits"]
        );
        return keyPair;
    }

    // 2. Export Public Key ke format string Base64 (raw)
    async function exportPublicKey(publicKey) {
        const exported = await window.crypto.subtle.exportKey("raw", publicKey);
        return arrayBufferToBase64(exported);
    }

    // 3. Import Public Key dari format string Base64
    async function importPublicKey(base64Key) {
        const keyBuffer = base64ToArrayBuffer(base64Key);
        return await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "ECDH", namedCurve: "P-256" },
            true,
            []
        );
    }

    // 4. Derive Shared Secret Kunci (ECDH)
    async function deriveSharedSecret(myPrivateKey, theirPublicKey) {
        return await window.crypto.subtle.deriveKey(
            { name: "ECDH", public: theirPublicKey },
            myPrivateKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    // 5. Enkripsi Pesan
    // Mengembalikan object { ciphertextBase64, ivBase64 }
    async function encryptMessage(text, sharedSecret) {
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const ciphertextBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            sharedSecret,
            enc.encode(text)
        );

        return {
            ciphertext: arrayBufferToBase64(ciphertextBuffer),
            iv: arrayBufferToBase64(iv)
        };
    }

    // 6. Dekripsi Pesan
    async function decryptMessage(ciphertextBase64, ivBase64, sharedSecret) {
        try {
            const ciphertextBuffer = base64ToArrayBuffer(ciphertextBase64);
            const ivBuffer = base64ToArrayBuffer(ivBase64);
            
            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: ivBuffer },
                sharedSecret,
                ciphertextBuffer
            );

            const dec = new TextDecoder();
            return dec.decode(decryptedBuffer);
        } catch (e) {
            console.error("Gagal mendekripsi pesan:", e);
            return "[Pesan tidak dapat didekripsi]";
        }
    }

    // Simpan Private Key ke IndexedDB secara aman
    // Karena localStorage tidak bisa menyimpan CryptoKey object
    const dbName = "ReadBridgeCryptoDB";
    const storeName = "keys";
    
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = (e) => reject(e);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
        });
    }

    async function storePrivateKeyLocally(userId, privateKey) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.put(privateKey, `privateKey_${userId}`);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }

    async function getLocalPrivateKey(userId) {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(`privateKey_${userId}`);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e);
        });
    }

    return {
        generateKeyPair,
        exportPublicKey,
        importPublicKey,
        deriveSharedSecret,
        encryptMessage,
        decryptMessage,
        storePrivateKeyLocally,
        getLocalPrivateKey
    };

})();

// Export untuk module jika digunakan
if (typeof module !== 'undefined' && module.exports) {
    module.exports = E2ECrypto;
}

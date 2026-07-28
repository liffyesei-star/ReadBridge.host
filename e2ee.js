/**
 * e2ee.js
 * End-to-End Encryption Utility using Web Crypto API
 */

const E2EE = {
    keyPair: null,
    myPublicKeyBase64: null,

    // Konversi array buffer ke base64 (untuk penyimpanan)
    _arrayBufferToBase64: (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },

    // Konversi base64 ke array buffer
    _base64ToArrayBuffer: (base64) => {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    },

    // Menghasilkan RSA-OAEP Key Pair baru
    generateKeyPair: async () => {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true, // extractable
            ["encrypt", "decrypt"]
        );
        
        // Simpan private key ke localStorage secara lokal
        const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        localStorage.setItem('rb_private_key', E2EE._arrayBufferToBase64(exportedPrivateKey));
        
        const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        E2EE.myPublicKeyBase64 = E2EE._arrayBufferToBase64(exportedPublicKey);
        
        E2EE.keyPair = keyPair;
        return { keyPair, publicKeyBase64: E2EE.myPublicKeyBase64 };
    },

    // Load private key dari localStorage
    loadPrivateKey: async () => {
        const storedKey = localStorage.getItem('rb_private_key');
        if (!storedKey) return null;

        const binaryDer = E2EE._base64ToArrayBuffer(storedKey);
        try {
            const privateKey = await window.crypto.subtle.importKey(
                "pkcs8",
                binaryDer,
                { name: "RSA-OAEP", hash: "SHA-256" },
                true,
                ["decrypt"]
            );
            E2EE.keyPair = { privateKey };
            return privateKey;
        } catch (e) {
            console.error("Gagal memuat private key:", e);
            return null;
        }
    },

    // Import Public Key dari string Base64 yang didapat dari server
    importPublicKey: async (base64Key) => {
        const binaryDer = E2EE._base64ToArrayBuffer(base64Key);
        return await window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"]
        );
    },

    // Hybrid Encryption: Enkripsi teks dengan AES-GCM, lalu kunci AES dienkripsi dengan RSA
    encryptMessage: async (text, receiverPublicKeyBase64) => {
        const receiverPubKey = await E2EE.importPublicKey(receiverPublicKeyBase64);
        
        // 1. Generate AES-GCM Key untuk pesan ini
        const aesKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        // 2. Enkripsi pesan dengan AES
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(text);
        const encryptedMessage = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            aesKey,
            encodedText
        );

        // 3. Export AES Key dan enkripsi dengan RSA Receiver
        const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
        const encryptedAesKey = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            receiverPubKey,
            rawAesKey
        );

        // Kembalikan gabungan IV, Encrypted AES Key, dan Ciphertext
        return JSON.stringify({
            iv: E2EE._arrayBufferToBase64(iv),
            encKey: E2EE._arrayBufferToBase64(encryptedAesKey),
            cipher: E2EE._arrayBufferToBase64(encryptedMessage)
        });
    },

    // Hybrid Decryption: Dekripsi kunci AES dengan RSA Private Key, lalu dekripsi pesan
    decryptMessage: async (encryptedPayloadJSON) => {
        if (!E2EE.keyPair || !E2EE.keyPair.privateKey) {
            await E2EE.loadPrivateKey();
            if (!E2EE.keyPair) throw new Error("Private Key tidak ditemukan di perangkat ini.");
        }

        const payload = JSON.parse(encryptedPayloadJSON);
        const iv = E2EE._base64ToArrayBuffer(payload.iv);
        const encryptedAesKey = E2EE._base64ToArrayBuffer(payload.encKey);
        const cipher = E2EE._base64ToArrayBuffer(payload.cipher);

        // 1. Dekripsi AES Key
        const rawAesKey = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            E2EE.keyPair.privateKey,
            encryptedAesKey
        );

        // 2. Import AES Key
        const aesKey = await window.crypto.subtle.importKey(
            "raw",
            rawAesKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["decrypt"]
        );

        // 3. Dekripsi Pesan
        const decryptedMessage = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(iv) },
            aesKey,
            cipher
        );

        return new TextDecoder().decode(decryptedMessage);
    }
};

window.E2EE = E2EE;

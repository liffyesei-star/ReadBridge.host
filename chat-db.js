/**
 * chat-db.js
 * Manajemen Firebase Firestore untuk Direct Message (E2EE)
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, where, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUfiy2BHYhHh1wql6uM5UvsF6hpNTVvhY",
    authDomain: "readbridge-8934c.firebaseapp.com",
    projectId: "readbridge-8934c",
    storageBucket: "readbridge-8934c.firebasestorage.app",
    messagingSenderId: "900450201794",
    appId: "1:900450201794:web:8d65f989e7fefe590d8b5b",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/**
 * Menyimpan Public Key milik user ke Firestore saat inisialisasi
 */
export async function saveUserPublicKey(userId, publicKeyBase64) {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            publicKey: publicKeyBase64,
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log("Public Key berhasil disimpan ke Firestore.");
    } catch (e) {
        console.error("Gagal menyimpan Public Key:", e);
    }
}

/**
 * Mengambil Public Key milik lawan bicara dari Firestore
 */
export async function getUserPublicKey(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data().publicKey;
        } else {
            console.warn("Public Key tidak ditemukan untuk user:", userId);
            return null;
        }
    } catch (e) {
        console.error("Error mengambil Public Key:", e);
        return null;
    }
}

/**
 * Mengirim pesan terenkripsi ke Firestore (dilengkapi ExpireAt 90 hari)
 */
export async function sendEncryptedMessage(senderId, recipientId, ciphertextBase64, ivBase64, category = 'personal') {
    try {
        // TTL 90 Hari (Mili Detik)
        const expireDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        
        // Chat ID (Kombinasi 2 ID yang diurutkan agar unik per percakapan)
        const chatId = [senderId, recipientId].sort().join('_');

        await addDoc(collection(db, "messages"), {
            chatId: chatId,
            senderId: senderId,
            recipientId: recipientId,
            ciphertext: ciphertextBase64,
            iv: ivBase64,
            category: category, // 'personal' atau 'transaksi'
            timestamp: serverTimestamp(),
            expireAt: expireDate // Digunakan oleh Firebase TTL Policy
        });
        console.log("Pesan terenkripsi berhasil dikirim!");
    } catch (e) {
        console.error("Error mengirim pesan:", e);
    }
}

/**
 * Mendengarkan pesan masuk secara Real-Time
 */
export function listenToMessages(senderId, recipientId, onNewMessage) {
    const chatId = [senderId, recipientId].sort().join('_');
    const q = query(
        collection(db, "messages"), 
        where("chatId", "==", chatId), 
        orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                messages.push({
                    id: change.doc.id,
                    ...data
                });
            }
        });
        
        if (messages.length > 0) {
            onNewMessage(messages);
        }
    });
}

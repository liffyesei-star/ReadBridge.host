/**
 * vote-db.js
 * Manajemen Firebase Firestore khusus untuk Real-time Voting (Upvote/Downvote)
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Simpan state listener agar tidak dobel
const unsubscribeFunctions = {};

/**
 * Mengirim vote ke Firestore
 * @param {string} postId - ID unik dari post/diskusi
 * @param {number} delta - +1 untuk upvote, -1 untuk downvote
 */
export async function castVote(postId, delta) {
    try {
        const postRef = doc(db, "posts_votes", postId);
        const postSnap = await getDoc(postRef);

        // Jika dokumen belum ada, buat awal dengan 0
        if (!postSnap.exists()) {
            await setDoc(postRef, {
                upvotes: 0,
                downvotes: 0
            });
        }

        if (delta > 0) {
            // Upvote
            await setDoc(postRef, {
                upvotes: increment(1)
            }, { merge: true });
        } else if (delta < 0) {
            // Downvote
            await setDoc(postRef, {
                downvotes: increment(1)
            }, { merge: true });
        }

    } catch (e) {
        console.error("Gagal castVote:", e);
    }
}

/**
 * Mendengarkan perubahan vote secara Real-time
 * @param {string} postId - ID unik dari post/diskusi
 * @param {function} callback - Fungsi callback(upvotes, downvotes)
 */
export function listenToPostVotes(postId, callback) {
    // Matikan listener sebelumnya untuk post ini jika ada
    if (unsubscribeFunctions[postId]) {
        unsubscribeFunctions[postId]();
    }

    const postRef = doc(db, "posts_votes", postId);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const upvotes = data.upvotes || 0;
            const downvotes = data.downvotes || 0;
            // Kita kembalikan ke callback
            callback(upvotes, downvotes);
        } else {
            // Belum ada data = 0
            callback(0, 0);
        }
    });

    unsubscribeFunctions[postId] = unsubscribe;
}

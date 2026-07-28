import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, query, orderBy, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth(app);

// ===== USER DB (Friends & Profile) =====

// Listener untuk daftar teman
export function listenToFriends(userId, callback) {
    if(!userId) return;
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (docSnap) => {
        if(docSnap.exists()) {
            const data = docSnap.data();
            callback(data.friends || []);
        } else {
            callback([]);
        }
    });
}

export async function addFriend(currentUserId, targetUid) {
    if(!currentUserId || !targetUid) return;
    const userRef = doc(db, 'users', currentUserId);
    // Kita asumsikan dokumen user sudah dibuat saat register
    await setDoc(userRef, {
        friends: arrayUnion(targetUid)
    }, { merge: true });
}

export async function removeFriend(currentUserId, targetUid) {
    if(!currentUserId || !targetUid) return;
    const userRef = doc(db, 'users', currentUserId);
    await setDoc(userRef, {
        friends: arrayRemove(targetUid)
    }, { merge: true });
}

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

// ===== CLUB DB =====
export async function createClub(creatorId, name, desc) {
    if(!creatorId || !name) return;
    const clubsRef = collection(db, 'clubs');
    const newClub = {
        name, desc,
        admins: [creatorId],
        members: [creatorId],
        timestamp: serverTimestamp()
    };
    const docRef = await addDoc(clubsRef, newClub);
    return docRef.id;
}

export function listenToClubs(callback) {
    const q = query(collection(db, 'clubs'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const clubs = [];
        snapshot.forEach(doc => {
            clubs.push({ id: doc.id, ...doc.data() });
        });
        callback(clubs);
    });
}

export async function joinClub(clubId, userId) {
    if(!clubId || !userId) return;
    const clubRef = doc(db, 'clubs', clubId);
    await updateDoc(clubRef, {
        members: arrayUnion(userId)
    });
}

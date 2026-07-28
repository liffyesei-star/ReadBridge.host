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

// ===== POST DB (Feed & Discussions) =====

export async function createPost(authorId, authorName, authorAvatar, authorUsername, content, tags, clubId = 'public', type = 'Diskusi') {
    if(!authorId || !content) return;
    const postsRef = collection(db, 'posts');
    const newPost = {
        authorId, authorName, authorAvatar, authorUsername,
        content, tags, clubId, type,
        timestamp: serverTimestamp(),
        comments: [] // Array of { authorId, authorName, content, timestamp }
    };
    const docRef = await addDoc(postsRef, newPost);
    return docRef.id;
}

// Mendengarkan semua post secara real-time
export function listenToFeed(callback) {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const posts = [];
        snapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        callback(posts);
    });
}

// Komentar
export async function addComment(postId, authorId, authorName, content) {
    if(!postId || !authorId || !content) return;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
        comments: arrayUnion({ authorId, authorName, content, timestamp: new Date().toISOString() })
    });
}

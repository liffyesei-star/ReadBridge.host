/**
 * vote-db.js
 * Manajemen Firebase Firestore khusus untuk Real-time Voting (Upvote/Downvote)
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, onSnapshot, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Satu listener Firestore per post, tapi bisa punya banyak subscriber DOM.
const voteSubscriptions = {};

function normalizeVoteNumber(value, fallback = 0) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "string") return fallback;

    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return fallback;

    const multiplier = trimmed.endsWith("k") ? 1000 : 1;
    const parsed = Number(trimmed.replace(/k$/, "").replace(/,/g, ".").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : fallback;
}

function getInitialCounts(options = {}) {
    const initialScore = normalizeVoteNumber(options.initialScore ?? options.initialVotes ?? options.initialUpvotes ?? options.score ?? options.upvotes, 0);
    const initialDownvotes = normalizeVoteNumber(options.initialDownvotes, 0);

    return {
        score: Math.max(0, initialScore),
        upvotes: Math.max(0, initialScore),
        downvotes: Math.max(0, initialDownvotes)
    };
}

async function ensureVoteDocument(postRef, options = {}) {
    const snap = await getDoc(postRef);
    if (snap.exists()) return;

    const initialCounts = getInitialCounts(options);
    await runTransaction(db, async (transaction) => {
        const transactionSnap = await transaction.get(postRef);
        if (!transactionSnap.exists()) {
            transaction.set(postRef, initialCounts);
        }
    });
}

/**
 * Mengirim vote ke Firestore
 * @param {string} postId - ID unik dari post/diskusi
 * @param {number} delta - +1 untuk upvote, -1 untuk downvote
 */
export async function castVote(postId, delta, options = {}) {
    try {
        const postRef = doc(db, "posts_votes", String(postId));
        
        let upDelta = 0;
        let downDelta = 0;
        
        if (typeof delta === 'object' && delta !== null) {
            upDelta = Number(delta.upDelta) || 0;
            downDelta = Number(delta.downDelta) || 0;
        } else {
            const voteDelta = Number(delta) || 0;
            if (voteDelta === 0) return;
            // Fallback for older calls: assume positive means upvote, negative means downvote?
            // Wait, previous castVote just added to score. Let's keep it adding to score if simple delta.
            if (voteDelta > 0) upDelta = voteDelta;
            if (voteDelta < 0) downDelta = Math.abs(voteDelta);
        }
        
        if (upDelta === 0 && downDelta === 0) return;

        await runTransaction(db, async (transaction) => {
            const postSnap = await transaction.get(postRef);
            const initialCounts = getInitialCounts(options);
            const data = postSnap.exists() ? postSnap.data() : initialCounts;
            
            const currentUpvotes = normalizeVoteNumber(data.upvotes, initialCounts.upvotes);
            const currentDownvotes = normalizeVoteNumber(data.downvotes, initialCounts.downvotes);
            
            const nextUpvotes = Math.max(0, currentUpvotes + upDelta);
            const nextDownvotes = Math.max(0, currentDownvotes + downDelta);
            const nextScore = Math.max(0, nextUpvotes - nextDownvotes); // Keep score synced if anyone uses it

            transaction.set(postRef, {
                score: nextScore,
                upvotes: nextUpvotes,
                downvotes: nextDownvotes,
                updatedAt: Date.now()
            }, { merge: true });
        });
    } catch (e) {
        console.error("Gagal castVote:", e);
    }
}

/**
 * Mendengarkan perubahan vote secara Real-time
 * @param {string} postId - ID unik dari post/diskusi
 * @param {function} callback - Fungsi callback(upvotes, downvotes)
 */
export function listenToPostVotes(postId, callback, options = {}) {
    const key = String(postId);
    const initialCounts = getInitialCounts(options);

    if (!voteSubscriptions[key]) {
        voteSubscriptions[key] = {
            callbacks: new Set(),
            unsubscribe: null,
            lastPayload: null
        };
    }

    const subscription = voteSubscriptions[key];
    subscription.callbacks.add(callback);

    if (subscription.lastPayload) {
        callback(subscription.lastPayload.upvotes, subscription.lastPayload.downvotes, subscription.lastPayload.score);
    }

    if (!subscription.unsubscribe) {
        const postRef = doc(db, "posts_votes", key);

        ensureVoteDocument(postRef, initialCounts).catch((e) => {
            console.error("Gagal menyiapkan dokumen vote:", e);
        });

        subscription.unsubscribe = onSnapshot(postRef, (docSnap) => {
            let payload = initialCounts;
            if (docSnap.exists()) {
                const data = docSnap.data();
                const upvotes = normalizeVoteNumber(data.upvotes, initialCounts.upvotes);
                const downvotes = normalizeVoteNumber(data.downvotes, initialCounts.downvotes);
                const score = Math.max(0, normalizeVoteNumber(data.score, upvotes - downvotes));

                payload = {
                    score,
                    upvotes,
                    downvotes
                };
            }

            subscription.lastPayload = payload;
            subscription.callbacks.forEach((fn) => fn(payload.upvotes, payload.downvotes, payload.score));
        }, (e) => {
            console.error("Gagal listenToPostVotes:", e);
        });
    }

    return () => {
        subscription.callbacks.delete(callback);
        if (subscription.callbacks.size === 0 && subscription.unsubscribe) {
            subscription.unsubscribe();
            delete voteSubscriptions[key];
        }
    };
}

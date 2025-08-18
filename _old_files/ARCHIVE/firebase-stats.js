// Firebase configuration for Créno stats
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuration Firebase pour Catimini
const firebaseConfig = {
    apiKey: "AIzaSyApPmmL0e_ewgdwqKGv9Rp796i0pdY9Pg0",
    authDomain: "catimini-256a1.firebaseapp.com",
    projectId: "catimini-256a1",
    storageBucket: "catimini-256a1.appspot.com",
    messagingSenderId: "426239063773",
    appId: "1:426239063773:web:YOUR_APP_ID" // Remplacez YOUR_APP_ID par l'ID de votre app web
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get Créno stats
export async function getCrenoStats() {
    try {
        // Try to get events count from counters collection
        const eventsCounterDoc = await getDoc(doc(db, 'counters', 'events'));
        let totalEvents = 0;
        
        if (eventsCounterDoc.exists()) {
            totalEvents = eventsCounterDoc.data().count || 0;
            console.log("Events count from Firebase:", totalEvents);
        }
        
        // Try to get other stats from stats document
        const statsDoc = await getDoc(doc(db, 'stats', 'creno'));
        
        if (statsDoc.exists()) {
            const data = statsDoc.data();
            return {
                totalEvents: totalEvents || data.totalEvents || 0,
                totalUsers: data.totalUsers || 0,
                averageRating: data.averageRating || 0
            };
        } else {
            // Return with at least the events count
            return {
                totalEvents: totalEvents || 7,
                totalUsers: 16, // Default value
                averageRating: 4.8 // Default value
            };
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
        // Return fallback values in case of error
        return {
            totalEvents: 7,
            totalUsers: 16,
            averageRating: 4.8
        };
    }
}

// Function to update stats in the DOM
export async function updateCrenoStatsDisplay() {
    const stats = await getCrenoStats();
    
    // Update the stats when they appear in the animation
    window.crenoStats = stats;
    
    // Dispatch event to notify that stats are loaded
    window.dispatchEvent(new CustomEvent('crenoStatsLoaded', { detail: stats }));
}

// Auto-update stats on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCrenoStatsDisplay);
} else {
    updateCrenoStatsDisplay();
}
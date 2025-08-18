// Cloud Functions pour maintenir automatiquement le compteur d'événements
// À déployer dans Firebase Functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Fonction pour initialiser le compteur (à exécuter une fois)
exports.initializeEventCounter = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    
    // Compter tous les événements existants
    const eventsSnapshot = await db.collection('events').get();
    const count = eventsSnapshot.size;
    
    // Créer ou mettre à jour le document compteur
    await db.doc('counters/events').set({
      count: count,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ 
      success: true, 
      message: `Compteur initialisé avec ${count} événements`
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Incrémenter automatiquement quand un événement est créé
exports.onEventCreated = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const db = admin.firestore();
    const counterRef = db.doc('counters/events');
    
    try {
      await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        
        if (!counterDoc.exists) {
          // Si le compteur n'existe pas, le créer
          transaction.set(counterRef, {
            count: 1,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        } else {
          // Sinon, l'incrémenter
          const newCount = (counterDoc.data().count || 0) + 1;
          transaction.update(counterRef, {
            count: newCount,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });
      
      console.log('Compteur incrémenté');
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation:', error);
    }
  });

// Décrémenter automatiquement quand un événement est supprimé
exports.onEventDeleted = functions.firestore
  .document('events/{eventId}')
  .onDelete(async (snap, context) => {
    const db = admin.firestore();
    const counterRef = db.doc('counters/events');
    
    try {
      await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        
        if (counterDoc.exists) {
          const newCount = Math.max(0, (counterDoc.data().count || 0) - 1);
          transaction.update(counterRef, {
            count: newCount,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });
      
      console.log('Compteur décrémenté');
    } catch (error) {
      console.error('Erreur lors de la décrémentation:', error);
    }
  });

// Fonction pour recalculer le compteur (en cas de problème)
exports.recalculateEventCounter = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    
    // Recompter tous les événements
    const eventsSnapshot = await db.collection('events').get();
    const count = eventsSnapshot.size;
    
    // Mettre à jour le compteur
    await db.doc('counters/events').set({
      count: count,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.json({ 
      success: true, 
      message: `Compteur recalculé : ${count} événements`
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});
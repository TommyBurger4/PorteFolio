# Règles Firebase pour Créno - Sécurité maximale

## Règles Firestore à copier dans la console Firebase

Allez dans : https://console.firebase.google.com/project/catimini-256a1/firestore/rules

Remplacez TOUTES les règles par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // BLOQUER COMPLÈTEMENT l'accès aux événements
    match /events/{eventId} {
      allow read: if false;  // Personne ne peut lire
      allow write: if request.auth != null;  // Seuls les utilisateurs connectés peuvent écrire
    }
    
    // Permettre la lecture du compteur d'événements
    match /counters/events {
      allow read: if true;  // Tout le monde peut lire le nombre
      allow write: if false;  // Personne ne peut modifier (sauf Cloud Functions)
    }
    
    // Permettre la lecture des stats globales
    match /stats/creno {
      allow read: if true;  // Tout le monde peut lire
      allow write: if false;  // Personne ne peut modifier (sauf Cloud Functions)
    }
    
    // Bloquer tout le reste par défaut
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## IMPORTANT : Créer manuellement le compteur

Puisque Firebase ne permet pas de compter les documents sans les lire, vous devez :

### Option 1 : Compter manuellement et créer le document

1. Dans la console Firebase, comptez vos documents dans la collection `events`
2. Créez la collection `counters` avec un document `events` :
   ```json
   {
     "count": [VOTRE_NOMBRE_D'EVENTS],
     "lastUpdated": timestamp
   }
   ```

### Option 2 : Script pour compter (à exécuter UNE SEULE FOIS avec des permissions admin)

```javascript
// À exécuter dans une Cloud Function ou avec Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

async function createCounters() {
  const db = admin.firestore();
  
  // Compter les événements
  const eventsSnapshot = await db.collection('events').get();
  const eventCount = eventsSnapshot.size;
  
  // Créer/mettre à jour le compteur
  await db.doc('counters/events').set({
    count: eventCount,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Créer/mettre à jour les stats
  await db.doc('stats/creno').set({
    totalEvents: eventCount,
    totalUsers: 1250,  // À ajuster
    averageRating: 4.8,  // À ajuster
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`Compteurs créés : ${eventCount} événements`);
}
```

## Cloud Functions pour maintenir le compteur à jour (optionnel)

Si vous voulez que le compteur se mette à jour automatiquement :

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Quand un événement est créé
exports.onEventCreated = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const db = admin.firestore();
    
    // Incrémenter les compteurs
    const batch = db.batch();
    
    batch.update(db.doc('counters/events'), {
      count: admin.firestore.FieldValue.increment(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    batch.update(db.doc('stats/creno'), {
      totalEvents: admin.firestore.FieldValue.increment(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
  });

// Quand un événement est supprimé
exports.onEventDeleted = functions.firestore
  .document('events/{eventId}')
  .onDelete(async (snap, context) => {
    const db = admin.firestore();
    
    // Décrémenter les compteurs
    const batch = db.batch();
    
    batch.update(db.doc('counters/events'), {
      count: admin.firestore.FieldValue.increment(-1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    batch.update(db.doc('stats/creno'), {
      totalEvents: admin.firestore.FieldValue.increment(-1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    
    await batch.commit();
  });
```

## Résultat

Avec ces règles :
- ✅ Les utilisateurs peuvent voir le NOMBRE d'événements
- ❌ Les utilisateurs NE peuvent PAS voir le contenu des événements
- ❌ Les utilisateurs NE peuvent PAS lister les événements
- ✅ Le site affichera le vrai nombre depuis `counters/events`

## Étapes à suivre

1. Copiez les règles dans la console Firebase
2. Cliquez sur "Publier"
3. Créez manuellement les documents `counters/events` et `stats/creno`
4. Testez avec `test-firebase-stats.html`
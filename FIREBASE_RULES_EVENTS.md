# Règles Firebase pour accéder à la collection events sans voir le contenu

## Option 1 : Permettre de lister les IDs sans lire le contenu (Firebase v9+)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Permettre de lister la collection (voir les IDs) mais pas de lire les documents
      allow list: if true;
      allow get: if false;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

## Option 2 : Utiliser des champs spécifiques (Plus flexible)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Permettre de lire seulement certains champs publics
      allow read: if resource == null || 
                     request.auth != null || 
                     // Autoriser seulement l'accès aux métadonnées publiques
                     request.query.select.hasAll(['isPublic', 'createdAt']);
      allow write: if request.auth != null;
    }
  }
}
```

## Option 3 : Compter sans lire (Recommandé pour votre cas)

Malheureusement, Firestore ne permet pas nativement de compter les documents sans les lire. Les options sont :

### 3a. Utiliser Firestore Count (nécessite de lire)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Bloquer toute lecture directe
      allow read: if false;
      allow write: if request.auth != null;
    }
  }
}
```

Puis côté client, utilisez l'aggregation query (nécessite Firebase Admin SDK ou Cloud Functions) :

```javascript
// Ceci doit être fait côté serveur (Cloud Function)
const count = await db.collection('events').count().get();
console.log('Total events:', count.data().count);
```

### 3b. Document de compteur séparé (Meilleure solution)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bloquer complètement l'accès à events
    match /events/{eventId} {
      allow read: if false;
      allow write: if request.auth != null;
    }
    
    // Permettre la lecture du compteur public
    match /counters/events {
      allow read: if true;
      allow write: if false; // Seules les Cloud Functions peuvent écrire
    }
  }
}
```

## Cloud Function pour maintenir le compteur

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Incrémenter lors de la création
exports.incrementEventCount = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const counterRef = admin.firestore().doc('counters/events');
    await counterRef.update({
      count: admin.firestore.FieldValue.increment(1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  });

// Décrémenter lors de la suppression
exports.decrementEventCount = functions.firestore
  .document('events/{eventId}')
  .onDelete(async (snap, context) => {
    const counterRef = admin.firestore().doc('counters/events');
    await counterRef.update({
      count: admin.firestore.FieldValue.increment(-1),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

## Code client pour récupérer le nombre

```javascript
import { doc, getDoc } from 'firebase/firestore';

async function getEventCount() {
  try {
    const counterDoc = await getDoc(doc(db, 'counters', 'events'));
    if (counterDoc.exists()) {
      return counterDoc.data().count;
    }
    return 0;
  } catch (error) {
    console.error('Error getting event count:', error);
    return 0;
  }
}
```

## Résumé des approches

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| list sans get | Simple à implémenter | Expose les IDs des documents |
| Champs spécifiques | Contrôle fin | Expose certaines données |
| Document compteur | Sécurité maximale, Performance | Nécessite Cloud Functions |

**Recommandation** : Utilisez l'option 3b (document compteur) pour une sécurité maximale et de meilleures performances.
# Configuration Firebase pour les Statistiques

## 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou utilisez un existant
3. Activez Firestore Database

## 2. Configuration

Dans le fichier `firebase-stats.js`, remplacez la configuration par vos vraies clés :

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};
```

## 3. Structure Firestore

Créez la structure suivante dans Firestore :

### Collection `apps`
```
apps/
├── creno/
│   ├── activeUsers: 2000
│   └── eventsCreated: 15000
│
└── findmycourt/
    ├── activeUsers: 3000
    └── courtsAdded: 8500
```

### Collection `stats`
```
stats/
└── global/
    ├── totalUsers: 5000
    ├── completedProjects: 6
    └── satisfactionRate: 98
```

## 4. Règles de sécurité Firestore

Pour une lecture publique (statistiques) :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lecture publique pour les stats
    match /apps/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    match /stats/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 5. Mettre à jour les stats depuis vos apps

Dans vos applications (Créno, FindMyCourt), ajoutez du code pour mettre à jour Firebase :

```javascript
// Exemple pour Créno
firebase.firestore().collection('apps').doc('creno').update({
    activeUsers: firebase.firestore.FieldValue.increment(1),
    eventsCreated: firebase.firestore.FieldValue.increment(1)
});
```

## 6. Fonctionnalités

- ✅ Chargement des stats depuis Firebase
- ✅ Mise à jour en temps réel
- ✅ Animation des changements
- ✅ Fallback sur valeurs par défaut si Firebase échoue
- ✅ Format des nombres (K, M)
- ✅ Indicateur "temps réel" avec point vert

## 7. Test sans Firebase

Si vous voulez tester sans Firebase, le script utilisera automatiquement les valeurs par défaut.
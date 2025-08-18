# 📁 Structure du Portfolio - Version Clean

## 🏠 Racine du projet
```
/
├── index.html              # Page d'accueil principale
├── admin.html              # Interface d'administration (tests locaux)
├── CNAME                   # Configuration du domaine GitHub Pages
├── _config.yml             # Configuration Jekyll
└── README.md               # Documentation du projet
```

## 📄 Pages des projets
```
/
├── creno.html              # Page détaillée de Créno
├── fakt.html               # Page détaillée de Fakt
├── findmycourt.html        # Page détaillée de FindMyCourt
├── pixshare.html           # Page détaillée de PixShare
├── burger-michel.html      # Page détaillée de Burger Michel
└── clubs-sportifs.html     # Page détaillée des Clubs Sportifs
```

## 🎨 Assets
```
/assets/
├── css/
│   └── main.css            # Styles principaux
├── js/
│   ├── app.js              # Script principal
│   ├── ios-fixes.js        # Correctifs iOS
│   ├── projects-manager.js # Gestion dynamique des projets
│   ├── scroll-controlled-animation.js # Animations au scroll
│   └── simple-slide-animation.js # Animations simples
└── images/
    ├── Creno/              # Images du projet Créno
    ├── Fakt/               # Images du projet Fakt
    ├── FindMyCourt/        # Images du projet FindMyCourt
    ├── PixShare/           # Images du projet PixShare
    ├── BurgerMichelEIRL/   # Images du projet Burger Michel
    ├── AppliClubSportifs/  # Images du projet Clubs Sportifs
    └── TomPaul/            # Images de l'équipe
```

## ⚙️ Configuration
```
/config/
├── projects-config.js      # Configuration détaillée des projets
└── projects-settings.json  # Paramètres de visibilité (GitHub Pages)
```

## 📚 Documentation
```
/docs/
├── EMAILJS_SETUP.md        # Configuration EmailJS
└── EMAILJS_TEMPLATE_GUIDE.md # Guide des templates email
```

## 🗂️ Fichiers archivés
```
/_old_files/
├── ARCHIVE/                # Anciennes versions de fichiers
├── projets/                # Ancienne structure de projets
├── debug-*.js              # Scripts de débogage
├── test-*.html             # Pages de test
└── *.sh                    # Scripts shell
```

## 📋 Fichiers de documentation technique
```
/
├── DJI_TECHNOLOGY_ANALYSIS.md  # Analyse technique DJI
├── FIREBASE_*.md               # Documentation Firebase
├── NOUVELLE_STRUCTURE.md       # Documentation structure
├── SOLUTION_DEBUG.md           # Solutions de débogage
└── STRUCTURE.md                # Structure originale
```

## 🚀 Workflow de développement

### Pour modifier le site publié (GitHub Pages) :
1. Modifier `config/projects-settings.json`
2. Commit et push les changements
3. Attendre 1-2 minutes pour la mise à jour

### Pour tester localement :
1. Utiliser `admin.html` pour activer/désactiver les projets
2. Les changements restent dans le localStorage du navigateur

### Structure recommandée pour ajouter un nouveau projet :
1. Créer `nouveau-projet.html` à la racine
2. Ajouter les images dans `assets/images/NouveauProjet/`
3. Mettre à jour `config/projects-config.js`
4. Mettre à jour `config/projects-settings.json`
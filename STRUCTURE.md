# Structure du Portfolio - Mise à jour

## Nouvelle organisation des dossiers

```
PorteFolio/
├── index.html                    # Page d'accueil
├── assets/                       # Ressources statiques
│   ├── images/                   # Images organisées par projet
│   │   ├── TomPaul/
│   │   ├── Creno/
│   │   ├── FIndMyCourt/
│   │   ├── Fakt/
│   │   ├── PixShare/
│   │   ├── AppliClubSportifs/
│   │   └── BurgerMichelEIRL/
│   ├── css/                      # Futurs fichiers CSS
│   └── js/                       # Futurs fichiers JavaScript
├── projets/                      # Projets organisés par dossier
│   ├── BurgerMichel/
│   │   └── burger-michel.html
│   ├── ClubSportifs/
│   │   └── clubs-sportifs.html
│   ├── Créno/
│   │   ├── creno.html
│   │   └── user-guide.html
│   ├── FMC/                      # FindMyCourt
│   │   ├── findmycourt.html
│   │   ├── findmycourt-map-leaflet.html
│   │   ├── findmycourt-map-real.html
│   │   ├── findmycourt-map-static.html
│   │   └── findmycourt-map.html
│   ├── Fakt/
│   │   └── fact.html
│   ├── PixShare/
│   │   └── pixshare.html
│   └── privacy-policy.html       # Politique de confidentialité
├── docs/                         # Documentation technique
│   ├── EMAILJS_SETUP.md
│   └── EMAILJS_TEMPLATE_GUIDE.md
├── CNAME                         # Configuration GitHub Pages
├── _config.yml                   # Configuration Jekyll
└── README.md                     # Documentation du projet
```

## Liens mis à jour

### Dans index.html :
- `projets/Créno/creno.html`
- `projets/Créno/user-guide.html`
- `projets/Fakt/fact.html`
- `projets/FMC/findmycourt.html`
- `projets/FMC/findmycourt-map-real.html`
- `projets/PixShare/pixshare.html`
- `projets/ClubSportifs/clubs-sportifs.html`
- `projets/BurgerMichel/burger-michel.html`

### Dans les fichiers de projets :
- Liens vers l'accueil : `../../index.html`
- Images : `../../assets/images/`
- Références croisées : `../privacy-policy.html`

Tous les liens ont été corrigés pour correspondre à la nouvelle structure !
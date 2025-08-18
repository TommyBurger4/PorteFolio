// Configuration des projets à afficher
const projectsConfig = {
    // Projets actuellement visibles
    visible: {
        creno: {
            active: true,
            order: 1,
            featured: true
        },
        pixshare: {
            active: true, 
            order: 2,
            featured: true
        },
        findmycourt: {
            active: true,
            order: 3,
            featured: true
        },
        fakt: {
            active: true,
            order: 4,
            featured: true
        }
    },
    
    // Projets cachés (accessibles par URL directe uniquement)
    hidden: {
        clubs_sportifs: {
            active: false,
            order: 5,
            featured: false,
            url: 'clubs-sportifs.html', 
            title: 'Clubs Sportifs',
            description: 'Trouvez le club sportif parfait',
            color: '#7C3AED'
        },
        burger_michel: {
            active: false,
            order: 6,
            featured: false,
            url: 'burger-michel.html',
            title: 'Burger Michel EIRL', 
            description: 'Site vitrine pour artisan couvreur',
            color: '#EA580C'
        }
    }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectsConfig;
}
// Gestion dynamique des projets
(function () {
    // Configuration des projets
    const projectsConfig = {
        creno: {
            name: 'Créno',
            type: 'app',
            description: 'L\'organisation réinventée',
            color: '#fcc60d',
            url: 'creno.html',
            showcaseSection: 'creno-showcase',
            menuAnchor: '#creno-showcase'
        },
        pixshare: {
            name: 'PixShare',
            type: 'app',
            description: 'Le partage photo repensé',
            color: '#10B981',
            url: 'pixshare.html',
            showcaseSection: 'pixshare-showcase',
            menuAnchor: '#pixshare-showcase'
        },
        'burger-michel': {
            name: 'Burger Michel',
            type: 'website',
            description: 'Site web en cours pour une entreprise de couverture',
            color: '#ff6b6b',
            url: 'burger-michel.html',
            individualSection: true
        },
        fakt: {
            name: 'Fakt',
            type: 'app',
            description: 'Automatisation de facturation',
            color: '#87CEEB',
            url: 'fakt.html',
            showcaseSection: 'fakt-showcase',
            menuAnchor: '#fakt-showcase'
        },
        findmycourt: {
            name: 'FindMyCourt',
            type: 'app',
            description: 'Trouvez votre terrain idéal',
            color: '#FFD700',
            url: 'findmycourt.html',
            showcaseSection: 'findmycourt-showcase',
            menuAnchor: '#findmycourt-showcase'
        },
        'clubs-sportifs': {
            name: 'Clubs Sportifs',
            type: 'website',
            description: 'Plateforme de gestion pour clubs sportifs',
            color: '#8B5CF6',
            url: 'clubs-sportifs.html',
            individualSection: true
        }
    };

    // Charger les paramètres depuis localStorage
    function loadProjectsSettings() {
        const defaultSettings = {
            creno: true,
            pixshare: false,
            'burger-michel': false,
            fakt: true,
            findmycourt: false,
            'clubs-sportifs': false
        };

        const savedSettings = localStorage.getItem('topal-projects-settings');
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (e) {
                console.error('Error parsing settings:', e);
            }
        }
        return defaultSettings;
    }

    // Mettre à jour les menus de navigation
    function updateNavigationMenus() {
        const settings = loadProjectsSettings();
        const appsMenu = document.getElementById('apps-menu');
        const websitesMenu = document.getElementById('websites-menu');

        if (!appsMenu || !websitesMenu) return;

        // Réinitialiser les menus
        appsMenu.innerHTML = '';
        websitesMenu.innerHTML = '';

        // Ajouter les projets actifs aux menus appropriés
        Object.entries(projectsConfig).forEach(([projectId, config]) => {
            if (settings[projectId]) {
                const menuItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = config.menuAnchor || config.url;
                link.textContent = config.name;
                menuItem.appendChild(link);

                if (config.type === 'app') {
                    appsMenu.appendChild(menuItem);
                } else {
                    websitesMenu.appendChild(menuItem);
                }
            }
        });

        // Cacher le dropdown "Sites web" si aucun site web n'est actif
        const websitesDropdown = websitesMenu.closest('.dropdown');
        if (websitesDropdown) {
            if (websitesMenu.children.length === 0) {
                websitesDropdown.style.display = 'none';
            } else {
                websitesDropdown.style.display = '';
            }
        }
    }

    // Mettre à jour la visibilité des sections showcase
    function updateShowcaseSections() {
        const settings = loadProjectsSettings();

        // Gérer Créno
        const crenoShowcase = document.getElementById('creno-showcase');
        const crenoSection = crenoShowcase?.nextElementSibling;
        if (crenoShowcase) {
            crenoShowcase.style.display = settings.creno ? 'block' : 'none';
            if (crenoSection && crenoSection.classList.contains('scroll-section')) {
                crenoSection.style.display = settings.creno ? 'block' : 'none';
            }
        }

        // Gérer PixShare
        const pixshareShowcase = document.getElementById('pixshare-showcase');
        const pixshareSection = pixshareShowcase?.nextElementSibling;
        if (pixshareShowcase) {
            pixshareShowcase.style.display = settings.pixshare ? 'block' : 'none';
            if (pixshareSection && pixshareSection.classList.contains('scroll-section')) {
                pixshareSection.style.display = settings.pixshare ? 'block' : 'none';
            }
        }

        // Gérer FindMyCourt
        const findmycourtShowcase = document.getElementById('findmycourt-showcase');
        const findmycourtSection = findmycourtShowcase?.nextElementSibling;
        if (findmycourtShowcase) {
            findmycourtShowcase.style.display = settings.findmycourt ? 'block' : 'none';
            if (findmycourtSection && findmycourtSection.classList.contains('scroll-section')) {
                findmycourtSection.style.display = settings.findmycourt ? 'block' : 'none';
            }
        }

        // Gérer Fakt
        const faktShowcase = document.getElementById('fakt-showcase');
        const faktSection = faktShowcase?.nextElementSibling;
        if (faktShowcase) {
            faktShowcase.style.display = settings.fakt ? 'block' : 'none';
            if (faktSection && faktSection.classList.contains('scroll-section')) {
                faktSection.style.display = settings.fakt ? 'block' : 'none';
            }
        }
    }

    // Mettre à jour les cartes de projets dans la grille
    function updateProjectCards() {
        const settings = loadProjectsSettings();
        const projectsGrid = document.querySelector('.projects-grid');

        if (!projectsGrid) return;

        // Sauvegarder les cartes existantes
        const existingCards = {};
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase();
            if (title) {
                existingCards[title] = card;
            }
        });

        // Réorganiser les cartes selon les paramètres
        projectsGrid.innerHTML = '';

        // Ajouter les cartes des projets actifs
        Object.entries(projectsConfig).forEach(([projectId, config]) => {
            if (settings[projectId]) {
                const cardKey = config.name.toLowerCase();
                if (existingCards[cardKey]) {
                    projectsGrid.appendChild(existingCards[cardKey]);
                }
            }
        });
    }

    // Générer les sections individuelles des projets
    function generateIndividualSections() {
        const settings = loadProjectsSettings();
        const container = document.getElementById('dynamic-projects-container');

        if (!container) return;

        // Vider le conteneur
        container.innerHTML = '';

        // Générer les sections pour chaque projet actif (sauf ceux qui ont leurs propres sections showcase)
        Object.entries(projectsConfig).forEach(([projectId, config]) => {
            if (settings[projectId] && projectId !== 'creno' && projectId !== 'pixshare' && projectId !== 'findmycourt' && projectId !== 'fakt') {
                const section = document.createElement('section');
                section.className = 'scroll-section';
                section.style.cssText = 'background: #000; padding: 2rem 0;';
                section.innerHTML = `
        <div class="section-container">
            <div class="project-showcase fade-section" style="text-align: center;">
                <h2 style="font-size: 3rem; margin-bottom: 2rem; color: ${config.color};">
                    ${config.name}
                </h2>
                <p style="font-size: 1.5rem; max-width: 700px; margin: 0 auto 3rem; line-height: 1.8; color: #fff;">
                    ${config.description}
                </p>
                <a href="${config.url}" class="hover-lift" style="display: inline-block; padding: 1.2rem 3.5rem; background: ${config.color}; color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem;">
                    Découvrir ${config.name} →
                </a>
            </div>
        </div>`;
                container.appendChild(section);
            }
        });

        // Réinitialiser les animations pour les nouvelles sections
        if (window.initScrollAnimations) {
            window.initScrollAnimations();
        }
    }

    // Fonction principale d'initialisation
    function initProjectsManager() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProjectsManager);
            return;
        }

        // Mettre à jour tous les éléments
        updateNavigationMenus();
        updateShowcaseSections();
        updateProjectCards();
        generateIndividualSections();
    }

    // Initialiser
    initProjectsManager();

    // Réinitialiser après un court délai pour s'assurer que tout est chargé
    setTimeout(initProjectsManager, 100);

    // Exposer la fonction pour permettre la mise à jour manuelle
    window.updateProjectsDisplay = initProjectsManager;
})();
// Script de débogage pour les sections de projets
console.log("=== DÉBOGAGE PROJECTS MANAGER ===");

// Vérifier l'existence du conteneur
const container = document.getElementById('dynamic-projects-container');
console.log("1. Conteneur trouvé:", !!container);
if (container) {
    console.log("   - ID:", container.id);
    console.log("   - Classes:", container.className);
    console.log("   - Style inline:", container.style.cssText);
    console.log("   - Position dans DOM:", container.getBoundingClientRect());
    console.log("   - Parent:", container.parentElement?.tagName);
    console.log("   - Contenu HTML:", container.innerHTML);
    console.log("   - Enfants:", container.children.length);
    
    // Vérifier les styles computed
    const computedStyle = window.getComputedStyle(container);
    console.log("   - Display computed:", computedStyle.display);
    console.log("   - Visibility computed:", computedStyle.visibility);
    console.log("   - Opacity computed:", computedStyle.opacity);
    console.log("   - Height computed:", computedStyle.height);
    console.log("   - Width computed:", computedStyle.width);
}

// Vérifier localStorage
const settings = localStorage.getItem('topal-projects-settings');
console.log("2. Settings localStorage:", settings);
if (settings) {
    try {
        const parsed = JSON.parse(settings);
        console.log("   - Settings parsées:", parsed);
    } catch (e) {
        console.log("   - Erreur parsing:", e);
    }
}

// Vérifier les fonctions disponibles
console.log("3. Fonction updateProjectsDisplay disponible:", typeof window.updateProjectsDisplay);

// Forcer la génération des sections avec logs détaillés
console.log("4. === GÉNÉRATION FORCÉE DES SECTIONS ===");

const projectsConfig = {
    'burger-michel': {
        name: 'Burger Michel',
        type: 'website',
        description: 'Site web en cours pour une entreprise de couverture',
        color: '#ff6b6b',
        url: 'burger-michel.html'
    },
    fakt: {
        name: 'Fakt',
        type: 'app',
        description: 'Créez rapidement des devis PDF professionnels pour vos services et locations.',
        color: '#498fc3',
        url: 'fakt.html'
    },
    findmycourt: {
        name: 'FindMyCourt',
        type: 'app',
        description: 'Trouvez les terrains de sport près de chez vous grâce à notre carte interactive communautaire.',
        color: '#4F46E5',
        url: 'findmycourt.html'
    },
    'clubs-sportifs': {
        name: 'Clubs Sportifs',
        type: 'website',
        description: 'Plateforme de gestion pour clubs sportifs',
        color: '#8B5CF6',
        url: 'clubs-sportifs.html'
    }
};

const defaultSettings = {
    creno: true,
    pixshare: true,
    'burger-michel': false,
    fakt: true,
    findmycourt: true,
    'clubs-sportifs': false
};

if (container) {
    container.innerHTML = '';
    
    Object.entries(projectsConfig).forEach(([projectId, config]) => {
        console.log(`   Traitement du projet ${projectId}:`, defaultSettings[projectId]);
        
        if (defaultSettings[projectId] && projectId !== 'creno' && projectId !== 'pixshare') {
            console.log(`   -> Création de la section pour ${config.name}`);
            
            const section = document.createElement('section');
            section.className = 'scroll-section';
            section.style.cssText = 'background: #000; padding: 2rem 0; border: 2px solid red; margin: 1rem 0;';
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
            
            console.log(`   -> Section HTML créée:`, section.outerHTML.substring(0, 200) + '...');
            container.appendChild(section);
            console.log(`   -> Section ajoutée au conteneur`);
        }
    });
    
    console.log("5. État final du conteneur:");
    console.log("   - Nombre d'enfants:", container.children.length);
    console.log("   - HTML final:", container.innerHTML.substring(0, 500) + '...');
    
    // Vérifier la visibilité des sections créées
    Array.from(container.children).forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const computed = window.getComputedStyle(child);
        console.log(`   Section ${index}:`, {
            visible: rect.height > 0 && rect.width > 0,
            display: computed.display,
            rect: rect
        });
    });
} else {
    console.log("ERREUR: Conteneur introuvable!");
}

console.log("=== FIN DÉBOGAGE ===");
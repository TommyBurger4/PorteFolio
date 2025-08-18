// Script pour mettre à jour automatiquement les projets dans index.html
// Usage: node update-projects.js

const fs = require('fs');
const path = require('path');

const projectsData = {
    'findmycourt': {
        title: 'FindMyCourt',
        description: 'Trouvez les terrains de sport près de chez vous grâce à notre carte interactive communautaire.',
        color: '#4F46E5',
        url: 'findmycourt.html'
    },
    'fakt': {
        title: 'Fakt', 
        description: 'Créez rapidement des devis PDF professionnels pour vos services et locations.',
        color: '#498fc3',
        url: 'fakt.html'
    },
    'clubs-sportifs': {
        title: 'Clubs Sportifs',
        description: 'Trouvez le club sportif parfait près de chez vous dans toute la France.',
        color: '#7C3AED', 
        url: 'clubs-sportifs.html'
    },
    'burger-michel': {
        title: 'Burger Michel EIRL',
        description: 'Site vitrine professionnel pour artisan couvreur spécialisé en toiture.',
        color: '#EA580C',
        url: 'burger-michel.html'
    }
};

function generateProjectHTML(projectId) {
    const project = projectsData[projectId];
    return `    <section class="scroll-section" style="background: #000; padding: 2rem 0;">
        <div class="section-container">
            <div class="project-showcase fade-section" style="text-align: center;">
                <h2 style="font-size: 3rem; margin-bottom: 2rem; color: ${project.color};">
                    ${project.title}
                </h2>
                <p style="font-size: 1.5rem; max-width: 700px; margin: 0 auto 3rem; line-height: 1.8; color: #fff;">
                    ${project.description}
                </p>
                <a href="${project.url}" class="hover-lift" style="display: inline-block; padding: 1.2rem 3.5rem; background: ${project.color}; color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem;">
                    Découvrir ${project.title} →
                </a>
            </div>
        </div>
    </section>`;
}

function updateIndexHTML(activeProjects) {
    const indexPath = path.join(__dirname, 'index.html');
    
    try {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Markers pour identifier où insérer les projets
        const startMarker = '<!-- ADDITIONAL_PROJECTS_START -->';
        const endMarker = '<!-- ADDITIONAL_PROJECTS_END -->';
        
        // Générer le HTML des projets actifs
        let projectsHTML = '';
        if (activeProjects.length > 0) {
            projectsHTML = '\n' + startMarker + '\n';
            activeProjects.forEach(projectId => {
                if (projectsData[projectId]) {
                    projectsHTML += generateProjectHTML(projectId) + '\n';
                }
            });
            projectsHTML += endMarker + '\n';
        } else {
            projectsHTML = '\n' + startMarker + '\n' + endMarker + '\n';
        }
        
        // Vérifier si les markers existent
        if (indexContent.includes(startMarker) && indexContent.includes(endMarker)) {
            // Remplacer le contenu entre les markers
            const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
            indexContent = indexContent.replace(regex, projectsHTML.trim());
        } else {
            // Ajouter les markers et le contenu avant la section contact
            const contactSection = indexContent.indexOf('<!-- Contact -->');
            if (contactSection !== -1) {
                indexContent = indexContent.slice(0, contactSection) + 
                             projectsHTML + 
                             indexContent.slice(contactSection);
            } else {
                console.error('❌ Section contact non trouvée dans index.html');
                return false;
            }
        }
        
        // Sauvegarder le fichier
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log(`✅ index.html mis à jour avec ${activeProjects.length} projet(s): ${activeProjects.join(', ')}`);
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message);
        return false;
    }
}

// API simple pour la page admin
function createAPI() {
    const express = require('express');
    const app = express();
    const PORT = 3000;
    
    app.use(express.json());
    app.use(express.static(__dirname));
    
    // Endpoint pour récupérer les projets actifs
    app.get('/api/projects', (req, res) => {
        try {
            const configPath = path.join(__dirname, 'config', 'active-projects.json');
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                res.json(config);
            } else {
                res.json({ activeProjects: [] });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    // Endpoint pour mettre à jour les projets
    app.post('/api/projects', (req, res) => {
        try {
            const { activeProjects } = req.body;
            
            // Sauvegarder la configuration
            const configDir = path.join(__dirname, 'config');
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir);
            }
            
            const configPath = path.join(configDir, 'active-projects.json');
            fs.writeFileSync(configPath, JSON.stringify({ activeProjects }, null, 2));
            
            // Mettre à jour index.html
            const success = updateIndexHTML(activeProjects);
            
            if (success) {
                res.json({ 
                    success: true, 
                    message: `Projets mis à jour: ${activeProjects.join(', ') || 'aucun'}` 
                });
            } else {
                res.status(500).json({ error: 'Erreur lors de la mise à jour' });
            }
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        console.log(`📱 Interface admin: http://localhost:${PORT}/admin-simple.html`);
    });
}

// Si appelé directement depuis la ligne de commande
if (require.main === module) {
    const activeProjects = process.argv.slice(2);
    updateIndexHTML(activeProjects);
}

module.exports = { updateIndexHTML, createAPI };
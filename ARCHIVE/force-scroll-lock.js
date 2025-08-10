// FORCE SCROLL LOCK - DERNIER RECOURS

// Attendre que tout soit chargé
window.addEventListener('load', function() {
    setTimeout(function() {
        console.log('🔧 Force scroll lock initialization');
        
        // Tuer tous les autres scripts
        window.DJIAnimations = null;
        window.animations = null;
        
        // Forcer les styles CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Override tout */
            .loading-screen { display: none !important; }
            body { overflow-y: auto !important; }
            
            /* Stats toujours cachées au départ */
            .creno-stats-showcase,
            .pixshare-stats-showcase {
                display: none !important;
                opacity: 0 !important;
            }
            
            /* Sections toujours visibles */
            .creno-scroll-trigger,
            .pixshare-scroll-trigger {
                opacity: 1 !important;
                visibility: visible !important;
                display: flex !important;
                height: 100vh !important;
                position: relative !important;
            }
        `;
        document.head.appendChild(style);
        
        // Vérifier que le script principal fonctionne
        const crenoSection = document.querySelector('.creno-scroll-trigger');
        const pixshareSection = document.querySelector('.pixshare-scroll-trigger');
        
        if (crenoSection) {
            console.log('✅ Section Créno trouvée');
            // Ajouter un indicateur visuel pour debug
            const debugDiv = document.createElement('div');
            debugDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; z-index: 9999; font-size: 12px;';
            debugDiv.textContent = 'SCROLL LOCK: READY';
            document.body.appendChild(debugDiv);
            
            // Listener manuel pour tester
            let lastScrollY = 0;
            window.addEventListener('scroll', function() {
                const rect = crenoSection.getBoundingClientRect();
                const distance = Math.abs(rect.top + rect.height/2 - window.innerHeight/2);
                
                debugDiv.textContent = `Distance: ${Math.round(distance)}px`;
                
                if (distance < 100) {
                    debugDiv.style.background = 'green';
                    debugDiv.textContent = 'ZONE DE DÉCLENCHEMENT!';
                } else {
                    debugDiv.style.background = 'red';
                }
            });
        } else {
            console.error('❌ Section Créno non trouvée!');
        }
        
    }, 1000);
});
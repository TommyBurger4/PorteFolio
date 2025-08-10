// Animation simple slide-in pour les descriptions avec effet slow motion

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Simple Slide Animation - Initialisation');
    
    // Sélectionner uniquement les descriptions (pas les éléments dans les animations Créno/PixShare)
    const descriptions = document.querySelectorAll('.slide-in-left');
    const validDescriptions = Array.from(descriptions).filter(el => {
        return !el.closest('.creno-animation-container') && !el.closest('.pixshare-animation-container');
    });
    
    console.log(`📊 Descriptions trouvées: ${validDescriptions.length}`);
    
    // État pour gérer le ralentissement
    let currentSlowSection = null;
    let slowScrollHandler = null;
    
    // Appliquer immédiatement le style initial
    validDescriptions.forEach(desc => {
        desc.style.cssText = `
            opacity: 0;
            transform: translateX(-150px);
            transition: none;
        `;
    });
    
    // Fonction de ralentissement du scroll
    function activateSlowMotion(element) {
        if (currentSlowSection === element) return;
        
        console.log('🐌 Activation du slow motion pour:', element.textContent.substring(0, 30) + '...');
        currentSlowSection = element;
        
        // Supprimer l'ancien handler s'il existe
        if (slowScrollHandler) {
            window.removeEventListener('wheel', slowScrollHandler);
        }
        
        // Créer le nouveau handler
        slowScrollHandler = function(e) {
            e.preventDefault();
            
            // Ralentir fortement le scroll (15% de la vitesse)
            const slowedDelta = e.deltaY * 0.15;
            
            window.scrollBy({
                top: slowedDelta,
                behavior: 'auto'
            });
            
            // Vérifier si on est toujours dans la zone de ralentissement
            const rect = element.getBoundingClientRect();
            const elementBottom = rect.bottom;
            
            // Si l'élément est passé, désactiver le slow motion
            if (elementBottom < window.innerHeight * 0.3) {
                deactivateSlowMotion();
            }
        };
        
        window.addEventListener('wheel', slowScrollHandler, { passive: false });
    }
    
    function deactivateSlowMotion() {
        if (slowScrollHandler) {
            console.log('🏃 Retour à la vitesse normale');
            window.removeEventListener('wheel', slowScrollHandler);
            slowScrollHandler = null;
            currentSlowSection = null;
        }
    }
    
    // Observer pour l'effet slow motion
    const slowMotionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.slowMotionActivated) {
                const rect = entry.target.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Activer quand le haut de l'élément arrive au milieu de l'écran
                if (rect.top < viewportHeight * 0.6 && rect.top > 0) {
                    entry.target.dataset.slowMotionActivated = 'true';
                    activateSlowMotion(entry.target);
                }
            }
        });
    }, {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px 0px -20% 0px'
    });
    
    // Observer pour déclencher l'animation
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                console.log('🚀 Animation déclenchée pour:', entry.target.textContent.substring(0, 50) + '...');
                
                // Lancer l'animation
                setTimeout(() => {
                    entry.target.style.cssText = `
                        opacity: 1;
                        transform: translateX(0);
                        transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        text-align: center;
                        width: 100%;
                    `;
                }, 50);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px 0px'
    });
    
    validDescriptions.forEach(desc => {
        slowMotionObserver.observe(desc);
        animationObserver.observe(desc);
    });
});
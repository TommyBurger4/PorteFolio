// Corrections spécifiques pour iOS Safari

(function() {
    // Détecter iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (!isIOS) return;
    
    console.log('📱 iOS détecté - Application des correctifs');
    
    // 1. Fix pour le viewport height sur iOS
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // 2. Désactiver le bounce scroll
    document.body.addEventListener('touchmove', function(e) {
        if (document.body.scrollHeight <= window.innerHeight) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 3. Fix pour les animations qui ne se déclenchent pas
    document.addEventListener('DOMContentLoaded', function() {
        // Forcer le rendu des éléments cachés
        const statsContainers = document.querySelectorAll('.creno-stats-container, .pixshare-stats-container');
        
        statsContainers.forEach(container => {
            // Ajouter will-change pour optimiser les performances
            container.style.willChange = 'opacity, transform';
            
            // Forcer la 3D acceleration
            container.style.transform = 'translateZ(0)';
            container.style.webkitTransform = 'translateZ(0)';
        });
        
        // Fix pour les stat items
        const statItems = document.querySelectorAll('.creno-stat-item, .pixshare-stat-item');
        statItems.forEach(item => {
            item.style.webkitBackfaceVisibility = 'hidden';
            item.style.backfaceVisibility = 'hidden';
            item.style.perspective = '1000px';
        });
    });
    
    // 4. Fix pour le scroll qui se bloque
    let scrollTimeout;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Si le scroll est bloqué, forcer un petit mouvement
            if (Math.abs(window.scrollY - lastScrollY) < 1) {
                window.scrollTo(0, window.scrollY + 1);
                window.scrollTo(0, window.scrollY - 1);
            }
        }, 150);
    });
    
    // 5. Simplifier les animations pour iOS
    if (window.matchMedia('(max-width: 768px)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.2s');
        document.documentElement.style.setProperty('--transition-normal', '0.4s');
        document.documentElement.style.setProperty('--transition-slow', '0.6s');
    }
    
    console.log('✅ Correctifs iOS appliqués');
})();
// Lenis Smooth Scroll - Solution pour iOS et tous les navigateurs
// Corrige le scroll "bloquant" sur iPhone/iPad

(function() {
    'use strict';

    let lenis = null;

    function initLenis() {
        // Attendre que Lenis soit chargé
        if (typeof Lenis === 'undefined') {
            setTimeout(initLenis, 100);
            return;
        }

        // Configuration Lenis optimisée pour iOS
        lenis = new Lenis({
            duration: 1.2,           // Durée du smooth scroll
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing naturel
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,      // Plus réactif au touch sur mobile
            infinite: false,
            autoResize: true
        });

        // Intégration avec GSAP ScrollTrigger si disponible
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback: RAF loop sans GSAP
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        // Exposer lenis globalement pour le debug
        window.lenis = lenis;

        console.log('Lenis smooth scroll initialized');
    }

    // Démarrer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLenis);
    } else {
        initLenis();
    }
})();

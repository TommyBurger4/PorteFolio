// Corrections cross-platform pour iOS Safari, Android, et tous les navigateurs mobiles

(function () {
    'use strict';

    // Detection d'environnement robuste
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Log uniquement en dev
    const log = (msg) => {
        if (typeof Logger !== 'undefined') {
            Logger.log(msg);
        } else {
            console.log(msg);
        }
    };

    log(`🌐 Environnement détecté: iOS=${isIOS}, Android=${isAndroid}, Safari=${isSafari}, Mobile=${isMobile}, Touch=${isTouch}`);

    // 1. Fix pour le viewport height sur iOS (100vh bug)
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });

    // 2. Désactiver le bounce scroll iOS seulement quand nécessaire
    if (isIOS) {
        // Ne pas bloquer tout le scroll, juste le overscroll
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
    }

    // 3. Optimisations GPU pour les animations
    document.addEventListener('DOMContentLoaded', function () {
        // Tous les containers d'animation (creno, fakt, pixshare, findmycourt, etc.)
        const animationContainers = document.querySelectorAll('[class*="-animation-container"]');

        animationContainers.forEach(container => {
            // Force GPU layer
            container.style.transform = 'translateZ(0)';
            container.style.webkitTransform = 'translateZ(0)';
            container.style.backfaceVisibility = 'hidden';
            container.style.webkitBackfaceVisibility = 'hidden';
        });

        // Tous les logos zoom (creno, fakt, pixshare, findmycourt, etc.)
        const logos = document.querySelectorAll('[class*="-logo-zoom"]');
        logos.forEach(logo => {
            logo.style.willChange = 'transform, filter, opacity';
            logo.style.transform = 'translateZ(0)';
            logo.style.webkitTransform = 'translateZ(0)';
        });

        // Tous les stats containers
        const statsContainers = document.querySelectorAll('[class*="-stats-container"]');
        statsContainers.forEach(container => {
            container.style.willChange = 'opacity, transform';
            container.style.transform = 'translateZ(0)';
            container.style.webkitTransform = 'translateZ(0)';
        });

        // Tous les stat items
        const statItems = document.querySelectorAll('[class*="-stat-item"]');
        statItems.forEach(item => {
            item.style.webkitBackfaceVisibility = 'hidden';
            item.style.backfaceVisibility = 'hidden';
            item.style.transform = 'translateZ(0)';
        });

        log('✅ Optimisations GPU appliquées à tous les éléments d\'animation');
    });

    // 4. Fix pour Safari qui ne trigger pas correctement les animations au scroll
    if (isSafari) {
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    // Force un repaint pour Safari
                    document.body.style.pointerEvents = 'none';
                    document.body.offsetHeight; // Force reflow
                    document.body.style.pointerEvents = '';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        log('✅ Safari scroll fix appliqué');
    }

    // 5. Touch-action pour permettre le scroll natif tout en permettant les animations
    if (isTouch) {
        document.documentElement.style.touchAction = 'pan-y';
        document.body.style.touchAction = 'pan-y';

        // Permettre le pinch-zoom sur tout sauf les sections d'animation
        const animSections = document.querySelectorAll('[class*="-animation-container"]');
        animSections.forEach(section => {
            section.style.touchAction = 'pan-y';
        });

        log('✅ Touch-action configuré pour appareils tactiles');
    }

    // 6. Fix pour les animations qui restent bloquées sur iOS
    if (isIOS) {
        // Forcer le rendu après un changement de tab
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // Forcer un refresh des animations GSAP si disponible
                setTimeout(() => {
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                        log('🔄 ScrollTrigger refresh après visibilitychange');
                    }
                }, 100);
            }
        });

        log('✅ iOS visibility fix appliqué');
    }

    // 7. Performance: réduire les animations si l'utilisateur préfère
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        log('⚡ Animations réduites selon préférences utilisateur');
    }

    // 8. Fix pour Android Chrome qui a des problèmes avec position:fixed pendant le scroll
    if (isAndroid) {
        const style = document.createElement('style');
        style.textContent = `
            /* Fix Android Chrome fixed positioning */
            .pin-spacer {
                contain: layout style;
            }
        `;
        document.head.appendChild(style);
        log('✅ Android Chrome fix appliqué');
    }

    log('✅ Tous les correctifs cross-platform appliqués');
})();

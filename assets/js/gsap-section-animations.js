// GSAP ScrollTrigger - Animations style Apple/DJI
// Solution cross-platform : Safari iOS, Safari Mac, Chrome, Firefox, Android, Windows

(function() {
    'use strict';

    // Detecter l'environnement
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid || window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function initGSAPAnimations() {
        // Attendre que GSAP soit chargé
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP ou ScrollTrigger non chargé');
            // Réessayer après un court délai
            setTimeout(initGSAPAnimations, 200);
            return;
        }

        console.log('🚀 GSAP ScrollTrigger initialisé');
        console.log(`📱 Environnement: iOS=${isIOS}, Android=${isAndroid}, Safari=${isSafari}, Mobile=${isMobile}, Touch=${isTouch}`);

        // Enregistrer le plugin
        gsap.registerPlugin(ScrollTrigger);

        // CRITICAL: Configuration globale pour compatibilité universelle
        ScrollTrigger.config({
            // Limite les recalculs pour de meilleures performances
            limitCallbacks: true,
            // Ignore les éléments mobiles qui peuvent causer des problèmes
            ignoreMobileResize: true
        });

        // CRITICAL pour iOS/touch: Normaliser le scroll pour éviter les conflits
        // avec le momentum scroll natif d'iOS Safari
        if (isTouch || isMobile) {
            ScrollTrigger.normalizeScroll({
                allowNestedScroll: true,
                lockAxis: false,
                momentum: self => Math.min(3, self.velocityY / 1000), // Réduit le momentum
                type: "touch,wheel,pointer"
            });
            console.log('📲 ScrollTrigger.normalizeScroll activé pour touch/mobile');
        }

        // Configuration des sections à animer
        const sections = [
            { name: 'creno', color: '#1a315c' },
            { name: 'fakt', color: '#87CEEB' }
        ];

        sections.forEach(config => {
            setupSectionAnimation(config);
        });

        // Rafraîchir après le chargement complet (important pour iOS)
        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
                console.log('🔄 ScrollTrigger refresh après load');
            }, 500);
        });

        // Rafraîchir après changement d'orientation (mobile)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
                console.log('🔄 ScrollTrigger refresh après orientation change');
            }, 500);
        });

        console.log('✅ Toutes les animations GSAP configurées');
    }

    function setupSectionAnimation(config) {
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) {
            console.log(`⚠️ Section ${config.name} non trouvée`);
            return;
        }

        console.log(`📦 Configuration GSAP pour ${config.name}`);

        const logo = container.querySelector(`.${config.name}-logo-zoom`);
        const text = container.querySelector(`.${config.name}-text-content`);
        const statsContainer = container.querySelector(`.${config.name}-stats-container`);
        const statItems = container.querySelectorAll(`.${config.name}-stat-item`);

        if (!logo || !statsContainer) {
            console.log(`⚠️ Éléments manquants pour ${config.name}`);
            return;
        }

        // Préparer les éléments pour l'animation GPU-accelerated
        gsap.set(logo, {
            xPercent: -50,
            yPercent: -50,
            force3D: true,           // Force GPU acceleration
            willChange: 'transform, filter'
        });

        // Cacher les stats au départ
        gsap.set(statsContainer, {
            autoAlpha: 0,
            force3D: true
        });
        gsap.set(statItems, {
            autoAlpha: 0,
            y: 50,
            scale: 0.8,
            force3D: true
        });

        // Configuration ScrollTrigger adaptée à l'environnement
        const scrollTriggerConfig = {
            trigger: container,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: isMobile ? 0.5 : 1,  // Scrub plus réactif sur mobile
            anticipatePin: 1,
            // CRITICAL pour iOS: utiliser transform au lieu de fixed
            pinType: isIOS ? "transform" : "fixed",
            // Évite les problèmes avec les barres d'adresse mobiles
            pinSpacing: true,
            // Force le recalcul si nécessaire
            invalidateOnRefresh: true,
            // Callbacks de debug
            onEnter: () => console.log(`🎯 ${config.name} - PINNED`),
            onLeave: () => console.log(`➡️ ${config.name} - UNPINNED`),
            onEnterBack: () => console.log(`🔙 ${config.name} - PINNED (back)`),
            onLeaveBack: () => console.log(`⬅️ ${config.name} - UNPINNED (back)`)
        };

        // Timeline principale
        const tl = gsap.timeline({
            scrollTrigger: scrollTriggerConfig
        });

        // PHASE 1: Le logo recule et s'assombrit
        tl.to(logo, {
            scale: 0.85,
            xPercent: -50,
            yPercent: -50,
            filter: "brightness(0.5)",
            duration: 0.4,
            ease: "power2.out",
            force3D: true
        }, 0);

        // Le texte recule aussi
        if (text) {
            tl.to(text, {
                y: 20,
                opacity: 0.5,
                duration: 0.4,
                ease: "power2.out",
                force3D: true
            }, 0);
        }

        // PHASE 2: Les stats apparaissent
        tl.to(statsContainer, {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.15,
            ease: "none"
        }, 0);

        // Animer chaque stat
        statItems.forEach((stat, index) => {
            tl.to(stat, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.25,
                ease: "back.out(1.7)",
                force3D: true,
                onStart: () => {
                    const counter = stat.querySelector('.stat-counter');
                    if (counter) {
                        animateCounter(counter);
                    }
                }
            }, 0.1 + (index * 0.15));
        });

        console.log(`✅ ${config.name} - Animation configurée (pinType: ${scrollTriggerConfig.pinType})`);
    }

    // Animation de compteur
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        if (isNaN(target)) return;

        if (element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';

        const hasDecimal = target % 1 !== 0;
        const duration = 1.5;

        gsap.to(element, {
            innerText: target,
            duration: duration,
            snap: { innerText: hasDecimal ? 0.1 : 1 },
            ease: "power2.out",
            onUpdate: function() {
                const value = parseFloat(this.targets()[0].innerText);
                if (hasDecimal) {
                    element.innerText = value.toFixed(1);
                } else {
                    element.innerText = Math.floor(value);
                }
            }
        });
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAPAnimations);
    } else {
        // DOM déjà prêt, attendre que GSAP soit chargé
        setTimeout(initGSAPAnimations, 100);
    }

})();

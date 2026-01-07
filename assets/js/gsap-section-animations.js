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
            setTimeout(initGSAPAnimations, 200);
            return;
        }

        console.log('🚀 GSAP ScrollTrigger initialisé');
        console.log(`📱 Environnement: iOS=${isIOS}, Android=${isAndroid}, Safari=${isSafari}, Mobile=${isMobile}, Touch=${isTouch}`);

        gsap.registerPlugin(ScrollTrigger);

        // Configuration globale
        ScrollTrigger.config({
            limitCallbacks: true,
            ignoreMobileResize: true
        });

        // Normaliser le scroll sur touch/mobile
        if (isTouch || isMobile) {
            ScrollTrigger.normalizeScroll({
                allowNestedScroll: true,
                lockAxis: false,
                momentum: self => Math.min(3, self.velocityY / 1000),
                type: "touch,wheel,pointer"
            });
            console.log('📲 ScrollTrigger.normalizeScroll activé');
        }

        // Configuration des sections
        const sections = [
            { name: 'creno', color: '#1a315c' },
            { name: 'fakt', color: '#87CEEB' }
        ];

        sections.forEach(config => {
            setupSectionAnimation(config);
        });

        // Refresh après chargement complet
        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
                console.log('🔄 ScrollTrigger refresh après load');
            }, 500);
        });

        // Refresh après changement d'orientation
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

        // IMPORTANT: Ne PAS modifier le transform du logo pour préserver le centrage CSS
        // Le CSS gère: position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)
        // On ajoute seulement force3D pour GPU acceleration sans toucher au positionnement
        gsap.set(logo, {
            force3D: true
        });

        // Cacher les stats au départ
        gsap.set(statsContainer, {
            autoAlpha: 0,
            force3D: true
        });

        // Stats en position absolue autour du logo (desktop ET mobile)
        gsap.set(statItems, {
            autoAlpha: 0,
            y: 20,
            scale: 0.9,
            force3D: true
        });

        // Configuration ScrollTrigger
        const scrollTriggerConfig = {
            trigger: container,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: isMobile ? 0.5 : 1,
            anticipatePin: 1,
            // Sur iOS: utiliser transform au lieu de fixed
            // Mais attention: cela peut affecter les éléments enfants
            pinType: isIOS ? "transform" : "fixed",
            pinSpacing: true,
            invalidateOnRefresh: true,
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
        // IMPORTANT: Utiliser scale uniquement, sans toucher à xPercent/yPercent
        // pour ne pas casser le centrage CSS
        tl.to(logo, {
            scale: 0.85,
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

        // Animer chaque stat (apparition progressive autour du logo)
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

        console.log(`✅ ${config.name} - Animation configurée (pinType: ${scrollTriggerConfig.pinType}, mobile: ${isMobile})`);
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

    // Initialiser
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAPAnimations);
    } else {
        setTimeout(initGSAPAnimations, 100);
    }

})();

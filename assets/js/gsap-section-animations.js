// GSAP ScrollTrigger - Style Apple/DJI
// Solution UNIVERSELLE - Fonctionne sur TOUS les navigateurs/devices
// Compatible avec Lenis smooth scroll

(function() {
    'use strict';

    function initGSAPAnimations() {
        // Attendre GSAP
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initGSAPAnimations, 100);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Configuration pour compatibilité Lenis/iOS
        ScrollTrigger.config({
            ignoreMobileResize: true  // Évite les recalculs lors du resize de la barre d'adresse iOS
        });
        console.log('GSAP ScrollTrigger ready');

        // Configuration SIMPLE - pas de comportements différents selon device
        const sections = [
            { name: 'creno' },
            { name: 'fakt' }
        ];

        sections.forEach(setupSection);

        // Refresh une seule fois après load
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    function setupSection(config) {
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) return;

        // Éléments à animer (INTERNES au container pinné)
        const logo = container.querySelector(`.${config.name}-logo-zoom`);
        const text = container.querySelector(`.${config.name}-text-content`);
        const statsContainer = container.querySelector(`.${config.name}-stats-container`);
        const statItems = container.querySelectorAll(`.${config.name}-stat-item`);

        if (!logo || !statsContainer) return;

        // État initial des stats (cachées)
        gsap.set(statsContainer, { autoAlpha: 0 });
        gsap.set(statItems, { autoAlpha: 0, y: 20 });

        // Timeline avec ScrollTrigger
        // IMPORTANT: On pin le CONTAINER, on anime les éléments INTERNES
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=100%",           // Durée du pin = 100% viewport height
                pin: true,               // Pin le container
                scrub: 1,                // Smooth scrub
                anticipatePin: 1,        // CRITIQUE: évite le délai de pin
                // PAS de pinType manuel - GSAP choisit automatiquement
                // PAS de normalizeScroll - peut causer des problèmes
            }
        });

        // Animation du logo: scale down + dim
        // Note: on n'utilise PAS xPercent/yPercent pour ne pas casser le CSS centering
        tl.to(logo, {
            scale: 0.8,
            filter: "brightness(0.4)",
            duration: 0.5
        }, 0);

        // Animation du texte
        if (text) {
            tl.to(text, {
                y: 30,
                autoAlpha: 0.3,
                duration: 0.5
            }, 0);
        }

        // Stats container devient visible
        tl.to(statsContainer, {
            autoAlpha: 1,
            duration: 0.3
        }, 0.1);

        // Chaque stat apparaît progressivement
        statItems.forEach((stat, i) => {
            tl.to(stat, {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                onStart: () => animateCounter(stat.querySelector('.stat-counter'))
            }, 0.2 + (i * 0.1));
        });

        console.log(`${config.name} animation ready`);
    }

    function animateCounter(el) {
        if (!el || el.dataset.animated) return;
        el.dataset.animated = 'true';

        const target = parseFloat(el.dataset.target);
        if (isNaN(target)) return;

        const isDecimal = target % 1 !== 0;

        gsap.to(el, {
            innerText: target,
            duration: 1.5,
            snap: { innerText: isDecimal ? 0.1 : 1 },
            ease: "power2.out",
            onUpdate: function() {
                const val = parseFloat(this.targets()[0].innerText);
                el.innerText = isDecimal ? val.toFixed(1) : Math.floor(val);
            }
        });
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAPAnimations);
    } else {
        initGSAPAnimations();
    }

})();

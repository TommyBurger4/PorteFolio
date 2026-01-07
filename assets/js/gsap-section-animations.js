// GSAP ScrollTrigger - Animations style Apple/DJI
// Pin + Scrub pour des animations fluides sur tous les navigateurs

// Attendre que GSAP soit chargé
function initGSAPAnimations() {
    // Vérifier que GSAP et ScrollTrigger sont disponibles
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP ou ScrollTrigger non chargé');
        return;
    }

    console.log('🚀 GSAP ScrollTrigger initialisé');

    // Enregistrer le plugin
    gsap.registerPlugin(ScrollTrigger);

    // Configuration des sections à animer
    const sections = [
        { name: 'creno', color: '#1a315c' },
        { name: 'fakt', color: '#87CEEB' }
    ];

    sections.forEach(config => {
        setupSectionAnimation(config);
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

    // IMPORTANT: Utiliser xPercent/yPercent de GSAP pour le centrage
    // Cela évite les conflits avec le CSS transform: translate(-50%, -50%)
    // GSAP combine xPercent, yPercent et scale en un seul transform
    gsap.set(logo, {
        xPercent: -50,
        yPercent: -50,
        // Retirer le transform CSS et laisser GSAP gérer
        clearProps: "transform"
    });

    // Réappliquer immédiatement le centrage GSAP
    gsap.set(logo, {
        xPercent: -50,
        yPercent: -50
    });

    // Cacher les stats au départ
    gsap.set(statsContainer, { autoAlpha: 0 });
    gsap.set(statItems, { autoAlpha: 0, y: 50, scale: 0.8 });

    // Timeline principale avec ScrollTrigger et PIN
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top top",      // Commence quand le haut de la section touche le haut du viewport
            end: "+=150%",         // Dure 150% de la hauteur du viewport
            pin: true,             // PIN - La section reste fixe pendant le scroll
            scrub: 1,              // Lie l'animation au scroll (1 = léger smoothing)
            anticipatePin: 1,      // Optimise le pinning
            // markers: true,   // Désactivé en prod
            onEnter: () => console.log(`🎯 ${config.name} - PINNED`),
            onLeave: () => console.log(`➡️ ${config.name} - UNPINNED`),
        }
    });

    // PHASE 1: Le logo recule légèrement et s'assombrit (pendant que les stats apparaissent)
    // On maintient xPercent/yPercent pour garder le centrage
    tl.to(logo, {
        scale: 0.85,
        xPercent: -50,
        yPercent: -50,
        filter: "brightness(0.5)",
        duration: 0.4,
        ease: "power2.out"
    }, 0);

    // Le texte recule aussi légèrement
    if (text) {
        tl.to(text, {
            y: 20,
            opacity: 0.5,
            duration: 0.4,
            ease: "power2.out"
        }, 0);
    }

    // PHASE 2: Les stats apparaissent progressivement
    tl.to(statsContainer, {
        autoAlpha: 1,
        pointerEvents: "auto",
        duration: 0.15,
        ease: "none"
    }, 0);

    // Animer chaque stat avec un délai progressif
    statItems.forEach((stat, index) => {
        tl.to(stat, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "back.out(1.7)",
            onStart: () => {
                // Animer le compteur quand la stat apparaît
                const counter = stat.querySelector('.stat-counter');
                if (counter) {
                    animateCounter(counter);
                }
            }
        }, 0.1 + (index * 0.15));
    });

    console.log(`✅ ${config.name} - Animation GSAP configurée avec PIN`);
}

// Animation de compteur
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    if (isNaN(target)) return;

    // Vérifier si déjà animé
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
    // DOM déjà prêt, attendre un peu que GSAP soit chargé
    setTimeout(initGSAPAnimations, 100);
}

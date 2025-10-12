// Système d'animations basé sur IntersectionObserver
// Propre, fiable, fonctionne sur tous les écrans

console.log('🚀 SCRIPT SECTION-ANIMATIONS.JS CHARGÉ !');
console.log('🌍 User Agent:', navigator.userAgent);
console.log('📄 Document ready state:', document.readyState);

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM READY - Démarrage du système d\'animations');
    initSectionAnimations();
});

// Si le DOM est déjà prêt (script chargé après DOMContentLoaded)
if (document.readyState === 'loading') {
    console.log('⏳ En attente du DOM...');
} else {
    console.log('✅ DOM déjà prêt - Démarrage immédiat');
    initSectionAnimations();
}

function initSectionAnimations() {
    console.log('🔥 INIT SECTION ANIMATIONS !');

    // Détecter le device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    console.log(`📱 Section Animations - Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);

    // Sélectionner toutes les sections avec animations
    console.log('🔍 Recherche des sections avec [class*="-animation-container"]...');
    const animationSections = document.querySelectorAll('[class*="-animation-container"]');
    console.log('📦 Sections trouvées:', animationSections.length);

    // Logger chaque section trouvée
    animationSections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.className}`);
    });

    if (animationSections.length === 0) {
        console.log('⚠️ Aucune section d\'animation trouvée');
        console.log('🔍 Vérification du DOM...');
        console.log('Toutes les sections:', document.querySelectorAll('section').length);
        return;
    }

    console.log(`✅ ${animationSections.length} sections d'animation détectées`);

    // Tracker l'état de chaque section
    const sectionStates = new Map();

    // Observer avec plusieurs seuils pour tous les écrans
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionName = section.className.match(/(\w+)-animation-container/)?.[1] || 'unknown';
            const ratio = Math.round(entry.intersectionRatio * 100);

            // Initialiser l'état si nécessaire
            if (!sectionStates.has(section)) {
                sectionStates.set(section, {
                    phase: 'waiting', // waiting → snapped → animated
                    readyForAnimation: false
                });
            }

            const state = sectionStates.get(section);

            // Logger TOUS les changements de visibilité
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📱 SECTION: ${sectionName.toUpperCase()}`);
            console.log(`👁️ VISIBLE: ${ratio}%`);
            console.log(`🎯 IS INTERSECTING: ${entry.isIntersecting ? 'YES' : 'NO'}`);
            console.log(`📍 PHASE: ${state.phase}`);
            console.log(`📊 BOUNDS: top=${Math.round(entry.boundingClientRect.top)}, bottom=${Math.round(entry.boundingClientRect.bottom)}`);

            // PHASE 1 : Détecter quand la section est bien centrée (snappée)
            // >= 70% visible = section bien au centre après le snap
            if (entry.isIntersecting && entry.intersectionRatio >= 0.7 && state.phase === 'waiting') {
                console.log(`🎯 PHASE 1: Section snappée au centre (${ratio}% visible)`);
                state.phase = 'snapped';

                // Préparer le logo et le texte (arrière-plan)
                prepareSection(section, sectionName);

                console.log(`⏳ En attente d'un mouvement de scroll pour animer les stats...`);
            }

            // PHASE 2 : Détecter quand la section commence à sortir (= scroll down détecté)
            // La section était snappée (>70%) et descend maintenant entre 50-69% = l'utilisateur scroll
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && entry.intersectionRatio < 0.7 && state.phase === 'snapped') {
                console.log(`🚨 PHASE 2: Scroll down détecté (${ratio}% visible) - DÉCLENCHEMENT ANIMATION!`);
                state.phase = 'animated';
                triggerSectionAnimation(section, sectionName);
            }

            // Si la section sort du viewport, reset
            if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                if (state.phase === 'snapped' || state.phase === 'animated') {
                    console.log(`⬅️ Section sortie - Reset de la phase`);
                    state.phase = 'waiting';
                }
            }

            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        });
    }, {
        // Plusieurs seuils pour détecter progressivement
        threshold: [0, 0.25, 0.5, 0.7, 0.75, 1],
        // Marge pour anticiper l'entrée
        rootMargin: '0px 0px -10% 0px'
    });

    // Observer toutes les sections
    animationSections.forEach(section => {
        observer.observe(section);
        console.log(`👁️ Observing: ${section.className}`);
    });

    // PHASE 1 : Préparer la section (logo et texte en arrière-plan, PAS de stats)
    function prepareSection(section, sectionName) {
        console.log(`🎬 PHASE 1: Préparation de ${sectionName.toUpperCase()}`);

        // Logo et texte reculent légèrement en arrière-plan
        const logo = section.querySelector(`[class*="${sectionName}-logo-zoom"]`);
        if (logo) {
            logo.style.transition = 'all 0.3s ease-out';
            logo.style.transform = 'translate(-50%, -50%) scale(0.9)';
            logo.style.opacity = '0.8';
            logo.style.filter = 'brightness(0.7)';
        }

        const text = section.querySelector(`[class*="${sectionName}-text-content"]`);
        if (text) {
            text.style.transition = 'all 0.3s ease-out';
            text.style.opacity = '0.7';
            text.style.transform = 'translateY(20px) scale(0.9)';
        }

        console.log(`✅ Section préparée - Logo et texte en arrière-plan`);
    }

    // PHASE 2 : Déclencher les animations des stats
    function triggerSectionAnimation(section, sectionName) {
        console.log(`🎬 PHASE 2: Animation des stats pour ${sectionName.toUpperCase()}`)

        const statsContainer = section.querySelector(`[class*="${sectionName}-stats-container"]`);
        if (statsContainer) {
            statsContainer.style.display = 'block';
            statsContainer.style.opacity = '1';

            // Animer chaque stat item
            const statItems = statsContainer.querySelectorAll(`[class*="${sectionName}-stat-item"]`);

            console.log(`📊 Nombre de stats trouvées: ${statItems.length}`);

            statItems.forEach((item, index) => {
                // FORCER position absolute même sur mobile (override le CSS)
                item.style.setProperty('position', 'absolute', 'important');

                console.log(`  Stat ${index + 1}: position forcée à absolute`);

                // Animation avec délai progressif
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';

                    // Animer le compteur
                    const counter = item.querySelector('.stat-counter');
                    if (counter) {
                        animateCounter(counter);
                    }
                }, index * 150);
            });
        }

        console.log(`✅ Stats animées: ${sectionName.toUpperCase()}`);
    }

    // Animation de compteur
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        if (isNaN(target)) return;

        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }

    console.log('✅ Section Animations - IntersectionObserver actif');
}

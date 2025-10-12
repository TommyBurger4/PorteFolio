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

                // BLOQUER le scroll (overflow: hidden)
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                console.log(`🔒 SCROLL BLOQUÉ`);

                // Préparer le logo et le texte (arrière-plan)
                prepareSection(section, sectionName);

                console.log(`⏳ En attente d'un geste de scroll...`);

                // PHASE 2 : Écouter les tentatives de scroll (même si bloqué)
                let scrollAttempts = 0;

                const unlockAndAnimate = () => {
                    if (state.phase === 'snapped') {
                        scrollAttempts++;
                        console.log(`📍 Tentative de scroll détectée (#${scrollAttempts})`);

                        if (scrollAttempts >= 1) { // Dès la première tentative
                            console.log(`🚨 PHASE 2: DÉCLENCHEMENT ANIMATION!`);
                            state.phase = 'animated';

                            // DÉBLOQUER le scroll
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';
                            console.log(`🔓 SCROLL DÉBLOQUÉ`);

                            // Retirer les listeners
                            window.removeEventListener('touchmove', unlockAndAnimate);
                            window.removeEventListener('wheel', unlockAndAnimate);

                            triggerSectionAnimation(section, sectionName);
                        }
                    }
                };

                // Écouter les tentatives de scroll
                window.addEventListener('touchmove', unlockAndAnimate, { passive: true });
                window.addEventListener('wheel', unlockAndAnimate, { passive: true });
            }

            // Si la section sort du viewport, reset ET débloquer
            if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                if (state.phase === 'snapped' || state.phase === 'animated') {
                    console.log(`⬅️ Section sortie - Reset de la phase`);
                    state.phase = 'waiting';

                    // S'assurer que le scroll est débloqué
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    console.log(`🔓 SCROLL DÉBLOQUÉ (sortie)`);
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
            // FORCER le container à être visible avec !important
            statsContainer.style.setProperty('display', 'block', 'important');
            statsContainer.style.setProperty('opacity', '1', 'important');
            statsContainer.style.setProperty('pointer-events', 'auto', 'important');
            statsContainer.style.setProperty('visibility', 'visible', 'important');
            console.log(`📦 Container ${sectionName}: FORCÉ visible (display:block, opacity:1)`);

            // Animer chaque stat item
            const statItems = statsContainer.querySelectorAll(`[class*="${sectionName}-stat-item"]`);

            console.log(`📊 Nombre de stats trouvées: ${statItems.length}`);

            // Positions fixes pour chaque stat (layout desktop)
            const statPositions = [
                { top: '15%', left: '10%', right: 'auto', bottom: 'auto' },    // stat-1
                { top: '15%', right: '10%', left: 'auto', bottom: 'auto' },    // stat-2
                { bottom: '25%', left: '15%', top: 'auto', right: 'auto' },    // stat-3
                { bottom: '15%', right: '12%', top: 'auto', left: 'auto' }     // stat-4
            ];

            statItems.forEach((item, index) => {
                // ANNULER COMPLÈTEMENT le CSS mobile (carrousel flex)
                item.style.setProperty('position', 'absolute', 'important');
                item.style.setProperty('flex', 'none', 'important');
                item.style.setProperty('width', 'auto', 'important');
                item.style.setProperty('display', 'block', 'important');
                item.style.setProperty('padding', '0', 'important');
                item.style.setProperty('z-index', '100', 'important'); // Au-dessus de tout

                // FORCER les positions desktop (autour du logo)
                const pos = statPositions[index];
                if (pos) {
                    item.style.setProperty('top', pos.top, 'important');
                    item.style.setProperty('left', pos.left, 'important');
                    item.style.setProperty('right', pos.right, 'important');
                    item.style.setProperty('bottom', pos.bottom, 'important');

                    // Log de la position réelle
                    const posInfo = pos.top !== 'auto' ? `top:${pos.top}` : `bottom:${pos.bottom}`;
                    console.log(`  Stat ${index + 1}: ${posInfo}, left:${pos.left || 'auto'}, right:${pos.right || 'auto'}`);
                }

                // FORCER la stat-box à être VISIBLE avec un fond blanc/gris clair
                const statBox = item.querySelector('.stat-box');
                if (statBox) {
                    // Background bien visible (blanc semi-transparent sur fond noir)
                    statBox.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
                    statBox.style.setProperty('border', '2px solid rgba(255, 255, 255, 0.2)', 'important');
                    statBox.style.setProperty('box-shadow', '0 20px 60px rgba(0, 0, 0, 0.5)', 'important');
                    console.log(`  ✅ Stat ${index + 1}: Background forcé à rgba(255,255,255,0.95)`);
                }

                // Forcer le texte à être VISIBLE (noir sur fond blanc)
                const statCounter = item.querySelector('.stat-counter');
                if (statCounter) {
                    statCounter.style.setProperty('color', '#000', 'important');
                    console.log(`  ✅ Stat ${index + 1}: Texte counter forcé à noir`);
                }

                const statLabel = item.querySelector('.stat-label');
                if (statLabel) {
                    statLabel.style.setProperty('color', '#333', 'important');
                    console.log(`  ✅ Stat ${index + 1}: Texte label forcé à gris foncé`);
                }

                // Forcer opacity à 0 initialement
                item.style.setProperty('opacity', '0', 'important');
                item.style.setProperty('transform', 'translateY(30px) scale(0.8)', 'important');

                // Animation avec délai progressif
                setTimeout(() => {
                    item.style.setProperty('opacity', '1', 'important');
                    item.style.setProperty('transform', 'translateY(0) scale(1)', 'important');

                    console.log(`  🎬 Stat ${index + 1}: Animation déclenchée - opacity devrait être 1`);

                    // Vérifier la position réelle calculée
                    const rect = item.getBoundingClientRect();
                    console.log(`  📍 Stat ${index + 1}: Position réelle - top:${Math.round(rect.top)}px, left:${Math.round(rect.left)}px, width:${Math.round(rect.width)}px, height:${Math.round(rect.height)}px`);
                    console.log(`  👁️ Stat ${index + 1}: Visible dans viewport? ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth ? 'OUI' : 'NON'}`);

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

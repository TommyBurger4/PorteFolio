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
                    readyForAnimation: false,
                    savedScrollY: 0 // Pour Android
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
            // >= 85% visible = section bien au centre après le snap (plus tard pour voir "scroll pour découvrir")
            if (entry.isIntersecting && entry.intersectionRatio >= 0.85 && state.phase === 'waiting') {
                console.log(`🎯 PHASE 1: Section snappée au centre (${ratio}% visible)`);
                state.phase = 'snapped';

                // Système 2-phases avec blocage pour TOUS les devices
                // Sur Android, il faut aussi bloquer avec position: fixed + touch-action
                if (isAndroid) {
                    state.savedScrollY = window.scrollY;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${state.savedScrollY}px`;
                    document.body.style.width = '100%';
                    document.body.style.touchAction = 'none';
                    document.documentElement.style.touchAction = 'none';
                    console.log(`🔒 SCROLL BLOQUÉ ANDROID (position: fixed + touch-action: none à ${state.savedScrollY}px)`);
                }
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                console.log(`🔒 SCROLL BLOQUÉ (${isMobile ? 'mobile' : 'desktop'})`);

                // Préparer le logo et le texte (arrière-plan)
                prepareSection(section, sectionName);

                console.log(`⏳ En attente d'un geste de scroll...`);

                // PHASE 2 : Écouter les tentatives de scroll (même si bloqué)
                let scrollAttempts = 0;
                const requiredAttempts = isMobile ? 1 : 5; // Mobile: 1 tentative, Desktop: 5 tentatives

                const unlockAndAnimate = (e) => {
                    if (state.phase === 'snapped') {
                        // Sur tous les navigateurs sauf Safari, bloquer le scroll avec preventDefault
                        if (!isIOS) {
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        scrollAttempts++;
                        console.log(`📍 Tentative de scroll détectée (#${scrollAttempts}/${requiredAttempts})`);

                        if (scrollAttempts >= requiredAttempts) {
                            console.log(`🚨 PHASE 2: DÉCLENCHEMENT ANIMATION!`);
                            state.phase = 'animated';

                            // DÉBLOQUER le scroll
                            document.body.style.overflow = '';
                            document.documentElement.style.overflow = '';

                            // Sur Android, restaurer la position du scroll et touch-action
                            if (isAndroid) {
                                document.body.style.position = '';
                                document.body.style.top = '';
                                document.body.style.width = '';
                                document.body.style.touchAction = '';
                                document.documentElement.style.touchAction = '';
                                window.scrollTo(0, state.savedScrollY);
                                console.log(`🔓 SCROLL DÉBLOQUÉ ANDROID (restauré à ${state.savedScrollY}px + touch-action restauré)`);
                            }

                            console.log(`🔓 SCROLL DÉBLOQUÉ (${isMobile ? 'mobile' : 'desktop'})`);

                            // Retirer les listeners
                            window.removeEventListener('touchstart', unlockAndAnimate);
                            window.removeEventListener('touchmove', unlockAndAnimate);
                            window.removeEventListener('wheel', unlockAndAnimate);

                            triggerSectionAnimation(section, sectionName);
                        }
                    }
                };

                // Écouter les tentatives de scroll
                // Safari iOS: passive: true (fonctionne déjà parfaitement)
                // Tous les autres (Android + Desktop Chrome/Firefox/Edge): passive: false pour vraiment bloquer
                if (isIOS) {
                    window.addEventListener('touchmove', unlockAndAnimate, { passive: true });
                    console.log(`👂 Listeners iOS/Safari actifs (passive: true)`);
                } else {
                    // Android + Desktop (Chrome, Firefox, Edge, etc.)
                    if (isMobile) {
                        // Mobile Android: écouter touchstart et touchmove
                        window.addEventListener('touchstart', unlockAndAnimate, { passive: false });
                        window.addEventListener('touchmove', unlockAndAnimate, { passive: false });
                        console.log(`👂 Listeners Android actifs (passive: false)`);
                    } else {
                        // Desktop: écouter wheel pour la molette
                        window.addEventListener('wheel', unlockAndAnimate, { passive: false });
                        console.log(`👂 Listeners Desktop (Chrome/Firefox/Edge) actifs (passive: false)`);
                    }
                }
            }

            // Si la section sort du viewport, reset ET débloquer
            if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                if (state.phase === 'snapped' || state.phase === 'animated') {
                    console.log(`⬅️ Section sortie - Reset de la phase`);
                    state.phase = 'waiting';

                    // S'assurer que le scroll est débloqué (tous les devices)
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';

                    // Sur Android, restaurer la position du scroll et touch-action
                    if (isAndroid && state.savedScrollY !== undefined) {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        document.body.style.touchAction = '';
                        document.documentElement.style.touchAction = '';
                        window.scrollTo(0, state.savedScrollY);
                        console.log(`🔓 SCROLL DÉBLOQUÉ ANDROID sortie (restauré à ${state.savedScrollY}px + touch-action restauré)`);
                    }

                    console.log(`🔓 SCROLL DÉBLOQUÉ (sortie ${isMobile ? 'mobile' : 'desktop'})`);
                }
            }

            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        });
    }, {
        // Plusieurs seuils pour détecter progressivement
        threshold: [0, 0.25, 0.5, 0.7, 0.75, 0.85, 1],
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
            // Z-index bas pour passer derrière les stats
            logo.style.zIndex = '10';
        }

        const text = section.querySelector(`[class*="${sectionName}-text-content"]`);
        if (text) {
            text.style.transition = 'all 0.3s ease-out';
            text.style.opacity = '0.7';
            text.style.transform = 'translateY(20px) scale(0.9)';
            // Z-index bas pour passer derrière les stats
            text.style.zIndex = '15';
        }

        console.log(`✅ Section préparée - Logo et texte en arrière-plan (z-index 10-15)`);
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

            // ANNULER les propriétés mobile qui cachent les stats
            statsContainer.style.setProperty('overflow', 'visible', 'important');
            statsContainer.style.setProperty('position', 'absolute', 'important');

            if (isMobile) {
                // Sur mobile : plein écran simple
                statsContainer.style.setProperty('transform', 'none', 'important');
                statsContainer.style.setProperty('top', '0', 'important');
                statsContainer.style.setProperty('left', '0', 'important');
                statsContainer.style.setProperty('right', '0', 'important');
                statsContainer.style.setProperty('bottom', '0', 'important');
                statsContainer.style.setProperty('width', '100%', 'important');
                statsContainer.style.setProperty('height', '100%', 'important');
                console.log(`📦 Container ${sectionName}: Mobile - plein écran`);
            } else {
                // Sur desktop : centré avec transform
                statsContainer.style.setProperty('top', '50%', 'important');
                statsContainer.style.setProperty('left', '50%', 'important');
                statsContainer.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
                statsContainer.style.setProperty('width', '90vw', 'important');
                statsContainer.style.setProperty('max-width', '1000px', 'important');
                statsContainer.style.setProperty('height', '80vh', 'important');
                console.log(`📦 Container ${sectionName}: Desktop - centré`);
            }

            // Animer chaque stat item
            const statItems = statsContainer.querySelectorAll(`[class*="${sectionName}-stat-item"]`);

            console.log(`📊 Nombre de stats trouvées: ${statItems.length}`);

            // Positions fixes pour chaque stat - esthétique améliorée
            // Sur mobile : bien espacées autour du logo central, sans chevaucher le titre
            // Sur desktop : positions équilibrées autour du logo
            const statPositions = isMobile ? [
                { top: '25%', left: '3%', right: 'auto', bottom: 'auto' },      // stat-1 (téléchargements) - haut gauche
                { top: '28%', right: '3%', left: 'auto', bottom: 'auto' },      // stat-2 (événements) - haut droit, légèrement plus bas
                { bottom: '23%', left: '5%', top: 'auto', right: 'auto' },      // stat-3 (note) - bas gauche
                { bottom: '18%', right: '2%', top: 'auto', left: 'auto' }       // stat-4 (stores) - bas droit
            ] : [
                { top: '15%', left: '10%', right: 'auto', bottom: 'auto' },     // stat-1
                { top: '15%', right: '10%', left: 'auto', bottom: 'auto' },     // stat-2
                { bottom: '25%', left: '15%', top: 'auto', right: 'auto' },     // stat-3
                { bottom: '15%', right: '12%', top: 'auto', left: 'auto' }      // stat-4
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

                // FORCER les couleurs selon la section (Créno = bleu, PixShare = violet)
                const statBox = item.querySelector('.stat-box');
                if (statBox) {
                    if (sectionName === 'creno') {
                        // Créno : fond bleu semi-transparent avec border bleu
                        statBox.style.setProperty('background', 'linear-gradient(135deg, rgba(26, 49, 92, 0.25) 0%, rgba(26, 49, 92, 0.15) 100%)', 'important');
                        statBox.style.setProperty('border', '2px solid rgba(26, 49, 92, 0.4)', 'important');
                        statBox.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
                        statBox.style.setProperty('-webkit-backdrop-filter', 'blur(20px)', 'important');
                        console.log(`  ✅ Stat ${index + 1}: Background bleu Créno`);
                    } else if (sectionName === 'pixshare') {
                        // PixShare : fond violet semi-transparent avec border violet
                        statBox.style.setProperty('background', 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)', 'important');
                        statBox.style.setProperty('border', '2px solid rgba(147, 51, 234, 0.3)', 'important');
                        statBox.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
                        statBox.style.setProperty('-webkit-backdrop-filter', 'blur(20px)', 'important');
                        console.log(`  ✅ Stat ${index + 1}: Background violet PixShare`);
                    }
                    statBox.style.setProperty('box-shadow', '0 20px 60px rgba(0, 0, 0, 0.5)', 'important');

                    // Sur mobile : stats plus petites avec variations esthétiques
                    if (isMobile) {
                        statBox.style.setProperty('padding', '1rem 1.5rem', 'important');
                        statBox.style.setProperty('border-radius', '16px', 'important');
                        statBox.style.setProperty('min-width', '120px', 'important');

                        // Variations esthétiques par stat pour dynamisme
                        if (index === 0) {
                            // Stat 1 : légère inclinaison gauche
                            statBox.style.setProperty('transform', 'rotate(-2deg)', 'important');
                        } else if (index === 1) {
                            // Stat 2 : légère inclinaison droite
                            statBox.style.setProperty('transform', 'rotate(2deg)', 'important');
                        } else if (index === 2) {
                            // Stat 3 : légèrement plus petite
                            statBox.style.setProperty('transform', 'scale(0.95) rotate(-1deg)', 'important');
                        } else if (index === 3) {
                            // Stat 4 (stores) : forte inclinaison + petit - effet DJI
                            statBox.style.setProperty('transform', 'rotate(8deg) scale(0.85)', 'important');
                            console.log(`  🔄 Stat ${index + 1}: Inclinée 8deg + scale 0.85`);
                        }

                        console.log(`  📱 Stat ${index + 1}: Taille mobile réduite avec rotation`);
                    }
                }

                // Forcer le texte avec les bonnes couleurs
                const statCounter = item.querySelector('.stat-counter');
                if (statCounter) {
                    if (sectionName === 'creno') {
                        statCounter.style.setProperty('color', '#1a315c', 'important');
                        statCounter.style.setProperty('text-shadow', '0 0 20px rgba(26, 49, 92, 0.6)', 'important');
                        console.log(`  ✅ Stat ${index + 1}: Texte counter bleu Créno`);
                    } else if (sectionName === 'pixshare') {
                        statCounter.style.setProperty('color', '#9333ea', 'important');
                        statCounter.style.setProperty('text-shadow', '0 0 20px rgba(147, 51, 234, 0.6)', 'important');
                        console.log(`  ✅ Stat ${index + 1}: Texte counter violet PixShare`);
                    }

                    // Sur mobile : texte plus petit
                    if (isMobile) {
                        statCounter.style.setProperty('font-size', '1.8rem', 'important');
                        statCounter.style.setProperty('margin-bottom', '0.3rem', 'important');
                    }
                }

                const statLabel = item.querySelector('.stat-label');
                if (statLabel) {
                    statLabel.style.setProperty('color', 'rgba(255, 255, 255, 0.8)', 'important');

                    // Sur mobile : label plus petit
                    if (isMobile) {
                        statLabel.style.setProperty('font-size', '0.75rem', 'important');
                    }

                    console.log(`  ✅ Stat ${index + 1}: Texte label blanc`);
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

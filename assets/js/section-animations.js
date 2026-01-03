// Système d'animations basé sur IntersectionObserver
// Propre, fiable, fonctionne sur tous les écrans

Logger.log('🚀 SCRIPT SECTION-ANIMATIONS.JS CHARGÉ !');
Logger.log('🌍 User Agent:', navigator.userAgent);
Logger.log('📄 Document ready state:', document.readyState);

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', function () {
    Logger.log('✅ DOM READY - Démarrage du système d\'animations');
    initSectionAnimations();
});

// Si le DOM est déjà prêt (script chargé après DOMContentLoaded)
if (document.readyState === 'loading') {
    Logger.log('⏳ En attente du DOM...');
} else {
    Logger.log('✅ DOM déjà prêt - Démarrage immédiat');
    initSectionAnimations();
}

function initSectionAnimations() {
    Logger.log('🔥 INIT SECTION ANIMATIONS !');

    // Détecter le device et navigateur
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    // Détecter Safari (iOS et Mac)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isSafariMac = isSafari && !isMobile;

    Logger.log(`📱 Section Animations - Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);
    Logger.log(`🧭 Navigateur: ${isSafari ? (isSafariMac ? 'Safari Mac' : 'Safari iOS') : 'Autre'}`);

    // Sélectionner toutes les sections avec animations
    Logger.log('🔍 Recherche des sections avec [class*="-animation-container"]...');
    const animationSections = document.querySelectorAll('[class*="-animation-container"]');
    Logger.log('📦 Sections trouvées:', animationSections.length);

    // Logger chaque section trouvée
    animationSections.forEach((section, index) => {
        Logger.log(`  ${index + 1}. ${section.className}`);
    });

    if (animationSections.length === 0) {
        Logger.log('⚠️ Aucune section d\'animation trouvée');
        Logger.log('🔍 Vérification du DOM...');
        Logger.log('Toutes les sections:', document.querySelectorAll('section').length);
        return;
    }

    Logger.log(`✅ ${animationSections.length} sections d'animation détectées`);

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
            Logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            Logger.log(`📱 SECTION: ${sectionName.toUpperCase()}`);
            Logger.log(`👁️ VISIBLE: ${ratio}%`);
            Logger.log(`🎯 IS INTERSECTING: ${entry.isIntersecting ? 'YES' : 'NO'}`);
            Logger.log(`📍 PHASE: ${state.phase}`);
            Logger.log(`📊 BOUNDS: top=${Math.round(entry.boundingClientRect.top)}, bottom=${Math.round(entry.boundingClientRect.bottom)}`);

            // PHASE 1 : Détecter quand la section est bien centrée (snappée)
            // >= 85% visible sur Android (même seuil que desktop)
            const triggerThreshold = 0.85;

            // Fallback: Si la section est PARFAITEMENT centrée dans le viewport
            const viewportCenter = window.innerHeight / 2;
            const sectionTop = entry.boundingClientRect.top;
            const sectionBottom = entry.boundingClientRect.bottom;
            const sectionHeight = sectionBottom - sectionTop;
            const sectionCenter = sectionTop + (sectionHeight / 2);

            // Distance entre le centre de la section et le centre du viewport
            const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
            const wellCentered = distanceFromCenter < (window.innerHeight * 0.05); // < 5% de l'écran (très strict)

            // Déclencher si: ratio suffisant OU parfaitement centré + visible à 75%+
            const shouldTrigger = (entry.intersectionRatio >= triggerThreshold) ||
                (wellCentered && entry.intersectionRatio >= 0.75);

            if (entry.isIntersecting && shouldTrigger && state.phase === 'waiting') {
                Logger.log(`🎯 PHASE 1: Section snappée au centre`);
                Logger.log(`   - Visible: ${ratio}%, Seuil: ${triggerThreshold * 100}%`);
                Logger.log(`   - Distance du centre: ${Math.round(distanceFromCenter)}px`);
                Logger.log(`   - Bien centrée: ${wellCentered ? 'OUI' : 'NON'}`);
                state.phase = 'snapped';

                // Système 2-phases avec blocage pour TOUS les devices
                // Sauvegarder la position de scroll
                state.savedScrollY = window.scrollY;

                // Sur Android, il faut bloquer avec position: fixed + touch-action
                if (isAndroid) {
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${state.savedScrollY}px`;
                    document.body.style.width = '100%';
                    document.body.style.touchAction = 'none';
                    document.documentElement.style.touchAction = 'none';
                    Logger.log(`🔒 SCROLL BLOQUÉ ANDROID (position: fixed + touch-action: none à ${state.savedScrollY}px)`);
                }

                // Safari Mac : blocage agressif avec position: fixed (comme Android) pour contrer le trackpad
                if (isSafariMac) {
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${state.savedScrollY}px`;
                    document.body.style.width = '100%';
                    document.body.style.height = '100%';
                    Logger.log(`🔒 SCROLL BLOQUÉ SAFARI MAC (position: fixed à ${state.savedScrollY}px)`);
                }

                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                Logger.log(`🔒 SCROLL BLOQUÉ (${isMobile ? 'mobile' : isSafariMac ? 'Safari Mac' : 'desktop'})`);

                // Préparer le logo et le texte (arrière-plan)
                prepareSection(section, sectionName);

                Logger.log(`⏳ En attente d'un geste de scroll...`);

                // PHASE 2 : Écouter les tentatives de scroll (même si bloqué)
                let scrollAttempts = 0;
                // Mobile: 1 tentative, Safari Mac: 1 tentative (trackpad), Autres Desktop: 15 tentatives
                const requiredAttempts = isMobile ? 1 : (isSafariMac ? 1 : 15);

                const unlockAndAnimate = (e) => {
                    if (state.phase === 'snapped') {
                        // Sur tous les navigateurs sauf Safari (iOS et Mac), bloquer le scroll avec preventDefault
                        if (!isSafari) {
                            e.preventDefault();
                            e.stopPropagation();
                        }

                        scrollAttempts++;
                        Logger.log(`📍 Tentative de scroll détectée (#${scrollAttempts}/${requiredAttempts})`);

                        if (scrollAttempts >= requiredAttempts) {
                            Logger.log(`🚨 PHASE 2: DÉCLENCHEMENT ANIMATION!`);
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
                                Logger.log(`🔓 SCROLL DÉBLOQUÉ ANDROID (restauré à ${state.savedScrollY}px + touch-action restauré)`);
                            }

                            // Sur Safari Mac, retirer le handler (cas où unlockAndAnimate serait appelé)
                            if (isSafariMac && state.safariMacHandler) {
                                window.removeEventListener('wheel', state.safariMacHandler);
                                document.body.style.overscrollBehavior = '';
                                document.documentElement.style.overscrollBehavior = '';
                                state.safariMacHandler = null;
                                Logger.log(`🔓 SCROLL DÉBLOQUÉ SAFARI MAC (handler retiré)`);
                            }

                            Logger.log(`🔓 SCROLL DÉBLOQUÉ (${isMobile ? 'mobile' : isSafariMac ? 'Safari Mac' : 'desktop'})`);

                            // Retirer les listeners
                            window.removeEventListener('touchstart', unlockAndAnimate);
                            window.removeEventListener('touchmove', unlockAndAnimate);
                            window.removeEventListener('wheel', unlockAndAnimate);

                            triggerSectionAnimation(section, sectionName);
                        }
                    }
                };

                // Écouter les tentatives de scroll
                // Safari Mac : overflow:hidden bloque le scroll, on compte juste les wheel events
                // Safari iOS : passive: true car touch events
                // Autres navigateurs : passive: false pour vraiment bloquer
                if (isSafariMac) {
                    // Safari Mac : listener PASSIF pour compter (overflow:hidden fait le blocage)
                    const safariMacHandler = (e) => {
                        if (state.phase === 'snapped') {
                            // COMPTER les tentatives (overflow:hidden bloque déjà le scroll)
                            scrollAttempts++;
                            Logger.log(`📍 Safari Mac: Tentative de scroll (#${scrollAttempts}/${requiredAttempts})`);

                            if (scrollAttempts >= requiredAttempts) {
                                Logger.log(`🚨 PHASE 2: DÉCLENCHEMENT ANIMATION!`);
                                state.phase = 'animated';

                                // Retirer le listener AVANT de débloquer
                                window.removeEventListener('wheel', safariMacHandler);
                                state.safariMacHandler = null;

                                // DÉBLOQUER le scroll COMPLÈTEMENT avec délai pour Safari
                                setTimeout(() => {
                                    document.body.style.overflow = '';
                                    document.body.style.overflowY = '';
                                    document.documentElement.style.overflow = '';
                                    document.documentElement.style.overflowY = '';
                                    document.body.style.overscrollBehavior = '';
                                    document.documentElement.style.overscrollBehavior = '';
                                    document.body.style.position = '';
                                    document.body.style.top = '';
                                    document.body.style.width = '';
                                    document.body.style.height = '';
                                    // Restaurer la position de scroll
                                    window.scrollTo(0, state.savedScrollY);
                                    Logger.log(`🔓 SCROLL DÉBLOQUÉ SAFARI MAC (délai 50ms, restauré à ${state.savedScrollY}px)`);
                                }, 50);

                                triggerSectionAnimation(section, sectionName);
                            }
                        }
                    };

                    // Stocker le handler pour pouvoir le retirer si la section sort du viewport
                    state.safariMacHandler = safariMacHandler;

                    // Listener PASSIF sur window (pas document) - Safari préfère ça
                    window.addEventListener('wheel', safariMacHandler, { passive: true });
                    Logger.log(`👂 Listener Safari Mac actif (passive: true, compte les wheel events)`);
                } else if (isSafari && isMobile) {
                    // Safari iOS : touch events avec passive: true
                    window.addEventListener('touchmove', unlockAndAnimate, { passive: true });
                    Logger.log(`👂 Listeners Safari iOS actifs (passive: true)`);
                } else {
                    // Android + Desktop (Chrome, Firefox, Edge, etc.)
                    if (isMobile) {
                        // Mobile Android: écouter touchstart et touchmove
                        window.addEventListener('touchstart', unlockAndAnimate, { passive: false });
                        window.addEventListener('touchmove', unlockAndAnimate, { passive: false });
                        Logger.log(`👂 Listeners Android actifs (passive: false)`);
                    } else {
                        // Desktop non-Safari: écouter wheel pour la molette
                        window.addEventListener('wheel', unlockAndAnimate, { passive: false });
                        Logger.log(`👂 Listeners Desktop (Chrome/Firefox/Edge) actifs (passive: false)`);
                    }
                }
            }

            // Si la section sort du viewport, reset ET débloquer
            if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
                if (state.phase === 'snapped' || state.phase === 'animated') {
                    Logger.log(`⬅️ Section sortie - Reset de la phase`);
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
                        Logger.log(`🔓 SCROLL DÉBLOQUÉ ANDROID sortie (restauré à ${state.savedScrollY}px + touch-action restauré)`);
                    }

                    // Sur Safari Mac, retirer le handler et reset complet
                    if (isSafariMac && state.safariMacHandler) {
                        window.removeEventListener('wheel', state.safariMacHandler);
                        state.safariMacHandler = null;
                    }
                    // Reset complet pour Safari Mac
                    if (isSafariMac) {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        document.body.style.height = '';
                        document.body.style.overscrollBehavior = '';
                        document.documentElement.style.overscrollBehavior = '';
                        document.body.style.overflowY = '';
                        document.documentElement.style.overflowY = '';
                        window.scrollTo(0, state.savedScrollY);
                        Logger.log(`🔓 SCROLL DÉBLOQUÉ SAFARI MAC sortie (restauré à ${state.savedScrollY}px)`);
                    }

                    Logger.log(`🔓 SCROLL DÉBLOQUÉ (sortie ${isMobile ? 'mobile' : isSafariMac ? 'Safari Mac' : 'desktop'})`);
                }
            }

            Logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
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
        Logger.log(`👁️ Observing: ${section.className}`);
    });

    // PHASE 1 : Préparer la section (logo et texte en arrière-plan, PAS de stats)
    function prepareSection(section, sectionName) {
        Logger.log(`🎬 PHASE 1: Préparation de ${sectionName.toUpperCase()}`);

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
            text.style.transition = 'all 0.5s ease-out';
            // Le texte reste visible mais recule légèrement
            text.style.opacity = '0.6';
            text.style.transform = 'translateY(20px) scale(0.95)';
            // Z-index bas pour passer derrière les stats
            text.style.zIndex = '5';
        }

        Logger.log(`✅ Section préparée - Logo et texte en arrière-plan (z-index 5-10)`);
    }

    // PHASE 2 : Déclencher les animations des stats
    function triggerSectionAnimation(section, sectionName) {
        Logger.log(`🎬 PHASE 2: Animation des stats pour ${sectionName.toUpperCase()}`)

        // Faire disparaître complètement le texte sur mobile pour éviter superposition
        const text = section.querySelector(`[class*="${sectionName}-text-content"]`);
        if (text && isMobile) {
            text.style.transition = 'all 0.3s ease-out';
            text.style.opacity = '0';
            text.style.transform = 'translateY(60px) scale(0.9)';
            Logger.log(`📱 Texte caché complètement sur mobile`);
        }

        const statsContainer = section.querySelector(`[class*="${sectionName}-stats-container"]`);
        if (statsContainer) {
            // FORCER le container à être visible avec !important
            statsContainer.style.setProperty('display', 'block', 'important');
            statsContainer.style.setProperty('opacity', '1', 'important');
            statsContainer.style.setProperty('pointer-events', 'auto', 'important');
            statsContainer.style.setProperty('visibility', 'visible', 'important');
            // Z-index élevé pour passer au-dessus du texte
            statsContainer.style.setProperty('z-index', '50', 'important');

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
                Logger.log(`📦 Container ${sectionName}: Mobile - plein écran`);
            } else {
                // Sur desktop : centré avec transform
                statsContainer.style.setProperty('top', '50%', 'important');
                statsContainer.style.setProperty('left', '50%', 'important');
                statsContainer.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
                statsContainer.style.setProperty('width', '90vw', 'important');
                statsContainer.style.setProperty('max-width', '1000px', 'important');
                statsContainer.style.setProperty('height', '80vh', 'important');
                Logger.log(`📦 Container ${sectionName}: Desktop - centré`);
            }

            // Animer chaque stat item
            const statItems = statsContainer.querySelectorAll(`[class*="${sectionName}-stat-item"]`);

            Logger.log(`📊 Nombre de stats trouvées: ${statItems.length}`);

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
                    Logger.log(`  Stat ${index + 1}: ${posInfo}, left:${pos.left || 'auto'}, right:${pos.right || 'auto'}`);
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
                        Logger.log(`  ✅ Stat ${index + 1}: Background bleu Créno`);
                    } else if (sectionName === 'pixshare') {
                        // PixShare : fond violet semi-transparent avec border violet
                        statBox.style.setProperty('background', 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)', 'important');
                        statBox.style.setProperty('border', '2px solid rgba(147, 51, 234, 0.3)', 'important');
                        statBox.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
                        statBox.style.setProperty('-webkit-backdrop-filter', 'blur(20px)', 'important');
                        Logger.log(`  ✅ Stat ${index + 1}: Background violet PixShare`);
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
                            Logger.log(`  🔄 Stat ${index + 1}: Inclinée 8deg + scale 0.85`);
                        }

                        Logger.log(`  📱 Stat ${index + 1}: Taille mobile réduite avec rotation`);
                    }
                }

                // Forcer le texte avec les bonnes couleurs
                const statCounter = item.querySelector('.stat-counter');
                if (statCounter) {
                    if (sectionName === 'creno') {
                        statCounter.style.setProperty('color', '#1a315c', 'important');
                        statCounter.style.setProperty('text-shadow', '0 0 20px rgba(26, 49, 92, 0.6)', 'important');
                        Logger.log(`  ✅ Stat ${index + 1}: Texte counter bleu Créno`);
                    } else if (sectionName === 'pixshare') {
                        statCounter.style.setProperty('color', '#9333ea', 'important');
                        statCounter.style.setProperty('text-shadow', '0 0 20px rgba(147, 51, 234, 0.6)', 'important');
                        Logger.log(`  ✅ Stat ${index + 1}: Texte counter violet PixShare`);
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

                    Logger.log(`  ✅ Stat ${index + 1}: Texte label blanc`);
                }

                // Forcer opacity à 0 initialement
                item.style.setProperty('opacity', '0', 'important');
                item.style.setProperty('transform', 'translateY(30px) scale(0.8)', 'important');

                // Animation avec délai progressif
                setTimeout(() => {
                    item.style.setProperty('opacity', '1', 'important');
                    item.style.setProperty('transform', 'translateY(0) scale(1)', 'important');

                    Logger.log(`  🎬 Stat ${index + 1}: Animation déclenchée - opacity devrait être 1`);

                    // Vérifier la position réelle calculée
                    const rect = item.getBoundingClientRect();
                    Logger.log(`  📍 Stat ${index + 1}: Position réelle - top:${Math.round(rect.top)}px, left:${Math.round(rect.left)}px, width:${Math.round(rect.width)}px, height:${Math.round(rect.height)}px`);
                    Logger.log(`  👁️ Stat ${index + 1}: Visible dans viewport? ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth ? 'OUI' : 'NON'}`);

                    // Animer le compteur
                    const counter = item.querySelector('.stat-counter');
                    if (counter) {
                        animateCounter(counter);
                    }
                }, index * 150);
            });
        }

        Logger.log(`✅ Stats animées: ${sectionName.toUpperCase()}`);
    }

    // Animation de compteur
    function animateCounter(element) {
        // Lire la valeur cible depuis l'attribut data-target
        const target = parseFloat(element.getAttribute('data-target'));
        if (isNaN(target)) return;

        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        // Vérifier si la valeur cible a une décimale
        const hasDecimal = target % 1 !== 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = hasDecimal ? target.toFixed(1) : target;
                clearInterval(timer);
            } else {
                element.textContent = hasDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, 16);
    }

    Logger.log('✅ Section Animations - IntersectionObserver actif');
}

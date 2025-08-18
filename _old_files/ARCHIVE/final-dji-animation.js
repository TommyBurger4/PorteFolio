// ANIMATION FINALE DJI - AVEC STATS GARANTIES

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Final DJI Animation initialized');
    
    // Supprimer les anciens éléments
    document.querySelectorAll('.animation-wrapper, .creno-wrapper, .pixshare-wrapper').forEach(el => el.remove());
    
    // Configuration
    const sections = [
        { name: 'creno', color: '#ffc605' },
        { name: 'pixshare', color: '#9333ea' }
    ];
    
    sections.forEach(config => {
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) return;
        
        const elements = {
            container,
            sticky: container.querySelector('.animation-sticky-section'),
            logo: container.querySelector(`.${config.name}-logo-zoom`),
            stats: container.querySelector(`.${config.name}-stats-container`),
            statItems: container.querySelectorAll(`.${config.name}-stat-item`),
            text: container.querySelector(`.${config.name}-text-content`)
        };
        
        // Vérifier que les éléments existent
        if (!elements.logo || !elements.stats || !elements.sticky) {
            console.error(`Éléments manquants pour ${config.name}`);
            return;
        }
        
        console.log(`✅ ${config.name} - Configuration OK`);
        console.log(`  - Stats trouvées: ${elements.statItems.length} items`);
        
        // État initial
        if (elements.text) {
            elements.text.style.display = 'block';
            elements.text.style.opacity = '1';
            elements.text.style.transform = 'translateX(-50%)';
        }
        
        elements.logo.style.transform = 'translate(-50%, -50%) scale(1)';
        elements.stats.style.display = 'none';
        elements.stats.style.opacity = '0';
        
        // État
        let state = {
            hasTriggered: false,
            animationStarted: false,
            statsShown: false,
            blockEndTime: 0
        };
        
        // Animation principale
        const updateAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Centre du logo
            const logoCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = logoCenter - viewportCenter;
            
            // Progress
            const scrollProgress = -rect.top / (rect.height - viewportHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // DÉCLENCHEMENT au centre
            if (Math.abs(distanceFromCenter) < 60 && !state.hasTriggered && clampedProgress > 0.1) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT AU CENTRE!`);
                state.hasTriggered = true;
                state.blockEndTime = Date.now() + 1800; // Bloquer 1.8s
                
                // Démarrer l'animation immédiatement
                setTimeout(() => {
                    state.animationStarted = true;
                    console.log(`🚀 ${config.name} - Animation démarrée`);
                }, 100);
            }
            
            // Si déclenché, gérer l'animation
            if (state.hasTriggered) {
                // Bloquer le scroll si nécessaire
                if (Date.now() < state.blockEndTime) {
                    blockScroll();
                }
                
                // Animation progressive
                if (state.animationStarted) {
                    const animProgress = Math.min(1, (clampedProgress - 0.2) / 0.5);
                    
                    // Phase 1: Texte disparaît (0-30%)
                    if (elements.text && animProgress < 0.5) {
                        const textOpacity = 1 - (animProgress * 2);
                        elements.text.style.opacity = textOpacity;
                        elements.text.style.transform = `translate(-50%, ${animProgress * -60}px)`;
                    }
                    
                    // Phase 2: Logo zoom (0-70%)
                    const zoomProgress = Math.min(1, animProgress / 0.7);
                    const scale = 1 + (zoomProgress * 2.2); // 1 à 3.2
                    const translateY = zoomProgress * -50;
                    elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
                    
                    // Phase 3: Stats (après 35%)
                    if (animProgress > 0.35 && !state.statsShown) {
                        state.statsShown = true;
                        showStats();
                    }
                }
            }
            
            // Reset si on s'éloigne
            if (rect.bottom < -400 || rect.top > viewportHeight + 400) {
                if (state.hasTriggered) {
                    resetAnimation();
                }
            }
            
            // Debug
            updateDebug(config.name, clampedProgress, distanceFromCenter, state);
        };
        
        // Afficher les stats avec garantie
        const showStats = () => {
            console.log(`📊 ${config.name} - AFFICHAGE DES STATS!`);
            
            // Forcer l'affichage
            elements.stats.style.cssText = `
                display: block !important;
                opacity: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-width: 1000px;
                height: 80vh;
                z-index: 30;
                pointer-events: none;
            `;
            
            // Forcer le reflow
            elements.stats.offsetHeight;
            
            // Animer l'apparition
            requestAnimationFrame(() => {
                elements.stats.style.transition = 'opacity 0.6s ease-out';
                elements.stats.style.opacity = '1';
                
                // Animer chaque stat individuellement
                elements.statItems.forEach((stat, index) => {
                    console.log(`  - Animation stat ${index + 1}`);
                    
                    setTimeout(() => {
                        stat.style.cssText += `
                            opacity: 1 !important;
                            transform: translateY(0) scale(1) !important;
                            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                        `;
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && !stat.dataset.animated) {
                            stat.dataset.animated = 'true';
                            const target = parseInt(counter.dataset.target) || 0;
                            console.log(`    - Compteur: ${target}`);
                            animateCounter(counter, target);
                        }
                    }, index * 180);
                });
            });
        };
        
        // Bloquer le scroll
        const blockScroll = () => {
            const handleWheel = (e) => {
                e.preventDefault();
                // Très lent: 8% de la vitesse
                window.scrollBy(0, e.deltaY * 0.08);
            };
            
            window.addEventListener('wheel', handleWheel, { passive: false });
            
            setTimeout(() => {
                window.removeEventListener('wheel', handleWheel);
            }, 50);
        };
        
        // Reset
        const resetAnimation = () => {
            console.log(`🔄 Reset ${config.name}`);
            
            state.hasTriggered = false;
            state.animationStarted = false;
            state.statsShown = false;
            state.blockEndTime = 0;
            
            if (elements.text) {
                elements.text.style.opacity = '1';
                elements.text.style.transform = 'translate(-50%, 0)';
            }
            
            elements.logo.style.transform = 'translate(-50%, -50%) scale(1)';
            
            elements.stats.style.opacity = '0';
            setTimeout(() => {
                elements.stats.style.display = 'none';
            }, 300);
            
            elements.statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(30px) scale(0.8)';
                delete stat.dataset.animated;
                const counter = stat.querySelector('.stat-counter');
                if (counter) counter.textContent = '0';
            });
        };
        
        // Animation des compteurs
        const animateCounter = (element, target) => {
            const duration = 1800;
            const startTime = performance.now();
            
            const update = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                const current = Math.floor(target * easeProgress);
                
                if (target > 10000) {
                    element.textContent = (current / 1000).toFixed(1) + 'K';
                } else if (target > 1000) {
                    element.textContent = current.toLocaleString('fr-FR');
                } else {
                    element.textContent = current + '+';
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        };
        
        // Debug visuel
        const updateDebug = (name, progress, distance, state) => {
            let debugEl = document.querySelector(`.debug-${name}`);
            if (!debugEl) {
                debugEl = document.createElement('div');
                debugEl.className = `debug-${name}`;
                debugEl.style.cssText = `
                    position: fixed;
                    ${name === 'creno' ? 'top: 10px' : 'top: 110px'};
                    right: 10px;
                    background: ${config.color};
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 11px;
                    z-index: 9999;
                    font-family: monospace;
                    min-width: 220px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                `;
                document.body.appendChild(debugEl);
            }
            
            const isBlocking = Date.now() < state.blockEndTime;
            const status = !state.hasTriggered ? 'En attente' :
                          isBlocking ? '⏸️ BLOCAGE' :
                          state.statsShown ? '✅ Stats affichées' :
                          state.animationStarted ? '▶️ Animation' : '⏳ Préparation';
            
            debugEl.innerHTML = `
                <strong>${name.toUpperCase()}</strong><br>
                <hr style="margin: 4px 0; opacity: 0.3;">
                Progress: ${Math.round(progress * 100)}%<br>
                Centre: ${Math.round(distance)}px<br>
                Status: <strong>${status}</strong><br>
                Stats: ${state.statsShown ? 'OUI' : 'NON'}
            `;
            
            // Couleur selon l'état
            if (isBlocking) {
                debugEl.style.background = '#e74c3c';
                debugEl.style.transform = 'scale(1.05)';
            } else if (Math.abs(distance) < 60) {
                debugEl.style.background = '#27ae60';
                debugEl.style.transform = 'scale(1)';
            } else {
                debugEl.style.background = config.color;
                debugEl.style.transform = 'scale(1)';
            }
        };
        
        // Écouter le scroll
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Check initial
        setTimeout(updateAnimation, 100);
    });
    
    console.log('✅ Final DJI Animation ready');
});
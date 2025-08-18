// ANIMATION 3 PHASES CORRIGÉE - CENTRAGE ET BLOCAGE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Fixed Three-Phase Animation initialized');
    
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
        
        console.log(`✅ ${config.name} - Tous les éléments trouvés`);
        console.log(`  - Logo: ${elements.logo ? 'OK' : 'MANQUANT'}`);
        console.log(`  - Stats: ${elements.stats ? 'OK' : 'MANQUANT'}`);
        console.log(`  - Text: ${elements.text ? 'OK' : 'MANQUANT'}`);
        console.log(`  - Sticky: ${elements.sticky ? 'OK' : 'MANQUANT'}`);
        
        // État initial - CENTRAGE CORRECT
        if (elements.text) {
            elements.text.style.cssText = `
                display: block !important;
                opacity: 1 !important;
                transform: translateY(0) !important;
                position: absolute;
                bottom: 10%;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                z-index: 10;
            `;
        }
        
        // Logo centré
        elements.logo.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
            transition: transform 0.3s ease-out;
            z-index: 20;
        `;
        
        // Stats cachées mais positionnées
        elements.stats.style.cssText = `
            display: none;
            opacity: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            max-width: 1000px;
            height: 80vh;
            z-index: 30;
        `;
        
        // État de l'animation
        let state = {
            hasTriggered: false,
            isBlocking: false,
            blockStartTime: 0
        };
        
        // Animation basée sur la position de scroll
        const updateAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Position du centre du logo par rapport au viewport
            const logoCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = logoCenter - viewportCenter;
            
            // Calculer le progress dans la section
            const scrollProgress = -rect.top / (rect.height - viewportHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // Log détaillé
            console.log(`📊 ${config.name} Progress: ${Math.round(clampedProgress * 100)}% | Distance du centre: ${Math.round(distanceFromCenter)}px`);
            
            // DÉCLENCHEMENT: Quand le logo arrive au centre de l'écran
            if (Math.abs(distanceFromCenter) < 100 && !state.hasTriggered && clampedProgress > 0.2) {
                console.log(`🎯 ${config.name} - CENTRE ATTEINT! Déclenchement de l'animation`);
                state.hasTriggered = true;
                state.isBlocking = true;
                state.blockStartTime = Date.now();
            }
            
            // Si on a déclenché, gérer le blocage
            if (state.isBlocking) {
                const blockDuration = Date.now() - state.blockStartTime;
                
                if (blockDuration < 2000) { // Bloquer pendant 2 secondes
                    // Ralentir fortement le scroll
                    const event = new Event('blockScroll');
                    event.factor = 0.1; // 10% de la vitesse normale
                    window.dispatchEvent(event);
                } else {
                    state.isBlocking = false;
                }
            }
            
            // 3 PHASES D'ANIMATION:
            if (state.hasTriggered) {
                const animProgress = Math.min(1, (clampedProgress - 0.3) / 0.4);
                
                // PHASE 1: Texte disparaît
                if (elements.text && animProgress < 0.5) {
                    const textOpacity = 1 - (animProgress * 2);
                    elements.text.style.opacity = textOpacity;
                    elements.text.style.transform = `translate(-50%, ${animProgress * -100}px)`;
                }
                
                // PHASE 2: Logo zoom
                const logoScale = 1 + (animProgress * 2); // 1 à 3
                const logoY = animProgress * -50;
                elements.logo.style.transform = `translate(-50%, calc(-50% + ${logoY}px)) scale(${logoScale})`;
                
                // PHASE 3: Stats apparaissent (après 40% du progress)
                if (animProgress > 0.4) {
                    if (elements.stats.style.display === 'none') {
                        console.log(`📊 ${config.name} - Affichage des stats`);
                        elements.stats.style.display = 'block';
                        
                        // Forcer le reflow
                        elements.stats.offsetHeight;
                        
                        setTimeout(() => {
                            elements.stats.style.opacity = '1';
                            
                            // Animer chaque stat
                            elements.statItems.forEach((stat, index) => {
                                setTimeout(() => {
                                    stat.style.opacity = '1';
                                    stat.style.transform = 'translateY(0) scale(1)';
                                    
                                    // Animer le compteur
                                    const counter = stat.querySelector('.stat-counter');
                                    if (counter && !stat.dataset.animated) {
                                        stat.dataset.animated = 'true';
                                        const target = parseInt(counter.dataset.target) || 0;
                                        animateCounter(counter, target);
                                    }
                                }, index * 150);
                            });
                        }, 100);
                    }
                }
            }
            
            // Reset si on s'éloigne trop
            if (rect.bottom < -500 || rect.top > viewportHeight + 500) {
                if (state.hasTriggered) {
                    resetAnimation();
                    state.hasTriggered = false;
                    state.isBlocking = false;
                }
            }
            
            // Debug visuel
            updateDebug(config.name, clampedProgress, distanceFromCenter);
        };
        
        // Reset de l'animation
        const resetAnimation = () => {
            console.log(`🔄 Reset ${config.name}`);
            
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
            const duration = 1500;
            const startTime = performance.now();
            
            const update = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const current = Math.floor(target * progress);
                
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
        
        // Debug amélioré
        const updateDebug = (name, progress, distance) => {
            let debugEl = document.querySelector(`.debug-${name}`);
            if (!debugEl) {
                debugEl = document.createElement('div');
                debugEl.className = `debug-${name}`;
                debugEl.style.cssText = `
                    position: fixed;
                    ${name === 'creno' ? 'top: 10px' : 'top: 80px'};
                    right: 10px;
                    background: ${config.color};
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 11px;
                    z-index: 9999;
                    font-family: monospace;
                    min-width: 180px;
                `;
                document.body.appendChild(debugEl);
            }
            
            const phase = !state.hasTriggered ? 'En attente' :
                         state.isBlocking ? 'BLOCAGE' :
                         progress < 0.5 ? 'Animation' : 'Stats';
            
            debugEl.innerHTML = `
                <strong>${name.toUpperCase()}</strong><br>
                Progress: ${Math.round(progress * 100)}%<br>
                Distance: ${Math.round(distance)}px<br>
                Phase: <strong>${phase}</strong><br>
                Triggered: ${state.hasTriggered ? '✅' : '❌'}
            `;
            
            // Couleur selon l'état
            if (state.isBlocking) {
                debugEl.style.background = '#ff0000';
            } else if (Math.abs(distance) < 100) {
                debugEl.style.background = '#00ff00';
            } else {
                debugEl.style.background = config.color;
            }
        };
        
        // Gestion du blocage scroll
        window.addEventListener('blockScroll', (e) => {
            if (state.isBlocking) {
                const handleWheel = (event) => {
                    event.preventDefault();
                    window.scrollBy(0, event.deltaY * e.factor);
                };
                
                window.addEventListener('wheel', handleWheel, { passive: false });
                
                setTimeout(() => {
                    window.removeEventListener('wheel', handleWheel);
                }, 100);
            }
        });
        
        // Écouter le scroll avec throttle
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
        
        // Animation initiale
        setTimeout(() => {
            updateAnimation();
        }, 100);
    });
    
    console.log('✅ Fixed Three-Phase Animation ready');
});
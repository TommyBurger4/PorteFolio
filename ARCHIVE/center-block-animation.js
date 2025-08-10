// ANIMATION AVEC BLOCAGE AU CENTRE - VERSION CORRIGÉE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Center Block Animation initialized');
    
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
        
        // État initial - Tout visible et centré
        if (elements.text) {
            elements.text.style.display = 'block';
            elements.text.style.opacity = '1';
            elements.text.style.transform = 'translateX(-50%)';
        }
        
        elements.logo.style.transform = 'translate(-50%, -50%) scale(1)';
        elements.stats.style.display = 'none';
        elements.stats.style.opacity = '0';
        
        // État de l'animation
        let state = {
            hasTriggered: false,
            isBlocking: false,
            animationProgress: 0
        };
        
        // Fonction principale
        const updateAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Centre du logo
            const logoCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = logoCenter - viewportCenter;
            
            // Progress dans la section
            const scrollProgress = -rect.top / (rect.height - viewportHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // DÉCLENCHEMENT: Logo au centre (±80px)
            if (Math.abs(distanceFromCenter) < 80 && !state.hasTriggered) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT! Centre atteint`);
                state.hasTriggered = true;
                state.isBlocking = true;
                
                // Commencer l'animation immédiatement
                startAnimation();
            }
            
            // Si déclenché, continuer l'animation
            if (state.hasTriggered) {
                // Calculer le progress de l'animation
                const animStart = 0.2;
                const animEnd = 0.7;
                state.animationProgress = Math.max(0, Math.min(1, (clampedProgress - animStart) / (animEnd - animStart)));
                
                updateAnimationPhases(state.animationProgress);
            }
            
            // Reset si on s'éloigne
            if (rect.bottom < -300 || rect.top > viewportHeight + 300) {
                if (state.hasTriggered) {
                    resetAnimation();
                }
            }
            
            // Debug
            updateDebug(config.name, clampedProgress, distanceFromCenter, state);
        };
        
        // Démarrer l'animation
        const startAnimation = () => {
            console.log(`🚀 ${config.name} - Animation démarrée`);
            
            // Bloquer le scroll pendant 1.5 secondes
            blockScroll(1500);
        };
        
        // Mise à jour des phases d'animation
        const updateAnimationPhases = (progress) => {
            // Phase 1 (0-40%): Texte disparaît
            if (elements.text) {
                const textProgress = Math.min(1, progress / 0.4);
                elements.text.style.opacity = 1 - textProgress;
                elements.text.style.transform = `translate(-50%, ${textProgress * -50}px)`;
            }
            
            // Phase 2 (0-70%): Logo zoom
            const zoomProgress = Math.min(1, progress / 0.7);
            const scale = 1 + (zoomProgress * 2); // 1 à 3
            const translateY = zoomProgress * -40;
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
            
            // Phase 3 (40-100%): Stats apparaissent
            if (progress > 0.4 && elements.stats.style.display === 'none') {
                console.log(`📊 ${config.name} - Affichage des stats`);
                elements.stats.style.display = 'block';
                
                setTimeout(() => {
                    elements.stats.style.opacity = '1';
                    
                    // Animer chaque stat
                    elements.statItems.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0) scale(1)';
                            
                            // Compteur
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
        };
        
        // Bloquer le scroll temporairement
        const blockScroll = (duration) => {
            if (state.isBlocking) {
                const startTime = Date.now();
                
                const handleWheel = (e) => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed < duration) {
                        e.preventDefault();
                        // Ralentir à 15% de la vitesse
                        window.scrollBy(0, e.deltaY * 0.15);
                    } else {
                        window.removeEventListener('wheel', handleWheel);
                        state.isBlocking = false;
                    }
                };
                
                window.addEventListener('wheel', handleWheel, { passive: false });
                
                // Sécurité
                setTimeout(() => {
                    window.removeEventListener('wheel', handleWheel);
                    state.isBlocking = false;
                }, duration);
            }
        };
        
        // Reset animation
        const resetAnimation = () => {
            console.log(`🔄 Reset ${config.name}`);
            
            state.hasTriggered = false;
            state.isBlocking = false;
            state.animationProgress = 0;
            
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
        
        // Debug visuel amélioré
        const updateDebug = (name, progress, distance, state) => {
            let debugEl = document.querySelector(`.debug-${name}`);
            if (!debugEl) {
                debugEl = document.createElement('div');
                debugEl.className = `debug-${name}`;
                debugEl.style.cssText = `
                    position: fixed;
                    ${name === 'creno' ? 'top: 10px' : 'top: 100px'};
                    right: 10px;
                    background: ${config.color};
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 11px;
                    z-index: 9999;
                    font-family: monospace;
                    min-width: 200px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                `;
                document.body.appendChild(debugEl);
            }
            
            const status = !state.hasTriggered ? 'En attente' :
                          state.isBlocking ? 'BLOCAGE' :
                          state.animationProgress > 0.4 ? 'Stats' : 'Animation';
            
            debugEl.innerHTML = `
                <strong>${name.toUpperCase()}</strong><br>
                Section: ${Math.round(progress * 100)}%<br>
                Centre: ${Math.round(distance)}px<br>
                Status: <strong>${status}</strong><br>
                Anim: ${Math.round(state.animationProgress * 100)}%
            `;
            
            // Couleur selon l'état
            if (state.isBlocking) {
                debugEl.style.background = '#ff0000';
                debugEl.style.animation = 'pulse 0.5s infinite';
            } else if (Math.abs(distance) < 80) {
                debugEl.style.background = '#00ff00';
                debugEl.style.animation = 'none';
            } else {
                debugEl.style.background = config.color;
                debugEl.style.animation = 'none';
            }
        };
        
        // Style pour l'animation pulse
        if (!document.querySelector('#pulse-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-style';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
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
        setTimeout(() => {
            updateAnimation();
        }, 100);
    });
    
    console.log('✅ Center Block Animation ready');
});
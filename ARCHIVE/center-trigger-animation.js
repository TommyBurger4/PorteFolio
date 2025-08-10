// ANIMATION DÉCLENCHÉE AU CENTRE DE L'ÉCRAN

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Center-triggered Animation initialized');
    
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
        
        let state = {
            hasTriggered: false,
            isAnimating: false,
            scrollLocked: false
        };
        
        // Fonction principale de vérification
        const checkAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            
            // Position du logo par rapport au viewport
            const logoCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = logoCenter - viewportCenter;
            
            // Debug visuel
            updateDebug(config.name, distanceFromCenter);
            
            // DÉCLENCHEMENT : Logo exactement au centre (±50px)
            if (Math.abs(distanceFromCenter) < 50 && !state.hasTriggered) {
                console.log(`🎯 ${config.name} AU CENTRE ! Déclenchement de l'animation`);
                state.hasTriggered = true;
                triggerAnimation();
            }
            
            // Si on a déclenché, continuer l'animation basée sur le scroll
            if (state.hasTriggered && !state.isAnimating) {
                const progress = calculateProgress(rect);
                updateAnimation(progress);
            }
            
            // Reset si on s'éloigne beaucoup
            if (rect.bottom < -500 || rect.top > window.innerHeight + 500) {
                if (state.hasTriggered) {
                    resetAnimation();
                }
            }
        };
        
        // Calcul du progrès dans la section
        const calculateProgress = (rect) => {
            const scrolledInSection = -rect.top;
            const sectionHeight = rect.height;
            // Progress de 0 à 1 sur la moitié de la hauteur de la section
            return Math.max(0, Math.min(1, scrolledInSection / (sectionHeight * 0.4)));
        };
        
        // Déclencher l'animation initiale
        const triggerAnimation = () => {
            state.isAnimating = true;
            
            // Phase 1: Fade out du texte immédiatement
            if (elements.text) {
                elements.text.style.transition = 'all 0.8s ease-out';
                elements.text.style.opacity = '0';
                elements.text.style.transform = 'translateY(-30px)';
            }
            
            // Phase 2: Commencer le zoom du logo
            if (elements.logo) {
                elements.logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
            
            // Ralentir le scroll
            slowDownScroll();
        };
        
        // Mise à jour continue de l'animation
        const updateAnimation = (progress) => {
            // Zoom du logo (0 à 70% du progress)
            if (progress <= 0.7) {
                const zoomProgress = progress / 0.7;
                const scale = 1 + (zoomProgress * 1.8); // 1 à 2.8
                const translateY = zoomProgress * -40;
                if (elements.logo) {
                    elements.logo.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                }
            }
            
            // Apparition des stats (50% à 100%)
            if (progress > 0.5 && !elements.stats.dataset.visible) {
                showStats();
            }
        };
        
        // Afficher les statistiques
        const showStats = () => {
            elements.stats.dataset.visible = 'true';
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
                            animateCounter(counter, parseInt(counter.dataset.target) || 0);
                        }
                    }, index * 150);
                });
            }, 100);
        };
        
        // Ralentir le scroll temporairement
        const slowDownScroll = () => {
            if (state.scrollLocked) return;
            state.scrollLocked = true;
            
            let duration = 2000; // 2 secondes
            const startTime = Date.now();
            
            const handleWheel = (e) => {
                const elapsed = Date.now() - startTime;
                if (elapsed < duration) {
                    e.preventDefault();
                    // Réduire la vitesse à 20%
                    window.scrollBy(0, e.deltaY * 0.2);
                } else {
                    window.removeEventListener('wheel', handleWheel);
                    state.scrollLocked = false;
                    state.isAnimating = false;
                }
            };
            
            window.addEventListener('wheel', handleWheel, { passive: false });
            
            // Timeout de sécurité
            setTimeout(() => {
                window.removeEventListener('wheel', handleWheel);
                state.scrollLocked = false;
                state.isAnimating = false;
            }, duration);
        };
        
        // Reset complet
        const resetAnimation = () => {
            console.log(`🔄 Reset ${config.name}`);
            state.hasTriggered = false;
            state.isAnimating = false;
            
            if (elements.logo) {
                elements.logo.style.transform = 'scale(1) translateY(0)';
            }
            if (elements.text) {
                elements.text.style.opacity = '1';
                elements.text.style.transform = 'translateY(0)';
            }
            if (elements.stats) {
                elements.stats.style.opacity = '0';
                elements.stats.dataset.visible = '';
                setTimeout(() => {
                    elements.stats.style.display = 'none';
                }, 300);
            }
            
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
        
        // Debug visuel
        const updateDebug = (name, distance) => {
            let debugEl = document.querySelector(`.debug-${name}`);
            if (!debugEl) {
                debugEl = document.createElement('div');
                debugEl.className = `debug-${name}`;
                debugEl.style.cssText = `
                    position: fixed;
                    ${name === 'creno' ? 'top: 10px' : 'top: 50px'};
                    right: 10px;
                    background: ${config.color};
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    z-index: 9999;
                `;
                document.body.appendChild(debugEl);
            }
            
            debugEl.textContent = `${name.toUpperCase()}: ${Math.round(distance)}px du centre`;
            debugEl.style.background = Math.abs(distance) < 50 ? '#00ff00' : config.color;
        };
        
        // Écouter le scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Vérification initiale
        checkAnimation();
    });
});
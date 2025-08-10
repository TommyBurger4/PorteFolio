// ANIMATION CORRIGÉE - PAS DE BLOCAGE + STATS VISIBLES

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Fixed Center Animation initialized');
    
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
        if (!elements.logo || !elements.stats) {
            console.error(`Éléments manquants pour ${config.name}`);
            return;
        }
        
        let state = {
            hasTriggered: false,
            animationProgress: 0
        };
        
        // S'assurer que les stats sont cachées au départ
        elements.stats.style.display = 'none';
        elements.stats.style.opacity = '0';
        
        // Fonction principale
        const checkAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            
            // Position du centre
            const logoCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = logoCenter - viewportCenter;
            
            // Debug
            updateDebug(config.name, distanceFromCenter);
            
            // Si la section est visible
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Déclenchement au centre
                if (Math.abs(distanceFromCenter) < 100 && !state.hasTriggered) {
                    console.log(`🎯 ${config.name} - Animation déclenchée`);
                    state.hasTriggered = true;
                }
                
                // Si déclenché, calculer le progress
                if (state.hasTriggered) {
                    // Progress basé sur le scroll dans la section
                    const scrolledInSection = Math.max(0, -rect.top);
                    const maxScroll = rect.height - window.innerHeight;
                    state.animationProgress = Math.min(1, scrolledInSection / (maxScroll * 0.6));
                    
                    updateAnimation(state.animationProgress);
                }
            } else {
                // Reset si on sort complètement
                if (rect.bottom < -300 || rect.top > window.innerHeight + 300) {
                    if (state.hasTriggered) {
                        resetAnimation();
                        state.hasTriggered = false;
                        state.animationProgress = 0;
                    }
                }
            }
        };
        
        // Mise à jour de l'animation
        const updateAnimation = (progress) => {
            console.log(`Animation ${config.name} progress: ${Math.round(progress * 100)}%`);
            
            // Phase 1: Texte disparaît (0-30%)
            if (elements.text) {
                const textOpacity = Math.max(0, 1 - (progress / 0.3));
                elements.text.style.opacity = textOpacity;
                elements.text.style.transform = `translateY(${progress * -30}px)`;
            }
            
            // Phase 2: Logo zoom (0-60%)
            if (progress <= 0.6) {
                const zoomProgress = progress / 0.6;
                const scale = 1 + (zoomProgress * 1.5); // 1 à 2.5
                const translateY = zoomProgress * -30;
                elements.logo.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            }
            
            // Phase 3: Stats apparaissent (40-100%)
            if (progress > 0.4) {
                // Afficher le container si pas déjà fait
                if (elements.stats.style.display === 'none') {
                    console.log(`Affichage des stats ${config.name}`);
                    elements.stats.style.display = 'block';
                    
                    // Forcer le reflow
                    elements.stats.offsetHeight;
                    
                    // Puis animer l'opacité
                    setTimeout(() => {
                        elements.stats.style.transition = 'opacity 0.6s ease-out';
                        elements.stats.style.opacity = '1';
                    }, 50);
                }
                
                // Animer chaque stat individuellement
                const statsProgress = (progress - 0.4) / 0.6;
                elements.statItems.forEach((stat, index) => {
                    const delay = index * 0.15;
                    const itemProgress = Math.max(0, Math.min(1, (statsProgress - delay) / (1 - delay)));
                    
                    stat.style.opacity = itemProgress;
                    stat.style.transform = `translateY(${(1 - itemProgress) * 30}px) scale(${0.8 + itemProgress * 0.2})`;
                    
                    // Animer le compteur
                    if (itemProgress > 0.5 && !stat.dataset.animated) {
                        stat.dataset.animated = 'true';
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            animateCounter(counter, parseInt(counter.dataset.target) || 0);
                        }
                    }
                });
            }
            
            // Ralentir légèrement le scroll pendant l'animation principale (optionnel)
            if (progress > 0.2 && progress < 0.8) {
                // Petit ralentissement sans bloquer
                slowScroll(0.7); // 70% de la vitesse normale
            }
        };
        
        // Reset
        const resetAnimation = () => {
            console.log(`Reset ${config.name}`);
            
            elements.logo.style.transform = 'scale(1) translateY(0)';
            
            if (elements.text) {
                elements.text.style.opacity = '1';
                elements.text.style.transform = 'translateY(0)';
            }
            
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
        
        // Ralentissement doux du scroll (sans bloquer)
        let slowTimeout;
        const slowScroll = (factor) => {
            if (slowTimeout) return;
            
            const handleWheel = (e) => {
                e.preventDefault();
                window.scrollBy(0, e.deltaY * factor);
            };
            
            window.addEventListener('wheel', handleWheel, { passive: false });
            
            slowTimeout = setTimeout(() => {
                window.removeEventListener('wheel', handleWheel);
                slowTimeout = null;
            }, 100); // Très court pour ne pas gêner
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
        
        // Debug
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
            
            const progress = state.animationProgress;
            debugEl.innerHTML = `
                ${name.toUpperCase()}: ${Math.round(distance)}px<br>
                Progress: ${Math.round(progress * 100)}%
            `;
            debugEl.style.background = Math.abs(distance) < 100 ? '#00ff00' : config.color;
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
        
        // Check initial
        checkAnimation();
    });
    
    console.log('✅ Fixed Center Animation ready');
});
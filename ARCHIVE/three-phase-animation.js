// ANIMATION 3 PHASES - SCROLL NATUREL AVEC STATS VISIBLES

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Three-Phase Animation initialized');
    
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
        
        console.log(`✅ ${config.name} - Tous les éléments trouvés`);
        
        // État initial - IMPORTANT: rendre le texte visible
        if (elements.text) {
            elements.text.style.display = 'block';
            elements.text.style.opacity = '1';
            elements.text.style.transform = 'translateY(0)';
        }
        
        elements.stats.style.display = 'none';
        elements.stats.style.opacity = '0';
        
        elements.logo.style.transform = 'scale(1)';
        
        // Animation basée sur la position de scroll
        const updateAnimation = () => {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculer où on en est dans le scroll de cette section
            const scrollProgress = -rect.top / (rect.height - viewportHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // 3 PHASES D'ANIMATION:
            
            // PHASE 1 (0-30%): Entrée - le texte reste visible
            if (clampedProgress < 0.3) {
                const phase1Progress = clampedProgress / 0.3;
                
                // Le texte reste complètement visible
                if (elements.text) {
                    elements.text.style.opacity = '1';
                    elements.text.style.transform = 'translateY(0)';
                }
                
                // Logo commence légèrement à grossir
                const logoScale = 1 + (phase1Progress * 0.2); // 1 à 1.2
                elements.logo.style.transform = `scale(${logoScale})`;
                
                // Stats restent cachées
                elements.stats.style.display = 'none';
            }
            
            // PHASE 2 (30-70%): Centre - animation principale
            else if (clampedProgress >= 0.3 && clampedProgress < 0.7) {
                const phase2Progress = (clampedProgress - 0.3) / 0.4;
                
                // Texte disparaît progressivement
                if (elements.text) {
                    const textOpacity = 1 - phase2Progress;
                    elements.text.style.opacity = textOpacity;
                    elements.text.style.transform = `translateY(${phase2Progress * -50}px)`;
                }
                
                // Logo zoom important
                const logoScale = 1.2 + (phase2Progress * 1.3); // 1.2 à 2.5
                elements.logo.style.transform = `scale(${logoScale}) translateY(${phase2Progress * -30}px)`;
                
                // Stats apparaissent à partir de 50%
                if (phase2Progress > 0.5) {
                    if (elements.stats.style.display === 'none') {
                        console.log(`📊 ${config.name} - Affichage des stats`);
                        elements.stats.style.display = 'block';
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
                        }, 50);
                    }
                }
            }
            
            // PHASE 3 (70-100%): Sortie - tout reste visible
            else {
                // Maintenir l'état final
                if (elements.text) {
                    elements.text.style.opacity = '0';
                    elements.text.style.transform = 'translateY(-50px)';
                }
                
                elements.logo.style.transform = 'scale(2.5) translateY(-30px)';
                
                if (elements.stats.style.display === 'none') {
                    elements.stats.style.display = 'block';
                    elements.stats.style.opacity = '1';
                }
            }
            
            // Debug visuel
            updateDebug(config.name, clampedProgress);
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
        const updateDebug = (name, progress) => {
            let debugEl = document.querySelector(`.debug-${name}`);
            if (!debugEl) {
                debugEl = document.createElement('div');
                debugEl.className = `debug-${name}`;
                debugEl.style.cssText = `
                    position: fixed;
                    ${name === 'creno' ? 'top: 10px' : 'top: 60px'};
                    right: 10px;
                    background: ${config.color};
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    z-index: 9999;
                    font-family: monospace;
                `;
                document.body.appendChild(debugEl);
            }
            
            const phase = progress < 0.3 ? 'Montée' : 
                         progress < 0.7 ? 'Centre' : 'Descente';
            
            debugEl.innerHTML = `
                ${name.toUpperCase()}<br>
                Progress: ${Math.round(progress * 100)}%<br>
                Phase: ${phase}
            `;
        };
        
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
        updateAnimation();
    });
    
    console.log('✅ Three-Phase Animation ready - Scroll naturel préservé');
});
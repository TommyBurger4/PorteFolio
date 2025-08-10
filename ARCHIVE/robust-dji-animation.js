// ANIMATION DJI ROBUSTE - VERSION GARANTIE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Robust DJI Animation initialized');
    
    // Configuration
    const sections = [
        { name: 'creno', color: '#ffc605' },
        { name: 'pixshare', color: '#9333ea' }
    ];
    
    sections.forEach(config => {
        console.log(`📋 Configuration ${config.name}...`);
        
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) {
            console.error(`❌ Container ${config.name} non trouvé`);
            return;
        }
        
        const elements = {
            container,
            sticky: container.querySelector('.animation-sticky-section'),
            logo: container.querySelector(`.${config.name}-logo-zoom`),
            stats: container.querySelector(`.${config.name}-stats-container`),
            statItems: container.querySelectorAll(`.${config.name}-stat-item`),
            text: container.querySelector(`.${config.name}-text-content`)
        };
        
        console.log(`✅ ${config.name} trouvé:`, {
            logo: !!elements.logo,
            stats: !!elements.stats,
            text: !!elements.text,
            statItems: elements.statItems.length
        });
        
        if (!elements.logo || !elements.stats) {
            console.error(`❌ Éléments manquants pour ${config.name}`);
            return;
        }
        
        // État
        let state = {
            triggered: false,
            statsShown: false
        };
        
        // Fonction principale
        const checkScroll = () => {
            const rect = container.getBoundingClientRect();
            const sticky = elements.sticky.getBoundingClientRect();
            
            // Position du centre
            const stickyCenter = sticky.top + (sticky.height / 2);
            const viewportCenter = window.innerHeight / 2;
            const distance = Math.abs(stickyCenter - viewportCenter);
            
            // Progress dans la section
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            
            // DÉCLENCHEMENT simple : proche du centre
            if (distance < 100 && !state.triggered && progress > 0.15) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT!`);
                state.triggered = true;
                startAnimation();
            }
            
            // Continuer l'animation si déclenchée
            if (state.triggered) {
                updateAnimation(progress);
            }
            
            // Debug
            updateDebug(distance, progress);
        };
        
        // Démarrer l'animation
        const startAnimation = () => {
            console.log(`🚀 ${config.name} - Animation démarrée`);
            
            // Bloquer le scroll pendant 1.5s
            let blockTime = 1500;
            let startTime = Date.now();
            
            const blockWheel = (e) => {
                if (Date.now() - startTime < blockTime) {
                    e.preventDefault();
                    window.scrollBy(0, e.deltaY * 0.1);
                } else {
                    window.removeEventListener('wheel', blockWheel);
                }
            };
            
            window.addEventListener('wheel', blockWheel, { passive: false });
            setTimeout(() => window.removeEventListener('wheel', blockWheel), blockTime);
        };
        
        // Mettre à jour l'animation
        const updateAnimation = (progress) => {
            // Calculer le progress de l'animation (commence à 20%)
            const animProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
            
            // Phase 1: Texte disparaît (0-40%)
            if (elements.text) {
                const textProgress = Math.min(1, animProgress / 0.4);
                elements.text.style.opacity = 1 - textProgress;
                elements.text.style.transform = `translate(-50%, ${textProgress * -50}px)`;
            }
            
            // Phase 2: Logo zoom (0-70%)
            const zoomProgress = Math.min(1, animProgress / 0.7);
            const scale = 1 + (zoomProgress * 2);
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${zoomProgress * -40}px)) scale(${scale})`;
            
            // Phase 3: Stats (après 40%)
            if (animProgress > 0.4 && !state.statsShown) {
                state.statsShown = true;
                showStats();
            }
        };
        
        // Afficher les stats
        const showStats = () => {
            console.log(`📊 ${config.name} - AFFICHAGE STATS`);
            
            // Forcer l'affichage
            elements.stats.style.display = 'block';
            elements.stats.style.opacity = '0';
            
            // Transition
            setTimeout(() => {
                elements.stats.style.transition = 'opacity 0.6s ease-out';
                elements.stats.style.opacity = '1';
                
                // Animer chaque stat
                elements.statItems.forEach((stat, i) => {
                    setTimeout(() => {
                        console.log(`  📈 Stat ${i + 1} animée`);
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        // Compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            animateNumber(counter, target);
                        }
                    }, i * 200);
                });
            }, 100);
        };
        
        // Animation des nombres
        const animateNumber = (el, target) => {
            const duration = 1500;
            const start = Date.now();
            
            const update = () => {
                const progress = Math.min(1, (Date.now() - start) / duration);
                const current = Math.floor(target * progress);
                
                if (target > 10000) {
                    el.textContent = (current / 1000).toFixed(1) + 'K';
                } else if (target > 1000) {
                    el.textContent = current.toLocaleString('fr-FR');
                } else {
                    el.textContent = current + '+';
                }
                
                if (progress < 1) requestAnimationFrame(update);
            };
            
            update();
        };
        
        // Debug visuel
        const updateDebug = (distance, progress) => {
            let debug = document.querySelector(`.debug-${config.name}`);
            if (!debug) {
                debug = document.createElement('div');
                debug.className = `debug-${config.name}`;
                debug.style.cssText = `
                    position: fixed;
                    ${config.name === 'creno' ? 'top: 10px' : 'top: 90px'};
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
                document.body.appendChild(debug);
            }
            
            debug.innerHTML = `
                <strong>${config.name.toUpperCase()}</strong><br>
                Distance: ${Math.round(distance)}px<br>
                Progress: ${Math.round(progress * 100)}%<br>
                Déclenché: ${state.triggered ? '✅' : '❌'}<br>
                Stats: ${state.statsShown ? '✅' : '❌'}
            `;
            
            if (distance < 100) {
                debug.style.background = '#27ae60';
            } else if (state.triggered) {
                debug.style.background = '#e74c3c';
            } else {
                debug.style.background = config.color;
            }
        };
        
        // Scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Check initial
        setTimeout(checkScroll, 100);
        
        console.log(`✅ ${config.name} configuré et prêt`);
    });
    
    console.log('✅ Robust DJI Animation ready');
});
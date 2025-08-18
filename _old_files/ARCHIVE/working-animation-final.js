// ANIMATION FINALE FONCTIONNELLE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Working Animation Final initialized');
    
    // Configuration
    const sections = [
        { name: 'creno', color: '#ffc605' },
        { name: 'pixshare', color: '#9333ea' }
    ];
    
    sections.forEach(config => {
        console.log(`📋 Setup ${config.name}...`);
        
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
        
        console.log(`✅ ${config.name} - Éléments trouvés`);
        
        // État
        let state = {
            triggered: false,
            statsShown: false,
            scrollCount: 0
        };
        
        // Créer le debug immédiatement
        const debugEl = document.createElement('div');
        debugEl.className = `debug-${config.name}`;
        debugEl.style.cssText = `
            position: fixed;
            ${config.name === 'creno' ? 'top: 10px' : 'top: 100px'};
            right: 10px;
            background: ${config.color};
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 99999;
            font-family: monospace;
            min-width: 200px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(debugEl);
        debugEl.innerHTML = `<strong>${config.name.toUpperCase()}</strong><br>En attente...`;
        
        console.log(`📊 Debug créé pour ${config.name}`);
        
        // Fonction de check
        const checkAnimation = () => {
            state.scrollCount++;
            
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            
            // Calculs
            const stickyCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = window.innerHeight / 2;
            const distance = stickyCenter - viewportCenter;
            const absDistance = Math.abs(distance);
            
            // Progress
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            
            // Log tous les 10 scrolls
            if (state.scrollCount % 10 === 0) {
                console.log(`📍 ${config.name} - Distance: ${Math.round(distance)}px, Progress: ${Math.round(progress * 100)}%`);
            }
            
            // Update debug
            debugEl.innerHTML = `
                <strong>${config.name.toUpperCase()}</strong><br>
                <hr style="margin: 4px 0; opacity: 0.3;">
                Distance: ${Math.round(distance)}px<br>
                Progress: ${Math.round(progress * 100)}%<br>
                Déclenché: ${state.triggered ? '✅' : '❌'}<br>
                Stats: ${state.statsShown ? '✅' : '❌'}
            `;
            
            // Couleur selon distance
            if (absDistance < 80) {
                debugEl.style.background = '#27ae60';
            } else if (state.triggered) {
                debugEl.style.background = '#e74c3c';
            } else {
                debugEl.style.background = config.color;
            }
            
            // DÉCLENCHEMENT
            if (absDistance < 80 && !state.triggered && progress > 0.1) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT! Distance: ${Math.round(distance)}px`);
                state.triggered = true;
                startAnimation();
            }
            
            // Continuer l'animation
            if (state.triggered) {
                const animProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
                updateAnimation(animProgress);
            }
        };
        
        // Démarrer l'animation
        const startAnimation = () => {
            console.log(`🚀 ${config.name} - Animation démarrée!`);
            
            // Bloquer le scroll
            let blockEnd = Date.now() + 1500;
            
            const blockWheel = (e) => {
                if (Date.now() < blockEnd) {
                    e.preventDefault();
                    window.scrollBy(0, e.deltaY * 0.1);
                } else {
                    window.removeEventListener('wheel', blockWheel);
                }
            };
            
            window.addEventListener('wheel', blockWheel, { passive: false });
        };
        
        // Update animation
        const updateAnimation = (animProgress) => {
            // Texte disparaît
            if (elements.text && animProgress < 0.5) {
                const textOpacity = 1 - (animProgress * 2);
                elements.text.style.opacity = textOpacity;
                elements.text.style.transform = `translate(-50%, ${animProgress * -60}px)`;
            }
            
            // Logo zoom
            const scale = 1 + (animProgress * 2.5);
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${animProgress * -40}px)) scale(${scale})`;
            
            // Stats apparaissent
            if (animProgress > 0.35 && !state.statsShown) {
                state.statsShown = true;
                showStats();
            }
        };
        
        // Montrer les stats
        const showStats = () => {
            console.log(`📊 ${config.name} - AFFICHAGE DES STATS!`);
            
            // Forcer display block
            elements.stats.style.cssText += `
                display: block !important;
                opacity: 0;
                transition: opacity 0.6s ease-out;
            `;
            
            // Opacity après un court délai
            setTimeout(() => {
                elements.stats.style.opacity = '1';
                
                // Animer chaque stat
                elements.statItems.forEach((stat, i) => {
                    setTimeout(() => {
                        console.log(`  📈 Stat ${i + 1}/${elements.statItems.length}`);
                        
                        stat.style.cssText += `
                            opacity: 1 !important;
                            transform: translateY(0) scale(1) !important;
                            transition: all 0.6s ease-out !important;
                        `;
                        
                        // Compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && !counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            const target = parseInt(counter.dataset.target) || 0;
                            animateCounter(counter, target);
                        }
                    }, i * 200);
                });
            }, 100);
        };
        
        // Animation compteur
        const animateCounter = (el, target) => {
            console.log(`    🔢 Compteur: 0 → ${target}`);
            const duration = 1800;
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
        
        // IMPORTANT: Listener scroll
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        console.log(`🎧 Scroll listener ajouté pour ${config.name}`);
        
        // Check initial
        setTimeout(() => {
            console.log(`🔍 Check initial pour ${config.name}`);
            checkAnimation();
        }, 200);
    });
    
    console.log('✅ Working Animation Final ready!');
});
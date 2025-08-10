// ANIMATION AVEC DÉCLENCHEMENT CORRIGÉ

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Fix Animation Trigger initialized');
    
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
            isBlocking: false
        };
        
        // Créer le debug
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
        
        // Fonction de check
        const checkAnimation = () => {
            const rect = container.getBoundingClientRect();
            const stickyRect = elements.sticky.getBoundingClientRect();
            
            // Calculs
            const stickyCenter = stickyRect.top + (stickyRect.height / 2);
            const viewportCenter = window.innerHeight / 2;
            const distance = stickyCenter - viewportCenter;
            const absDistance = Math.abs(distance);
            
            // Progress
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
            
            // Update debug
            debugEl.innerHTML = `
                <strong>${config.name.toUpperCase()}</strong><br>
                <hr style="margin: 4px 0; opacity: 0.3;">
                Distance: ${Math.round(distance)}px<br>
                Progress: ${Math.round(progress * 100)}%<br>
                Déclenché: ${state.triggered ? '✅' : '❌'}<br>
                Stats: ${state.statsShown ? '✅' : '❌'}<br>
                Blocage: ${state.isBlocking ? '🔒' : ''}
            `;
            
            // Couleur selon distance
            if (absDistance < 60) {
                debugEl.style.background = '#27ae60';
            } else if (state.isBlocking) {
                debugEl.style.background = '#e74c3c';
            } else {
                debugEl.style.background = config.color;
            }
            
            // DÉCLENCHEMENT CORRIGÉ - Plus sensible
            if (absDistance < 60 && !state.triggered && progress > 0.05) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT! Distance: ${Math.round(distance)}px, Progress: ${Math.round(progress * 100)}%`);
                state.triggered = true;
                triggerAnimation();
            }
            
            // Continuer l'animation
            if (state.triggered) {
                const animProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.6));
                updateAnimation(animProgress);
            }
        };
        
        // Déclencher l'animation
        const triggerAnimation = () => {
            console.log(`🚀 ${config.name} - Animation démarrée avec blocage!`);
            state.isBlocking = true;
            
            // Bloquer le scroll pendant 2 secondes
            const startTime = Date.now();
            const blockDuration = 2000;
            
            const blockWheel = (e) => {
                const elapsed = Date.now() - startTime;
                if (elapsed < blockDuration) {
                    e.preventDefault();
                    // Très lent: 5% de la vitesse
                    window.scrollBy(0, e.deltaY * 0.05);
                } else {
                    window.removeEventListener('wheel', blockWheel);
                    state.isBlocking = false;
                }
            };
            
            window.addEventListener('wheel', blockWheel, { passive: false });
            
            // Timeout de sécurité
            setTimeout(() => {
                window.removeEventListener('wheel', blockWheel);
                state.isBlocking = false;
            }, blockDuration);
        };
        
        // Update animation
        const updateAnimation = (animProgress) => {
            // Phase 1: Texte disparaît (0-40%)
            if (elements.text) {
                const textProgress = Math.min(1, animProgress / 0.4);
                elements.text.style.opacity = 1 - textProgress;
                elements.text.style.transform = `translate(-50%, ${textProgress * -60}px)`;
            }
            
            // Phase 2: Logo zoom (0-80%)
            const zoomProgress = Math.min(1, animProgress / 0.8);
            const scale = 1 + (zoomProgress * 2.5);
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${zoomProgress * -40}px)) scale(${scale})`;
            
            // Phase 3: Stats apparaissent (après 30%)
            if (animProgress > 0.3 && !state.statsShown) {
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
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 90vw !important;
                max-width: 1000px !important;
                height: 80vh !important;
                z-index: 30 !important;
                pointer-events: none !important;
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
        
        // Listener scroll
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
    
    console.log('✅ Fix Animation Trigger ready!');
});
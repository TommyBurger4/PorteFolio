// ANIMATION CONTRÔLÉE PAR LE SCROLL - LOGO RECULE ET S'ASSOMBRIT

(function() {
    console.log('🎯 Scroll Controlled Animation - Version finale');
    
    document.addEventListener('DOMContentLoaded', function() {
        const sections = [
            { name: 'creno', color: '#ffc605' },
            { name: 'pixshare', color: '#9333ea' }
        ];
        
        sections.forEach(config => {
            setupAnimation(config);
        });
    });
    
    function setupAnimation(config) {
        console.log(`📦 Configuration ${config.name}...`);
        
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
            triggered: false,
            blocking: false,
            scrollStart: 0,
            blockProgress: 0,
            animationsComplete: false
        };
        
        function checkAnimation() {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            if (!elements.logo || !elements.text) return;
            
            // Point de déclenchement
            const logoRect = elements.logo.getBoundingClientRect();
            const textRect = elements.text.getBoundingClientRect();
            const triggerPoint = (logoRect.top + logoRect.height/2 + textRect.top) / 2;
            const distance = Math.abs(triggerPoint - viewportHeight/2);
            
            // Debug proche du centre
            if (distance < 150 && !state.triggered) {
                console.log(`📏 ${config.name} - Distance: ${Math.round(distance)}px`);
            }
            
            // DÉCLENCHER LE BLOCAGE
            if (distance < 50 && !state.triggered) {
                console.log(`🎯 ${config.name} - BLOCAGE ACTIVÉ!`);
                state.triggered = true;
                state.blocking = true;
                state.scrollStart = window.scrollY;
                startScrollBlock();
            }
            
            // Si on s'éloigne trop, reset
            if (rect.bottom < -500 || rect.top > viewportHeight + 500) {
                if (state.triggered) {
                    resetAnimation();
                }
            }
        }
        
        function startScrollBlock() {
            console.log(`🔒 ${config.name} - Scroll bloqué, utilisez la molette pour progresser`);
            
            let accumulatedDelta = 0;
            const scrollSensitivity = 0.5; // Ajuster la sensibilité
            
            const handleWheel = (e) => {
                if (!state.blocking) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                // Accumuler le delta du scroll
                accumulatedDelta += e.deltaY * scrollSensitivity;
                
                // Convertir en progression (0 à 1)
                const maxScroll = 1000; // Quantité de scroll nécessaire pour compléter
                state.blockProgress = Math.max(0, Math.min(1, accumulatedDelta / maxScroll));
                
                console.log(`📊 Progress: ${Math.round(state.blockProgress * 100)}%`);
                
                // Appliquer l'animation
                applyScrollAnimation(state.blockProgress);
                
                // Ne débloquer que si toutes les animations sont terminées
                if (state.blockProgress >= 1 && !state.animationsComplete) {
                    console.log(`⏳ ${config.name} - Progress 100%, attente fin des animations...`);
                    
                    // Attendre que tous les compteurs soient terminés
                    state.animationsComplete = true;
                    setTimeout(() => {
                        console.log(`🔓 ${config.name} - Toutes animations terminées, déblocage`);
                        state.blocking = false;
                        window.removeEventListener('wheel', handleWheel);
                        window.removeEventListener('touchmove', blockOther);
                        window.removeEventListener('keydown', blockOther);
                        
                        // Débloquer le scroll natif
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                        
                        // Scroll léger pour continuer
                        setTimeout(() => {
                            window.scrollBy({
                                top: 100,
                                behavior: 'smooth'
                            });
                        }, 300);
                    }, 2500); // Attendre 2.5s pour que les compteurs finissent
                }
            };
            
            // Bloquer aussi les autres méthodes de scroll
            const blockOther = (e) => {
                if (state.blocking) {
                    e.preventDefault();
                    return false;
                }
            };
            
            window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
            window.addEventListener('touchmove', blockOther, { passive: false, capture: true });
            window.addEventListener('keydown', blockOther, { passive: false, capture: true });
            
            // Bloquer aussi le scroll natif
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }
        
        function applyScrollAnimation(progress) {
            // PHASE 1 (0-40%) : Logo et texte reculent et s'assombrissent
            if (progress <= 0.4) {
                const phase1Progress = progress / 0.4;
                
                // Reculer (scale down) et assombrir
                const scale = 1 - (phase1Progress * 0.1); // 1 → 0.9 (très peu de dézoom)
                const translateZ = phase1Progress * -30; // Effet de profondeur léger
                const opacity = 1 - (phase1Progress * 0.2); // 1 → 0.8 (très visible)
                
                elements.logo.style.transform = `translate(-50%, -50%) scale(${scale}) translateZ(${translateZ}px)`;
                elements.logo.style.opacity = opacity;
                elements.logo.style.filter = `brightness(${1 - phase1Progress * 0.5})`;
                
                if (elements.text) {
                    elements.text.style.transform = `translateY(${phase1Progress * 20}px) scale(${scale})`;
                    elements.text.style.opacity = opacity;
                }
            }
            
            // PHASE 2 (30-100%) : Statistiques apparaissent progressivement
            if (progress > 0.3) {
                // S'assurer que le logo reste en arrière-plan
                if (progress > 0.4) {
                    elements.logo.style.transform = `translate(-50%, -50%) scale(0.9) translateZ(-30px)`;
                    elements.logo.style.opacity = 0.8;
                    elements.logo.style.filter = 'brightness(0.7)';
                    
                    if (elements.text) {
                        elements.text.style.transform = 'translateY(20px) scale(0.9)';
                        elements.text.style.opacity = '0.7';
                    }
                }
                
                // Afficher les stats
                if (elements.stats.style.display !== 'block') {
                    showStats();
                }
                
                // Animer chaque stat en fonction du progress
                const statsProgress = (progress - 0.3) / 0.7; // 0 à 1 sur 70% du progress
                
                elements.statItems.forEach((stat, index) => {
                    // Chaque stat apparaît à un moment différent
                    const statStart = index * 0.2; // 0, 0.2, 0.4, 0.6
                    const statProgress = Math.max(0, Math.min(1, (statsProgress - statStart) / 0.3));
                    
                    if (statProgress > 0) {
                        stat.style.opacity = statProgress;
                        stat.style.transform = `translateY(${(1 - statProgress) * 30}px) scale(${0.8 + statProgress * 0.2})`;
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && statProgress > 0.5 && !counter.dataset.animating) {
                            counter.dataset.animating = 'true';
                            animateCounter(counter, statProgress);
                        }
                    }
                });
            }
        }
        
        function showStats() {
            console.log(`📊 ${config.name} - Préparation des stats`);
            
            elements.stats.style.cssText = `
                display: block !important;
                opacity: 1 !important;
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 90vw !important;
                max-width: 1000px !important;
                height: 80vh !important;
                z-index: 30 !important;
                pointer-events: none !important;
            `;
            
            // Préparer les stats (invisibles au début)
            elements.statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(30px) scale(0.8)';
                stat.style.transition = 'all 0.4s ease-out';
            });
        }
        
        function animateCounter(counter, speed = 1) {
            const target = parseFloat(counter.dataset.target) || 0;
            const duration = 1500 / speed;
            const start = Date.now();
            const startValue = parseFloat(counter.textContent) || 0;
            
            function update() {
                const progress = Math.min(1, (Date.now() - start) / duration);
                const current = startValue + (target - startValue) * progress;
                
                if (target > 10000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'K';
                } else if (target > 1000) {
                    counter.textContent = Math.floor(current).toLocaleString('fr-FR');
                } else if (target < 10) {
                    // Pour les notes (comme 4.8)
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
                
                if (progress < 1) requestAnimationFrame(update);
            }
            
            update();
        }
        
        function resetAnimation() {
            console.log(`🔄 Reset ${config.name}`);
            
            state.triggered = false;
            state.blocking = false;
            state.blockProgress = 0;
            state.animationsComplete = false;
            
            // Reset styles
            elements.logo.style.transform = 'translate(-50%, -50%) scale(1)';
            elements.logo.style.opacity = '1';
            elements.logo.style.filter = 'brightness(1)';
            
            if (elements.text) {
                elements.text.style.transform = 'translateY(0) scale(1)';
                elements.text.style.opacity = '1';
            }
            
            elements.stats.style.display = 'none';
            elements.statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(30px) scale(0.8)';
                const counter = stat.querySelector('.stat-counter');
                if (counter) {
                    delete counter.dataset.animating;
                    counter.textContent = '0';
                }
            });
        }
        
        // Écouter le scroll
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking && !state.blocking) {
                requestAnimationFrame(function() {
                    checkAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        console.log(`✅ ${config.name} prêt - Scroll pour contrôler l'animation`);
    }
})();
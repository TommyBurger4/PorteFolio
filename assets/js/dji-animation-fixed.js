// ANIMATION DJI AVEC BLOCAGE TOTAL ET ANIMATION AUTOMATIQUE

(function() {
    console.log('🚀 DJI Animation Fixed - Blocage total');
    
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
        console.log(`📦 Setting up ${config.name}...`);
        
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
            animating: false,
            animationProgress: 0
        };
        
        function checkTrigger() {
            if (state.triggered || state.animating) return;
            
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            if (!elements.logo || !elements.text) return;
            
            // Point de déclenchement
            const logoRect = elements.logo.getBoundingClientRect();
            const textRect = elements.text.getBoundingClientRect();
            const triggerPoint = (logoRect.top + logoRect.height/2 + textRect.top) / 2;
            const distance = Math.abs(triggerPoint - viewportHeight/2);
            
            // Debug
            if (distance < 200 && !state.triggered) {
                console.log(`📏 ${config.name} - Distance: ${Math.round(distance)}px`);
            }
            
            // Déclencher
            if (distance < 50 && !state.triggered) {
                console.log(`🎯 ${config.name} - DÉCLENCHEMENT!`);
                state.triggered = true;
                startBlockingAnimation();
            }
        }
        
        function startBlockingAnimation() {
            console.log(`🔒 ${config.name} - BLOCAGE TOTAL DU SCROLL`);
            state.animating = true;
            
            // Sauvegarder la position actuelle
            const startScroll = window.scrollY;
            
            // BLOQUER TOTALEMENT LE SCROLL
            const preventDefault = (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            
            // Bloquer TOUS les événements de scroll
            window.addEventListener('wheel', preventDefault, { passive: false });
            window.addEventListener('touchmove', preventDefault, { passive: false });
            window.addEventListener('keydown', preventDefault, { passive: false });
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Animation automatique progressive
            const animationDuration = 3000; // 3 secondes
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / animationDuration);
                
                // Easing function (ease-in-out)
                const easeProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : -1 + (4 - 2 * progress) * progress;
                
                state.animationProgress = easeProgress;
                
                console.log(`🎬 Animation automatique: ${Math.round(easeProgress * 100)}%`);
                
                // Appliquer les transformations
                applyAnimations(easeProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Fin de l'animation - débloquer
                    console.log(`🔓 ${config.name} - Fin de l'animation, déblocage`);
                    
                    window.removeEventListener('wheel', preventDefault);
                    window.removeEventListener('touchmove', preventDefault);
                    window.removeEventListener('keydown', preventDefault);
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                    
                    state.animating = false;
                    
                    // Scroll automatique pour passer la section
                    setTimeout(() => {
                        window.scrollBy({
                            top: 200,
                            behavior: 'smooth'
                        });
                    }, 500);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        function applyAnimations(progress) {
            // Phase 1: Texte disparaît (0-30%)
            if (elements.text) {
                const textProgress = Math.min(1, progress / 0.3);
                elements.text.style.opacity = 1 - textProgress;
                elements.text.style.transform = `translateY(${textProgress * -80}px)`;
            }
            
            // Phase 2: Logo zoom (0-80%)
            const zoomProgress = Math.min(1, progress / 0.8);
            const scale = 1 + (zoomProgress * 3); // Zoom jusqu'à 4x
            const translateY = zoomProgress * -50;
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
            
            // Phase 3: Stats apparaissent (après 25%)
            if (progress > 0.25 && elements.stats.style.display !== 'block') {
                showStats(progress);
            }
        }
        
        function showStats(animProgress) {
            console.log(`📊 ${config.name} - Affichage des stats`);
            
            // Forcer l'affichage
            elements.stats.style.cssText = `
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
                transition: opacity 0.8s ease-out;
            `;
            
            // Apparition progressive
            requestAnimationFrame(() => {
                elements.stats.style.opacity = '1';
                
                // Animer chaque stat avec un délai basé sur la progression
                elements.statItems.forEach((stat, index) => {
                    const delay = (animProgress - 0.25) * 1000 + (index * 200);
                    
                    setTimeout(() => {
                        console.log(`  📈 Stat ${index + 1} apparaît`);
                        stat.style.cssText += `
                            opacity: 1 !important;
                            transform: translateY(0) scale(1) !important;
                            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                        `;
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && !counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            animateCounter(counter);
                        }
                    }, Math.max(0, delay));
                });
            });
        }
        
        function animateCounter(counter) {
            const target = parseInt(counter.dataset.target) || 0;
            const duration = 2000;
            const start = Date.now();
            
            function update() {
                const progress = Math.min(1, (Date.now() - start) / duration);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out
                const current = Math.floor(target * easeProgress);
                
                if (target > 10000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'K';
                } else if (target > 1000) {
                    counter.textContent = current.toLocaleString('fr-FR');
                } else {
                    counter.textContent = current + '+';
                }
                
                if (progress < 1) requestAnimationFrame(update);
            }
            
            update();
        }
        
        // Écouter le scroll uniquement pour le déclenchement
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking && !state.animating) {
                requestAnimationFrame(function() {
                    checkTrigger();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        console.log(`✅ ${config.name} ready avec blocage total`);
    }
})();
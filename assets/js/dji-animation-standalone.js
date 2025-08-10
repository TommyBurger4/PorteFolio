// ANIMATION DJI STANDALONE - VERSION INDÉPENDANTE

(function() {
    console.log('🚀 DJI Animation Standalone starting...');
    
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
        console.log(`📦 Setting up ${config.name} animation...`);
        
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) {
            console.error(`❌ Container ${config.name} not found`);
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
        
        console.log(`✅ ${config.name} elements found:`, {
            logo: !!elements.logo,
            text: !!elements.text,
            stats: !!elements.stats,
            statItems: elements.statItems.length
        });
        
        let state = {
            triggered: false,
            blocking: false
        };
        
        function checkAnimation() {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
            
            if (!elements.logo || !elements.text) return;
            
            // Calculer le point central entre logo et texte
            const logoRect = elements.logo.getBoundingClientRect();
            const textRect = elements.text.getBoundingClientRect();
            
            const logoCenter = logoRect.top + (logoRect.height / 2);
            const textTop = textRect.top;
            const triggerPoint = (logoCenter + textTop) / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(triggerPoint - viewportCenter);
            
            // Log uniquement quand on est proche
            if (distance < 200 && !state.triggered) {
                console.log(`📏 ${config.name} - Distance: ${Math.round(distance)}px | Progress: ${Math.round(progress * 100)}%`);
            }
            
            // Déclencher l'animation - Seuil augmenté à 50px
            if (distance < 50 && !state.triggered && progress > 0.05) {
                console.log(`🎯 ${config.name} - ANIMATION TRIGGERED! Distance: ${Math.round(distance)}px`);
                state.triggered = true;
                startAnimation();
            }
            
            // Appliquer les transformations
            if (state.triggered) {
                const animProgress = Math.max(0, Math.min(1, (progress - 0.1) / 0.6));
                console.log(`🎬 ${config.name} - Animation progress: ${Math.round(animProgress * 100)}%`);
                applyAnimations(animProgress);
            }
        }
        
        function startAnimation() {
            console.log(`🔒 ${config.name} - Blocking scroll...`);
            state.blocking = true;
            
            const blockEnd = Date.now() + 2500;
            
            function handleWheel(e) {
                if (Date.now() < blockEnd) {
                    e.preventDefault();
                    window.scrollBy(0, e.deltaY * 0.05);
                } else {
                    window.removeEventListener('wheel', handleWheel);
                    state.blocking = false;
                    console.log(`🔓 ${config.name} - Scroll unblocked`);
                }
            }
            
            window.addEventListener('wheel', handleWheel, { passive: false });
        }
        
        function applyAnimations(animProgress) {
            // Texte disparaît
            if (elements.text) {
                const textOpacity = Math.max(0, 1 - (animProgress / 0.4));
                elements.text.style.opacity = textOpacity;
                elements.text.style.transform = `translateY(${animProgress * -60}px)`;
            }
            
            // Logo zoom
            const scale = 1 + (animProgress * 2.5);
            const translateY = animProgress * -40;
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
            
            // Stats apparaissent plus tôt (20% au lieu de 35%)
            if (animProgress > 0.2 && elements.stats.style.display !== 'block') {
                showStats();
            }
        }
        
        function showStats() {
            console.log(`📊 ${config.name} - Showing stats...`);
            console.log(`  Current display: ${elements.stats.style.display}`);
            console.log(`  Current opacity: ${elements.stats.style.opacity}`);
            
            // Forcer l'affichage avec !important
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
                transition: opacity 0.6s ease-out;
            `;
            
            // Forcer le reflow
            elements.stats.offsetHeight;
            
            requestAnimationFrame(() => {
                elements.stats.style.opacity = '1';
                console.log(`  Stats opacity set to 1`);
                
                elements.statItems.forEach((stat, index) => {
                    setTimeout(() => {
                        console.log(`  Animating stat ${index + 1}`);
                        stat.style.cssText += `
                            opacity: 1 !important;
                            transform: translateY(0) scale(1) !important;
                            transition: all 0.6s ease-out !important;
                        `;
                        
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && !counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            animateCounter(counter);
                        }
                    }, index * 150);
                });
            });
        }
        
        function animateCounter(counter) {
            const target = parseInt(counter.dataset.target) || 0;
            const duration = 1500;
            const start = Date.now();
            
            function update() {
                const progress = Math.min(1, (Date.now() - start) / duration);
                const current = Math.floor(target * progress);
                
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
        
        // Écouter le scroll
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    checkAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Check initial
        setTimeout(checkAnimation, 100);
        
        console.log(`✅ ${config.name} animation ready!`);
    }
})();
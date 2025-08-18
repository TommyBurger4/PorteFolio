// ANIMATION DJI CLEAN - VERSION ÉPURÉE ET FONCTIONNELLE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Clean DJI Animation initialized');
    
    // Configuration des sections
    const sections = [
        { name: 'creno', color: '#ffc605' },
        { name: 'pixshare', color: '#9333ea' }
    ];
    
    sections.forEach(config => {
        // Récupération des éléments
        const container = document.querySelector(`.${config.name}-animation-container`);
        if (!container) return;
        
        const elements = {
            sticky: container.querySelector('.animation-sticky-section'),
            logo: container.querySelector(`.${config.name}-logo-zoom`),
            stats: container.querySelector(`.${config.name}-stats-container`),
            statItems: container.querySelectorAll(`.${config.name}-stat-item`),
            text: container.querySelector(`.${config.name}-text-content`)
        };
        
        // État de l'animation
        const state = {
            triggered: false,
            blocking: false
        };
        
        // Fonction principale appelée à chaque scroll
        function updateAnimation() {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculer la progression dans la section (0 à 1)
            const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
            
            // Calculer la distance du centre
            const stickyRect = elements.sticky.getBoundingClientRect();
            const centerDistance = Math.abs((stickyRect.top + stickyRect.height / 2) - viewportHeight / 2);
            
            // Déclencher l'animation au centre
            if (centerDistance < 50 && !state.triggered && progress > 0.1) {
                state.triggered = true;
                startAnimation();
            }
            
            // Appliquer les transformations si l'animation est déclenchée
            if (state.triggered) {
                applyAnimations(progress);
            }
            
            // Reset si on s'éloigne
            if (rect.bottom < -200 || rect.top > viewportHeight + 200) {
                resetAnimation();
            }
        }
        
        // Démarrer l'animation avec blocage du scroll
        function startAnimation() {
            console.log(`🚀 ${config.name} animation started`);
            state.blocking = true;
            
            // Bloquer le scroll pendant 1.8 secondes
            const blockEnd = Date.now() + 1800;
            
            function handleWheel(e) {
                if (Date.now() < blockEnd) {
                    e.preventDefault();
                    window.scrollBy(0, e.deltaY * 0.08); // 8% de la vitesse normale
                } else {
                    window.removeEventListener('wheel', handleWheel);
                    state.blocking = false;
                }
            }
            
            window.addEventListener('wheel', handleWheel, { passive: false });
        }
        
        // Appliquer les animations basées sur la progression
        function applyAnimations(progress) {
            // Calculer la progression de l'animation (commence à 20% du scroll)
            const animProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
            
            // Phase 1: Texte disparaît (0-40% de l'animation)
            if (elements.text) {
                const textOpacity = Math.max(0, 1 - (animProgress / 0.4));
                elements.text.style.opacity = textOpacity;
                elements.text.style.transform = `translateY(${animProgress * -60}px)`;
            }
            
            // Phase 2: Logo zoom (0-80% de l'animation)
            const zoomProgress = Math.min(1, animProgress / 0.8);
            const scale = 1 + (zoomProgress * 2.5); // 1x à 3.5x
            const translateY = zoomProgress * -40;
            elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
            
            // Phase 3: Stats apparaissent (après 35% de l'animation)
            if (animProgress > 0.35 && elements.stats.style.display === 'none') {
                showStats();
            }
        }
        
        // Afficher les statistiques
        function showStats() {
            console.log(`📊 ${config.name} stats appearing`);
            
            elements.stats.style.display = 'block';
            
            // Forcer le reflow
            elements.stats.offsetHeight;
            
            // Animer l'apparition
            requestAnimationFrame(() => {
                elements.stats.style.opacity = '1';
                
                // Animer chaque stat individuellement
                elements.statItems.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter && !counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            animateCounter(counter);
                        }
                    }, index * 150);
                });
            });
        }
        
        // Animation des compteurs
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
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            update();
        }
        
        // Reset de l'animation
        function resetAnimation() {
            state.triggered = false;
            
            if (elements.text) {
                elements.text.style.opacity = '1';
                elements.text.style.transform = 'translateY(0)';
            }
            
            elements.logo.style.transform = 'translate(-50%, -50%) scale(1)';
            
            elements.stats.style.opacity = '0';
            setTimeout(() => {
                elements.stats.style.display = 'none';
            }, 300);
            
            elements.statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(30px) scale(0.8)';
                delete stat.querySelector('.stat-counter').dataset.animated;
                const counter = stat.querySelector('.stat-counter');
                if (counter) counter.textContent = '0';
            });
        }
        
        // Optimisation avec requestAnimationFrame
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // Écouter le scroll
        window.addEventListener('scroll', handleScroll);
        
        // Check initial
        updateAnimation();
        
        console.log(`✅ ${config.name} animation ready`);
    });
});
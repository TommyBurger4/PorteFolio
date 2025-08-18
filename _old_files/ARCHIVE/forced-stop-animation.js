// ANIMATION AVEC ARRÊT FORCÉ SUR CRÉNO ET PIXSHARE

(function() {
    'use strict';
    
    console.log('🛑 Forced stop animation initialized');
    
    // Supprimer loading screen
    document.querySelector('.loading-screen')?.remove();
    
    // Variables globales
    let currentSection = null;
    let isLocked = false;
    let hasAnimated = new Set();
    
    // Sections à animer
    const animatedSections = [
        {
            container: '.creno-animation-container',
            name: 'creno',
            duration: 3000
        },
        {
            container: '.pixshare-animation-container', 
            name: 'pixshare',
            duration: 3000
        }
    ];
    
    // Setup pour chaque section
    animatedSections.forEach(config => {
        const container = document.querySelector(config.container);
        if (!container) return;
        
        // Observer pour détecter l'entrée dans la section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    // On entre dans la section
                    if (!hasAnimated.has(config.name) && !isLocked) {
                        console.log(`🎯 Entering ${config.name} section`);
                        lockAndAnimate(container, config);
                    }
                }
            });
        }, {
            threshold: [0.3, 0.5, 0.7],
            rootMargin: '-100px 0px -100px 0px'
        });
        
        observer.observe(container);
    });
    
    // Fonction pour bloquer et animer
    function lockAndAnimate(container, config) {
        if (isLocked) return;
        
        console.log(`🔒 Locking scroll for ${config.name}`);
        isLocked = true;
        currentSection = container;
        
        // 1. Scroll jusqu'au centre de la section
        const rect = container.getBoundingClientRect();
        const scrollTarget = window.scrollY + rect.top;
        
        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });
        
        // 2. Bloquer le scroll après 500ms (temps du smooth scroll)
        setTimeout(() => {
            // Méthode 1: Empêcher les events de scroll
            const preventScroll = (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            
            // Méthode 2: Fixer la position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            // Ajouter les listeners
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', preventKeys, { passive: false });
            
            // 3. Lancer l'animation
            startAnimation(container, config.name);
            
            // 4. Débloquer après la durée de l'animation
            setTimeout(() => {
                console.log(`🔓 Unlocking scroll for ${config.name}`);
                
                // Restaurer le scroll
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                
                // Restaurer la position de scroll
                window.scrollTo(0, scrollY);
                
                // Retirer les listeners
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                window.removeEventListener('keydown', preventKeys);
                
                isLocked = false;
                hasAnimated.add(config.name);
                
                // Scroll vers la prochaine section
                const nextSection = container.nextElementSibling;
                if (nextSection) {
                    setTimeout(() => {
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }, config.duration);
            
        }, 500);
    }
    
    // Empêcher les touches de navigation
    function preventKeys(e) {
        const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, PageUp/Down, End, Home, Arrows
        if (keys.includes(e.keyCode)) {
            e.preventDefault();
            return false;
        }
    }
    
    // Animation de la section
    function startAnimation(container, name) {
        const logo = container.querySelector(`.${name}-logo-zoom`);
        const stats = container.querySelector(`.${name}-stats-container`);
        const textContent = container.querySelector(`.${name}-text-content`);
        const statItems = container.querySelectorAll(`.${name}-stat-item`);
        
        // Phase 1: Zoom du logo
        if (logo) {
            logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            logo.style.transform = 'scale(2.2) translateY(-20px)';
        }
        
        // Masquer le texte
        if (textContent) {
            textContent.style.transition = 'opacity 0.8s ease-out';
            textContent.style.opacity = '0';
        }
        
        // Phase 2: Afficher les stats (après 1.5s)
        setTimeout(() => {
            // Réduire le logo
            if (logo) {
                logo.style.transform = 'scale(1.5) translateY(-40px)';
            }
            
            // Afficher le container de stats
            if (stats) {
                stats.style.display = 'block';
                requestAnimationFrame(() => {
                    stats.style.opacity = '1';
                });
                
                // Animer chaque stat
                statItems.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            animateCounter(counter, target);
                        }
                    }, 100 + index * 150);
                });
            }
        }, 1500);
    }
    
    // Animation des compteurs
    function animateCounter(element, target) {
        const duration = 1200;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            if (target > 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = current + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Reset quand on s'éloigne beaucoup
    window.addEventListener('scroll', () => {
        if (!isLocked && currentSection) {
            const rect = currentSection.getBoundingClientRect();
            if (rect.bottom < -500 || rect.top > window.innerHeight + 500) {
                // Reset l'animation pour cette section
                const name = currentSection.classList.contains('creno-animation-container') ? 'creno' : 'pixshare';
                hasAnimated.delete(name);
                
                // Reset visuel
                const logo = currentSection.querySelector(`.${name}-logo-zoom`);
                const stats = currentSection.querySelector(`.${name}-stats-container`);
                const textContent = currentSection.querySelector(`.${name}-text-content`);
                
                if (logo) logo.style.transform = 'scale(1)';
                if (stats) {
                    stats.style.opacity = '0';
                    setTimeout(() => stats.style.display = 'none', 300);
                }
                if (textContent) textContent.style.opacity = '1';
                
                currentSection = null;
            }
        }
    });
    
})();
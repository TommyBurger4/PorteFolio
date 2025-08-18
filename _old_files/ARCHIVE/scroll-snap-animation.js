// ANIMATION AVEC SCROLL-SNAP ET ZOOM PROGRESSIF

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Scroll-snap animation initialized');
    
    // Créer un indicateur de debug
    const debugDiv = document.createElement('div');
    debugDiv.className = 'scroll-debug';
    debugDiv.innerHTML = 'Scroll: 0px<br>Phase: Initial';
    document.body.appendChild(debugDiv);
    
    // Supprimer le loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
    
    // Configuration pour Créno
    setupScrollSnapAnimation('.creno-animation-container', {
        logoSelector: '.creno-logo-zoom',
        statsSelector: '.creno-stats-container',
        statItemsSelector: '.creno-stat-item',
        textContentSelector: '.creno-text-content'
    });
    
    // Configuration pour PixShare  
    setupScrollSnapAnimation('.pixshare-animation-container', {
        logoSelector: '.pixshare-logo-zoom',
        statsSelector: '.pixshare-stats-container',
        statItemsSelector: '.pixshare-stat-item',
        textContentSelector: '.pixshare-text-content'
    });
    
    function setupScrollSnapAnimation(containerSelector, selectors) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const stickySection = container.querySelector('.animation-sticky-section');
        const logo = container.querySelector(selectors.logoSelector);
        const statsContainer = container.querySelector(selectors.statsSelector);
        const statItems = container.querySelectorAll(selectors.statItemsSelector);
        const textContent = container.querySelector(selectors.textContentSelector);
        
        let isAnimating = false;
        let animationPhase = 0; // 0: initial, 1: zooming, 2: stats shown
        let scrollProgress = 0;
        
        // Observer pour détecter quand on entre/sort de la section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    debugDiv.innerHTML = `Section visible<br>Phase: ${animationPhase}`;
                    // Activer l'écoute du scroll
                    window.addEventListener('scroll', handleScroll);
                    
                    // Si on entre par le haut, forcer le snap
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.top > 0 && rect.top < window.innerHeight * 0.5) {
                        debugDiv.innerHTML = `Snap triggered!<br>Top: ${rect.top}`;
                        snapToSection();
                    }
                } else {
                    // Désactiver l'écoute et reset
                    window.removeEventListener('scroll', handleScroll);
                    resetAnimation();
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 0.9, 1],
            rootMargin: '0px'
        });
        
        observer.observe(container);
        
        // Fonction pour "snapper" sur la section
        function snapToSection() {
            if (isAnimating) return;
            
            isAnimating = true;
            const containerTop = container.offsetTop;
            
            // Scroll smooth vers le container
            window.scrollTo({
                top: containerTop,
                behavior: 'smooth'
            });
            
            // Bloquer le scroll pendant l'animation
            document.body.style.overflow = 'hidden';
            
            // Démarrer l'animation après le snap
            setTimeout(() => {
                startZoomAnimation();
            }, 500);
        }
        
        // Gestion du scroll dans la section
        function handleScroll() {
            const rect = container.getBoundingClientRect();
            const containerHeight = container.offsetHeight;
            const scrolledInContainer = -rect.top;
            scrollProgress = Math.max(0, Math.min(1, scrolledInContainer / (containerHeight - window.innerHeight)));
            
            // Si on est dans la première moitié et qu'on n'a pas encore animé
            if (scrollProgress > 0.1 && scrollProgress < 0.5 && animationPhase === 0) {
                snapToSection();
            }
            
            // Animation progressive basée sur le scroll (après le snap)
            if (animationPhase === 1 && scrollProgress > 0.3) {
                const zoomProgress = (scrollProgress - 0.3) / 0.3; // 0.3 à 0.6
                const scale = 1 + (zoomProgress * 1.5); // 1 à 2.5
                
                if (logo) {
                    logo.style.transform = `scale(${scale})`;
                }
                
                if (textContent && zoomProgress > 0.5) {
                    textContent.style.opacity = 1 - ((zoomProgress - 0.5) * 2);
                }
            }
        }
        
        // Animation de zoom
        function startZoomAnimation() {
            animationPhase = 1;
            
            // Phase 1: Zoom initial
            if (logo) {
                logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                logo.style.transform = 'scale(2)';
            }
            
            // Masquer le texte
            if (textContent) {
                textContent.style.transition = 'opacity 0.8s ease-out';
                textContent.style.opacity = '0';
            }
            
            // Phase 2: Afficher les stats
            setTimeout(() => {
                animationPhase = 2;
                
                // Réduire un peu le logo
                if (logo) {
                    logo.style.transform = 'scale(1.5) translateY(-30px)';
                }
                
                // Afficher les stats
                if (statsContainer) {
                    statsContainer.style.display = 'block';
                    setTimeout(() => {
                        statsContainer.style.opacity = '1';
                    }, 50);
                    
                    // Animer chaque stat
                    statItems.forEach((stat, index) => {
                        setTimeout(() => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0) scale(1)';
                            
                            // Animer les compteurs
                            const counter = stat.querySelector('.stat-counter');
                            if (counter) {
                                const target = parseInt(counter.dataset.target) || 0;
                                animateCounter(counter, target);
                            }
                        }, 200 + index * 150);
                    });
                }
                
                // Débloquer le scroll après l'animation
                setTimeout(() => {
                    document.body.style.overflow = '';
                    isAnimating = false;
                }, 1500);
            }, 1800);
        }
        
        // Reset de l'animation
        function resetAnimation() {
            animationPhase = 0;
            scrollProgress = 0;
            isAnimating = false;
            
            if (logo) {
                logo.style.transform = 'scale(1)';
            }
            
            if (textContent) {
                textContent.style.opacity = '1';
            }
            
            if (statsContainer) {
                statsContainer.style.opacity = '0';
                setTimeout(() => {
                    statsContainer.style.display = 'none';
                }, 300);
            }
            
            statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(50px) scale(0.8)';
                const counter = stat.querySelector('.stat-counter');
                if (counter) {
                    counter.textContent = '0';
                }
            });
            
            document.body.style.overflow = '';
        }
        
        // Animation des compteurs
        function animateCounter(element, target) {
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * easeOutCubic);
                
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
    }
    
    // Animations simples pour les autres sections
    const fadeElements = document.querySelectorAll('.fade-section, .feature-card-dji');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });
});
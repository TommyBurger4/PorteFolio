// ANIMATION DJI QUI FONCTIONNE - VERSION SIMPLIFIÉE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Working DJI Animation started');
    
    // Configuration des sections
    const sections = [
        {
            name: 'creno',
            container: document.querySelector('.creno-animation-container'),
            color: '#ffc605'
        },
        {
            name: 'pixshare', 
            container: document.querySelector('.pixshare-animation-container'),
            color: '#9333ea'
        }
    ];
    
    // Pour chaque section
    sections.forEach(section => {
        if (!section.container) {
            console.error(`Section ${section.name} non trouvée`);
            return;
        }
        
        console.log(`✅ Section ${section.name} trouvée`);
        
        const logo = section.container.querySelector(`.${section.name}-logo-zoom`);
        const statsContainer = section.container.querySelector(`.${section.name}-stats-container`);
        const textContent = section.container.querySelector(`.${section.name}-text-content`);
        const statItems = section.container.querySelectorAll(`.${section.name}-stat-item`);
        
        if (!logo || !statsContainer) {
            console.error(`Éléments manquants pour ${section.name}`);
            return;
        }
        
        // État initial
        let hasStarted = false;
        let isAnimating = false;
        let progress = 0;
        
        // Fonction d'animation au scroll
        const checkScroll = () => {
            const rect = section.container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            // Si la section est visible
            if (sectionTop < viewportHeight && sectionBottom > 0) {
                // Calculer la position du centre de la section
                const sectionCenter = sectionTop + (rect.height / 2);
                const viewportCenter = viewportHeight / 2;
                const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
                
                // Ne commencer l'animation que quand la section est proche du centre
                if (distanceFromCenter < viewportHeight * 0.3) { // 30% de la hauteur du viewport
                    // Calculer le progrès basé sur la position dans la section
                    const stickySection = section.container.querySelector('.animation-sticky-section');
                    const stickyRect = stickySection.getBoundingClientRect();
                    
                    // Progress basé sur combien on a scrollé dans la section
                    const containerHeight = rect.height;
                    const scrolledInSection = -sectionTop;
                    progress = Math.min(1, Math.max(0, scrolledInSection / (containerHeight * 0.5)));
                    
                    if (!hasStarted && progress > 0) {
                        hasStarted = true;
                        console.log(`🚀 Animation ${section.name} démarrée - Centre atteint`);
                    }
                    
                    // Appliquer les transformations
                    if (progress > 0) {
                        applyAnimations(progress);
                    }
                }
            } else {
                // Reset si on s'éloigne
                if (hasStarted && (sectionBottom < -200 || sectionTop > viewportHeight + 200)) {
                    resetAnimations();
                    hasStarted = false;
                    progress = 0;
                }
            }
        };
        
        // Appliquer les animations basées sur le progrès
        const applyAnimations = (progress) => {
            // Phase 1: Texte disparaît (0-40%)
            if (textContent) {
                const textOpacity = Math.max(0, 1 - (progress / 0.4));
                textContent.style.opacity = textOpacity;
                textContent.style.transform = `translateY(${progress * -30}px)`;
            }
            
            // Phase 2: Logo zoom (20-60%)
            if (progress > 0.2) {
                const zoomProgress = Math.min(1, (progress - 0.2) / 0.4);
                const scale = 1 + (zoomProgress * 1.5);
                logo.style.transform = `scale(${scale}) translateY(${zoomProgress * -30}px)`;
            }
            
            // Phase 3: Stats apparaissent (50-100%)
            if (progress > 0.5 && !isAnimating) {
                isAnimating = true;
                
                // Afficher le container
                statsContainer.style.display = 'block';
                setTimeout(() => {
                    statsContainer.style.opacity = '1';
                }, 50);
                
                // Animer chaque stat
                statItems.forEach((stat, index) => {
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
                    }, index * 200);
                });
                
                // Ralentir le scroll
                if (progress > 0.5 && progress < 0.8) {
                    slowScroll();
                }
            }
        };
        
        // Reset des animations
        const resetAnimations = () => {
            console.log(`🔄 Reset ${section.name}`);
            
            if (logo) logo.style.transform = 'scale(1)';
            if (textContent) {
                textContent.style.opacity = '1';
                textContent.style.transform = 'translateY(0)';
            }
            if (statsContainer) {
                statsContainer.style.opacity = '0';
                setTimeout(() => {
                    statsContainer.style.display = 'none';
                }, 300);
            }
            
            statItems.forEach(stat => {
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(30px) scale(0.8)';
                delete stat.dataset.animated;
                const counter = stat.querySelector('.stat-counter');
                if (counter) counter.textContent = '0';
            });
            
            isAnimating = false;
        };
        
        // Ralentir le scroll temporairement
        let slowScrollTimeout;
        const slowScroll = () => {
            if (slowScrollTimeout) return;
            
            const handleWheel = (e) => {
                e.preventDefault();
                window.scrollBy(0, e.deltaY * 0.3); // 30% de la vitesse
            };
            
            window.addEventListener('wheel', handleWheel, { passive: false });
            
            slowScrollTimeout = setTimeout(() => {
                window.removeEventListener('wheel', handleWheel);
                slowScrollTimeout = null;
            }, 1500);
        };
        
        // Animation des compteurs
        const animateCounter = (element, target) => {
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (target - start) * progress);
                
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
        
        // Écouter le scroll
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
        checkScroll();
    });
    
    // Animations basiques pour les autres sections
    document.querySelectorAll('.fade-section').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(el);
    });
    
    console.log('✅ Working DJI Animation ready');
});
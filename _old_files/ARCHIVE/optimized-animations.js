// ANIMATIONS OPTIMISÉES POUR CRÉNO ET PIXSHARE

document.addEventListener('DOMContentLoaded', function() {
    // 1. Forcer la disparition du loading screen
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1000);
    
    // 2. S'assurer que le scroll fonctionne par défaut
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // 3. Configuration pour Créno et PixShare
    const setupScrollAnimation = (sectionSelector, logoSelector, statsSelector, statItemsSelector, brandColor) => {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        
        const logo = section.querySelector(logoSelector);
        const statsContainer = section.querySelector(statsSelector);
        const statItems = section.querySelectorAll(statItemsSelector);
        
        let isAnimating = false;
        let animationComplete = false;
        let scrollProgress = 0;
        
        // Animation des compteurs
        const animateCounter = (element, target) => {
            const duration = 1500;
            const start = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (target - start) * progress);
                
                element.textContent = current.toLocaleString('fr-FR') + '+';
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        // Observer pour déclencher l'animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationComplete) {
                    const rect = entry.target.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const viewportCenter = viewportHeight / 2;
                    
                    // Déclencher quand la section est proche du centre
                    if (Math.abs(sectionCenter - viewportCenter) < 200 && !isAnimating) {
                        isAnimating = true;
                        
                        // Bloquer le scroll temporairement
                        const originalOverflow = document.body.style.overflow;
                        document.body.style.overflow = 'hidden';
                        
                        // Animation du logo
                        if (logo) {
                            logo.style.transition = 'all 0.8s ease-out';
                            logo.style.transform = 'scale(0.7) translateY(-30px)';
                            logo.style.opacity = '0.8';
                        }
                        
                        // Afficher le conteneur de stats
                        if (statsContainer) {
                            statsContainer.style.display = 'block';
                            statsContainer.style.opacity = '0';
                            
                            setTimeout(() => {
                                statsContainer.style.transition = 'opacity 0.5s ease-out';
                                statsContainer.style.opacity = '1';
                            }, 300);
                        }
                        
                        // Animer les stats une par une
                        statItems.forEach((stat, index) => {
                            setTimeout(() => {
                                stat.style.transition = 'all 0.6s ease-out';
                                stat.style.opacity = '1';
                                stat.style.transform = 'translateY(0) scale(1)';
                                
                                // Animer les compteurs
                                const numberEl = stat.querySelector('.stat-number');
                                if (numberEl && !stat.dataset.animated) {
                                    stat.dataset.animated = 'true';
                                    const target = parseInt(numberEl.textContent) || (index === 0 ? 16 : 7);
                                    animateCounter(numberEl, target);
                                }
                            }, 500 + index * 300);
                        });
                        
                        // Débloquer le scroll après l'animation
                        setTimeout(() => {
                            document.body.style.overflow = originalOverflow;
                            isAnimating = false;
                            animationComplete = true;
                            
                            // Remettre le logo à sa taille normale
                            if (logo) {
                                logo.style.transform = 'scale(1) translateY(0)';
                                logo.style.opacity = '1';
                            }
                        }, 2500);
                    }
                } else if (!entry.isIntersecting && animationComplete) {
                    // Reset si on s'éloigne de la section
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < 0 || rect.top > window.innerHeight) {
                        animationComplete = false;
                        
                        // Reset des éléments
                        if (statsContainer) {
                            statsContainer.style.display = 'none';
                        }
                        
                        statItems.forEach(stat => {
                            stat.style.opacity = '0';
                            stat.style.transform = 'translateY(30px) scale(0.8)';
                            delete stat.dataset.animated;
                            
                            const numberEl = stat.querySelector('.stat-number');
                            if (numberEl) {
                                numberEl.textContent = '0';
                            }
                        });
                    }
                }
            });
        }, {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '-100px 0px -100px 0px'
        });
        
        observer.observe(section);
    };
    
    // 4. Appliquer les animations
    setupScrollAnimation(
        '.creno-scroll-trigger',
        '.creno-main-logo img',
        '.creno-stats-showcase',
        '.creno-stat',
        '#ffc605'
    );
    
    setupScrollAnimation(
        '.pixshare-scroll-trigger',
        '.pixshare-main-logo img',
        '.pixshare-stats-showcase',
        '.pixshare-stat',
        '#9333ea'
    );
    
    // 5. Animations simples pour les autres sections
    const simpleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-section, .feature-card-dji, .mask-reveal').forEach(el => {
        simpleObserver.observe(el);
    });
    
    // 6. Navigation mobile
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });
    }
    
    // 7. Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 8. Mobile: désactiver les animations complexes
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        document.querySelectorAll('.creno-stats-showcase, .pixshare-stats-showcase').forEach(el => {
            el.style.display = 'none';
        });
    }
});
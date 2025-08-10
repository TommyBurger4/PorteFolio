// ANIMATIONS STYLE DJI - ZOOM ET STATISTIQUES

class DJIStyleAnimation {
    constructor() {
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        console.log('🚀 DJI Style Animation initialized');
        
        // Supprimer le loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Configuration des sections
        this.setupCrenoAnimation();
        this.setupPixShareAnimation();
        
        // Animations basiques pour les autres sections
        this.setupBasicAnimations();
    }
    
    setupCrenoAnimation() {
        const container = document.querySelector('.creno-animation-container');
        if (!container) return;
        
        const logo = container.querySelector('.creno-logo-zoom');
        const statsContainer = container.querySelector('.creno-stats-container');
        const stats = container.querySelectorAll('.creno-stat-item');
        const textContent = container.querySelectorAll('.creno-text-content');
        
        let phase = 0; // 0: initial, 1: zooming, 2: stats
        let isAnimating = false;
        
        // Variables pour le scroll
        let lastScrollY = window.scrollY;
        let scrollAccumulator = 0;
        
        // Observer pour détecter quand on entre dans la section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    // Activer l'animation de scroll
                    window.addEventListener('wheel', handleWheel, { passive: false });
                    window.addEventListener('touchmove', handleTouch, { passive: false });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-10% 0px -10% 0px'
        });
        
        observer.observe(container);
        
        // Gestion du scroll avec accumulation
        const handleWheel = (e) => {
            const containerRect = container.getBoundingClientRect();
            
            // Vérifier si on est dans la zone d'animation
            if (containerRect.top > 100 || containerRect.bottom < -100) {
                return;
            }
            
            e.preventDefault();
            scrollAccumulator += e.deltaY;
            
            // Phase 1: Zoom sur le logo
            if (phase === 0 && scrollAccumulator > 50) {
                phase = 1;
                isAnimating = true;
                
                // Animation de zoom
                logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                logo.style.transform = 'scale(2.5) translateY(-20px)';
                
                // Fade out du texte
                textContent.forEach(el => {
                    el.style.transition = 'opacity 0.8s ease-out';
                    el.style.opacity = '0';
                });
                
                setTimeout(() => {
                    scrollAccumulator = 0;
                    isAnimating = false;
                }, 1500);
            }
            
            // Phase 2: Afficher les stats
            else if (phase === 1 && scrollAccumulator > 100 && !isAnimating) {
                phase = 2;
                isAnimating = true;
                
                // Réduire le logo
                logo.style.transform = 'scale(1.5) translateY(-50px)';
                
                // Afficher le container de stats
                statsContainer.style.display = 'block';
                setTimeout(() => {
                    statsContainer.style.opacity = '1';
                }, 50);
                
                // Animer les stats une par une
                stats.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        // Animer le compteur
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            this.animateCounter(counter, 0, target, 1500);
                        }
                    }, index * 200);
                });
                
                // Permettre le scroll normal après l'animation
                setTimeout(() => {
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('touchmove', handleTouch);
                    
                    // Smooth scroll vers la prochaine section
                    const nextSection = container.nextElementSibling;
                    if (nextSection) {
                        setTimeout(() => {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }, 1000);
                    }
                }, 2000);
            }
        };
        
        const handleTouch = (e) => {
            // Gestion tactile pour mobile
            if (e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaY = lastScrollY - touch.clientY;
                scrollAccumulator += deltaY * 2;
                lastScrollY = touch.clientY;
            }
        };
        
        // Reset quand on quitte la section
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && phase > 0) {
                    // Reset complet
                    phase = 0;
                    scrollAccumulator = 0;
                    isAnimating = false;
                    
                    logo.style.transform = 'scale(1) translateY(0)';
                    statsContainer.style.opacity = '0';
                    setTimeout(() => {
                        statsContainer.style.display = 'none';
                    }, 300);
                    
                    stats.forEach(stat => {
                        stat.style.opacity = '0';
                        stat.style.transform = 'translateY(50px) scale(0.8)';
                    });
                    
                    textContent.forEach(el => {
                        el.style.opacity = '1';
                    });
                    
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('touchmove', handleTouch);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '200px 0px 200px 0px'
        });
        
        resetObserver.observe(container);
    }
    
    setupPixShareAnimation() {
        const container = document.querySelector('.pixshare-animation-container');
        if (!container) return;
        
        const logo = container.querySelector('.pixshare-logo-zoom');
        const statsContainer = container.querySelector('.pixshare-stats-container');
        const stats = container.querySelectorAll('.pixshare-stat-item');
        const textContent = container.querySelectorAll('.pixshare-text-content');
        
        let phase = 0;
        let isAnimating = false;
        let lastScrollY = window.scrollY;
        let scrollAccumulator = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    window.addEventListener('wheel', handleWheel, { passive: false });
                    window.addEventListener('touchmove', handleTouch, { passive: false });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-10% 0px -10% 0px'
        });
        
        observer.observe(container);
        
        const handleWheel = (e) => {
            const containerRect = container.getBoundingClientRect();
            
            if (containerRect.top > 100 || containerRect.bottom < -100) {
                return;
            }
            
            e.preventDefault();
            scrollAccumulator += e.deltaY;
            
            if (phase === 0 && scrollAccumulator > 50) {
                phase = 1;
                isAnimating = true;
                
                logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                logo.style.transform = 'scale(2.5) translateY(-20px)';
                
                textContent.forEach(el => {
                    el.style.transition = 'opacity 0.8s ease-out';
                    el.style.opacity = '0';
                });
                
                setTimeout(() => {
                    scrollAccumulator = 0;
                    isAnimating = false;
                }, 1500);
            }
            else if (phase === 1 && scrollAccumulator > 100 && !isAnimating) {
                phase = 2;
                isAnimating = true;
                
                logo.style.transform = 'scale(1.5) translateY(-50px)';
                
                statsContainer.style.display = 'block';
                setTimeout(() => {
                    statsContainer.style.opacity = '1';
                }, 50);
                
                stats.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            this.animateCounter(counter, 0, target, 1500);
                        }
                    }, index * 200);
                });
                
                setTimeout(() => {
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('touchmove', handleTouch);
                    
                    const nextSection = container.nextElementSibling;
                    if (nextSection) {
                        setTimeout(() => {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }, 1000);
                    }
                }, 2000);
            }
        };
        
        const handleTouch = (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const deltaY = lastScrollY - touch.clientY;
                scrollAccumulator += deltaY * 2;
                lastScrollY = touch.clientY;
            }
        };
        
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && phase > 0) {
                    phase = 0;
                    scrollAccumulator = 0;
                    isAnimating = false;
                    
                    logo.style.transform = 'scale(1) translateY(0)';
                    statsContainer.style.opacity = '0';
                    setTimeout(() => {
                        statsContainer.style.display = 'none';
                    }, 300);
                    
                    stats.forEach(stat => {
                        stat.style.opacity = '0';
                        stat.style.transform = 'translateY(50px) scale(0.8)';
                    });
                    
                    textContent.forEach(el => {
                        el.style.opacity = '1';
                    });
                    
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('touchmove', handleTouch);
                }
            });
        }, {
            threshold: 0,
            rootMargin: '200px 0px 200px 0px'
        });
        
        resetObserver.observe(container);
    }
    
    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOutCubic);
            
            if (end > 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = current + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    setupBasicAnimations() {
        // Observer pour les animations de fade-in
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
        
        // Observer tous les éléments avec animation
        document.querySelectorAll('.fade-section, .feature-card-dji').forEach(el => {
            fadeObserver.observe(el);
        });
    }
}

// Initialiser
new DJIStyleAnimation();
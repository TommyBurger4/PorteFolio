// EXPERT SOLUTION - SCROLL LOCK ANIMATION POUR CRÉNO ET PIXSHARE

(function() {
    'use strict';
    
    // Variables globales
    let isScrollLocked = false;
    let currentAnimation = null;
    let animationQueue = [];
    
    // Désactiver TOUS les autres scripts d'animation
    window.addEventListener('DOMContentLoaded', function() {
        // Killer de scripts conflictuels
        if (window.DJIAnimations) {
            window.DJIAnimations = null;
        }
        
        // Supprimer tous les event listeners de wheel existants
        const oldAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'wheel' && listener.name && listener.name.includes('global')) {
                return; // Bloquer les anciens handlers
            }
            return oldAddEventListener.call(this, type, listener, options);
        };
        
        initScrollLockSystem();
    });
    
    function initScrollLockSystem() {
        console.log('🚀 Initialisation du système de scroll-lock');
        
        // Forcer la disparition du loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Configuration des sections
        const sections = [
            {
                selector: '.creno-scroll-trigger',
                logoSelector: '.creno-main-logo img',
                statsSelector: '.creno-stats-showcase',
                statItemsSelector: '.creno-stat',
                color: '#ffc605',
                stats: { users: 16, events: 7 }
            },
            {
                selector: '.pixshare-scroll-trigger',
                logoSelector: '.pixshare-main-logo img',
                statsSelector: '.pixshare-stats-showcase',
                statItemsSelector: '.pixshare-stat',
                color: '#9333ea',
                stats: { photos: 45200, creators: 8750 }
            }
        ];
        
        sections.forEach(config => setupSection(config));
    }
    
    function setupSection(config) {
        const section = document.querySelector(config.selector);
        if (!section) {
            console.warn(`Section ${config.selector} non trouvée`);
            return;
        }
        
        const logo = section.querySelector(config.logoSelector);
        const statsContainer = section.querySelector(config.statsSelector);
        const statItems = section.querySelectorAll(config.statItemsSelector);
        
        let hasAnimated = false;
        let isInViewport = false;
        
        // Préparer les éléments
        if (statsContainer) {
            statsContainer.style.display = 'none';
            statsContainer.style.position = 'absolute';
            statsContainer.style.top = '50%';
            statsContainer.style.left = '50%';
            statsContainer.style.transform = 'translate(-50%, -50%)';
            statsContainer.style.width = '90vw';
            statsContainer.style.maxWidth = '800px';
            statsContainer.style.height = '90vh';
            statsContainer.style.maxHeight = '600px';
            statsContainer.style.pointerEvents = 'none';
            statsContainer.style.zIndex = '10';
        }
        
        statItems.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transition = 'none';
        });
        
        // Observer intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isInViewport = entry.isIntersecting;
                
                if (entry.isIntersecting && !hasAnimated && !isScrollLocked) {
                    const rect = entry.target.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - viewportHeight / 2);
                    
                    // Déclencher quand proche du centre
                    if (distanceFromCenter < 150) {
                        console.log(`🎯 Déclenchement animation ${config.selector}`);
                        triggerAnimation(section, logo, statsContainer, statItems, config);
                        hasAnimated = true;
                    }
                }
                
                // Reset si on s'éloigne beaucoup
                if (!entry.isIntersecting && hasAnimated) {
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
                        resetAnimation(logo, statsContainer, statItems);
                        hasAnimated = false;
                    }
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 0.9, 1],
            rootMargin: '-10% 0px -10% 0px'
        });
        
        observer.observe(section);
        
        // Scroll listener pour détecter la proximité
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!isInViewport || hasAnimated || isScrollLocked) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const sectionCenter = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(sectionCenter - viewportHeight / 2);
                
                if (distanceFromCenter < 150) {
                    console.log(`🎯 Déclenchement animation par scroll ${config.selector}`);
                    triggerAnimation(section, logo, statsContainer, statItems, config);
                    hasAnimated = true;
                }
            }, 50);
        });
    }
    
    function triggerAnimation(section, logo, statsContainer, statItems, config) {
        if (isScrollLocked) return;
        
        console.log('🔒 BLOCAGE DU SCROLL');
        lockScroll(section);
        
        // Phase 1: Réduire le logo
        if (logo) {
            logo.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            logo.style.transform = 'scale(0.6) translateY(-40px)';
            logo.style.opacity = '0.7';
        }
        
        // Phase 2: Afficher le conteneur de stats
        setTimeout(() => {
            if (statsContainer) {
                statsContainer.style.display = 'block';
                statsContainer.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    statsContainer.style.transition = 'opacity 0.5s ease-out';
                    statsContainer.style.opacity = '1';
                });
            }
        }, 400);
        
        // Phase 3: Animer les stats une par une
        statItems.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                stat.style.opacity = '1';
                
                // Positions personnalisées
                if (index === 0) {
                    stat.style.transform = 'translate(-150px, -100px) rotate(-12deg) scale(1)';
                } else if (index === 1) {
                    stat.style.transform = 'translate(150px, -100px) rotate(12deg) scale(1)';
                } else if (index === 2) {
                    stat.style.transform = 'translate(-100px, 100px) rotate(-8deg) scale(1)';
                } else if (index === 3) {
                    stat.style.transform = 'translate(100px, 100px) rotate(8deg) scale(1)';
                }
                
                // Animer les compteurs
                const numberEl = stat.querySelector('.stat-number');
                if (numberEl && !stat.dataset.animated) {
                    stat.dataset.animated = 'true';
                    let target = 0;
                    
                    if (config.stats.users && index === 0) target = config.stats.users;
                    else if (config.stats.events && index === 1) target = config.stats.events;
                    else if (config.stats.photos && index === 0) target = config.stats.photos;
                    else if (config.stats.creators && index === 1) target = config.stats.creators;
                    
                    if (target > 0) {
                        animateCounter(numberEl, target);
                    }
                }
            }, 600 + index * 200);
        });
        
        // Phase 4: Débloquer après l'animation
        setTimeout(() => {
            console.log('🔓 DÉBLOCAGE DU SCROLL');
            unlockScroll();
            
            // Restaurer le logo
            if (logo) {
                logo.style.transform = 'scale(1) translateY(0)';
                logo.style.opacity = '1';
            }
        }, 2500);
    }
    
    function lockScroll(section) {
        isScrollLocked = true;
        
        // Méthode 1: CSS
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
        
        // Méthode 2: Event prevention
        const preventScroll = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        
        // Stocker les handlers pour les retirer plus tard
        window._scrollPreventers = {
            wheel: preventScroll,
            touchmove: preventScroll,
            keydown: (e) => {
                if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                    e.preventDefault();
                    return false;
                }
            }
        };
        
        // Ajouter les listeners
        window.addEventListener('wheel', window._scrollPreventers.wheel, { passive: false });
        window.addEventListener('touchmove', window._scrollPreventers.touchmove, { passive: false });
        window.addEventListener('keydown', window._scrollPreventers.keydown, { passive: false });
        
        // Méthode 3: Scroll to current position continuously
        const scrollY = window.scrollY;
        window._scrollInterval = setInterval(() => {
            if (window.scrollY !== scrollY) {
                window.scrollTo(0, scrollY);
            }
        }, 10);
    }
    
    function unlockScroll() {
        isScrollLocked = false;
        
        // Restaurer la position de scroll
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        
        // Retirer les styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        // Retirer les listeners
        if (window._scrollPreventers) {
            window.removeEventListener('wheel', window._scrollPreventers.wheel);
            window.removeEventListener('touchmove', window._scrollPreventers.touchmove);
            window.removeEventListener('keydown', window._scrollPreventers.keydown);
            delete window._scrollPreventers;
        }
        
        // Arrêter l'interval
        if (window._scrollInterval) {
            clearInterval(window._scrollInterval);
            delete window._scrollInterval;
        }
        
        // Restaurer la position
        window.scrollTo(0, scrollY);
    }
    
    function resetAnimation(logo, statsContainer, statItems) {
        if (logo) {
            logo.style.transform = 'scale(1) translateY(0)';
            logo.style.opacity = '1';
        }
        
        if (statsContainer) {
            statsContainer.style.display = 'none';
            statsContainer.style.opacity = '0';
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
    
    function animateCounter(element, target) {
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            if (target > 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                element.textContent = current.toLocaleString('fr-FR') + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Gestion du responsive
    if (window.innerWidth < 768) {
        console.log('📱 Mode mobile détecté - animations simplifiées');
        // Sur mobile, réduire la durée du blocage
        window._mobileMode = true;
    }
    
})();
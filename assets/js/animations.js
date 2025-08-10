/* ==========================================================================
   ANIMATIONS.JS - Toutes les animations du site
   Portfolio Professionnel - Version 1.0
   ========================================================================== */

class PortfolioAnimations {
    constructor() {
        this.sections = [
            { name: 'creno', color: '#ffc605' },
            { name: 'pixshare', color: '#9333ea' }
        ];
        
        this.initDJIAnimations();
        this.initHeroAnimation();
        console.log('✅ Portfolio Animations initialized');
    }
    
    // ========================================
    // ANIMATIONS DJI STYLE
    // ========================================
    
    initDJIAnimations() {
        this.sections.forEach(config => {
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
            
            if (!elements.logo || !elements.stats) {
                console.error(`Elements missing for ${config.name}`);
                return;
            }
            
            // Debug - Vérifier que les éléments sont bien trouvés
            console.log(`📋 ${config.name} elements:`, {
                container: !!container,
                sticky: !!elements.sticky,
                logo: !!elements.logo,
                stats: !!elements.stats,
                text: !!elements.text,
                statItems: elements.statItems.length
            });
            
            // État de l'animation
            const state = {
                triggered: false,
                blocking: false,
                statsShown: false
            };
            
            // Fonction principale - Utiliser une fonction fléchée pour garder le contexte
            const updateAnimation = () => {
                console.log(`🔄 UpdateAnimation appelé pour ${config.name}`);
                const rect = container.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Progression dans la section (0 à 1)
                const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - viewportHeight)));
                
                // Calculer le point central entre le logo et le texte
                const logoRect = elements.logo.getBoundingClientRect();
                const textRect = elements.text ? elements.text.getBoundingClientRect() : null;
                
                // Point central = milieu entre le centre du logo et le haut du texte
                let triggerPoint;
                if (textRect) {
                    const logoCenter = logoRect.top + (logoRect.height / 2);
                    const textTop = textRect.top;
                    triggerPoint = (logoCenter + textTop) / 2;
                } else {
                    // Fallback si pas de texte
                    triggerPoint = logoRect.top + (logoRect.height / 2);
                }
                
                // Distance du point de déclenchement au centre du viewport
                const viewportCenter = viewportHeight / 2;
                const centerDistance = Math.abs(triggerPoint - viewportCenter);
                
                // Debug amélioré
                if (progress > 0 && progress < 0.5) {
                    console.log(`📍 ${config.name} - Progress: ${Math.round(progress * 100)}% | Distance: ${Math.round(centerDistance)}px | Triggered: ${state.triggered}`);
                }
                
                // Déclencher quand le point central est au centre de l'écran
                if (centerDistance < 30 && !state.triggered && progress > 0.05) {
                    console.log(`🎯 ${config.name} - DÉCLENCHEMENT! Point central au centre de l'écran`);
                    state.triggered = true;
                    this.startAnimation(config.name, state);
                }
                
                // Appliquer les animations
                if (state.triggered) {
                    this.applyAnimations(elements, progress, state);
                }
                
                // Reset si on s'éloigne
                if (rect.bottom < -200 || rect.top > viewportHeight + 200) {
                    this.resetAnimation(elements, state);
                }
            };
            
            // Optimisation avec RAF
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateAnimation();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', handleScroll);
            
            // Force un premier check après un court délai
            setTimeout(() => {
                console.log(`🔍 Check initial pour ${config.name}`);
                updateAnimation();
            }, 100);
            
            console.log(`✅ ${config.name} DJI animation ready`);
        });
    }
    
    // Démarrer l'animation avec blocage
    startAnimation(name, state) {
        console.log(`🚀 ${name} animation started - Blocage du scroll`);
        state.blocking = true;
        
        const blockEnd = Date.now() + 2500; // 2.5 secondes de blocage
        
        const handleWheel = (e) => {
            if (Date.now() < blockEnd) {
                e.preventDefault();
                // Scroll très lent (5% de la vitesse) pour faire apparaître les stats progressivement
                window.scrollBy(0, e.deltaY * 0.05);
            } else {
                window.removeEventListener('wheel', handleWheel);
                state.blocking = false;
            }
        };
        
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // Sécurité
        setTimeout(() => {
            window.removeEventListener('wheel', handleWheel);
            state.blocking = false;
        }, 2500);
    }
    
    // Appliquer les transformations
    applyAnimations(elements, progress, state) {
        const animProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
        
        // Phase 1: Texte disparaît
        if (elements.text) {
            const textOpacity = Math.max(0, 1 - (animProgress / 0.4));
            elements.text.style.opacity = textOpacity;
            elements.text.style.transform = `translateY(${animProgress * -60}px)`;
        }
        
        // Phase 2: Logo zoom
        const zoomProgress = Math.min(1, animProgress / 0.8);
        const scale = 1 + (zoomProgress * 2.5);
        const translateY = zoomProgress * -40;
        elements.logo.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`;
        
        // Phase 3: Stats
        if (animProgress > 0.35 && !state.statsShown) {
            state.statsShown = true;
            this.showStats(elements);
        }
    }
    
    // Afficher les stats
    showStats(elements) {
        elements.stats.style.display = 'block';
        
        requestAnimationFrame(() => {
            elements.stats.style.opacity = '1';
            
            elements.statItems.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0) scale(1)';
                    
                    const counter = stat.querySelector('.stat-counter');
                    if (counter && !counter.dataset.animated) {
                        counter.dataset.animated = 'true';
                        this.animateCounter(counter);
                    }
                }, index * 150);
            });
        });
    }
    
    // Animation des compteurs
    animateCounter(counter) {
        const target = parseInt(counter.dataset.target) || 0;
        const duration = 1500;
        const start = Date.now();
        
        const update = () => {
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
        };
        
        update();
    }
    
    // Reset animation
    resetAnimation(elements, state) {
        state.triggered = false;
        state.statsShown = false;
        
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
            const counter = stat.querySelector('.stat-counter');
            if (counter) {
                delete counter.dataset.animated;
                counter.textContent = '0';
            }
        });
    }
    
    // ========================================
    // ANIMATION HERO
    // ========================================
    
    initHeroAnimation() {
        const hero = document.querySelector('.hero-zoom');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero.style.transform !== `translateY(${rate}px)`) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Initialiser les animations
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioAnimations = new PortfolioAnimations();
});
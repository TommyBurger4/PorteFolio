// ANIMATION EXACTE STYLE DJI - SCROLL PROGRESSIF ET ARRÊT

class DJIExactAnimation {
    constructor() {
        this.sections = new Map();
        this.currentSection = null;
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        console.log('🚀 DJI Exact Animation initialized');
        
        // Supprimer le loading screen
        document.querySelector('.loading-screen')?.remove();
        
        // Supprimer les anciens wrappers
        document.querySelectorAll('.animation-wrapper, .creno-wrapper, .pixshare-wrapper').forEach(el => {
            console.log('Suppression:', el.className);
            el.remove();
        });
        
        // Configuration des sections
        this.setupSection('creno', {
            container: '.creno-animation-container',
            scrollDistance: 400, // Distance de scroll pour l'animation complète
            stats: [
                { target: 16, label: 'Utilisateurs actifs' },
                { target: 7, label: 'Événements créés' },
                { target: 98, label: '% de satisfaction' },
                { target: 3, label: 'Heures économisées/mois' }
            ]
        });
        
        this.setupSection('pixshare', {
            container: '.pixshare-animation-container',
            scrollDistance: 400,
            stats: [
                { target: 45200, label: 'Photos partagées' },
                { target: 8750, label: 'Créateurs actifs' },
                { target: 1250, label: 'Albums créés' },
                { target: 2100, label: 'GB de stockage' }
            ]
        });
        
        // Écouter le scroll
        this.setupScrollListener();
    }
    
    setupSection(name, config) {
        const container = document.querySelector(config.container);
        if (!container) {
            console.error(`Section ${name} non trouvée`);
            return;
        }
        
        // Préparer les éléments
        const elements = {
            container,
            sticky: container.querySelector('.animation-sticky-section'),
            logo: container.querySelector(`.${name}-logo-zoom`),
            stats: container.querySelector(`.${name}-stats-container`),
            statItems: container.querySelectorAll(`.${name}-stat-item`),
            textContent: container.querySelector(`.${name}-text-content`),
            scrollIndicator: container.querySelector('.scroll-indicator')
        };
        
        // État initial
        this.resetSection(elements);
        
        // Stocker la configuration
        this.sections.set(name, {
            ...config,
            elements,
            progress: 0,
            isActive: false,
            hasCompleted: false
        });
        
        // Observer pour détecter l'entrée/sortie
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = this.sections.get(name);
                section.isActive = entry.isIntersecting;
                
                if (!entry.isIntersecting && section.hasCompleted) {
                    // Reset si on s'éloigne
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < -300 || rect.top > window.innerHeight + 300) {
                        section.hasCompleted = false;
                        section.progress = 0;
                        this.resetSection(section.elements);
                    }
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 0.9],
            rootMargin: '0px'
        });
        
        observer.observe(container);
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    updateAnimations() {
        // Vérifier chaque section
        this.sections.forEach((section, name) => {
            if (!section.isActive || section.hasCompleted) return;
            
            const rect = section.elements.container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculer la progression basée sur la position dans le viewport
            const startPoint = viewportHeight * 0.8; // Commence quand la section est à 80% du bas
            const endPoint = viewportHeight * 0.2;   // Termine quand elle est à 20% du haut
            
            if (rect.top < startPoint && rect.bottom > endPoint) {
                // Calculer le progrès (0 à 1)
                const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));
                section.progress = progress;
                
                // Appliquer les animations
                this.animateSection(section, progress);
                
                // Si on atteint 50%, ralentir le scroll
                if (progress > 0.4 && progress < 0.6 && !this.isAnimating) {
                    this.slowDownScroll(section);
                }
            }
        });
    }
    
    animateSection(section, progress) {
        const { elements } = section;
        
        // Phase 1 (0-40%): Fade out du texte et indicateur
        if (progress <= 0.4) {
            const fadeProgress = 1 - (progress / 0.4);
            if (elements.textContent) {
                elements.textContent.style.opacity = fadeProgress;
                elements.textContent.style.transform = `translateY(${(1 - fadeProgress) * -30}px)`;
            }
            if (elements.scrollIndicator) {
                elements.scrollIndicator.style.opacity = fadeProgress;
            }
        }
        
        // Phase 2 (20-60%): Zoom du logo
        if (progress > 0.2 && progress <= 0.6) {
            const zoomProgress = (progress - 0.2) / 0.4;
            const scale = 1 + (zoomProgress * 1.5); // De 1 à 2.5
            const translateY = zoomProgress * -30;
            
            if (elements.logo) {
                elements.logo.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            }
        }
        
        // Phase 3 (50-100%): Apparition des stats
        if (progress > 0.5) {
            const statsProgress = (progress - 0.5) / 0.5;
            
            // Afficher le container
            if (elements.stats && !elements.stats.dataset.visible) {
                elements.stats.style.display = 'block';
                setTimeout(() => {
                    elements.stats.style.opacity = '1';
                }, 50);
                elements.stats.dataset.visible = 'true';
            }
            
            // Animer chaque stat
            elements.statItems.forEach((stat, index) => {
                const delay = index * 0.1;
                const itemProgress = Math.max(0, (statsProgress - delay) / (1 - delay));
                
                if (itemProgress > 0) {
                    stat.style.opacity = itemProgress;
                    stat.style.transform = `translateY(${(1 - itemProgress) * 30}px) scale(${0.8 + itemProgress * 0.2})`;
                    
                    // Animer le compteur
                    if (itemProgress > 0.5 && !stat.dataset.animated) {
                        stat.dataset.animated = 'true';
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            this.animateCounter(counter, target);
                        }
                    }
                }
            });
            
            // Marquer comme complété
            if (progress > 0.95) {
                section.hasCompleted = true;
            }
        }
    }
    
    slowDownScroll(section) {
        this.isAnimating = true;
        
        // Créer un effet de "friction" temporaire
        let remainingTime = 1500; // 1.5 secondes
        const startTime = Date.now();
        
        const handleWheel = (e) => {
            const elapsed = Date.now() - startTime;
            if (elapsed < remainingTime) {
                // Réduire la vitesse de scroll
                e.preventDefault();
                const friction = 0.3; // 30% de la vitesse normale
                window.scrollBy(0, e.deltaY * friction);
            } else {
                // Retirer l'effet après le temps écoulé
                window.removeEventListener('wheel', handleWheel);
                this.isAnimating = false;
            }
        };
        
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // Timeout de sécurité
        setTimeout(() => {
            window.removeEventListener('wheel', handleWheel);
            this.isAnimating = false;
        }, remainingTime);
    }
    
    animateCounter(element, target) {
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            // Formatage
            if (target > 10000) {
                element.textContent = (current / 1000).toFixed(1) + 'K';
            } else if (target > 1000) {
                element.textContent = current.toLocaleString('fr-FR');
            } else {
                element.textContent = current + (target < 100 ? '+' : '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
    
    resetSection(elements) {
        // Reset tous les éléments
        if (elements.logo) {
            elements.logo.style.transform = 'scale(1) translateY(0)';
        }
        
        if (elements.textContent) {
            elements.textContent.style.opacity = '1';
            elements.textContent.style.transform = 'translateY(0)';
        }
        
        if (elements.scrollIndicator) {
            elements.scrollIndicator.style.opacity = '1';
        }
        
        if (elements.stats) {
            elements.stats.style.display = 'none';
            elements.stats.style.opacity = '0';
            delete elements.stats.dataset.visible;
        }
        
        elements.statItems.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(30px) scale(0.8)';
            delete stat.dataset.animated;
            
            const counter = stat.querySelector('.stat-counter');
            if (counter) {
                counter.textContent = '0';
            }
        });
    }
}

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    new DJIExactAnimation();
});
// NETTOYAGE ET ANIMATION PROPRE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧹 Clean structure initialized');
    
    // 1. SUPPRIMER TOUS LES ANCIENS WRAPPERS
    document.querySelectorAll('.animation-wrapper, .creno-wrapper, .pixshare-wrapper').forEach(wrapper => {
        console.log('❌ Suppression wrapper:', wrapper.className);
        wrapper.remove();
    });
    
    // 2. SUPPRIMER LES ANCIENS PLACEHOLDERS
    document.querySelectorAll('.creno-placeholder, .pixshare-placeholder').forEach(el => {
        el.remove();
    });
    
    // 3. VÉRIFIER QUE LES NOUVELLES SECTIONS EXISTENT
    const crenoContainer = document.querySelector('.creno-animation-container');
    const pixshareContainer = document.querySelector('.pixshare-animation-container');
    
    if (!crenoContainer) {
        console.error('❌ Section Créno introuvable!');
        return;
    }
    
    if (!pixshareContainer) {
        console.error('❌ Section PixShare introuvable!');
        return;
    }
    
    console.log('✅ Sections trouvées:', {
        creno: crenoContainer,
        pixshare: pixshareContainer
    });
    
    // 4. SETUP DES ANIMATIONS AVEC ARRÊT
    let isLocked = false;
    let currentSection = null;
    
    // Animation pour Créno
    setupScrollStop(crenoContainer, 'creno');
    setupScrollStop(pixshareContainer, 'pixshare');
    
    function setupScrollStop(container, name) {
        let hasTriggered = false;
        
        // Observer avec seuil bas pour détecter tôt
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.2 && !hasTriggered && !isLocked) {
                    console.log(`🎯 ${name} visible à ${Math.round(entry.intersectionRatio * 100)}%`);
                    
                    // Vérifier la position
                    const rect = entry.target.getBoundingClientRect();
                    const centerDistance = Math.abs((rect.top + rect.height/2) - window.innerHeight/2);
                    
                    // Si on est proche du centre
                    if (centerDistance < 300) {
                        console.log(`🔒 ARRÊT sur ${name}!`);
                        triggerStopAndAnimate(container, name);
                        hasTriggered = true;
                    }
                }
                
                // Reset si on s'éloigne
                if (!entry.isIntersecting && hasTriggered) {
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < -500 || rect.top > window.innerHeight + 500) {
                        hasTriggered = false;
                        resetSection(container, name);
                    }
                }
            });
        }, {
            threshold: [0.2, 0.3, 0.4, 0.5],
            rootMargin: '0px'
        });
        
        observer.observe(container);
    }
    
    function triggerStopAndAnimate(container, name) {
        isLocked = true;
        currentSection = container;
        
        // 1. Scroll jusqu'à la section
        const rect = container.getBoundingClientRect();
        const scrollTarget = window.scrollY + rect.top;
        
        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });
        
        // 2. Bloquer après le smooth scroll
        setTimeout(() => {
            // Bloquer le scroll
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            // Empêcher les événements
            const preventScroll = (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            
            // 3. Animer
            animateSection(container, name);
            
            // 4. Débloquer après 3 secondes
            setTimeout(() => {
                console.log(`🔓 Déblocage ${name}`);
                
                // Restaurer le body
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                
                // Restaurer le scroll
                window.scrollTo(0, scrollY);
                
                // Retirer les listeners
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                
                isLocked = false;
                
                // Auto-scroll vers la suite
                const nextSection = container.nextElementSibling;
                if (nextSection) {
                    setTimeout(() => {
                        nextSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                }
            }, 3000);
            
        }, 600);
    }
    
    function animateSection(container, name) {
        const logo = container.querySelector(`.${name}-logo-zoom`);
        const stats = container.querySelector(`.${name}-stats-container`);
        const text = container.querySelector(`.${name}-text-content`);
        const statItems = container.querySelectorAll(`.${name}-stat-item`);
        
        // Phase 1: Zoom
        if (logo) {
            logo.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            logo.style.transform = 'scale(2.5) translateY(-20px)';
        }
        
        if (text) {
            text.style.transition = 'opacity 0.8s ease-out';
            text.style.opacity = '0';
        }
        
        // Phase 2: Stats
        setTimeout(() => {
            if (logo) {
                logo.style.transform = 'scale(1.8) translateY(-30px)';
            }
            
            if (stats) {
                stats.style.display = 'block';
                stats.style.opacity = '1';
                
                statItems.forEach((stat, i) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                        
                        const counter = stat.querySelector('.stat-counter');
                        if (counter) {
                            const target = parseInt(counter.dataset.target) || 0;
                            animateNumber(counter, target);
                        }
                    }, i * 150);
                });
            }
        }, 1500);
    }
    
    function resetSection(container, name) {
        const logo = container.querySelector(`.${name}-logo-zoom`);
        const stats = container.querySelector(`.${name}-stats-container`);
        const text = container.querySelector(`.${name}-text-content`);
        const statItems = container.querySelectorAll(`.${name}-stat-item`);
        
        if (logo) logo.style.transform = 'scale(1)';
        if (text) text.style.opacity = '1';
        if (stats) {
            stats.style.opacity = '0';
            setTimeout(() => stats.style.display = 'none', 300);
        }
        
        statItems.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(50px) scale(0.8)';
        });
    }
    
    function animateNumber(element, target) {
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);
            
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
    
    // 5. Basiques pour les autres sections
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-section').forEach(el => {
        fadeObserver.observe(el);
    });
});
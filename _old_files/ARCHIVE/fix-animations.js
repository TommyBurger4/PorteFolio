// CORRECTIONS DES ANIMATIONS

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fix animations loaded');
    
    // 1. Forcer la disparition du loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.remove();
    }
    
    // 2. Débloquer le scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // 3. Supprimer tous les placeholders qui bloquent
    document.querySelectorAll('.creno-placeholder, .pixshare-placeholder').forEach(el => el.remove());
    
    // 4. Reset des sections animées
    document.querySelectorAll('.creno-scroll-trigger, .pixshare-scroll-trigger').forEach(section => {
        section.style.position = 'relative';
        section.style.transform = 'none';
        section.style.opacity = '1';
        section.style.top = '0';
        section.style.left = '0';
        section.style.right = '0';
    });
    
    // 5. Animations simples au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer les sections
    document.querySelectorAll('.fade-section, .feature-card-dji, .mask-reveal').forEach(el => {
        observer.observe(el);
    });
    
    // 6. Navigation mobile
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });
    }
    
    // 7. Smooth scroll pour les liens
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 8. Désactiver toutes les animations complexes
    if (window.globalWheelHandler) {
        window.removeEventListener('wheel', window.globalWheelHandler);
    }
    
    // 9. S'assurer que tout est visible
    document.querySelectorAll('section, .hero-zoom-content, .product-showcase-dji').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = 'block';
    });
    
    // 10. Animation simple pour Créno et PixShare
    const animateLogoOnScroll = (logoElement, statsContainer) => {
        if (!logoElement) return;
        
        const rect = logoElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(elementCenter - viewportHeight / 2);
        
        // Simple scale effect
        if (distanceFromCenter < 200) {
            const scale = 1 - (distanceFromCenter / 400);
            logoElement.style.transform = `scale(${0.8 + scale * 0.2})`;
        }
    };
    
    // Appliquer l'animation simple au scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const crenoLogo = document.querySelector('.creno-main-logo img');
                const pixshareLogo = document.querySelector('.pixshare-main-logo img');
                
                animateLogoOnScroll(crenoLogo);
                animateLogoOnScroll(pixshareLogo);
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    console.log('All fixes applied');
});
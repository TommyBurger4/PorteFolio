// ANIMATIONS SIMPLES - SANS BLOQUER LE SCROLL

document.addEventListener('DOMContentLoaded', function() {
    console.log('📌 Animations simples activées');
    
    // 1. Débloquer le scroll immédiatement
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.height = 'auto';
    
    // 2. Supprimer le loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
    
    // 3. Animation simple pour Créno
    const crenoContainer = document.querySelector('.creno-animation-container');
    if (crenoContainer) {
        const crenoLogo = crenoContainer.querySelector('.creno-logo-zoom');
        const crenoStats = crenoContainer.querySelector('.creno-stats-container');
        const crenoTextContent = crenoContainer.querySelector('.creno-text-content');
        
        // Observer simple
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation du logo
                    if (crenoLogo) {
                        crenoLogo.style.transition = 'transform 1s ease-out';
                        crenoLogo.style.transform = 'scale(1.2)';
                    }
                    
                    // Afficher les stats après un délai
                    setTimeout(() => {
                        if (crenoStats) {
                            crenoStats.style.display = 'block';
                            crenoStats.style.opacity = '1';
                            
                            // Animer les stats
                            const statItems = crenoStats.querySelectorAll('.creno-stat-item');
                            statItems.forEach((stat, index) => {
                                setTimeout(() => {
                                    stat.style.opacity = '1';
                                    stat.style.transform = 'translateY(0)';
                                }, index * 200);
                            });
                        }
                    }, 1000);
                } else {
                    // Reset quand on sort de la vue
                    if (crenoLogo) {
                        crenoLogo.style.transform = 'scale(1)';
                    }
                    if (crenoStats) {
                        crenoStats.style.opacity = '0';
                        setTimeout(() => {
                            crenoStats.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        observer.observe(crenoContainer);
    }
    
    // 4. Même chose pour PixShare
    const pixshareContainer = document.querySelector('.pixshare-animation-container');
    if (pixshareContainer) {
        const pixshareLogo = pixshareContainer.querySelector('.pixshare-logo-zoom');
        const pixshareStats = pixshareContainer.querySelector('.pixshare-stats-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (pixshareLogo) {
                        pixshareLogo.style.transition = 'transform 1s ease-out';
                        pixshareLogo.style.transform = 'scale(1.2)';
                    }
                    
                    setTimeout(() => {
                        if (pixshareStats) {
                            pixshareStats.style.display = 'block';
                            pixshareStats.style.opacity = '1';
                            
                            const statItems = pixshareStats.querySelectorAll('.pixshare-stat-item');
                            statItems.forEach((stat, index) => {
                                setTimeout(() => {
                                    stat.style.opacity = '1';
                                    stat.style.transform = 'translateY(0)';
                                }, index * 200);
                            });
                        }
                    }, 1000);
                } else {
                    if (pixshareLogo) {
                        pixshareLogo.style.transform = 'scale(1)';
                    }
                    if (pixshareStats) {
                        pixshareStats.style.opacity = '0';
                        setTimeout(() => {
                            pixshareStats.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(pixshareContainer);
    }
    
    // 5. Animations basiques pour les autres sections
    const fadeElements = document.querySelectorAll('.fade-section, .feature-card-dji');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        el.style.transition = 'all 0.8s ease-out';
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        fadeObserver.observe(el);
    });
    
    // 6. Navigation mobile
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
        });
    }
    
    console.log('✅ Scroll débloqué, animations simples activées');
});
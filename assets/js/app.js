/* ==========================================================================
   APP.JS - Application principale
   Portfolio Professionnel - Version 1.0
   ========================================================================== */

class PortfolioApp {
    constructor() {
        this.initNavigation();
        this.initSmoothScroll();
        this.initFadeAnimations();
        this.initLoadingScreen();
        this.initMobileMenu();

        Logger.log('✅ Portfolio App initialized');
    }

    // Navigation sticky et transparente
    initNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(0, 0, 0, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(0, 0, 0, 0.9)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Smooth scroll pour les ancres
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Hauteur de la nav
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fermer le menu mobile si ouvert
                    this.closeMobileMenu();
                }
            });
        });
    }

    // Animations fade-in au scroll
    initFadeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer uniquement les éléments fade-section
        // Les slide-in-left sont gérés par slide-animations.js
        document.querySelectorAll('.fade-section').forEach(section => {
            fadeObserver.observe(section);
        });
    }

    // Gestion du loading screen
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Cache le loading screen après le chargement complet
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        });
    }

    // Menu mobile
    initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (!menuToggle || !navLinks) {
            Logger.warn('❌ Menu mobile non trouvé');
            return;
        }

        Logger.log('📱 Initialisation du menu mobile');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Changer l'icône
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Fermer le menu en cliquant sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const icon = menuToggle?.querySelector('i');

        if (navLinks) navLinks.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();

});
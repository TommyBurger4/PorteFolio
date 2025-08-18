// DJI/Apple Style Advanced Animations

class DJIAnimations {
    constructor() {
        this.init();
        this.setupScrollTriggers();
        // this.setupMouseFollower(); // Désactivé
        this.setupLoadingScreen();
        this.setupSmoothScroll();
    }

    init() {
        // Add scroll progress bar
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="scroll-progress">
                <div class="scroll-progress-bar"></div>
            </div>
        `);

        // Add mouse follower - Désactivé
        // document.body.insertAdjacentHTML('afterbegin', `
        //     <div class="mouse-follower"></div>
        // `);
    }

    setupLoadingScreen() {
        // Force scroll to top on page load
        window.scrollTo(0, 0);
        
        // Create loading screen if it doesn't exist
        let loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen) {
            document.body.insertAdjacentHTML('afterbegin', `
                <div class="loading-screen">
                    <div class="loading-logo">
                        <img src="assets/images/TomPaul/logo.png" alt="Loading" style="width: 120px; height: auto; filter: invert(1); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
                    </div>
                </div>
            `);
            loadingScreen = document.querySelector('.loading-screen');
        }
        
        // Ensure loading screen is visible
        if (loadingScreen) {
            loadingScreen.classList.remove('loaded');
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
            loadingScreen.style.visibility = 'visible';
            loadingScreen.style.pointerEvents = 'auto';
        }
        
        // Hide loading screen after a delay
        const hideLoadingScreen = () => {
            if (loadingScreen) {
                loadingScreen.classList.add('loaded');
                // Force hide after transition
                setTimeout(() => {
                    if (loadingScreen && loadingScreen.classList.contains('loaded')) {
                        loadingScreen.style.display = 'none';
                        loadingScreen.style.pointerEvents = 'none';
                    }
                }, 1000);
            }
        };
        
        // Multiple triggers to ensure loading screen disappears
        setTimeout(hideLoadingScreen, 1500); // Primary trigger
        
        // Backup triggers
        window.addEventListener('load', () => {
            setTimeout(hideLoadingScreen, 500);
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(hideLoadingScreen, 2000);
        });
        
        // Force hide after 3 seconds maximum
        setTimeout(() => {
            if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
                hideLoadingScreen();
            }
        }, 3000);
    }

    setupScrollTriggers() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        // Hero zoom effect
        const heroZoomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.classList.add('zoomed');
                } else {
                    entry.target.classList.remove('zoomed');
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.hero-zoom').forEach(el => {
            heroZoomObserver.observe(el);
        });

        // Product showcase animations - Version améliorée
        const productObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation fluide pour toute la section
                    requestAnimationFrame(() => {
                        entry.target.classList.add('in-view');
                    });
                    
                    // Animation du zoom sur scroll (plus douce)
                    const scrollHandler = () => {
                        const rect = entry.target.getBoundingClientRect();
                        const progress = 1 - (rect.top / window.innerHeight);
                        
                        if (progress > 0.3 && progress < 1.2) {
                            const scale = 1 + (progress - 0.3) * 0.3; // Zoom plus subtil
                            entry.target.style.transform = `scale(${scale}) translateZ(0)`;
                        }
                    };
                    
                    window.addEventListener('scroll', scrollHandler);
                    entry.target.scrollHandler = scrollHandler;
                } else {
                    if (entry.target.scrollHandler) {
                        window.removeEventListener('scroll', entry.target.scrollHandler);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.product-showcase-dji').forEach(el => {
            productObserver.observe(el);
        });

        // Feature reveals
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Parallax effect for background
                    const bgImage = entry.target.querySelector('.feature-bg-image');
                    if (bgImage) {
                        const parallaxHandler = () => {
                            const rect = entry.target.getBoundingClientRect();
                            const speed = 0.5;
                            const yPos = rect.top * speed;
                            bgImage.style.transform = `translateY(${yPos}px) scale(1.1)`;
                        };
                        
                        window.addEventListener('scroll', parallaxHandler);
                        entry.target.parallaxHandler = parallaxHandler;
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-reveal').forEach(el => {
            featureObserver.observe(el);
        });

        // Fade sections
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-section').forEach(el => {
            fadeObserver.observe(el);
        });

        // Feature cards stagger
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.feature-card-dji');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-grid-dji').forEach(el => {
            cardObserver.observe(el);
        });

        // Word by word animation
        const wordObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.word-by-word').forEach(el => {
            // Split text into words
            const text = el.textContent;
            const words = text.split(' ');
            el.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
            wordObserver.observe(el);
        });

        // Number counter animation
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('animated');
                    
                    const target = parseInt(entry.target.dataset.target || entry.target.textContent);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateNumber = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.textContent = Math.floor(current);
                            requestAnimationFrame(updateNumber);
                        } else {
                            entry.target.textContent = target;
                        }
                    };
                    
                    // Ne pas animer si c'est un élément Firebase (ils s'animeront via Firebase)
                    if (!entry.target.hasAttribute('data-stat') || entry.target.getAttribute('data-stat') === 'satisfaction') {
                        updateNumber();
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-number').forEach(el => {
            numberObserver.observe(el);
        });

        // Mask reveal effect - Version améliorée et plus fluide
        const maskObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation plus immédiate et fluide
                    requestAnimationFrame(() => {
                        entry.target.classList.add('revealed');
                    });
                } else {
                    // Reset pour permettre la re-animation lors du scroll vers le haut
                    entry.target.classList.remove('revealed');
                }
            });
        }, { 
            threshold: 0.2, // Déclenche plus tôt
            rootMargin: '0px 0px -50px 0px' // Marge plus petite pour plus de réactivité
        });

        document.querySelectorAll('.mask-reveal').forEach(el => {
            maskObserver.observe(el);
        });

        // Observer pour les sections de transition
        const transitionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('in-view');
                    });
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('.transition-section').forEach(el => {
            transitionObserver.observe(el);
        });
    }

    setupMouseFollower() {
        const follower = document.querySelector('.mouse-follower');
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateFollower = () => {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.1;
            followerY += dy * 0.1;
            
            follower.style.left = followerX - 20 + 'px';
            follower.style.top = followerY - 20 + 'px';
            
            requestAnimationFrame(animateFollower);
        };

        animateFollower();

        // Scale on hover
        document.querySelectorAll('a, button, .hover-lift').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
            });
        });
    }

    setupSmoothScroll() {
        // Update scroll progress
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
        };

        window.addEventListener('scroll', updateScrollProgress);

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Add scene transition
                    const transition = document.createElement('div');
                    transition.className = 'scene-transition';
                    document.body.appendChild(transition);
                    
                    setTimeout(() => {
                        transition.classList.add('active');
                    }, 10);
                    
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        setTimeout(() => {
                            transition.classList.remove('active');
                            setTimeout(() => {
                                transition.remove();
                            }, 800);
                        }, 500);
                    }, 400);
                }
            });
        });
    }

    // Cinematic page transitions
    setupPageTransitions() {
        const links = document.querySelectorAll('a:not([href^="#"])');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.hostname === window.location.hostname) {
                    e.preventDefault();
                    const href = this.href;
                    
                    const transition = document.createElement('div');
                    transition.className = 'scene-transition';
                    document.body.appendChild(transition);
                    
                    setTimeout(() => {
                        transition.classList.add('active');
                    }, 10);
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 800);
                }
            });
        });
    }

    // Advanced parallax scrolling
    createParallaxScene(container) {
        const layers = container.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            layers.forEach((layer, index) => {
                const depth = layer.dataset.depth || 1;
                const movement = rate * depth;
                layer.style.transform = `translateY(${movement}px)`;
            });
        });
    }

    // Cinematic video-style scroll
    createCinematicScroll() {
        let ticking = false;

        function updateScroll() {
            const scrollY = window.scrollY;
            const sections = document.querySelectorAll('.scroll-section');
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const screenCenter = window.innerHeight / 2;
                const distance = Math.abs(centerY - screenCenter);
                const maxDistance = window.innerHeight;
                
                // Calculate opacity based on distance from center
                const opacity = 1 - (distance / maxDistance);
                section.style.opacity = Math.max(0.3, opacity);
                
                // Scale effect
                const scale = 0.8 + (0.2 * opacity);
                section.style.transform = `scale(${scale})`;
            });
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }
}

// Initialize animations when DOM is ready - Moved to HTML to avoid double instantiation
// The initialization is now handled in the HTML file to prevent conflicts with loading screen

// Export for use in other scripts
window.DJIAnimations = DJIAnimations;
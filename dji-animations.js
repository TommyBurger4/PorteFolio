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
        // Add loading screen
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="loading-screen">
                <div class="loading-logo">
                    <img src="images/TomPaul/logo.png" alt="Loading" style="width: 120px; height: auto; filter: invert(1); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
                </div>
            </div>
        `);

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
        
        // Ensure loading screen is visible on every page load
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('loaded');
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
        }
        
        window.addEventListener('load', () => {
            // Force scroll to top again after load
            window.scrollTo(0, 0);
            
            // Always show loading animation
            setTimeout(() => {
                const loadingScreen = document.querySelector('.loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('loaded');
                }
            }, 1500);
        });
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

        // Product showcase zoom
        const productObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const image = entry.target.querySelector('.product-image');
                if (entry.isIntersecting && image) {
                    image.classList.add('in-view');
                    
                    // Zoom on scroll
                    const scrollHandler = () => {
                        const rect = entry.target.getBoundingClientRect();
                        const progress = 1 - (rect.top / window.innerHeight);
                        
                        if (progress > 0.5 && progress < 1.5) {
                            image.style.transform = `scale(${1 + (progress - 0.5) * 0.5}) translateZ(0)`;
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

        // Mask reveal effect
        const maskObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, 200);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.mask-reveal').forEach(el => {
            maskObserver.observe(el);
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

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animations = new DJIAnimations();
    animations.setupPageTransitions();
    // animations.createCinematicScroll(); // Disabled - conflicts with wrapper animations
    
    // Disable automatic wrapper reset - let animations complete naturally
    // The wrapper cleanup is now handled properly in the scroll handlers
    
    // Create parallax scenes
    document.querySelectorAll('.parallax-container').forEach(container => {
        animations.createParallaxScene(container);
    });
    
    // Listen for Firebase stats to be loaded
    window.addEventListener('crenoStatsLoaded', (event) => {
        console.log('Créno stats loaded from Firebase:', event.detail);
        window.crenoStats = event.detail;
    });
    
    // Simple scroll animations for app showcases
    const setupSimpleScrollAnimation = () => {
        const crenoSection = document.querySelector('.creno-scroll-trigger');
        const pixshareSection = document.querySelector('.pixshare-scroll-trigger');
        
        // Créno elements
        const crenoLogo = crenoSection ? crenoSection.querySelector('.app-logo-hero') : null;
        const crenoStats = crenoSection ? crenoSection.querySelector('.creno-stats-showcase') : null;
        const crenoStatItems = crenoSection ? crenoSection.querySelectorAll('.creno-stat') : [];
        
        // PixShare elements
        const pixshareLogo = pixshareSection ? pixshareSection.querySelector('.pixshare-logo') : null;
        const pixshareStats = pixshareSection ? pixshareSection.querySelector('.pixshare-stats-showcase') : null;
        const pixshareStatItems = pixshareSection ? pixshareSection.querySelectorAll('.pixshare-stat') : [];
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Créno animation
            if (crenoSection) {
                const rect = crenoSection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
                    
                    if (progress > 0.5) {
                        if (crenoStats) crenoStats.style.display = 'block';
                        if (crenoLogo) {
                            crenoLogo.style.transform = `scale(${1 - progress * 0.3})`;
                            crenoLogo.style.opacity = `${1 - progress * 0.3}`;
                        }
                        crenoStatItems.forEach((stat, i) => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0) scale(1)';
                        });
                    }
                }
            }
            
            // PixShare animation
            if (pixshareSection) {
                const rect = pixshareSection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
                    
                    if (progress > 0.5) {
                        if (pixshareStats) pixshareStats.style.display = 'block';
                        if (pixshareLogo) {
                            pixshareLogo.style.transform = `scale(${1 - progress * 0.3})`;
                            pixshareLogo.style.opacity = `${1 - progress * 0.3}`;
                        }
                        pixshareStatItems.forEach((stat, i) => {
                            stat.style.opacity = '1';
                            stat.style.transform = 'translateY(0) scale(1)';
                        });
                    }
                }
            }
        });
    };
    
    // Initialize simple animations
    // setupSimpleScrollAnimation(); // Disabled - using wrapper animations instead
    
    // Créno scroll-triggered animation
    const crenoSection = document.querySelector('.creno-scroll-trigger');
    if (crenoSection) {
        const crenoLogo = crenoSection.querySelector('.app-logo-hero');
        const statsContainer = crenoSection.querySelector('.creno-stats-showcase');
        const stats = crenoSection.querySelectorAll('.creno-stat');
        const crenoTitle = crenoSection.querySelector('.creno-title');
        const crenoSubtitle = crenoSection.querySelector('.creno-subtitle');
        const crenoContent = crenoSection.querySelector('.creno-content');
        
        let isAnimating = false;
        let animationProgress = 0;
        let hasTriggered = false;
        const totalSteps = 5;
        let scrollLocked = false;
        let triggerTimestamp = 0; // Add timestamp to prevent multiple triggers
        let animationLock = false; // Additional lock mechanism
        
        // Check if wrapper already exists to prevent duplicates
        let wrapper = crenoSection.closest('.creno-wrapper');
        if (!wrapper) {
            // Create wrapper for scroll animation
            wrapper = document.createElement('div');
            // Adaptive height based on viewport
            const viewportHeight = window.innerHeight;
            // Pour un écran de 749px, utiliser 300vh pour plus d'espace d'animation
            const wrapperHeight = viewportHeight < 800 ? '300vh' : (viewportHeight < 900 ? '250vh' : '200vh');
            wrapper.style.minHeight = wrapperHeight;
            wrapper.style.position = 'relative';
            wrapper.classList.add('animation-wrapper', 'creno-wrapper');
            crenoSection.parentNode.insertBefore(wrapper, crenoSection);
            wrapper.appendChild(crenoSection);
            
            console.log('Créno wrapper created:', {
                viewportHeight,
                wrapperHeight,
                screenWidth: window.innerWidth,
                calculatedHeight: parseFloat(wrapperHeight) * viewportHeight / 100
            });
        }
        
        // Initial setup to prevent jump
        crenoSection.style.position = 'relative';
        crenoSection.style.width = '100%';
        crenoSection.style.height = '100vh';
        crenoSection.style.top = '0';
        
        // Counter animation function
        const animateCounter = (element, target) => {
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString('fr-FR') + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString('fr-FR') + '+';
                }
            };
            
            updateCounter();
        };
        
        const updateAnimation = (progress) => {
            console.log('🎯 Créno updateAnimation called with progress:', progress.toFixed(2));
            
            // Step 1: Logo shrinks (0-1)
            if (progress <= 1) {
                const scale = 1 - (progress * 0.4);
                crenoLogo.style.transform = `scale(${scale})`;
                crenoLogo.style.opacity = 1 - (progress * 0.3);
                
                // Keep section centered during animation
                crenoSection.style.display = 'flex';
                crenoSection.style.alignItems = 'center';
                crenoSection.style.justifyContent = 'center';
                
                console.log('🔄 Logo animation:', {
                    scale,
                    opacity: 1 - (progress * 0.3),
                    logoTransform: crenoLogo.style.transform
                });
            }
            
            // Step 2: Show stats container (1-2)
            if (progress > 1 && progress <= 2) {
                if (statsContainer.style.display !== 'block') {
                    console.log('📊 Showing stats container at progress:', progress.toFixed(2));
                    statsContainer.style.display = 'block';
                }
                crenoLogo.style.transform = 'scale(0.6)';
                crenoLogo.style.opacity = '0.7';
            }
            
            // Step 3-4: Animate stats one by one with stagger (only 2 stats now)
            stats.forEach((stat, index) => {
                const statStart = 2 + index * 0.7;
                const statProgress = Math.max(0, Math.min(1, (progress - statStart) / 0.7));
                
                if (statProgress > 0) {
                    stat.style.opacity = statProgress;
                    const yOffset = 30 - (statProgress * 30);
                    
                    // Different animations for each stat with rotation
                    if (index === 0) { // Users - slide from left with rotation
                        stat.style.transform = `translateY(${yOffset}px) translateX(${-30 + statProgress * 30}px) rotate(-12deg) scale(${0.8 + statProgress * 0.2}) translateZ(0)`;
                    } else if (index === 1) { // Events - slide from right with rotation
                        stat.style.transform = `translateY(${yOffset}px) translateX(${30 - statProgress * 30}px) rotate(15deg) scale(${0.8 + statProgress * 0.2}) translateZ(0)`;
                    }
                    
                    stat.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    stat.style.willChange = 'transform, opacity';
                    
                    // Animate numbers when stat appears
                    if (statProgress > 0.5 && !stat.dataset.animated) {
                        stat.dataset.animated = 'true';
                        const numberEl = stat.querySelector('.stat-number');
                        
                        // Use real stats from Firebase if available
                        const realStats = window.crenoStats || { totalUsers: 16, totalEvents: 7, averageRating: 4.8 };
                        
                        if (index === 0) animateCounter(numberEl, realStats.totalUsers);
                        if (index === 1) animateCounter(numberEl, realStats.totalEvents);
                        // Rating doesn't need counter animation
                    }
                }
            });
            
            // Fade text elements
            const textOpacity = Math.max(0.2, 1 - (progress / totalSteps));
            crenoTitle.style.opacity = textOpacity;
            crenoSubtitle.style.opacity = textOpacity * 0.8;
            crenoContent.style.opacity = textOpacity * 0.6;
        };
        
        const handleScroll = () => {
            // Check if wrapper still exists
            if (!wrapper || !wrapper.parentNode) return;
            
            const rect = wrapper.getBoundingClientRect();
            const wrapperTop = rect.top;
            const wrapperHeight = wrapper.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate progress with better precision
            const scrollProgress = Math.max(0, Math.min(1, -wrapperTop / (wrapperHeight - viewportHeight)));
            
            // Apply cubic easing for smoother animation
            const easedProgress = scrollProgress < 0.5 
                ? 4 * scrollProgress * scrollProgress * scrollProgress 
                : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2;
            
            // Adaptive trigger margin based on screen size
            // Pour viewport 749px, utiliser une marge très faible pour déclencher plus tôt
            const triggerMargin = viewportHeight < 800 ? viewportHeight * 0.05 : (viewportHeight < 900 ? viewportHeight * 0.15 : viewportHeight * 0.1);
            
            // Debug log for trigger conditions
            const inAnimationZone = wrapperTop <= -triggerMargin && wrapperTop > -(wrapperHeight - viewportHeight + triggerMargin);
            
            // Force trigger si on arrive sur la section (pour résoudre le problème du viewport 749px)
            // Ajusté pour déclencher quand la section est bien visible
            const forceStart = wrapperTop < -50 && wrapperTop > -150 && !hasTriggered;
            
            if (!hasTriggered && (Math.abs(wrapperTop) < 200 || forceStart)) {
                console.log('Créno trigger check:', {
                    wrapperTop,
                    triggerMargin,
                    wrapperHeight,
                    viewportHeight,
                    inAnimationZone,
                    shouldTrigger: wrapperTop <= -triggerMargin,
                    forceStart
                });
            }
            
            // Check if we should trigger animation with enhanced protection
            const shouldTrigger = (inAnimationZone || forceStart) && !hasTriggered && !animationLock;
            const currentTime = Date.now();
            
            // Enhanced trigger protection with timestamp and lock
            if (shouldTrigger && !wrapper.querySelector('.creno-placeholder') && (currentTime - triggerTimestamp > 500)) {
                // Set all locks immediately
                animationLock = true;
                hasTriggered = true;
                triggerTimestamp = currentTime;
                
                console.log('🎬 Créno animation triggered!', {
                    mode: forceStart ? 'forced' : 'normal',
                    timestamp: currentTime,
                    locks: { hasTriggered, animationLock }
                });
                
                // Log section position before fixing
                const beforeRect = crenoSection.getBoundingClientRect();
                console.log('📍 Before fixed position:', {
                    top: beforeRect.top,
                    bottom: beforeRect.bottom,
                    scrollY: window.scrollY
                });
                
                // Add placeholder BEFORE changing position to prevent jump
                const placeholder = document.createElement('div');
                placeholder.style.height = '100vh';
                placeholder.style.width = '100%';
                placeholder.className = 'creno-placeholder';
                wrapper.insertBefore(placeholder, crenoSection);
                console.log('📦 Placeholder added');
                
                // Switch to fixed positioning at CURRENT position to avoid jump
                const currentTop = beforeRect.top;
                crenoSection.style.position = 'fixed';
                crenoSection.style.top = currentTop + 'px'; // Start at current position
                crenoSection.style.left = '0';
                crenoSection.style.right = '0';
                crenoSection.style.zIndex = '50';
                crenoSection.style.transition = 'none'; // No transition for initial positioning
                
                // Store initial position for smooth animation
                crenoSection.dataset.initialTop = currentTop;
                
                // Log section position after fixing
                const afterRect = crenoSection.getBoundingClientRect();
                console.log('📍 After fixed position:', {
                    top: afterRect.top,
                    position: crenoSection.style.position,
                    styleTop: crenoSection.style.top
                });
                
                // Release animation lock after a short delay
                setTimeout(() => {
                    animationLock = false;
                    console.log('🔓 Animation lock released');
                }, 100);
            } else if ((inAnimationZone || forceStart) && hasTriggered) {
                
                animationProgress = easedProgress * totalSteps;
                console.log('🔧 Créno animation in progress:', {
                    easedProgress: easedProgress.toFixed(3),
                    animationProgress: animationProgress.toFixed(2),
                    totalSteps,
                    wrapperTop
                });
                updateAnimation(animationProgress);
            } else if (wrapperTop < -(wrapperHeight - viewportHeight + triggerMargin)) {
                // Animation complete - restore normal flow
                if (hasTriggered) {
                    console.log('✅ Créno animation complete, starting cleanup');
                    crenoSection.style.position = 'relative';
                    crenoSection.style.top = '0';
                    crenoSection.style.bottom = 'auto';
                    crenoSection.style.left = 'auto';
                    crenoSection.style.right = 'auto';
                    crenoSection.style.zIndex = '1';
                    hasTriggered = false;
                    animationLock = false; // Reset lock
                    triggerTimestamp = 0; // Reset timestamp
                    // Remove placeholder
                    const placeholder = wrapper.querySelector('.creno-placeholder');
                    if (placeholder) {
                        placeholder.remove();
                        console.log('🗑️ Placeholder removed');
                    }
                    
                    // Mark wrapper as complete
                    wrapper.classList.add('animation-complete');
                    
                    // Move section out of wrapper immediately to prevent double appearance
                    if (wrapper.parentNode) {
                        wrapper.parentNode.insertBefore(crenoSection, wrapper.nextSibling);
                        // Collapse wrapper gradually
                        wrapper.style.transition = 'height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        wrapper.style.height = '0';
                        wrapper.style.minHeight = '0';
                        wrapper.style.overflow = 'hidden';
                        
                        setTimeout(() => {
                            if (wrapper.parentNode) {
                                wrapper.remove();
                            }
                        }, 600);
                    }
                    
                    crenoSection.style.position = 'relative';
                    crenoSection.style.zIndex = '1';
                    crenoSection.style.opacity = '1';
                    crenoSection.style.transition = 'opacity 0.3s ease';
                }
                updateAnimation(totalSteps);
            } else {
                // Reset all animations
                if (hasTriggered) {
                    // Remove transition to avoid visual glitch
                    crenoSection.style.transition = 'none';
                    crenoSection.style.position = 'relative';
                    hasTriggered = false;
                    animationLock = false; // Reset lock
                    triggerTimestamp = 0; // Reset timestamp
                    // Remove placeholder
                    const placeholder = wrapper.querySelector('.creno-placeholder');
                    if (placeholder) placeholder.remove();
                    
                    // Re-enable transitions after a frame
                    requestAnimationFrame(() => {
                        crenoSection.style.transition = '';
                    });
                }
                crenoLogo.style.transform = '';
                crenoLogo.style.opacity = '';
                statsContainer.style.display = 'none';
                stats.forEach((stat, index) => {
                    stat.style.opacity = '0';
                    if (index === 0) {
                        stat.style.transform = 'translateY(30px) rotate(-12deg)';
                    } else if (index === 1) {
                        stat.style.transform = 'translateY(30px) rotate(15deg)';
                    }
                    delete stat.dataset.animated;
                });
                crenoTitle.style.opacity = '';
                crenoSubtitle.style.opacity = '';
                crenoContent.style.opacity = '';
            }
        };
        
        // Use requestAnimationFrame with throttling for optimal performance
        let ticking = false;
        let lastScrollTime = 0;
        const scrollHandler = () => {
            const now = performance.now();
            // Increase throttle time to reduce multiple triggers
            if (!ticking && now - lastScrollTime > 32) { // 30fps throttle for smoother animation
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                    lastScrollTime = performance.now();
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', handleScroll);
    }
    
    // PixShare scroll-triggered animation
    const pixshareSection = document.querySelector('.pixshare-scroll-trigger');
    if (pixshareSection) {
        const pixshareLogo = pixshareSection.querySelector('.pixshare-logo');
        const statsContainer = pixshareSection.querySelector('.pixshare-stats-showcase');
        const stats = pixshareSection.querySelectorAll('.pixshare-stat');
        const pixshareTitle = pixshareSection.querySelector('.pixshare-title');
        const pixshareSubtitle = pixshareSection.querySelector('.pixshare-subtitle');
        const pixshareContent = pixshareSection.querySelector('.pixshare-content');
        
        let isAnimating = false;
        let animationProgress = 0;
        let hasTriggered = false;
        const totalSteps = 5;
        
        // Check if wrapper already exists to prevent duplicates
        let wrapper = pixshareSection.closest('.pixshare-wrapper');
        if (!wrapper) {
            // Create wrapper for scroll animation
            wrapper = document.createElement('div');
            // Adaptive height based on viewport
            const viewportHeight = window.innerHeight;
            // Pour un écran de 749px, utiliser 300vh pour plus d'espace d'animation
            const wrapperHeight = viewportHeight < 800 ? '300vh' : (viewportHeight < 900 ? '250vh' : '200vh');
            wrapper.style.minHeight = wrapperHeight;
            wrapper.style.position = 'relative';
            wrapper.classList.add('animation-wrapper', 'pixshare-wrapper');
            pixshareSection.parentNode.insertBefore(wrapper, pixshareSection);
            wrapper.appendChild(pixshareSection);
        }
        
        // Initial setup to prevent jump
        pixshareSection.style.position = 'relative';
        pixshareSection.style.width = '100%';
        pixshareSection.style.height = '100vh';
        pixshareSection.style.top = '0';
        
        // Counter animation function
        const animateCounter = (element, target, suffix = '') => {
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (target > 1000) {
                        element.textContent = (current / 1000).toFixed(1) + 'K' + suffix;
                    } else {
                        element.textContent = Math.floor(current) + suffix;
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target > 1000) {
                        element.textContent = (target / 1000).toFixed(1) + 'K' + suffix;
                    } else {
                        element.textContent = target + suffix;
                    }
                }
            };
            
            updateCounter();
        };
        
        const updateAnimation = (progress) => {
            // Step 1: Logo shrinks
            if (progress <= 1) {
                const scale = 1 - (progress * 0.4);
                pixshareLogo.style.transform = `scale(${scale})`;
                pixshareLogo.style.opacity = 1 - (progress * 0.3);
                
                // Keep section centered during animation
                pixshareSection.style.display = 'flex';
                pixshareSection.style.alignItems = 'center';
                pixshareSection.style.justifyContent = 'center';
            }
            
            // Step 2: Show stats container
            if (progress > 1 && progress <= 2) {
                statsContainer.style.display = 'block';
                pixshareLogo.style.transform = 'scale(0.6)';
                pixshareLogo.style.opacity = '0.7';
            }
            
            // Step 3-5: Animate stats
            stats.forEach((stat, index) => {
                const statStart = 2 + index * 0.5;
                const statProgress = Math.max(0, Math.min(1, (progress - statStart) / 0.5));
                
                if (statProgress > 0) {
                    stat.style.opacity = statProgress;
                    const yOffset = 30 - (statProgress * 30);
                    
                    if (index === 0) {
                        stat.style.transform = `translateY(${yOffset}px) translateX(${-30 + statProgress * 30}px) rotate(-12deg) scale(${0.8 + statProgress * 0.2}) translateZ(0)`;
                    } else if (index === 1) {
                        stat.style.transform = `translateY(${yOffset}px) translateX(${30 - statProgress * 30}px) rotate(15deg) scale(${0.8 + statProgress * 0.2}) translateZ(0)`;
                    } else {
                        stat.style.transform = `translateY(${yOffset + 30}px) rotate(-8deg) scale(${0.8 + statProgress * 0.2}) translateZ(0)`;
                    }
                    
                    stat.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    stat.style.willChange = 'transform, opacity';
                    
                    // Animate numbers
                    if (statProgress > 0.5 && !stat.dataset.animated) {
                        stat.dataset.animated = 'true';
                        const numberEl = stat.querySelector('.stat-number');
                        if (index === 0) animateCounter(numberEl, 45200);
                        if (index === 1) animateCounter(numberEl, 8750);
                        if (index === 2 && numberEl) numberEl.textContent = '2.1 TB';
                    }
                }
            });
            
            // Fade text elements
            const textOpacity = Math.max(0.2, 1 - (progress / totalSteps));
            pixshareTitle.style.opacity = textOpacity;
            pixshareSubtitle.style.opacity = textOpacity * 0.8;
            pixshareContent.style.opacity = textOpacity * 0.6;
        };
        
        const handleScroll = () => {
            // Check if wrapper still exists
            if (!wrapper || !wrapper.parentNode) return;
            
            const rect = wrapper.getBoundingClientRect();
            const wrapperTop = rect.top;
            const wrapperHeight = wrapper.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate progress with better precision
            const scrollProgress = Math.max(0, Math.min(1, -wrapperTop / (wrapperHeight - viewportHeight)));
            
            // Apply cubic easing for smoother animation
            const easedProgress = scrollProgress < 0.5 
                ? 4 * scrollProgress * scrollProgress * scrollProgress 
                : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2;
            
            // Adaptive trigger margin based on screen size
            // Pour viewport 749px, utiliser une marge très faible pour déclencher plus tôt
            const triggerMargin = viewportHeight < 800 ? viewportHeight * 0.05 : (viewportHeight < 900 ? viewportHeight * 0.15 : viewportHeight * 0.1);
            
            if (wrapperTop <= -triggerMargin && wrapperTop > -(wrapperHeight - viewportHeight + triggerMargin)) {
                if (!hasTriggered && pixshareSection.style.position !== 'fixed') {
                    hasTriggered = true;
                    
                    // Check if placeholder already exists
                    if (!wrapper.querySelector('.pixshare-placeholder')) {
                        // Add placeholder BEFORE changing position to prevent jump
                        const placeholder = document.createElement('div');
                        placeholder.style.height = '100vh';
                        placeholder.style.width = '100%';
                        placeholder.className = 'pixshare-placeholder';
                        wrapper.insertBefore(placeholder, pixshareSection);
                    }
                    
                    // Switch to fixed positioning immediately at current viewport position
                    pixshareSection.style.position = 'fixed';
                    pixshareSection.style.top = '0';
                    pixshareSection.style.left = '0';
                    pixshareSection.style.right = '0';
                    pixshareSection.style.zIndex = '50';
                    pixshareSection.style.transition = 'none'; // No transition for initial positioning
                }
                
                animationProgress = easedProgress * totalSteps;
                updateAnimation(animationProgress);
            } else if (wrapperTop < -(wrapperHeight - viewportHeight + triggerMargin)) {
                // Animation complete - restore normal flow
                if (hasTriggered) {
                    console.log('PixShare animation complete - resetting wrapper');
                    pixshareSection.style.position = 'relative';
                    pixshareSection.style.top = '0';
                    pixshareSection.style.bottom = 'auto';
                    pixshareSection.style.left = 'auto';
                    pixshareSection.style.right = 'auto';
                    pixshareSection.style.zIndex = '1';
                    hasTriggered = false;
                    // Remove placeholder
                    const placeholder = wrapper.querySelector('.pixshare-placeholder');
                    if (placeholder) placeholder.remove();
                    
                    // Mark wrapper as complete
                    wrapper.classList.add('animation-complete');
                    
                    // Move section out of wrapper immediately to prevent double appearance
                    if (wrapper.parentNode) {
                        wrapper.parentNode.insertBefore(pixshareSection, wrapper.nextSibling);
                        // Collapse wrapper gradually
                        wrapper.style.transition = 'height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        wrapper.style.height = '0';
                        wrapper.style.minHeight = '0';
                        wrapper.style.overflow = 'hidden';
                        
                        setTimeout(() => {
                            if (wrapper.parentNode) {
                                wrapper.remove();
                            }
                        }, 600);
                    }
                    
                    pixshareSection.style.position = 'relative';
                    pixshareSection.style.zIndex = '1';
                    pixshareSection.style.opacity = '1';
                    pixshareSection.style.transition = 'opacity 0.3s ease';
                    
                    console.log('PixShare animation complete - wrapper collapsing');
                }
                updateAnimation(totalSteps);
            } else {
                // Reset animations
                if (hasTriggered) {
                    // Remove transition to avoid visual glitch
                    pixshareSection.style.transition = 'none';
                    pixshareSection.style.position = 'relative';
                    hasTriggered = false;
                    // Remove placeholder
                    const placeholder = wrapper.querySelector('.pixshare-placeholder');
                    if (placeholder) placeholder.remove();
                    
                    // Re-enable transitions after a frame
                    requestAnimationFrame(() => {
                        pixshareSection.style.transition = '';
                    });
                }
                pixshareLogo.style.transform = '';
                pixshareLogo.style.opacity = '';
                statsContainer.style.display = 'none';
                stats.forEach((stat, index) => {
                    stat.style.opacity = '0';
                    if (index === 0) {
                        stat.style.transform = 'translateY(30px) rotate(-12deg)';
                    } else if (index === 1) {
                        stat.style.transform = 'translateY(30px) rotate(15deg)';
                    }
                    delete stat.dataset.animated;
                });
                pixshareTitle.style.opacity = '';
                pixshareSubtitle.style.opacity = '';
                pixshareContent.style.opacity = '';
            }
        };
        
        // Use requestAnimationFrame with throttling for optimal performance
        let ticking = false;
        let lastScrollTime = 0;
        const scrollHandler = () => {
            const now = performance.now();
            // Increase throttle time to reduce multiple triggers
            if (!ticking && now - lastScrollTime > 32) { // 30fps throttle for smoother animation
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                    lastScrollTime = performance.now();
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', handleScroll);
    }
});

// Export for use in other scripts
window.DJIAnimations = DJIAnimations;
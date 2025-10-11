// ANIMATION CONTRÔLÉE PAR LE SCROLL - LOGO RECULE ET S'ASSOMBRIT

(function() {
    // // console.log('🎯 Scroll Controlled Animation - Version finale');

    document.addEventListener('DOMContentLoaded', function() {
        const sections = [
            { name: 'creno', color: '#ffc605' },
            { name: 'pixshare', color: '#9333ea' },
            { name: 'findmycourt', color: '#FFD700' },
            { name: 'fakt', color: '#87CEEB' }
        ];

        sections.forEach(config => {
            setupAnimation(config);
        });
    });

    function setupAnimation(config) {
        // // console.log(`📦 Configuration ${config.name}...`);

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

        let state = {
            triggered: false,
            scrollStart: 0,
            animationsComplete: false
        };

        // Détection iOS Safari
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOSSafari = isIOS && isSafari;

        if (isIOSSafari) {
            // console.log(`🍎 ${config.name} - Mode iOS Safari activé`);
        }

        // Utiliser Intersection Observer pour une meilleure détection sur mobile
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: isIOSSafari ? '-10% 0px -10% 0px' : '0px', // Zone plus large sur iOS
                threshold: isIOSSafari
                    ? [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8] // Plus de seuils sur iOS
                    : [0.3, 0.5, 0.7]
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Sur iOS, déclencher dès 20% de visibilité pour compenser le momentum scroll
                    const triggerRatio = isIOSSafari ? 0.2 : 0.4;

                    if (entry.isIntersecting && entry.intersectionRatio > triggerRatio && !state.triggered) {
                        // console.log(`🎯 ${config.name} - ANIMATION DÉCLENCHÉE (Observer ${Math.round(entry.intersectionRatio * 100)}%)!`);
                        state.triggered = true;
                        state.scrollStart = window.scrollY;
                        startAnimation();
                    }
                });
            }, observerOptions);

            // Observer le conteneur entier, pas juste le logo
            if (elements.container) {
                observer.observe(elements.container);
            }
        }

        function checkAnimation() {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (!elements.logo || !elements.text) return;

            // Point de déclenchement
            const logoRect = elements.logo.getBoundingClientRect();
            const textRect = elements.text.getBoundingClientRect();
            const triggerPoint = (logoRect.top + logoRect.height/2 + textRect.top) / 2;
            const distance = Math.abs(triggerPoint - viewportHeight/2);

            // Debug proche du centre - Plus verbeux sur iOS
            if (isIOSSafari && !state.triggered) {
                if (distance < 400) {
                    // console.log(`📏 ${config.name} - Distance: ${Math.round(distance)}px | Scroll: ${Math.round(window.scrollY)}px | Container top: ${Math.round(rect.top)}px`);
                }
            } else if (distance < 200 && !state.triggered) {
                // console.log(`📏 ${config.name} - Distance: ${Math.round(distance)}px`);
            }

            // DÉCLENCHER L'ANIMATION - Zone élargie pour iOS
            const threshold = isIOSSafari ? 250 : 150; // Plus grande zone sur iOS
            if (distance < threshold && !state.triggered) {
                // console.log(`🎯 ${config.name} - ANIMATION DÉCLENCHÉE! Distance: ${Math.round(distance)}px, Threshold: ${threshold}px`);
                state.triggered = true;
                state.scrollStart = window.scrollY;

                // Démarrer l'animation sans bloquer le scroll
                startAnimation();
            }

            // PAS DE RESET - Une fois jouée, l'animation reste figée jusqu'au rafraîchissement
            // Les stats restent visibles en permanence après l'animation
        }
        
        function startAnimation() {
            // console.log(`▶️ ${config.name} - Animation démarrée`);
            
            // Animation automatique sans blocage
            const duration = 2500; // 2.5 secondes
            const startTime = Date.now();
            
            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / duration);
                
                applyScrollAnimation(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // console.log(`✅ ${config.name} - Animation terminée`);
                    state.animationsComplete = true;
                    
                    // S'assurer que les stats restent visibles
                    elements.stats.style.display = 'block';
                    elements.stats.style.opacity = '1';
                    
                    // Garder tous les éléments dans leur état final
                    elements.statItems.forEach(stat => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                    });
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        
        function applyScrollAnimation(progress) {
            // PHASE 1 (0-40%) : Logo et texte reculent et s'assombrissent
            if (progress <= 0.4) {
                const phase1Progress = progress / 0.4;
                
                // Reculer (scale down) et assombrir
                const scale = 1 - (phase1Progress * 0.1); // 1 → 0.9 (très peu de dézoom)
                const translateZ = phase1Progress * -30; // Effet de profondeur léger
                const opacity = 1 - (phase1Progress * 0.2); // 1 → 0.8 (très visible)
                
                elements.logo.style.transform = `translate(-50%, -50%) scale(${scale}) translateZ(${translateZ}px)`;
                elements.logo.style.opacity = opacity;
                elements.logo.style.filter = `brightness(${1 - phase1Progress * 0.5})`;
                
                if (elements.text) {
                    elements.text.style.transform = `translateY(${phase1Progress * 20}px) scale(${scale})`;
                    elements.text.style.opacity = opacity;
                }
            }
            
            // PHASE 2 (30-100%) : Statistiques apparaissent progressivement
            if (progress > 0.3) {
                // S'assurer que le logo reste en arrière-plan
                if (progress > 0.4) {
                    elements.logo.style.transform = `translate(-50%, -50%) scale(0.9) translateZ(-30px)`;
                    elements.logo.style.opacity = 0.8;
                    elements.logo.style.filter = 'brightness(0.7)';
                    
                    if (elements.text) {
                        elements.text.style.transform = 'translateY(20px) scale(0.9)';
                        elements.text.style.opacity = '0.7';
                    }
                }
                
                // Afficher les stats
                if (elements.stats.style.display !== 'block') {
                    showStats();
                }
                
                // Animer chaque stat en fonction du progress
                const statsProgress = (progress - 0.3) / 0.7; // 0 à 1 sur 70% du progress
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // Sur mobile, toutes les stats s'animent ensemble pour le carrousel
                    elements.statItems.forEach((stat, index) => {
                        if (statsProgress > 0) {
                            stat.style.opacity = statsProgress;
                            stat.style.transform = `scale(${0.8 + statsProgress * 0.2})`;
                            
                            // Animer le compteur
                            const counter = stat.querySelector('.stat-counter');
                            if (counter && statsProgress > 0.3 && !counter.dataset.animating) {
                                counter.dataset.animating = 'true';
                                animateCounter(counter, statsProgress);
                            }
                        }
                    });
                } else {
                    // Desktop : animation progressive
                    elements.statItems.forEach((stat, index) => {
                        // Chaque stat apparaît à un moment différent
                        const statStart = index * 0.2; // 0, 0.2, 0.4, 0.6
                        const statProgress = Math.max(0, Math.min(1, (statsProgress - statStart) / 0.3));
                        
                        if (statProgress > 0) {
                            stat.style.opacity = statProgress;
                            stat.style.transform = `translateY(${(1 - statProgress) * 30}px) scale(${0.8 + statProgress * 0.2})`;
                            
                            // Animer le compteur
                            const counter = stat.querySelector('.stat-counter');
                            if (counter && statProgress > 0.5 && !counter.dataset.animating) {
                                counter.dataset.animating = 'true';
                                animateCounter(counter, statProgress);
                            }
                        }
                    });
                }
            }
        }
        
        function showStats() {
            // console.log(`📊 ${config.name} - Préparation des stats`);
            
            // Détecter si on est sur mobile
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Configuration mobile avec carrousel
                setupMobileCarousel();
            } else {
                // Configuration desktop (comme avant)
                elements.stats.style.cssText = `
                    display: block !important;
                    opacity: 1 !important;
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 90vw !important;
                    max-width: 1000px !important;
                    height: 80vh !important;
                    z-index: 30 !important;
                    pointer-events: none !important;
                `;
                
                // Préparer les stats (invisibles au début)
                elements.statItems.forEach(stat => {
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateY(30px) scale(0.8)';
                    stat.style.transition = 'all 0.4s ease-out';
                });
            }
        }
        
        function setupMobileCarousel() {
            // console.log(`📱 ${config.name} - Configuration carrousel mobile`);
            
            // Container principal - au-dessus du logo
            elements.stats.style.cssText = `
                display: block !important;
                opacity: 1 !important;
                position: absolute !important;
                top: 35% !important;
                left: 0 !important;
                right: 0 !important;
                transform: translateY(-100%) !important;
                width: 100% !important;
                height: auto !important;
                overflow: hidden !important;
                z-index: 35 !important;
            `;
            
            // Créer le wrapper du carrousel
            let carouselWrapper = elements.stats.querySelector('.stats-carousel-wrapper');
            if (!carouselWrapper) {
                carouselWrapper = document.createElement('div');
                carouselWrapper.className = 'stats-carousel-wrapper';
                
                // Déplacer toutes les stats dans le wrapper
                while (elements.stats.firstChild) {
                    carouselWrapper.appendChild(elements.stats.firstChild);
                }
                elements.stats.appendChild(carouselWrapper);
            }
            
            // Style du wrapper
            carouselWrapper.style.cssText = `
                display: flex !important;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                width: ${elements.statItems.length * 100}% !important;
            `;
            
            // Configurer chaque stat
            elements.statItems.forEach((stat, index) => {
                stat.style.cssText = `
                    flex: 0 0 ${100 / elements.statItems.length}% !important;
                    width: ${100 / elements.statItems.length}% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.4s ease-out;
                `;
            });
            
            // Créer les indicateurs (dots)
            let indicators = elements.stats.querySelector('.carousel-indicators');
            if (!indicators) {
                indicators = document.createElement('div');
                indicators.className = 'carousel-indicators';
                
                elements.statItems.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.className = 'carousel-dot';
                    if (index === 0) dot.classList.add('active');
                    dot.dataset.index = index;
                    
                    // Click sur un dot
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                    });
                    
                    indicators.appendChild(dot);
                });
                
                elements.stats.appendChild(indicators);
            }
            
            // Variables pour le swipe
            let currentSlide = 0;
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            // Fonction pour aller à un slide
            function goToSlide(index) {
                currentSlide = index;
                const offset = -index * (100 / elements.statItems.length);
                carouselWrapper.style.transform = `translateX(${offset}%)`;
                
                // Mettre à jour les dots
                indicators.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            // Auto-rotation toutes les 3 secondes (gauche à droite uniquement)
            let autoRotateInterval = setInterval(() => {
                if (!isDragging) {
                    currentSlide++;
                    // Si on arrive à la fin, revenir au début
                    if (currentSlide >= elements.statItems.length) {
                        currentSlide = 0;
                    }
                    goToSlide(currentSlide);
                }
            }, 3000);
            
            // Gestion du swipe tactile
            carouselWrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                clearInterval(autoRotateInterval);
            }, { passive: true });
            
            carouselWrapper.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                const offset = -currentSlide * (100 / elements.statItems.length) + (diff / window.innerWidth) * 100;
                carouselWrapper.style.transform = `translateX(${offset}%)`;
            }, { passive: true });
            
            carouselWrapper.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;
                
                const diff = currentX - startX;
                const threshold = window.innerWidth / 4;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0 && currentSlide > 0) {
                        currentSlide--;
                    } else if (diff < 0 && currentSlide < elements.statItems.length - 1) {
                        currentSlide++;
                    }
                }
                
                goToSlide(currentSlide);
                
                // Redémarrer l'auto-rotation (gauche à droite uniquement)
                autoRotateInterval = setInterval(() => {
                    if (!isDragging) {
                        currentSlide++;
                        // Si on arrive à la fin, revenir au début
                        if (currentSlide >= elements.statItems.length) {
                            currentSlide = 0;
                        }
                        goToSlide(currentSlide);
                    }
                }, 3000);
            });
        }
        
        function animateCounter(counter, speed = 1) {
            const target = parseFloat(counter.dataset.target) || 0;
            const duration = 1500 / speed;
            const start = Date.now();
            const startValue = parseFloat(counter.textContent) || 0;
            
            function update() {
                const progress = Math.min(1, (Date.now() - start) / duration);
                const current = startValue + (target - startValue) * progress;
                
                if (target > 10000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'K';
                } else if (target > 1000) {
                    counter.textContent = Math.floor(current).toLocaleString('fr-FR');
                } else if (target < 10) {
                    // Pour les notes (comme 4.8)
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
                
                if (progress < 1) requestAnimationFrame(update);
            }
            
            update();
        }
        
        // Fonction resetAnimation supprimée - L'animation ne se reset jamais
        // Elle ne se rejoue qu'après un rafraîchissement de la page
        
        // Écouter le scroll et la molette pour une détection plus rapide
        let ticking = false;
        let lastScrollY = window.scrollY;

        function handleScrollCheck() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    checkAnimation();
                    lastScrollY = window.scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }

        // Pour iOS Safari, utiliser aussi touchend et scrollend
        if (isIOSSafari) {
            // Sur iOS, le scroll continue après le touch (momentum scrolling)
            let scrollTimeout;
            let checkInterval;

            const checkWithDebounce = () => {
                checkAnimation();
                clearTimeout(scrollTimeout);
                clearInterval(checkInterval);

                // Vérifier toutes les 50ms pendant le momentum scroll
                checkInterval = setInterval(checkAnimation, 50);

                scrollTimeout = setTimeout(() => {
                    clearInterval(checkInterval);
                    checkAnimation(); // Vérification finale
                }, 500); // Attendre 500ms après le dernier scroll
            };

            window.addEventListener('scroll', checkWithDebounce, { passive: true });
            window.addEventListener('touchmove', handleScrollCheck, { passive: true });
            window.addEventListener('touchstart', () => {
                // Vérifier dès le début du touch
                checkAnimation();
            }, { passive: true });
            window.addEventListener('touchend', () => {
                // Vérifier plusieurs fois après le touchend car le scroll continue
                for (let i = 0; i < 10; i++) {
                    setTimeout(checkAnimation, i * 100);
                }
            }, { passive: true });

            // Vérification périodique supplémentaire sur iOS pour capturer le scroll
            // console.log(`⏰ ${config.name} - Démarrage vérification périodique iOS (toutes les 200ms)`);
            const iosCheckInterval = setInterval(() => {
                if (!state.triggered) {
                    checkAnimation();
                }
            }, 200);

            // Nettoyer l'interval quand l'animation est déclenchée
            const originalStartAnimation = startAnimation;
            startAnimation = function() {
                clearInterval(iosCheckInterval);
                clearInterval(checkInterval);
                originalStartAnimation();
            };
        } else {
            // Desktop et Android
            window.addEventListener('scroll', handleScrollCheck);
            window.addEventListener('wheel', handleScrollCheck, { passive: true });
            window.addEventListener('touchmove', handleScrollCheck, { passive: true });
        }
        
        // console.log(`✅ ${config.name} prêt - Scroll pour contrôler l'animation`);
    }
})();
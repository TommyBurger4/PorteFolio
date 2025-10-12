// Système d'animations basé sur IntersectionObserver
// Propre, fiable, fonctionne sur tous les écrans

(function() {
    // Détecter le device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    console.log(`📱 Section Animations - Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);

    // Sélectionner toutes les sections avec animations
    const animationSections = document.querySelectorAll('[class*="-animation-container"]');

    if (animationSections.length === 0) {
        console.log('⚠️ Aucune section d\'animation trouvée');
        return;
    }

    console.log(`✅ ${animationSections.length} sections d'animation détectées`);

    // Observer avec plusieurs seuils pour tous les écrans
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionName = section.className.match(/(\w+)-animation-container/)?.[1] || 'unknown';

            // Détecter l'entrée dans le viewport (>50% visible)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {

                if (!section.dataset.animated) {
                    console.log(`🎬 Animation START: ${sectionName.toUpperCase()} (${Math.round(entry.intersectionRatio * 100)}% visible)`);

                    section.dataset.animated = 'true';
                    section.classList.add('section-visible');

                    // Déclencher l'animation après un court délai
                    setTimeout(() => {
                        triggerSectionAnimation(section, sectionName);
                    }, 100);
                }
            }
        });
    }, {
        // Plusieurs seuils pour détecter progressivement
        threshold: [0, 0.25, 0.5, 0.75, 1],
        // Marge pour anticiper l'entrée
        rootMargin: '0px 0px -10% 0px'
    });

    // Observer toutes les sections
    animationSections.forEach(section => {
        observer.observe(section);
        console.log(`👁️ Observing: ${section.className}`);
    });

    // Fonction pour déclencher les animations spécifiques
    function triggerSectionAnimation(section, sectionName) {
        // Zoom du logo
        const logo = section.querySelector(`[class*="${sectionName}-logo-zoom"]`);
        if (logo) {
            logo.style.transform = 'translate(-50%, -50%) scale(0.3)';
            logo.style.opacity = '0.3';
        }

        // Afficher le texte
        const text = section.querySelector(`[class*="${sectionName}-text-content"]`);
        if (text) {
            text.style.opacity = '0';
        }

        // Afficher les stats après 300ms
        setTimeout(() => {
            const statsContainer = section.querySelector(`[class*="${sectionName}-stats-container"]`);
            if (statsContainer) {
                statsContainer.style.display = 'block';

                setTimeout(() => {
                    statsContainer.style.opacity = '1';

                    // Animer chaque stat item
                    const statItems = statsContainer.querySelectorAll(`[class*="${sectionName}-stat-item"]`);
                    statItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';

                            // Animer le compteur
                            const counter = item.querySelector('.stat-counter');
                            if (counter) {
                                animateCounter(counter);
                            }
                        }, index * 150);
                    });
                }, 50);
            }
        }, 300);

        console.log(`✅ Animation déclenchée: ${sectionName.toUpperCase()}`);
    }

    // Animation de compteur
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        if (isNaN(target)) return;

        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }

    console.log('✅ Section Animations - IntersectionObserver actif');
})();

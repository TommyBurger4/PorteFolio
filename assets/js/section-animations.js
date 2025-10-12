// Système d'animations basé sur IntersectionObserver
// Propre, fiable, fonctionne sur tous les écrans

console.log('🚀 SCRIPT SECTION-ANIMATIONS.JS CHARGÉ !');
console.log('🌍 User Agent:', navigator.userAgent);
console.log('📄 Document ready state:', document.readyState);

// Attendre que le DOM soit prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM READY - Démarrage du système d\'animations');
    initSectionAnimations();
});

// Si le DOM est déjà prêt (script chargé après DOMContentLoaded)
if (document.readyState === 'loading') {
    console.log('⏳ En attente du DOM...');
} else {
    console.log('✅ DOM déjà prêt - Démarrage immédiat');
    initSectionAnimations();
}

function initSectionAnimations() {
    console.log('🔥 INIT SECTION ANIMATIONS !');

    // Détecter le device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    console.log(`📱 Section Animations - Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);

    // Sélectionner toutes les sections avec animations
    console.log('🔍 Recherche des sections avec [class*="-animation-container"]...');
    const animationSections = document.querySelectorAll('[class*="-animation-container"]');
    console.log('📦 Sections trouvées:', animationSections.length);

    // Logger chaque section trouvée
    animationSections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.className}`);
    });

    if (animationSections.length === 0) {
        console.log('⚠️ Aucune section d\'animation trouvée');
        console.log('🔍 Vérification du DOM...');
        console.log('Toutes les sections:', document.querySelectorAll('section').length);
        return;
    }

    console.log(`✅ ${animationSections.length} sections d'animation détectées`);

    // Observer avec plusieurs seuils pour tous les écrans
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const sectionName = section.className.match(/(\w+)-animation-container/)?.[1] || 'unknown';
            const ratio = Math.round(entry.intersectionRatio * 100);

            // Logger TOUS les changements de visibilité
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📱 SECTION: ${sectionName.toUpperCase()}`);
            console.log(`👁️ VISIBLE: ${ratio}%`);
            console.log(`🎯 IS INTERSECTING: ${entry.isIntersecting ? 'YES' : 'NO'}`);
            console.log(`🔒 ALREADY ANIMATED: ${section.dataset.animated === 'true' ? 'YES' : 'NO'}`);
            console.log(`📊 BOUNDS: top=${Math.round(entry.boundingClientRect.top)}, bottom=${Math.round(entry.boundingClientRect.bottom)}`);

            // Détecter l'entrée dans le viewport (>50% visible)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                console.log(`✅ CONDITION MET: >=50% visible`);

                if (!section.dataset.animated) {
                    console.log(`🚨 DÉCLENCHEMENT ANIMATION: ${sectionName.toUpperCase()} (${ratio}% visible)`);

                    section.dataset.animated = 'true';
                    section.classList.add('section-visible');

                    // Déclencher l'animation après un court délai
                    setTimeout(() => {
                        triggerSectionAnimation(section, sectionName);
                    }, 100);
                } else {
                    console.log(`⏭️ SKIP: Animation déjà lancée`);
                }
            } else {
                if (ratio < 50) {
                    console.log(`⚠️ CONDITION NOT MET: Seulement ${ratio}% visible (besoin >=50%)`);
                } else if (!entry.isIntersecting) {
                    console.log(`⚠️ CONDITION NOT MET: Pas dans le viewport`);
                }
            }
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
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
        // Phase 1 : Logo et texte reculent légèrement en arrière-plan
        const logo = section.querySelector(`[class*="${sectionName}-logo-zoom"]`);
        if (logo) {
            logo.style.transform = 'translate(-50%, -50%) scale(0.9)'; // Léger zoom arrière
            logo.style.opacity = '0.8'; // Encore visible
            logo.style.filter = 'brightness(0.7)'; // Légèrement assombri
        }

        // Le texte reste visible mais en retrait
        const text = section.querySelector(`[class*="${sectionName}-text-content"]`);
        if (text) {
            text.style.opacity = '0.7'; // Encore visible
            text.style.transform = 'translateY(20px) scale(0.9)'; // Léger décalage
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
}

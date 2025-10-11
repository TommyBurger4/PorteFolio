// PANNEAU DE DEBUG POUR SAFARI iOS
(function() {
    // Détecter iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (!isIOS) {
        console.log('🖥️ Desktop détecté - Pas de panneau de debug');
        return;
    }

    console.log('📱 iPhone détecté - Création du panneau de debug');

    // Créer le panneau de debug
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: #0f0;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        padding: 10px;
        border-radius: 8px;
        z-index: 99999;
        max-width: 200px;
        border: 2px solid #0f0;
        line-height: 1.4;
        pointer-events: none;
    `;

    document.body.appendChild(debugPanel);

    // Variables de tracking
    let currentSection = 'none';
    let lastScrollY = 0;
    let scrollDirection = 'none';
    let scrollEvents = 0;

    function updateDebugPanel() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Déterminer la direction
        if (scrollY > lastScrollY) {
            scrollDirection = 'DOWN ↓';
        } else if (scrollY < lastScrollY) {
            scrollDirection = 'UP ↑';
        }
        lastScrollY = scrollY;

        // Trouver la section actuelle - celle qui occupe le plus de viewport
        const sections = [
            { id: 'home', selector: '#home' },
            { id: 'about', selector: '#about' },
            { id: 'creno-showcase', selector: '.creno-animation-container' },
            { id: 'pixshare-showcase', selector: '.pixshare-animation-container' },
            { id: 'findmycourt-showcase', selector: '.findmycourt-animation-container' },
            { id: 'fakt-showcase', selector: '.fakt-animation-container' }
        ];

        let nearestSection = 'none';
        let maxVisibleArea = 0;
        let minDistance = Infinity;

        sections.forEach(sectionConfig => {
            const section = document.querySelector(sectionConfig.selector);

            if (section) {
                const rect = section.getBoundingClientRect();

                // Calculer combien de la section est visible dans le viewport
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                // Calculer la distance du centre de la section au centre du viewport
                const sectionCenter = rect.top + rect.height / 2;
                const viewportCenter = viewportHeight / 2;
                const distance = Math.abs(sectionCenter - viewportCenter);

                // La section avec la plus grande zone visible est la section actuelle
                if (visibleHeight > maxVisibleArea) {
                    maxVisibleArea = visibleHeight;
                    nearestSection = sectionConfig.id;
                    minDistance = distance;
                } else if (visibleHeight === maxVisibleArea && distance < minDistance) {
                    // Si égalité, prendre celle qui est la plus centrée
                    minDistance = distance;
                    nearestSection = sectionConfig.id;
                }
            }
        });

        currentSection = nearestSection;

        // Vérifier les propriétés CSS
        const htmlElement = document.documentElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        const scrollSnapType = computedStyle.scrollSnapType || computedStyle.webkitScrollSnapType || 'none';

        // Vérifier si on est sur une section showcase
        const currentSectionElement = document.querySelector(`.${currentSection.replace('-showcase', '-animation-container')}`);
        let sectionSnapAlign = 'N/A';
        if (currentSectionElement) {
            const sectionStyle = window.getComputedStyle(currentSectionElement);
            sectionSnapAlign = sectionStyle.scrollSnapAlign || sectionStyle.webkitScrollSnapAlign || 'none';
        }

        // Construire le message de debug
        debugPanel.innerHTML = `
            <strong>🐛 DEBUG iOS</strong><br>
            Device: iPhone 16 Pro<br>
            <hr style="border-color: #0f0; margin: 5px 0;">
            Scroll Y: ${Math.round(scrollY)}px<br>
            Direction: ${scrollDirection}<br>
            Events: ${scrollEvents}<br>
            <hr style="border-color: #0f0; margin: 5px 0;">
            Viewport: ${viewportHeight}px<br>
            Doc Height: ${docHeight}px<br>
            Visible Area: ${Math.round(maxVisibleArea)}px<br>
            <hr style="border-color: #0f0; margin: 5px 0;">
            Section: <span style="color: #ff0;">${currentSection}</span><br>
            Distance: ${Math.round(minDistance)}px<br>
            <hr style="border-color: #0f0; margin: 5px 0;">
            HTML Snap: <span style="color: ${scrollSnapType === 'none' ? '#f00' : '#0f0'}">${scrollSnapType}</span><br>
            Section Snap: <span style="color: ${sectionSnapAlign === 'none' ? '#f00' : '#0f0'}">${sectionSnapAlign}</span><br>
            Touch Scroll: ${computedStyle.webkitOverflowScrolling || 'auto'}
        `;
    }

    // Écouter tous les événements de scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        scrollEvents++;
        updateDebugPanel();

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            console.log('📊 Scroll stopped at:', {
                scrollY: window.scrollY,
                section: currentSection,
                direction: scrollDirection
            });
        }, 150);
    }, { passive: true });

    // Écouter touchstart
    window.addEventListener('touchstart', function() {
        console.log('👆 Touch start at Y:', window.scrollY);
        updateDebugPanel();
    }, { passive: true });

    // Écouter touchend
    window.addEventListener('touchend', function() {
        console.log('👆 Touch end at Y:', window.scrollY);
        setTimeout(updateDebugPanel, 100);
        setTimeout(updateDebugPanel, 500);
    }, { passive: true });

    // Écouter touchmove
    window.addEventListener('touchmove', function() {
        updateDebugPanel();
    }, { passive: true });

    // Écouter les changements de sections
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('👁️ Section visible:', entry.target.id || entry.target.className, 'Ratio:', entry.intersectionRatio);
                }
            });
        }, {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        });

        document.querySelectorAll('.creno-animation-container, .pixshare-animation-container, .findmycourt-animation-container, .fakt-animation-container, .hero-zoom').forEach(el => {
            observer.observe(el);
        });
    }

    // Initial update
    updateDebugPanel();

    // Update toutes les 500ms
    setInterval(updateDebugPanel, 500);

    console.log('✅ Panneau de debug actif');
})();

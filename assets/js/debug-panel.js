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

        // Trouver la section actuelle
        const sections = [
            'home',
            'creno-showcase',
            'pixshare-showcase',
            'findmycourt-showcase',
            'fakt-showcase'
        ];

        let nearestSection = 'none';
        let minDistance = Infinity;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId) ||
                           document.querySelector(`#${sectionId}`) ||
                           document.querySelector(`.${sectionId.replace('-showcase', '-animation-container')}`);

            if (section) {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSection = sectionId;
                }
            }
        });

        currentSection = nearestSection;

        // Vérifier les propriétés CSS
        const htmlElement = document.documentElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        const scrollSnapType = computedStyle.scrollSnapType || computedStyle.webkitScrollSnapType || 'none';

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
            <hr style="border-color: #0f0; margin: 5px 0;">
            Section: <span style="color: #ff0;">${currentSection}</span><br>
            Distance: ${Math.round(minDistance)}px<br>
            <hr style="border-color: #0f0; margin: 5px 0;">
            Snap Type: <span style="color: ${scrollSnapType === 'none' ? '#f00' : '#0f0'}">${scrollSnapType}</span><br>
            Touch Scroll: ${computedStyle.webkitOverflowScrolling || 'none'}
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

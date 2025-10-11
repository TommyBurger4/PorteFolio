// PANNEAU DE DEBUG POUR SAFARI iOS - VERSION DÉTAILLÉE
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
        position: fixed !important;
        top: 80px !important;
        right: 10px !important;
        background: rgba(0, 0, 0, 0.95) !important;
        color: #0f0 !important;
        font-family: 'Courier New', monospace !important;
        font-size: 11px !important;
        padding: 12px !important;
        border-radius: 8px !important;
        z-index: 999999 !important;
        min-width: 250px !important;
        max-width: 280px !important;
        min-height: 300px !important;
        max-height: 85vh !important;
        overflow-y: auto !important;
        border: 3px solid #0f0 !important;
        line-height: 1.5 !important;
        pointer-events: none !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5) !important;
    `;

    document.body.appendChild(debugPanel);

    // Créer l'indicateur rouge central en HTML pur
    const snapIndicatorHTML = `
        <div id="snap-indicator" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            background: red;
            border: 8px solid #ff0000;
            border-radius: 50%;
            z-index: 9999999;
            pointer-events: none;
            box-shadow: 0 0 50px rgba(255, 0, 0, 1);
            display: none;
            opacity: 0;
        ">
            <div style="color: white; font-size: 20px; font-weight: bold; text-align: center; line-height: 120px; font-family: Arial;">SNAP</div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', snapIndicatorHTML);
    const snapIndicator = document.getElementById('snap-indicator');

    // Variables de tracking
    let currentSection = 'none';
    let lastScrollY = 0;
    let scrollDirection = 'none';
    let scrollEvents = 0;
    let shouldSnap = false;
    let scrollBlocked = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let animationProgress = 0; // 0 = début, 100 = animations finies
    let sectionScrollPhase = 'locked'; // 'locked', 'animating', 'unlocked'
    let swipeCount = 0;

    function updateDebugPanel() {
        try {
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

        // Trouver TOUTES les sections du DOM (avec ou sans ID)
        const allSections = document.querySelectorAll('section');

        // Analyser chaque section
        let sectionsData = [];
        let maxVisibleSection = null;
        let maxVisibleHeight = 0;

        allSections.forEach((section, index) => {
            if (section) {
                // Déterminer le nom de la section
                let sectionName = section.id || section.className || `Section-${index}`;

                // Simplifier les noms de classes
                if (sectionName.includes('creno')) sectionName = 'CRÉNO';
                else if (sectionName.includes('pixshare')) sectionName = 'PIXSHARE';
                else if (sectionName.includes('findmycourt')) sectionName = 'FINDMYCOURT';
                else if (sectionName.includes('fakt')) sectionName = 'FAKT';
                else if (sectionName.includes('scroll-section')) sectionName = 'SCROLL-DESC';
                else if (sectionName.includes('upcoming')) sectionName = 'UPCOMING';
                else if (sectionName === 'home') sectionName = 'HOME';
                else if (sectionName === 'about') sectionName = 'ABOUT';
                else if (sectionName === 'projects') sectionName = 'PROJECTS';
                else if (sectionName === 'contact') sectionName = 'CONTACT';

                // Définir l'ID de la section
                const sectionId = section.id || `no-id-${index}`;

                const rect = section.getBoundingClientRect();

                // Calculer la partie visible
                const visibleTop = Math.max(0, rect.top);
                const visibleBottom = Math.min(viewportHeight, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                // Calculer le pourcentage visible
                const percentVisible = rect.height > 0 ? Math.round((visibleHeight / rect.height) * 100) : 0;

                // Calculer la distance du centre au viewport
                const sectionCenter = rect.top + rect.height / 2;
                const viewportCenter = viewportHeight / 2;
                const centerDistance = Math.round(Math.abs(sectionCenter - viewportCenter));

                sectionsData.push({
                    name: sectionName,
                    id: sectionId,
                    element: section,
                    visibleHeight: visibleHeight,
                    percentVisible: percentVisible,
                    centerDistance: centerDistance,
                    rectTop: Math.round(rect.top),
                    rectBottom: Math.round(rect.bottom),
                    height: Math.round(rect.height),
                    index: index
                });

                // Trouver la section la plus visible
                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    maxVisibleSection = sectionName;
                }
            }
        });

        // Trier par visibilité décroissante
        sectionsData.sort((a, b) => b.visibleHeight - a.visibleHeight);

        currentSection = maxVisibleSection || 'none';

        // Vérifier les propriétés CSS
        const htmlElement = document.documentElement;
        const computedStyle = window.getComputedStyle(htmlElement);
        const scrollSnapType = computedStyle.scrollSnapType || computedStyle.webkitScrollSnapType || 'none';
        const webkitOverflow = computedStyle.webkitOverflowScrolling || 'auto';

        // Vérifier la section actuelle
        const currentSectionElement = sectionsData[0]?.element;
        let sectionSnapAlign = 'N/A';
        let sectionHeight = 0;
        if (currentSectionElement) {
            const sectionStyle = window.getComputedStyle(currentSectionElement);
            sectionSnapAlign = sectionStyle.scrollSnapAlign || sectionStyle.webkitScrollSnapAlign || 'none';
            sectionHeight = Math.round(currentSectionElement.offsetHeight);
        }

        // Afficher l'indicateur rouge si la section devrait être snappée
        const topSectionPercent = sectionsData[0]?.percentVisible || 0;
        const hasSnapAlign = sectionSnapAlign !== 'none' && sectionSnapAlign !== 'N/A';
        const topSectionName = sectionsData[0]?.name || '';

        // Liste des sections qui doivent être bloquées (uniquement les projets)
        const sectionsToBlock = ['CRÉNO', 'PIXSHARE', 'FINDMYCOURT', 'FAKT', 'SCROLL-DESC'];

        // Sections qui ne doivent JAMAIS être bloquées
        const sectionsToNeverBlock = ['HOME', 'ABOUT', 'PROJECTS', 'CONTACT', 'UPCOMING'];

        const isBlockableSection = sectionsToBlock.includes(topSectionName);
        const isNeverBlockSection = sectionsToNeverBlock.includes(topSectionName);

        shouldSnap = topSectionPercent > 70 && hasSnapAlign && isBlockableSection && !isNeverBlockSection;

        // Gérer les phases de scroll sur les sections bloquées
        if (shouldSnap && sectionScrollPhase === 'locked') {
            // Phase initiale: section bloquée, attente de swipe pour lancer animations
            scrollBlocked = true;
            snapIndicator.style.setProperty('display', 'block', 'important');
            snapIndicator.style.setProperty('opacity', '1', 'important');
            snapIndicator.style.setProperty('visibility', 'visible', 'important');

            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else if (shouldSnap && sectionScrollPhase === 'animating') {
            // Phase animations: RESTER BLOQUÉ pendant les animations
            scrollBlocked = true;
            snapIndicator.style.setProperty('opacity', '0.5', 'important'); // Légèrement transparent

            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else if (shouldSnap && sectionScrollPhase === 'unlocked') {
            // Phase finale: animations finies, débloquer pour passer à la suite
            scrollBlocked = false;
            snapIndicator.style.setProperty('opacity', '0', 'important');
            setTimeout(() => {
                snapIndicator.style.setProperty('display', 'none', 'important');
            }, 300);

            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        } else {
            // Pas de snap: scroll libre
            scrollBlocked = false;
            sectionScrollPhase = 'locked';
            swipeCount = 0;
            animationProgress = 0;

            snapIndicator.style.setProperty('opacity', '0', 'important');
            setTimeout(() => {
                if (!shouldSnap) {
                    snapIndicator.style.setProperty('display', 'none', 'important');
                    snapIndicator.style.setProperty('visibility', 'hidden', 'important');
                }
            }, 300);

            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        // Construire le message de debug - TOP 5 sections
        let topSections = sectionsData.slice(0, 5).map((s, i) => {
            const indicator = i === 0 ? '→' : ' ';
            const name = s.name.length > 12 ? s.name.substring(0, 12) : s.name;
            return `${indicator} #${s.index} ${name}: ${Math.round(s.visibleHeight)}px (${s.percentVisible}%)`;
        }).join('<br>');

        // Détails de la section actuelle
        const topSection = sectionsData[0];
        let sectionDetails = '';
        if (topSection) {
            sectionDetails = `
                <hr style="border-color: #0f0; margin: 3px 0;">
                <strong>ACTUELLE:</strong><br>
                #${topSection.index} <span style="color: #ff0;">${topSection.name}</span><br>
                ID: ${topSection.id}<br>
                Height: ${topSection.height}px<br>
                Visible: ${Math.round(topSection.visibleHeight)}px<br>
                ${topSection.percentVisible}%<br>
                Top: ${topSection.rectTop}px<br>
                Btm: ${topSection.rectBottom}px
            `;
        }

            let phaseText = 'LIBRE';
            let phaseColor = '#0f0';
            let phaseInfo = '';
            if (sectionScrollPhase === 'locked') {
                phaseText = '🔒 LOCKED';
                phaseColor = '#f00';
                phaseInfo = 'Swipe ↓ pour animer';
            } else if (sectionScrollPhase === 'animating') {
                phaseText = '🎬 ANIMATING';
                phaseColor = '#ff0';
                phaseInfo = 'Animations en cours...';
            } else if (sectionScrollPhase === 'unlocked') {
                phaseText = '✓ UNLOCKED';
                phaseColor = '#0f0';
                phaseInfo = 'Scroll libre';
            }

            debugPanel.innerHTML = `
                <strong>🐛 iOS DEBUG</strong><br>
                <hr style="border-color: #0f0; margin: 3px 0;">
                <strong>PHASE:</strong><br>
                <span style="color: ${phaseColor}; font-weight: bold; font-size: 16px;">
                    ${phaseText}
                </span><br>
                <span style="color: #aaa; font-size: 11px;">${phaseInfo}</span><br>
                <hr style="border-color: #0f0; margin: 3px 0;">
                <strong>ACTUELLE:</strong><br>
                #${topSection?.index} <span style="color: #ff0;">${topSection?.name}</span><br>
                ${topSection?.percentVisible}% visible<br>
                <hr style="border-color: #0f0; margin: 3px 0;">
                Y: ${Math.round(scrollY)}px ${scrollDirection}<br>
            `;
        } catch (error) {
            debugPanel.innerHTML = `
                <strong>🐛 iOS DEBUG - ERROR</strong><br>
                <hr style="border-color: #f00; margin: 3px 0;">
                <span style="color: #f00;">Error: ${error.message}</span><br>
                <span style="color: #f00;">Stack: ${error.stack ? error.stack.substring(0, 200) : 'N/A'}</span>
            `;
            console.error('Debug panel error:', error);
        }
    }

    // Bloquer le scroll avec wheel (souris/trackpad)
    window.addEventListener('wheel', function(e) {
        if (scrollBlocked) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, { passive: false });

    // Écouter tous les événements de scroll
    let scrollTimeout;
    window.addEventListener('scroll', function(e) {
        scrollEvents++;

        // Si le scroll est bloqué, remettre à la position verrouillée
        if (scrollBlocked && lastScrollY !== 0) {
            window.scrollTo(0, lastScrollY);
        }

        updateDebugPanel();

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll stopped - pas de log
        }, 150);
    }, { passive: false });

    // Écouter touchstart
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        updateDebugPanel();
    }, { passive: true });

    // Écouter touchend et gérer progression des animations
    window.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;

        // Si on est sur une section bloquée et qu'on swipe down (>50px)
        if (scrollBlocked && swipeDistance > 50) {
            swipeCount++;

            // Premier swipe: lancer les animations MAIS RESTER BLOQUÉ
            if (sectionScrollPhase === 'locked') {
                sectionScrollPhase = 'animating';

                // Trigger le scroll pour lancer les animations existantes
                window.scrollBy(0, 1);

                // Après 2.5 secondes (durée des animations), débloquer automatiquement
                setTimeout(() => {
                    if (sectionScrollPhase === 'animating') {
                        sectionScrollPhase = 'unlocked';
                        document.body.style.overflow = '';
                        document.documentElement.style.overflow = '';
                        updateDebugPanel();
                    }
                }, 2500); // 2.5 secondes = durée des animations dans scroll-controlled-animation.js
            }
        }

        setTimeout(updateDebugPanel, 100);
        setTimeout(updateDebugPanel, 500);
    }, { passive: true });

    // Écouter touchmove et bloquer si nécessaire
    window.addEventListener('touchmove', function(e) {
        if (scrollBlocked) {
            e.preventDefault();
            e.stopPropagation();
        }
        updateDebugPanel();
    }, { passive: false });

    // Initial update
    updateDebugPanel();

    // Update toutes les 500ms
    setInterval(updateDebugPanel, 500);

    console.log('✅ Panneau de debug détaillé actif');
})();

// Animation simple slide-in pour les descriptions avec effet slow motion

document.addEventListener('DOMContentLoaded', function () {
    Logger.log('🎯 Simple Slide Animation - Initialisation');

    // Sélectionner uniquement les descriptions (pas les éléments dans les animations Créno/PixShare)
    const descriptions = document.querySelectorAll('.slide-in-left');
    const validDescriptions = Array.from(descriptions).filter(el => {
        return !el.closest('.creno-animation-container') && !el.closest('.pixshare-animation-container');
    });

    Logger.log(`📊 Descriptions trouvées: ${validDescriptions.length}`);

    // Plus de ralentissement du scroll

    // Appliquer immédiatement le style initial
    validDescriptions.forEach(desc => {
        desc.style.cssText = `
            opacity: 0;
            transform: translateX(-150px);
            transition: none;
        `;
    });



    // Observer pour déclencher l'animation
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';

                Logger.log('🚀 Animation déclenchée pour:', entry.target.textContent.substring(0, 50) + '...');

                // Lancer l'animation
                setTimeout(() => {
                    entry.target.style.cssText = `
                        opacity: 1;
                        transform: translateX(0);
                        transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        text-align: center;
                        width: 100%;
                    `;
                }, 50);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px 0px'
    });

    validDescriptions.forEach(desc => {
        animationObserver.observe(desc);
    });
});
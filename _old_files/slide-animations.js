// ANIMATIONS SLIDE-IN INDÉPENDANTES

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Slide Animations - Initialisation');
    
    // Attendre un peu pour s'assurer que le DOM est prêt
    setTimeout(() => {
        initSlideAnimations();
    }, 100);
});

function initSlideAnimations() {
    // Exclure les éléments qui sont dans les conteneurs d'animation Créno/PixShare
    const allSlideElements = document.querySelectorAll('.slide-in-left');
    const slideElements = Array.from(allSlideElements).filter(el => {
        return !el.closest('.creno-animation-container') && !el.closest('.pixshare-animation-container');
    });
    
    console.log(`📍 Slide-in elements trouvés: ${slideElements.length} (sur ${allSlideElements.length} total)`);
    
    if (slideElements.length === 0) {
        console.log('⚠️ Aucun élément .slide-in-left trouvé en dehors des animations');
        return;
    }
    
    // Configuration de l'observer
    const options = {
        root: null,
        rootMargin: '-50px 0px', // Ne se déclenche que quand l'élément est 50px dans le viewport
        threshold: 0.3 // Se déclenche quand 30% est visible
    };
    
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                console.log('🚀 Animation slide-in déclenchée pour:', entry.target);
                
                // Marquer comme animé
                entry.target.classList.add('animated');
                
                // Appliquer l'animation directement avec JavaScript
                animateSlideIn(entry.target);
            }
        });
    }, options);
    
    function animateSlideIn(element) {
        console.log('🎬 Début animation pour:', element);
        
        // Supprimer tous les styles inline existants
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
        element.style.removeProperty('transition');
        
        // Appliquer les styles CSS de base
        element.classList.add('slide-animation-ready');
        
        // Forcer le reflow
        void element.offsetHeight;
        
        // Ajouter la classe qui déclenche l'animation CSS
        requestAnimationFrame(() => {
            element.classList.add('slide-animation-active');
            console.log('✨ Animation lancée avec classes CSS');
        });
    }
    
    // Observer chaque élément
    slideElements.forEach((element, index) => {
        // Ne PAS initialiser l'état ici car cela rend les éléments invisibles
        // L'animation s'occupera de tout
        
        console.log(`👁️ Observation de l'élément ${index}:`, {
            text: element.textContent.substring(0, 50) + '...',
            classes: element.className
        });
        slideObserver.observe(element);
    });
    
    // Test manuel après 2 secondes
    setTimeout(() => {
        console.log('🧪 Test manuel des animations slide-in');
        slideElements.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            console.log(`Element ${i} - Visible: ${isVisible}, Has 'visible': ${el.classList.contains('visible')}`);
        });
    }, 2000);
}
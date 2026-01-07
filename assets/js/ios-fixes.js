// Correctifs mineurs cross-platform
// Version simplifiée - laisser GSAP gérer le scroll

(function() {
    'use strict';

    // Fix iOS 100vh (la barre d'adresse change la hauteur)
    function setVH() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => setTimeout(setVH, 100));

    console.log('iOS fixes applied');
})();

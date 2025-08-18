// TEST ANIMATION SIMPLE

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Test animation starting...');
    
    const creno = document.querySelector('.creno-animation-container');
    if (!creno) {
        console.error('❌ Section Créno non trouvée!');
        return;
    }
    
    console.log('✅ Section Créno trouvée');
    
    // Test scroll direct
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        if (scrollY !== lastScroll) {
            lastScroll = scrollY;
            
            const rect = creno.getBoundingClientRect();
            console.log(`📜 Scroll: ${Math.round(scrollY)}px | Créno top: ${Math.round(rect.top)}px`);
            
            // Si on est dans la zone de Créno
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                console.log('👀 Créno visible!');
            }
        }
    });
    
    console.log('🧪 Test animation ready');
});
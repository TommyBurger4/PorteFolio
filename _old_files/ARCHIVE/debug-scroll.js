// Debug Script for Scroll Issues
console.log('🔍 Debug Script Loaded');

// Function to log element details
function logElementDetails(name, element) {
    if (!element) {
        console.error(`❌ ${name} not found!`);
        return;
    }
    
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    console.group(`📦 ${name}`);
    console.log('DOM Element:', element);
    console.log('Position:', {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        scrollTop: element.scrollTop
    });
    console.log('Styles:', {
        position: styles.position,
        height: styles.height,
        minHeight: styles.minHeight,
        zIndex: styles.zIndex,
        overflow: styles.overflow,
        display: styles.display
    });
    console.log('Parent:', element.parentElement);
    console.groupEnd();
}

// Monitor scroll events
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY ? 'DOWN' : 'UP';
    
    console.log(`📍 Scroll ${direction}: ${currentScrollY}px`);
    
    // Check if we're stuck
    if (Math.abs(currentScrollY - lastScrollY) < 1 && direction === 'DOWN') {
        console.warn('⚠️ SCROLL MIGHT BE STUCK!');
        
        // Find what's blocking
        const viewportHeight = window.innerHeight;
        document.querySelectorAll('section, .animation-wrapper, div[style*="height"]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportHeight && rect.bottom >= 0) {
                const styles = window.getComputedStyle(el);
                if (styles.position === 'fixed' || 
                    parseInt(styles.height) > viewportHeight * 1.5 ||
                    parseInt(styles.minHeight) > viewportHeight * 1.5) {
                    console.error('🚫 BLOCKING ELEMENT FOUND:', el);
                    logElementDetails('Blocker', el);
                }
            }
        });
    }
    
    lastScrollY = currentScrollY;
});

// Check critical sections every 2 seconds
setInterval(() => {
    console.group('🔄 Periodic Check');
    
    // Check wrappers
    document.querySelectorAll('.animation-wrapper').forEach((wrapper, index) => {
        const height = wrapper.offsetHeight;
        const hasCompleteClass = wrapper.classList.contains('animation-complete');
        console.log(`Wrapper ${index}:`, {
            height,
            hasCompleteClass,
            classes: wrapper.className,
            style: wrapper.getAttribute('style')
        });
        
        if (height > window.innerHeight * 2 && hasCompleteClass) {
            console.error('❌ Wrapper still too tall after animation!', wrapper);
        }
    });
    
    // Check specific sections
    const sections = {
        'Créno': document.querySelector('.creno-scroll-trigger'),
        'PixShare': document.querySelector('.pixshare-scroll-trigger'),
        'Projects': document.querySelector('#projects'),
        'FindMyCourt Section': document.querySelector('.product-showcase-dji:nth-of-type(3)')
    };
    
    Object.entries(sections).forEach(([name, section]) => {
        if (section) {
            const rect = section.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;
            console.log(`${name}:`, {
                visible,
                top: rect.top,
                inWrapper: section.parentElement?.classList.contains('animation-wrapper')
            });
        }
    });
    
    console.groupEnd();
}, 2000);

// Log initial state
window.addEventListener('load', () => {
    console.group('🚀 Initial Page State');
    
    // Document info
    console.log('Document Height:', document.documentElement.scrollHeight);
    console.log('Viewport Height:', window.innerHeight);
    console.log('Can scroll:', document.documentElement.scrollHeight > window.innerHeight);
    
    // All sections
    document.querySelectorAll('section').forEach((section, index) => {
        console.log(`Section ${index}:`, {
            id: section.id,
            classes: section.className,
            height: section.offsetHeight,
            position: window.getComputedStyle(section).position
        });
    });
    
    console.groupEnd();
});

// Debug commands you can run in console
window.debugScroll = {
    // Check wrapper states
    checkWrappers: () => {
        document.querySelectorAll('.animation-wrapper').forEach((wrapper, index) => {
            const section = wrapper.querySelector('section');
            console.log(`Wrapper ${index}:`, {
                classes: wrapper.className,
                height: wrapper.offsetHeight,
                hasSection: !!section,
                sectionClass: section?.className,
                complete: wrapper.classList.contains('animation-complete')
            });
        });
    },
    
    // Show all sections
    showAllSections: () => {
        document.querySelectorAll('section').forEach(section => {
            section.style.position = 'relative';
            section.style.zIndex = 'auto';
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        console.log('✅ All sections forced visible');
    },
    
    // Find element at specific Y position
    findElementAtY: (y) => {
        const elements = document.elementsFromPoint(window.innerWidth / 2, y);
        console.log(`Elements at Y=${y}:`, elements);
        return elements;
    },
    
    // Check what's visible in viewport
    checkViewport: () => {
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;
        
        console.group('👁️ Viewport Check');
        console.log(`Viewport: ${viewportTop}px to ${viewportBottom}px`);
        
        document.querySelectorAll('section').forEach(section => {
            const rect = section.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            const absoluteBottom = absoluteTop + rect.height;
            
            if (absoluteBottom > viewportTop && absoluteTop < viewportBottom) {
                console.log('Visible:', section.id || section.className, {
                    coverage: `${Math.max(0, Math.min(absoluteBottom, viewportBottom) - Math.max(absoluteTop, viewportTop))}px`
                });
            }
        });
        console.groupEnd();
    },
    
    // Log specific element
    logElement: (selector) => {
        const element = document.querySelector(selector);
        logElementDetails(selector, element);
    }
};

console.log('💡 Debug commands available:');
console.log('- debugScroll.checkWrappers()');
console.log('- debugScroll.showAllSections()');
console.log('- debugScroll.findElementAtY(1000)');
console.log('- debugScroll.checkViewport()');
console.log('- debugScroll.logElement("#projects")');
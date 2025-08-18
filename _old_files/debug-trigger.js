// DEBUG - Visualiser le point de déclenchement

document.addEventListener('DOMContentLoaded', function() {
    // Créer un indicateur visuel
    const debugLine = document.createElement('div');
    debugLine.style.cssText = `
        position: fixed;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: rgba(255, 0, 0, 0.5);
        z-index: 9999;
        pointer-events: none;
        display: none;
    `;
    document.body.appendChild(debugLine);
    
    const debugPoint = document.createElement('div');
    debugPoint.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: #00ff00;
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        transform: translate(-50%, -50%);
        display: none;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    `;
    document.body.appendChild(debugPoint);
    
    // Fonction pour mettre à jour le debug
    window.addEventListener('scroll', () => {
        const creno = document.querySelector('.creno-animation-container');
        if (!creno) return;
        
        const rect = creno.getBoundingClientRect();
        
        // Ne montrer que quand on est proche de la section
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            debugLine.style.display = 'block';
            debugPoint.style.display = 'block';
            
            // Calculer le point de déclenchement
            const logo = creno.querySelector('.creno-logo-zoom');
            const text = creno.querySelector('.creno-text-content');
            
            if (logo && text) {
                const logoRect = logo.getBoundingClientRect();
                const textRect = text.getBoundingClientRect();
                
                const logoCenter = logoRect.top + (logoRect.height / 2);
                const textTop = textRect.top;
                const triggerPoint = (logoCenter + textTop) / 2;
                
                debugPoint.style.left = '50%';
                debugPoint.style.top = triggerPoint + 'px';
                
                // Changer la couleur selon la distance
                const distance = Math.abs(triggerPoint - window.innerHeight / 2);
                if (distance < 50) {
                    debugPoint.style.background = '#ff0000';
                    debugPoint.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    debugPoint.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
                } else if (distance < 100) {
                    debugPoint.style.background = '#ff9900';
                    debugPoint.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    debugPoint.style.boxShadow = '0 0 15px rgba(255, 153, 0, 0.6)';
                } else {
                    debugPoint.style.background = '#00ff00';
                    debugPoint.style.transform = 'translate(-50%, -50%) scale(1)';
                    debugPoint.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
                }
            }
        } else {
            debugLine.style.display = 'none';
            debugPoint.style.display = 'none';
        }
    });
    
    // Info
    const info = document.createElement('div');
    info.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 9999;
        font-family: monospace;
    `;
    info.innerHTML = `
        🎯 Debug Mode<br>
        Ligne rouge = Centre écran<br>
        Point vert = Loin (>100px)<br>
        Point orange = Proche (50-100px)<br>
        Point rouge = Zone déclenchement (<50px)
    `;
    document.body.appendChild(info);
    
    console.log('✅ Debug trigger activé');
});
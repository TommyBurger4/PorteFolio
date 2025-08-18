// Script de diagnostic temporaire
console.log("=== DIAGNOSTIC PROJECTS MANAGER ===");

// Vérifier le timing d'exécution
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded déclenché");
    
    setTimeout(function() {
        console.log("=== DIAGNOSTIC APRÈS 1 SECONDE ===");
        
        // Vérifier l'existence du conteneur
        const container = document.getElementById('dynamic-projects-container');
        console.log("Conteneur trouvé:", !!container);
        
        if (container) {
            console.log("Conteneur détails:", {
                id: container.id,
                className: container.className,
                innerHTML: container.innerHTML.length > 0 ? "Contenu présent" : "Vide",
                children: container.children.length,
                parentNode: container.parentNode?.tagName,
                style: container.style.cssText,
                computedStyle: {
                    display: window.getComputedStyle(container).display,
                    visibility: window.getComputedStyle(container).visibility,
                    opacity: window.getComputedStyle(container).opacity
                },
                rect: container.getBoundingClientRect()
            });
            
            // Lister les enfants
            if (container.children.length > 0) {
                console.log("Enfants du conteneur:");
                Array.from(container.children).forEach((child, index) => {
                    console.log(`  ${index}:`, {
                        tagName: child.tagName,
                        id: child.id,
                        className: child.className,
                        rect: child.getBoundingClientRect(),
                        visible: child.getBoundingClientRect().height > 0
                    });
                });
            }
        }
        
        // Vérifier localStorage
        const settings = localStorage.getItem('topal-projects-settings');
        console.log("LocalStorage settings:", settings);
        
        // Vérifier la fonction globale
        console.log("Fonction updateProjectsDisplay disponible:", typeof window.updateProjectsDisplay);
        
        // Forcer une mise à jour
        if (window.updateProjectsDisplay) {
            console.log("Tentative de mise à jour forcée...");
            window.updateProjectsDisplay();
        }
        
    }, 1000);
});

// Vérifier immédiatement aussi
console.log("Document readyState actuel:", document.readyState);
if (document.readyState === 'complete') {
    console.log("Document déjà chargé, diagnostic immédiat...");
    setTimeout(() => {
        const container = document.getElementById('dynamic-projects-container');
        console.log("Diagnostic immédiat - Conteneur:", !!container);
        if (container) {
            console.log("Contenu:", container.innerHTML.length > 0 ? "Présent" : "Vide");
        }
    }, 100);
}
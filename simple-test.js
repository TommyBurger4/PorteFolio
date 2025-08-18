// Test simple de génération de sections
console.log("=== TEST SIMPLE ===");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, test simple...");
    
    setTimeout(function() {
        const container = document.getElementById('dynamic-projects-container');
        console.log("Conteneur trouvé:", !!container);
        
        if (container) {
            console.log("Ajout d'une section de test...");
            
            // Créer une section de test simple
            const testSection = document.createElement('section');
            testSection.style.cssText = `
                background: #ff0000;
                padding: 2rem;
                margin: 1rem 0;
                border: 3px solid #00ff00;
                min-height: 200px;
                display: block;
                visibility: visible;
                opacity: 1;
            `;
            testSection.innerHTML = `
                <div style="text-align: center; color: white;">
                    <h2>SECTION DE TEST</h2>
                    <p>Si vous voyez ceci, le conteneur fonctionne !</p>
                </div>
            `;
            
            container.appendChild(testSection);
            console.log("Section de test ajoutée");
            
            // Vérifier après ajout
            setTimeout(() => {
                const rect = testSection.getBoundingClientRect();
                console.log("Section de test rect:", rect);
                console.log("Section visible:", rect.height > 0 && rect.width > 0);
            }, 100);
        }
    }, 500);
});
/**
 * LOGGER.JS - Système de logging intelligent
 * Active les logs uniquement en développement (localhost)
 * ========================================================================
 */

const Logger = {
    /**
     * Détecte si on est en environnement de développement
     * @returns {boolean} true si localhost, false si production
     */
    isDev: window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '',
    
    /**
     * Log normal - Uniquement en développement
     * @param {...any} args - Arguments à logger
     */
    log: function(...args) {
        if (this.isDev) {
            console.log(...args);
        }
    },
    
    /**
     * Erreurs - Toujours affichées (dev et prod)
     * @param {...any} args - Arguments à logger
     */
    error: function(...args) {
        console.error(...args);
    },
    
    /**
     * Warnings - Toujours affichés (dev et prod)
     * @param {...any} args - Arguments à logger
     */
    warn: function(...args) {
        console.warn(...args);
    },
    
    /**
     * Info - Uniquement en développement
     * @param {...any} args - Arguments à logger
     */
    info: function(...args) {
        if (this.isDev) {
            console.info(...args);
        }
    },
    
    /**
     * Debug - Uniquement en développement
     * @param {...any} args - Arguments à logger
     */
    debug: function(...args) {
        if (this.isDev) {
            console.debug(...args);
        }
    },
    
    /**
     * Affiche l'état du logger au démarrage
     */
    init: function() {
        const env = this.isDev ? '🔧 DÉVELOPPEMENT' : '🚀 PRODUCTION';
        const hostname = window.location.hostname || 'file://';
        
        if (this.isDev) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📊 Logger initialisé - Mode: ${env}`);
            console.log(`🌐 Hostname: ${hostname}`);
            console.log(`✅ Logs activés`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }
};

// Rendre le Logger disponible globalement
window.Logger = Logger;

// Initialiser au chargement
Logger.init();

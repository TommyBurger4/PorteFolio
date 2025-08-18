#\!/bin/bash

echo "📱 Ouverture du site dans le simulateur iOS..."

# Vérifier si Xcode est installé
if \! command -v xcrun &> /dev/null; then
    echo "❌ Xcode n'est pas installé. Installez-le depuis l'App Store."
    exit 1
fi

# Démarrer le serveur local en arrière-plan
echo "🚀 Démarrage du serveur local..."
python3 -m http.server 8000 &
SERVER_PID=$\!

# Attendre que le serveur démarre
sleep 2

# Ouvrir le simulateur
echo "📲 Ouverture du simulateur..."
open -a Simulator

# Attendre que le simulateur se lance
sleep 5

# Ouvrir Safari avec l'URL
echo "🌐 Ouverture du site dans Safari..."
xcrun simctl openurl booted "http://localhost:8000" || {
    echo "⚠️  Aucun simulateur actif. Démarrage d'un iPhone..."
    xcrun simctl list devices | grep "iPhone 15" | head -1
    sleep 3
    xcrun simctl openurl booted "http://localhost:8000"
}

echo ""
echo "✅ Site ouvert dans le simulateur \!"
echo ""
echo "⚠️  Appuyez sur Ctrl+C pour arrêter le serveur"

# Garder le serveur actif
wait $SERVER_PID
EOF < /dev/null
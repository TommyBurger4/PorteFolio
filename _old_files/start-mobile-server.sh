#!/bin/bash

# Script pour démarrer un serveur accessible sur mobile

echo "🚀 Démarrage du serveur pour test mobile..."
echo ""

# Obtenir l'adresse IP locale
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
    # Linux
    IP=$(hostname -I | awk '{print $1}')
fi

PORT=8080

echo "📱 Pour tester sur votre téléphone :"
echo "   1. Assurez-vous que votre téléphone est sur le même WiFi"
echo "   2. Ouvrez Safari/Chrome sur votre téléphone"
echo "   3. Allez à : http://$IP:$PORT"
echo ""
echo "💻 Pour tester localement : http://localhost:$PORT"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur Python
python3 -m http.server $PORT --bind 0.0.0.0
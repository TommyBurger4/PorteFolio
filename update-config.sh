#!/bin/bash
# Script pour mettre à jour la configuration et pousser sur GitHub

echo "Mise à jour de la configuration des projets..."

# Commit et push
git add config/projects-settings.json
git commit -m "Mise à jour de la configuration des projets"
git push

echo "Configuration mise à jour sur GitHub Pages!"
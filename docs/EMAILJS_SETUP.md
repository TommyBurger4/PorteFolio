# Configuration EmailJS pour le formulaire de contact

## Étapes pour configurer EmailJS :

### 1. Créer un compte EmailJS
- Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
- Créez un compte gratuit (200 emails/mois gratuits)

### 2. Ajouter votre service email
- Dans le dashboard EmailJS, cliquez sur "Email Services"
- Cliquez sur "Add New Service"
- Choisissez Gmail (ou votre fournisseur)
- Connectez votre compte email (findmycourt67@gmail.com)
- Notez le **Service ID** généré

### 3. Créer un template d'email
- Allez dans "Email Templates"
- Cliquez sur "Create New Template"
- Configurez le template avec ces variables :
  - **To Email**: findmycourt67@gmail.com
  - **From Name**: {{from_name}}
  - **Reply To**: {{from_email}}
  - **Subject**: Nouveau message de {{from_name}} - Portfolio
  - **Content**:
    ```
    Vous avez reçu un nouveau message depuis votre portfolio !
    
    Nom: {{from_name}}
    Email: {{from_email}}
    
    Message:
    {{message}}
    ```
- Sauvegardez et notez le **Template ID**

### 4. Récupérer votre User ID
- Allez dans "Integration" → "API Keys"
- Copiez votre **User ID** (Public Key)

### 5. Mettre à jour le code
Dans le fichier HTML, remplacez ces 3 valeurs :
- Ligne 402 : `emailjs.init("YOUR_USER_ID")` → Mettez votre User ID
- Ligne 420 : `const serviceID = 'YOUR_SERVICE_ID'` → Mettez votre Service ID
- Ligne 421 : `const templateID = 'YOUR_TEMPLATE_ID'` → Mettez votre Template ID

## Test
1. Ouvrez votre site web
2. Remplissez le formulaire
3. Envoyez un message test
4. Vérifiez votre boîte email

## Remarques
- Le compte gratuit permet 200 emails/mois
- Les emails arrivent instantanément
- Vous pouvez personnaliser le template dans EmailJS
- Pour plus de sécurité, vous pouvez utiliser des variables d'environnement
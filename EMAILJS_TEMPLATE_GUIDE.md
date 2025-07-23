# Guide de configuration du template EmailJS

## 🔧 Configuration requise dans EmailJS

### 1. Connectez-vous à EmailJS
Allez sur https://dashboard.emailjs.com/

### 2. Vérifiez votre Service (service_sbslxfo)
- Allez dans "Email Services"
- Vérifiez que votre service est bien configuré et actif
- Si vous utilisez Gmail, assurez-vous d'avoir autorisé EmailJS

### 3. Configurez votre Template (template_h16q1jc)
Dans "Email Templates", votre template doit contenir EXACTEMENT ces variables :

**Subject :**
```
Nouveau message de {{from_name}}
```

**Content :**
```
Vous avez reçu un nouveau message via votre portfolio :

Nom : {{from_name}}
Email : {{from_email}}

Message :
{{message}}

---
Ce message a été envoyé depuis votre site portfolio.
```

**Reply To :**
```
{{from_email}}
```

**To Email :**
```
Votre email où vous voulez recevoir les messages
```

### 4. Variables importantes
Les variables DOIVENT être exactement :
- `{{from_name}}` - Le nom de l'expéditeur
- `{{from_email}}` - L'email de l'expéditeur
- `{{message}}` - Le contenu du message

### 5. Testez votre template
- Cliquez sur "Test It" dans EmailJS
- Remplissez les valeurs de test
- Vérifiez que vous recevez bien l'email

## ⚠️ Erreurs courantes

1. **Variables incorrectes** : Vérifiez que vous utilisez {{from_name}} et non {{name}}
2. **Service inactif** : Reconnectez votre service email
3. **Limite atteinte** : EmailJS gratuit = 200 emails/mois
4. **Email non vérifié** : Vérifiez votre email dans les paramètres EmailJS

## 🧪 Pour déboguer

Ouvrez la console du navigateur (F12) et regardez les erreurs quand vous envoyez le formulaire.
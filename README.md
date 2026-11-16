# COMMUNIQUE ! — Quiz de communication

Quiz web en français pour une présentation de développement personnel. Design responsive, 10 questions, timer de 20 secondes, score sur 100 et correction finale.

## Important : fonctionnement
- Le quiz fonctionne entièrement dans le navigateur.
- Chaque participant obtient son score sur son propre téléphone.
- **Aucune réponse n'est enregistrée ni envoyée à un serveur.** GitHub Pages héberge seulement les fichiers statiques.
- Pour un classement commun/live entre plusieurs appareils, il faudra ajouter un backend (par exemple Firebase).

## Publier sur GitHub Pages (gratuit)
1. Connectez-vous à https://github.com et créez un nouveau repository, par exemple `communication-quiz`.
2. Téléversez `index.html`, `style.css`, `script.js` et `README.md` à la racine du dépôt (ou faites `git add .`, `git commit`, `git push`).
3. Dans le dépôt : **Settings → Pages**.
4. Dans **Build and deployment**, choisissez **Deploy from a branch**.
5. Sélectionnez `main` et `/ (root)`, puis **Save**.
6. Attendez la publication. L'adresse sera généralement `https://VOTRE-PSEUDO.github.io/communication-quiz/`.
7. Ouvrez le lien sur un téléphone et testez avant la présentation. Vous pouvez créer un QR code à partir de l'URL publiée.

## Tester en local
Double-cliquez sur `index.html` ou ouvrez-le dans un navigateur.

## Personnaliser
- Questions et réponses : `script.js`, tableau `QUESTIONS`.
- Couleurs et style : `style.css`.
- Texte de la page : `index.html`.

## Crédit
Projet de classe — « Le sens d'une communication est la réponse obtenue ».

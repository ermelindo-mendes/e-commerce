# Project e-commerce jeux videos 

Bienvenue dans le dépôt. Voici comment vous pouvez le configurer et l'exécuter sur votre machine locale.

## Installation

1. Clonez ce dépôt sur votre machine locale.

   ```bash
   git clone https://github.com/votre-utilisateur/votre-projet.git
   
   cd votre-projet

   npm install
    ```bash

2. Configuration de .env

Renommez le fichier .env.sample en .env.

Configurez les variables d'environnement dans le fichier .env :

MONGO_URI: Remplacez cette variable par votre URL de base de données MongoDB en ligne.

SESSION_SECRET: Remplacez cette variable par une chaîne secrète pour la gestion des sessions.

PORT: Configurez le port sur lequel vous souhaitez exécuter l'application (par défaut : 3000).


3. Exécution du projet
```bash
npm run dev
```bash

Ouvrez un navigateur et accédez à http://localhost:3000 (ou au port que vous avez configuré).
# Gestion Du Transport

## Installation

Installer les dépendences:

### Client

- Node.js
- npm

### Serveur

- Java
- Maven

```
pushd client
npm install
popd
```

## Configuration

### Client

**Setup:** Créer un fichier **.env** à la racine du projet react avec le même contenu que [**.env.default**](client/.env.default), puis remplacer les valeurs par défaut.

Variables d'environnement:

- REACT_APP_GEOLOCATION_API_KEY (clé api [Woosmap](https://developers.woosmap.com/) publique)

### Serveur

Le fichier [server/src/main/resources/application-dev.yml](server/src/main/resources/application-dev.yml) permet de spécifier une configuration locale du serveur (identifiants base de donnée, config securité, etc...)

Pour l'envoie de mail, il est nécessaire d'ajouter une configuration dans application-dev.yml pour utiliser l'api de mailjet : https://app.mailjet.com/

```yml
mailjet:
  apiKey: API_KEY
  apiSecret: API_SECRET
```

Si une erreur type CORS se produit lors d'une requête API, la valeur du Access-Control-Allow-Origin est à rajouter dans application-dev.yml :

```yml
env:
  allowedOrigin: "http://localhost:3000"
```

### Base de données

Ce projet utilise une base de données MySQL, vous trouverez la configuration dans [server/src/main/resources/application.yml](server/src/main/resources/application.yml), par default le nom de la base est gestion-transport mais vous pouvez choisir le nom que vous voulez en l'indiquant dans le fichier [server/src/main/resources/application-dev.yml](server/src/main/resources/application-dev.yml). Comme indiqué, un jeu de données sera lancé à chaque démarrage de l'application afin de faciliter les tests.

## Utilisation

A partir de la racine du projet, éxécuter la commande `./start`, qui s'occupe de lancer le client et le serveur. Un script va s'exécuter automatiquement afin d'avoir un jeu de données pour les tests.

## Structure

La structure du projet est la suivante:

- server:
  - config: La configuration de Spring (la sécurité).
  - controller: L'accès à l'API, c'est par là que les requêtes passent, et elles sont traitées par les services, puis on retourne les résultat sous forme de DTO.
  - dto: Les objets exposés aux clients via l'API. En général, c'est une version légère des entités métier.
  - entities: Les objets métiers, qui appartiennent en général à un repository (une table de base de données).
  - enums: C'est les énumérations métier.
  - helpers: Des classes qui permettent de réutiliser du code.
  - repositories: C'est les tables de base de données, via JPA, donc ça contient optionnellement des méthodes de requête.
  - security: Implémentation de l'authentification Spring via un Salarie.
  - services: Traite les requêtes venant du contrôleur, en s'aidant des repositories. C'est là où repose le coeur du métier.
- client:
  - assets : regroupe les ressources(images,fichiers css etc..)
  - routes: Contient les composants de l'application selon les roles et le composant Router gère la logique de navigation entre les pages de manière dynamique en fonction des profils.
  - components: Contient les composants utiles aux pages.
  - lib : regroupe des éléments de bibliothèque ou de librairie ainsi que des fonctionnalités utiles.
  - models: Equivalent aux entités du côté serveur, c'est les objets métier.
  - services: Gère la communication avec le serveur, effectue les requêtes pour obtenir et transmettre les informations (ça touche aux contrôleurs du serveur).


## Login

- Collaborateur:
  - email : employe@example.com
  - mdp : password123

- Chauffeur:
  - email : chauffeur@example.com
  - mdp : password123

- Administrateur:
  - email : admin@example.com
  - mdp : password123

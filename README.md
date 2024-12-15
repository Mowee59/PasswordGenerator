# PasswordGenerator

![Angular](https://img.shields.io/badge/Angular-17.3.8-red)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.16-blue)
![RxJS](https://img.shields.io/badge/RxJS-7.8.1-purple)

PasswordGenerator est une application Angular conçue pour générer des mots de passe sécurisés. Ce projet met en œuvre une architecture réactive en utilisant RxJS et les observables pour une gestion efficace des états de l'application.

![Password Generator](https://github.com/user-attachments/assets/67ab2eee-9106-43e9-b5ce-a3c1cc0922e4)

## Démo live

[Démo live sur Github Pages](https://mowee59.github.io/PasswordGenerator/)

## Fonctionnalités

- **Architecture réactive** : Utilisation de RxJS et des observables pour une gestion réactive des options de génération de mots de passe et de l'évaluation de leur force.
- **Gestion efficace des souscriptions** : Mise en œuvre de pratiques optimales pour gérer les souscriptions aux observables, garantissant ainsi la libération des ressources et évitant les fuites de mémoire.
- **Directives Angular** : Utilisation de directives Angular pour styliser le composant de curseur (slider) permettant de sélectionner la longueur du mot de passe.
- **Évaluation de la force du mot de passe** : Calcul de l'entropie pour évaluer la force du mot de passe généré.
- **Copie du mot de passe** : Fonctionnalité de copie du mot de passe compatible avec tous les types de navigateurs, utilisant l'API moderne du presse-papiers et des solutions alternatives pour les anciens navigateurs.


## Architecture

### Composants

- **AppComponent** : Le composant racine qui encapsule l'application.
- **PasswordGeneratorComponent** : Gère l'interface utilisateur pour la génération de mots de passe.
- **PasswordDisplayComponent** : Affiche le mot de passe généré et permet de le copier dans le presse-papiers.
- **PasswordOptionComponent** : Permet de sélectionner les options de génération de mots de passe, telles que l'inclusion de majuscules, minuscules, chiffres et symboles.
- **PasswordStrengthComponent** : Indique visuellement la force du mot de passe.
- **GenerateButtonComponent** : Bouton pour déclencher la génération d'un nouveau mot de passe.

### Services

- **PasswordGeneratorService** : Service responsable de la génération de mots de passe et de l'évaluation de leur force.
- **PasswordOptionsService** : Gère les options de génération de mots de passe sélectionnées par l'utilisateur.

## Installation

Pour installer et exécuter ce projet localement, suivez les étapes ci-dessous :

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/username/password-generator.git
   cd password-generator
   ```

2. **Installer les dépendances :**
   Assurez-vous d'avoir Node.js et npm installés, puis exécutez :
   ```bash
   yarn install
   ```

3. **Exécuter le serveur de développement :**
   Lancez l'application en mode développement :
   ```bash
   yarn start
   ```
   Accédez à l'application via `http://localhost:4200/`.

4. **Construire le projet :**
   Pour créer une version de production, exécutez :
   ```bash
   yarn run build
   ```


## Contact

Pour toute question ou suggestion, veuillez contacter [contact@aniss.dev](mailto:contact@aniss.dev).


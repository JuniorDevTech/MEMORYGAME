# MEMORYGAME — PROJECT STATUS

**Version :** 1.0  
**Date :** 13 novembre 2026  
**Statut :** Initialisation du projet  
**Technologie :** React Native, Expo SDK 58, TypeScript, Expo Router  
**Plateforme de test :** iOS avec Expo Go

---

## 1. Présentation du projet

MEMORYGAME est un jeu mobile de mémorisation et de réflexion.

Le joueur doit mémoriser un chemin composé de cases bleues, puis reproduire exactement ce chemin en sélectionnant les cases dans le bon ordre.

Le générateur de parcours porte le nom **NEBULA PATH**.

Objectif : produire une application mobile de qualité professionnelle, compatible iOS et Android, et prête à être publiée sur l'App Store et Google Play.

## 2. Règles du jeu confirmées

- Le joueur doit reproduire un chemin précis, case par case.
- L'ordre des cases doit être strictement respecté.
- Les déplacements autorisés sont orthogonaux : haut, bas, gauche et droite.
- Les déplacements diagonaux ne sont pas autorisés.
- Une case ne doit pas être répétée.
- Une mauvaise sélection entraîne une défaite immédiate.
- Le pion apparaît après la première sélection correcte et suit le parcours.
- Après une défaite, le chemin complet est révélé avec ses numéros.

## 3. Progression des niveaux

| Niveaux | Grille | Cases bleues |
| ------- | -----: | -----------: |
| 1       |  2 × 2 |            3 |
| 2       |  3 × 3 |            5 |
| 3       |  4 × 4 |            7 |
| 4       |  5 × 5 |            9 |
| 5       |  6 × 6 |           11 |

À partir du niveau 6 :

- La grille reste en 6 × 6.
- Le nombre de cases bleues augmente progressivement.
- Le nombre de cases bleues suit la formule proposée dans le cahier des charges : B(n) = min(n + 6, 36).
- À partir du niveau 30, les 36 cases sont bleues.

## 4. Chronomètres

### Temps de mémorisation

| Niveau |      Temps |
| ------ | ---------: |
| 1      | 6 secondes |
| 2      | 5 secondes |
| 3      | 4 secondes |
| 4      | 3 secondes |
| 5      | 2 secondes |

### Temps de recherche

| Niveau |       Temps |
| ------ | ----------: |
| 1      | 18 secondes |
| 2      | 16 secondes |
| 3      | 14 secondes |
| 4      | 12 secondes |
| 5      | 10 secondes |

**Règle confirmée :** les deux durées diminuent progressivement avec les niveaux.

La formule exacte de diminution à partir du niveau 6 reste à définir.

## 5. Défaite et progression

- La réinitialisation de la progression principale après une défaite au niveau 5 est obligatoire.
- Les niveaux 1 à 4 redémarrent au niveau concerné après une défaite.
- Le comportement exact de réinitialisation après une défaite au niveau 6 et au-delà reste à confirmer.
- Les parties rejouées ne modifient pas la progression principale.
- Les statistiques historiques ne doivent jamais être supprimées lors d'une réinitialisation de progression.

## 6. Écrans prévus

1. Splash Screen
2. Menu principal
3. Sélection des niveaux
4. Écran de jeu
5. Pause
6. Victoire
7. Défaite
8. Tutoriel
9. Statistiques
10. Paramètres

## 7. Architecture technique

- React Native
- Expo SDK 58
- TypeScript
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- AsyncStorage pour la sauvegarde locale
- EAS Build pour les builds de production

Aucun backend ni système de compte n'est prévu pour la première version.

## 8. Architecture du projet

```text
src/
├── app/
├── components/
├── constants/
├── features/
│   ├── game/
│   ├── progression/
│   ├── settings/
│   ├── statistics/
│   └── tutorial/
├── hooks/
├── services/
└── utils/
```

Le moteur NEBULA PATH doit rester indépendant de l'interface React Native afin de faciliter les tests.

## 9. Décisions restant à valider

- Conséquences d'une sélection non adjacente.
- Conséquences de la sélection répétée d'une case.
- Formule exacte des chronomètres à partir du niveau 6.
- Définition du temps moyen de réussite.
- Possibilité de passer le tutoriel.
- Définition du niveau maximum atteint.
- Pondération des difficultés dans NEBULA PATH.
- Nombre de parcours récents à conserver.
- Réinitialisation après une défaite à partir du niveau 6.

Aucune de ces décisions ne doit être considérée comme définitivement validée sans confirmation.

## 10. Progression du développement

### Phase 1 — Initialisation

- [x] Création du projet Expo.
- [x] Installation et vérification des dépendances.
- [x] Configuration TypeScript.
- [x] Configuration Expo Router.
- [x] Premier écran provisoire.
- [x] Correction des imports manquants.
- [x] Vérification TypeScript.
- [x] Vérification ESLint.
- [x] Configuration Expo validée.
- [x] Expo Doctor : 20/20.
- [x] Premier lancement sur iPhone avec Expo Go.

### Phase 2 — Architecture

- [x] Création des dossiers fonctionnels.
- [x] Création de PROJECT_STATUS.md.
- [ ] Organisation détaillée des modules.
- [ ] Définition des types du jeu.
- [ ] Préparation des tests.

### Phase 3 — Interface

- [ ] Identité graphique complète.
- [ ] Composants UI.
- [ ] Menu principal.
- [ ] Sélection des niveaux.
- [ ] Écran de jeu.
- [ ] Écrans de victoire et de défaite.

### Phase 4 — Moteur de jeu

- [ ] Générateur NEBULA PATH.
- [ ] Génération des chemins valides.
- [ ] Gestion des cases bleues et rouges.
- [ ] Validation du parcours.
- [ ] Gestion des erreurs et des défaites.
- [ ] Tests du moteur.

### Phase 5 — Progression et sauvegarde

- [ ] Système de niveaux.
- [ ] Chronomètres progressifs.
- [ ] Gestion des victoires et défaites.
- [ ] Sauvegarde locale.
- [ ] Statistiques.
- [ ] Paramètres.

### Phase 6 — Production

- [ ] Tests iOS.
- [ ] Tests Android.
- [ ] Optimisation des performances.
- [ ] Vérification des exigences de confidentialité.
- [ ] Builds EAS.
- [ ] Préparation App Store et Google Play.

## 11. Règles de travail

1. Une modification à la fois.
2. Expliquer chaque modification avant de la réaliser.
3. Tester après chaque modification.
4. Obtenir la validation avant de passer à l'étape suivante.
5. Ne supprimer aucun fichier sans justification et validation.
6. Ne jamais ignorer une règle du cahier des charges.
7. Mettre à jour ce document à chaque décision importante.
8. Ne jamais déclarer une étape terminée sans vérification.

**Référence principale :** cahier des charges MEMORYGAME V1.0 défini dans la conversation du projet.

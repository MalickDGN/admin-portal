# Contribuer au socle Adaa Admin Portal

## Installation

```bash
npm install
npm run dev
```

Voir `README.md` pour la liste complète des scripts (Storybook, tests, E2E).

## Avant d'ouvrir une Pull Request

```bash
npm run lint
npm run build          # tsc -b && vite build — doit passer sans erreur
npm run test            # Vitest — doit être vert
npm run build-storybook # si un composant UI a été ajouté/modifié
```

## Convention de commits

```
feat:     nouvelle fonctionnalité
fix:      correction de bug
refactor: changement de code sans changement de comportement
docs:     documentation uniquement
test:     ajout ou modification de tests
chore:    tâches d'outillage, dépendances, config
```

## Convention de branches

```
main                  # production
develop                # intégration
feature/<nom-court>    # nouvelle fonctionnalité
bugfix/<nom-court>      # correction
release/<version>       # préparation de release
```

## Ajouter un composant UI générique

1. Dossier `components/ui/<NomDuComposant>/` avec `<NomDuComposant>.tsx` +
   `<NomDuComposant>.css`
2. Respecter les tokens du Design System (`DESIGN_SYSTEM.md`) — pas de
   valeur brute
3. Exporter depuis `components/ui/index.ts`
4. Ajouter `<NomDuComposant>.stories.tsx` (voir un composant existant comme
   modèle)
5. Ajouter `<NomDuComposant>.test.tsx` si le composant a une logique
   (état, interactions) — un composant purement présentationnel (`Badge`)
   peut se contenter d'un test de rendu minimal

## Ajouter un module métier

Voir la section 6 de `ARCHITECTURE.md` — la procédure complète (type →
mock → service → page → route → navigation → tests) est détaillée avec le
pattern exact à répliquer.

## Style de code

- TypeScript strict (`tsconfig.json`) — pas de `any` non justifié
- ESLint + Prettier font foi ; ne pas discuter le formatage en review, lancer
  `npm run format`
- Composants courts et spécialisés : si un fichier `.tsx` dépasse ~150
  lignes, chercher à extraire un sous-composant ou un hook
- Composition plutôt qu'héritage ou composants monolithiques à multiples
  responsabilités
- Commentaires uniquement quand le code seul ne suffit pas à expliquer le
  *pourquoi* (pas le *quoi*)

## Critères d'acceptation d'une PR

Repris du cahier des charges (§32) — une PR est mergeable quand :

- [ ] Le build (`npm run build`) et les tests (`npm run test`) passent
- [ ] Le composant/la fonctionnalité est réellement réutilisable (pas de
      logique métier codée en dur dans un composant `ui/`)
- [ ] Le responsive a été vérifié (mobile/tablette/desktop)
- [ ] Aucune couleur/espacement/rayon en valeur brute (tokens uniquement)
- [ ] La documentation (`README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`) est
      mise à jour si le changement affecte l'architecture ou l'état
      d'avancement du socle

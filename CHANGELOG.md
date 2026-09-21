# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Ce projet n'a pas encore de première release stable ; les versions
ci-dessous marquent les jalons de construction du socle.

## [Non versionné] — Correctifs de sécurité (npm audit)

### Corrigé
- **`vitest` : faille critique corrigée** (CVSS 9.8, [GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp)
  — lecture/exécution de fichier arbitraire si le serveur UI de Vitest est exposé).
  `vitest` et `@vitest/coverage-v8` passés de `^2.1.4` à `^3.2.7`. Aucune
  modification de code nécessaire, 61 tests toujours verts.
- **`vite` : faille moderate corrigée** ([GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
  — CORS du serveur de dev permettant à un site tiers de lire les réponses).
  `vite` passé de `^5.3.4` à `^6.4.3`, `@vitejs/plugin-react` de `^4.3.1` à
  `^4.7.0` (compatibilité vite 6 confirmée, y compris avec Storybook 8.6.18).
  Build, tests et Storybook revalidés après la bascule.

### Non corrigé (risque résiduel documenté)
- **`vitest` — un avertissement moderate restant** ([GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9),
  traversée de chemin via le mock de redirection). Le correctif complet
  nécessite `vitest@4.1.11`, mais cette version majeure casse l'installation
  npm dans cet environnement (bug de résolution de dépendances côté npm,
  `Cannot read properties of null (reading 'edgesOut')`, reproductible même
  après suppression complète de `node_modules`). À retenter plus tard, avec
  une version de npm différente ou quand l'écosystème (Storybook,
  `@testing-library`) aura suivi.
- **`react-router` — moderate** (redirection ouverte, injection via
  hydratation SSR). Le correctif proposé (`react-router-dom@7.18.4`) est un
  saut de version majeure (6→7) avec API différente — non appliqué sans
  validation dédiée. La faille SSR ne s'applique pas ici (SPA pure, pas de
  rendu serveur) ; le risque de redirection ouverte est faible pour un
  back-office interne sans redirection basée sur une entrée utilisateur.
- **`uuid` (via `@storybook/addon-actions`/`@storybook/addon-essentials`) — moderate**.
  Le correctif proposé par `npm audit fix --force` est en réalité une
  **rétrogradation** de Storybook (8.6.18 → 7.0.6) — refusé. Dépendance de
  développement uniquement (catalogue de composants), aucune exposition en
  production.
- **`xlsx` (SheetJS) — high** ([GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6),
  [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)),
  pollution de prototype et ReDoS **lors du parsing** d'un fichier `.xlsx`.
  Aucun correctif publié sur le registre npm (SheetJS distribue ses
  correctifs via son propre CDN, pas npm, depuis 2022). Risque réel limité
  ici : le socle **n'appelle que `XLSX.writeFile()` (export), jamais
  `XLSX.read()`** — aucun fichier Excel n'est parsé, encore moins un fichier
  fourni par un utilisateur non fiable. Si une future fonctionnalité
  d'import Excel est ajoutée, revoir ce point avant d'appeler `XLSX.read()`
  sur un fichier externe (envisager alors le tarball officiel SheetJS —
  `https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz` — plutôt que le
  paquet npm).

## [Non versionné] — Build de prévisualisation partageable

### Ajouté
- `vite.config.preview.ts` : config de build dédiée (via `vite-plugin-singlefile`)
  générant un unique fichier HTML autonome, utilisée ponctuellement pour
  publier une démo interactive. N'affecte pas `npm run build` (production).
- `AppProviders` : bascule `BrowserRouter`/`HashRouter` via `VITE_ROUTER_MODE`
  (défaut inchangé : `BrowserRouter`), nécessaire pour que le routing
  fonctionne dans un environnement de preview statique sans réécriture d'URL
  côté serveur.

## [0.12.0] — TimePicker et stories de navigation

### Ajouté
- `TimePicker` (`components/ui/TimePicker`) : sélecteur d'heure léger, sans
  dépendance externe, sur le même principe que `DatePicker` (Popover +
  colonnes heures/minutes, pas de minutes configurable)
- Stories `Sidebar` (comparaison du menu filtré par rôle : ADMIN vs USER,
  démontre `nav-config.ts`) et `Header` (breadcrumb + utilisateur connecté),
  avec decorators `MemoryRouter` + `AuthProvider`
- Tests `TimePicker` (placeholder, valeur affichée, sélection combinée heure/minute)

Le catalogue Storybook couvre désormais l'intégralité des composants
génériques du socle, y compris ceux nécessitant un contexte
router/auth (Sidebar, Header).

## [0.11.0] — Pagination côté serveur

### Ajouté
- `mockStore.listPaged()` : simule filtrage + tri + pagination "serveur" en
  mémoire, renvoie `{ items, total }`
- `createResourceService.listPaged()` : même contrat côté mock et côté
  backend réel (query string `page/pageSize/search/sortKey/sortDir`)
- `hooks/usePaginatedResourceQuery.ts` : pilote page/recherche/tri via
  TanStack Query (`keepPreviousData` — pas de flash vide entre deux pages)
- `DataTable` : nouvelle prop `server` — mode entièrement contrôlé où
  `data` ne contient que la page courante ; recherche/tri/pagination
  délégués au parent. L'export CSV/Excel est désactivé dans ce mode.
  Le mode par défaut (client, sans `server`) est strictement inchangé.
- Story Storybook `Tables/DataTable (mode serveur)` : démonstration sur un
  catalogue synthétique de 120 produits
- Tests : `usePaginatedResourceQuery` (chargement, reset de page, tri), et
  5 scénarios DataTable en mode serveur (pas de filtrage local, délégation
  recherche/page/tri, export désactivé)
- Documentation : section "Pagination : client ou serveur ?" dans
  `ARCHITECTURE.md`, avec le critère de choix par module

### Note
Les 3 modules e-commerce existants (Produits, Commandes, Clients) restent
en pagination client — leurs volumes de données ne justifient pas le mode
serveur. Cette infrastructure est prête pour un futur module à gros volume.

## [0.10.0] — États vides et d'erreur illustrés

### Ajouté
- `EmptyState` et `ErrorState` (`components/ui/`) — composants génériques
  illustrés (icône + titre + description + action), couvrant le §14
  (gestion des états Loading/Success/Empty/Error)
- `DataTable` : nouvelle prop `error` (+ `errorLabel`, `onRetry`) affichant
  un `ErrorState` avec bouton "Réessayer" ; l'état vide devient contextuel
  (icône et message différents si une recherche est active sans résultat)
- `useResourceQuery` expose désormais `refetch`, branché sur `onRetry` dans
  les 3 pages e-commerce
- Pages 404/403 reconstruites sur `EmptyState` pour une cohérence visuelle
- Tests : `EmptyState`, `ErrorState`, nouveaux scénarios DataTable (recherche
  sans résultat, erreur + réessai)

## [0.9.0] — Export Excel natif

### Ajouté
- `utils/excel.ts` : génération de classeurs `.xlsx` via SheetJS (`xlsx`)
- Prop `excelExportable` sur `DataTable`, bouton "Exporter Excel" à côté du CSV
- Branché sur Produits, Commandes, Clients
- Test : déclenchement de la génération Excel (mock du module `xlsx`)

### Modifié
- La librairie SheetJS (~300 Ko) est chargée en **import dynamique**, au clic
  sur "Exporter Excel" seulement — elle n'alourdit plus le chunk partagé par
  les 3 pages e-commerce (`createResource`, repassé de 300 Ko à 20 Ko après
  ce changement), conformément au §17 (chargement à la demande des modules
  lourds)

## [0.8.0] — Thèmes projet additionnels

### Ajouté
- 3 nouvelles palettes complètes (claire + sombre) : `corporate`, `fintech`, `healthcare`
- Registre central `theme/themes/index.ts` (`themeRegistry`, `themeOptions`)
- `ThemeProvider` gère désormais `themeName` en plus de `mode`, persisté séparément
- Page **Paramètres** (`SettingsPage`) avec sélecteur de thème et bascule clair/sombre
- Tests : complétude du registre de thèmes, bascule de thème/mode sur `SettingsPage`

### Corrigé
- Le lien de navigation « Paramètres » pointait vers `/settings`, une route
  qui n'existait pas (lien mort depuis la Phase 1). La route est maintenant
  enregistrée dans `app/router/routes.tsx`.

## [0.7.0] — Couverture de tests étendue

### Ajouté
- Tests composants : `Select` (ouverture, sélection, Échap, erreur),
  `Modal` (ouverture/fermeture, Échap, clic extérieur), `ProductFormModal`
  (validation, soumission, pré-remplissage en mode édition)
- Stories manquantes : `Drawer`, `Popover`, `Tooltip`, `DatePicker`, `FormField`

### Corrigé
- **`FormField` ne transmettait pas sa `ref` jusqu'à l'`<input>` natif**
  (composant non enveloppé dans `forwardRef`). Conséquence : React Hook Form
  ne pouvait pas lire la valeur saisie par l'utilisateur à la soumission —
  tout formulaire utilisant `FormField` échouait silencieusement à envoyer
  les bonnes valeurs. Bug détecté par le test de soumission de
  `ProductFormModal`, qui échouait avec `onSubmit` jamais appelé avec les
  bonnes valeurs. Corrigé en enveloppant `FormField` dans `forwardRef`.

## [0.6.0] — Tests

### Ajouté
- Vitest + React Testing Library (`vitest.config.ts`), alias alignés sur l'app
- 24 tests unitaires/composants : `utils/csv`, schéma Zod produit,
  `createResourceService` (CRUD mock), `Button`, `Badge`, `DataTable`
  (recherche, tri, pagination, état vide, export CSV)
- Playwright configuré (`playwright.config.ts`) + parcours critique
  bout-en-bout (`e2e/critical-path.spec.ts`) : login → dashboard → recherche
  → CRUD produit → changement de statut commande → redirection RBAC
- `aria-label` ajouté sur `Select` (accessibilité + ciblage des tests)

## [0.5.0] — Storybook

### Ajouté
- Configuration Storybook (`.storybook/`) avec `ThemeProvider` branché et
  toggle clair/sombre dans la toolbar
- Stories pour Button, Card, Badge, StatCard, Select/MultiSelect, Modal,
  Tabs, Accordion, DataTable + page d'introduction

## [0.4.0] — Export de données

### Ajouté
- `utils/csv.ts` : génération/téléchargement CSV sans dépendance, compatible Excel
- Prop `exportable` + `csvValue` par colonne sur `DataTable`
- Export CSV branché sur Produits, Commandes, Clients

## [0.3.0] — Composants UI restants

### Ajouté
- `Select`, `MultiSelect`, `Popover`, `Tooltip`, `Accordion`, `DatePicker`
- Intégration : `Select` dans le formulaire produit (via `<Controller>`),
  filtre par date sur les commandes, tooltips sur le Header

## [0.2.0] — CRUD complet et intégration API

### Ajouté
- `createResourceService()` + `useResourceQuery()` (TanStack Query) — bascule
  mock/backend réel via `VITE_USE_MOCKS`, sans changement de code applicatif
- Pages Commandes (Drawer de détail, transitions de statut) et Clients (CRUD
  complet, route protégée ADMIN/MANAGER)
- `DataTable` générique (tri, recherche, pagination, sélection, actions)
- `Modal`, `Drawer`, `Tabs`, système de Toasts
- `FormField` + formulaire React Hook Form/Zod (modèle : produits)

## [0.1.0] — Socle initial

### Ajouté
- Structure de dossiers, stack (React/TS/Vite/React Router/TanStack Query/
  Zustand/RHF+Zod/Recharts), configuration multi-environnements
- Design tokens + `ThemeProvider` (clair/sombre, persistance)
- Layout system (Dashboard/Auth/Empty/Default), Sidebar + Header
- Routing avec lazy loading et routes protégées par rôle (RBAC)
- Couche `services/api` découplée du backend, i18n fr/en de base
- Composants UI de base (Button, Card, Badge, StatCard, PageLoader)
- Page Dashboard fonctionnelle (KPI, graphique, tableau)

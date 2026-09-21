# Adaa Admin Portal — Socle UX/UI React

Socle frontend React/TypeScript industrialisé, reproduisant l'expérience UX/UI
du template de référence **Rizz** et destiné à servir de base réutilisable
(`build once, reuse everywhere`) pour les futures plateformes web Adaa
(CRM, e-commerce, reporting, etc.).

## Stack

React 18 · TypeScript · Vite · React Router · TanStack Query · Zustand ·
React Hook Form + Zod · Recharts · lucide-react.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production (dist/)
npm run lint
npm run storybook        # catalogue de composants — http://localhost:6006
npm run build-storybook  # export statique du catalogue (storybook-static/)
npm run test              # tests unitaires/composants (Vitest)
npm run test:watch        # idem, en mode watch
npm run test:coverage     # avec rapport de couverture
npm run test:e2e          # parcours critiques bout-en-bout (Playwright)
```

Pour l'E2E, installer une fois le navigateur : `npx playwright install chromium`.

Un compte de démo est créé automatiquement à la connexion (`LoginPage`) —
à remplacer par un vrai appel `services/api/auth.ts` quand le backend sera prêt.

## Documentation

- **`ARCHITECTURE.md`** — comment le socle est construit, comment ajouter un module
- **`DESIGN_SYSTEM.md`** — tokens, thèmes, catalogue de composants, conventions
- **`CONTRIBUTING.md`** — conventions de commit/branche, checklist de PR
- **`CHANGELOG.md`** — historique des jalons du socle

## Aperçu de l'architecture

```
src/
├── app/                     # router, providers globaux, config
├── theme/                   # design tokens + moteur de thème (light/dark, multi-thème projet)
├── components/ui/           # composants génériques réutilisables (Button, Card, Select, Modal...)
├── components/tables/       # DataTable générique (tri, recherche, pagination, export CSV)
├── components/forms/        # FormField standardisé pour React Hook Form
├── components/feedback/     # Toasts
├── components/navigation/   # Sidebar, Header, config de navigation centralisée
├── layouts/                 # DashboardLayout, AuthLayout, EmptyLayout, DefaultLayout
├── features/                # un dossier par module métier (dashboard, ecommerce, settings)
├── services/api/            # client API + fabrique de service CRUD + services par ressource
├── services/auth/           # AuthProvider RBAC (roles ADMIN/MANAGER/USER/READ_ONLY)
├── hooks/                   # useResourceQuery (TanStack Query) et autres hooks partagés
├── i18n/                    # dictionnaires fr/en
└── types/, utils/, store/
```

Principe de séparation strict : **UI → Feature → Service → API Client → Backend**.
Aucun composant ne doit appeler `fetch` directement. Détail complet dans `ARCHITECTURE.md`.

Tous les styles consomment des variables CSS injectées par `ThemeProvider` à
partir des tokens et de la palette du thème actif — détail complet, catalogue
de composants et conventions dans `DESIGN_SYSTEM.md`.

## Basculer les mocks vers un vrai backend

Dans `.env.<environment>`, passer `VITE_USE_MOCKS=false` et renseigner `VITE_API_BASE_URL`.
Aucune ligne de composant ou de page n'a besoin d'être modifiée : `createResourceService()`
(services/api/createResource.ts) route alors automatiquement `list/create/update/remove`
vers `apiClient` (REST) au lieu du store en mémoire (`services/api/mockStore.ts`).

## Où en est ce socle

**Fondations**
- [x] Structure de dossiers complète selon le cahier des charges (§4)
- [x] Config build/lint/format multi-environnements (§5, §19)
- [x] Design tokens + thème light/dark avec persistance (§6, §7)
- [x] Layout system : Dashboard/Auth/Empty/Default (§9)
- [x] Sidebar + Header responsive, navigation centralisée (§3, §10)
- [x] Routing avec lazy loading, routes protégées par rôle RBAC (§11, §12)
- [x] i18n fr/en de base (§15)

**Composants UI (§8)**
- [x] Button, Card, Badge, StatCard, PageLoader
- [x] DataTable générique : tri, recherche, pagination, sélection multiple, actions par ligne, **export CSV et Excel** (chargement différé de la librairie Excel — voir §17), **mode serveur** pour les gros volumes (voir ARCHITECTURE.md)
- [x] Modal, Drawer, Tabs, Toasts
- [x] Select, MultiSelect, Popover, Tooltip, Accordion, DatePicker, **TimePicker**
- [x] **EmptyState** et **ErrorState** illustrés (§14 — gestion des états), intégrés au DataTable (état vide contextuel selon recherche active, état d'erreur avec bouton "Réessayer") et aux pages 404/403
- [x] FormField standardisé pour React Hook Form + Zod ; exemple de composant contrôlé (Select) branché via `<Controller>`

**Intégration API**
- [x] `createResourceService()` + `useResourceQuery()` (TanStack Query) — bascule mock/backend réel via `VITE_USE_MOCKS`, aucune feature à modifier

**Modules métier**
- [x] Dashboard : KPI cards, graphique de revenu, commandes récentes
- [x] Produits : CRUD complet (DataTable + Modal + Select + Zod + Toasts + export CSV/Excel)
- [x] Commandes : DataTable + Drawer de détail + transitions de statut + filtre par date + export CSV/Excel
- [x] Clients : CRUD complet, route protégée ADMIN/MANAGER, export CSV/Excel
- [x] Paramètres : bascule du thème projet (4 palettes) et du mode clair/sombre — corrige au passage un lien de navigation mort (`/settings` n'avait pas de route)

**Thèmes projet (§7)**
- [x] 4 thèmes prêts à l'emploi : `default`, `corporate`, `fintech`, `healthcare` (chacun avec palette claire et sombre)
- [x] Registre central (`theme/themes/index.ts`) — basculer de thème ne touche aucun composant

**Tests (§23)**
- [x] Vitest + React Testing Library configurés (`vitest.config.ts`, mêmes alias que l'app)
- [x] Tests unitaires : utilitaire CSV, schéma de validation Zod (produit), couche `createResourceService` (CRUD mock)
- [x] Tests composants : Button, Badge, Select, Modal, DataTable (recherche, tri, pagination, état vide/erreur, export CSV/Excel, mode serveur), ProductFormModal (validation + soumission + édition), SettingsPage (bascule thème/mode), EmptyState, ErrorState, TimePicker, `usePaginatedResourceQuery`, registre de thèmes — **61 tests, tous verts**
- [x] Playwright configuré (`playwright.config.ts`) avec parcours critique bout-en-bout : Login → Dashboard → Recherche → Consultation → Création → Modification → Suppression (produit), changement de statut (commande), redirection RBAC sans connexion
- [ ] Exécution effective de la suite E2E — **le navigateur Chromium n'a pas pu être installé dans cet environnement** (téléchargement bloqué par la politique réseau du sandbox : `cdn.playwright.dev` non autorisé). Les fichiers ont été relus et type-checkés manuellement ; à exécuter avec `npx playwright install chromium && npm run test:e2e` dans un environnement avec accès réseau standard (ou en CI)

**Storybook (§22)**
- [x] Configuration `.storybook/` (path aliases, ThemeProvider branché, toggle clair/sombre dans la toolbar)
- [x] Stories pour Button, Card, Badge, StatCard, Select/MultiSelect, Modal, Tabs, Accordion, DataTable (client et **mode serveur**), Drawer, Popover, Tooltip, DatePicker, **TimePicker**, FormField, EmptyState, ErrorState, **Sidebar** (filtrage par rôle), **Header**
- [x] Page d'introduction du catalogue

**Documentation (§21)**
- [x] `README.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CONTRIBUTING.md`, `CHANGELOG.md`

Les 3 modules e-commerce suivent exactement le même pattern d'intégration,
ce qui rend l'ajout d'un futur module mécanique : dupliquer
`types/entities.ts` → `services/api/<resource>.ts` → `useResourceQuery` → page avec DataTable.

## Reste à faire (prochaines itérations)

- Lancer réellement la suite E2E Playwright dans un environnement avec accès réseau (cf. ci-dessus)

# Architecture — Adaa Admin Portal

Ce document explique comment le socle est construit et comment l'étendre.
Pour l'état d'avancement fonctionnel, voir `README.md`.

## 1. Principe directeur

```
UI  →  Feature  →  Service  →  API Client  →  Backend
```

- **UI** (`components/ui`, `components/tables`, `components/forms`, `components/feedback`) :
  composants génériques, sans connaissance du métier ni de l'API. Un `Button`
  ou un `DataTable` ne sait rien de "produits" ou "commandes".
- **Feature** (`features/<domaine>`) : assemble les composants UI pour un
  écran métier (ex. `ProductsPage`). Appelle uniquement des **hooks**, jamais
  directement un service ou `fetch`.
- **Service** (`services/api/<resource>.ts`) : expose `list/create/update/remove`
  pour une ressource, typé. Ne contient aucune logique d'affichage.
- **API Client** (`services/api/client.ts`) : un seul point d'entrée HTTP
  (headers, token, base URL, gestion d'erreur). Rien d'autre n'appelle `fetch`.
- **Backend** : hors périmètre de ce dépôt.

Cette séparation permet de remplacer n'importe quelle couche sans toucher
aux autres (§30 du cahier des charges — principe de non-couplage).

## 2. Bascule mock / backend réel

`services/api/createResource.ts` fabrique un service CRUD standard. Selon
`VITE_USE_MOCKS` (`.env.<environment>`) :

- `true` (par défaut en dev) → les opérations passent par
  `services/api/mockStore.ts`, un store en mémoire avec latence simulée.
- `false` → les opérations passent par `apiClient` (REST réel).

Aucune feature, hook ou composant n'a besoin d'être modifié pour basculer :
c'est tout l'intérêt de la couche Service. Voir `services/api/products.ts`
pour l'exemple le plus simple.

## 3. Données serveur vs état local

- **État serveur** (listes, CRUD) → `hooks/useResourceQuery.ts`, un wrapper
  générique autour de TanStack Query (cache, invalidation automatique après
  mutation, `isLoading`/`isError`). C'est le seul moyen que les features
  utilisent pour lire/écrire une ressource.
- **État global client** (préférences UI, sélection cross-écran) → Zustand
  est en dépendance, prêt à l'emploi (`store/`), mais aucun store n'a encore
  été nécessaire : le thème, l'auth et les toasts couvrent les besoins
  transverses actuels via des Context dédiés (`theme/ThemeProvider.tsx`,
  `services/auth/AuthProvider.tsx`, `components/feedback/Toast/ToastProvider.tsx`).
- **État de formulaire** → React Hook Form, jamais du `useState` manuel pour
  un formulaire de plus de 2 champs (voir `ProductFormModal.tsx` comme modèle).

### Pagination : client ou serveur ?

Deux stratégies coexistent, à choisir **par module** selon le volume de
données :

- **Client** (par défaut, utilisé par Produits/Commandes/Clients) —
  `service.list()` charge toute la ressource, `useResourceQuery()` la met en
  cache, et `DataTable` filtre/trie/pagine en mémoire. Simple, réactif,
  adapté à des volumes de quelques centaines de lignes au plus.
- **Serveur** — `service.listPaged({ page, pageSize, search, sortKey, sortDir })`
  ne renvoie qu'une page (`{ items, total }`), `hooks/usePaginatedResourceQuery.ts`
  pilote l'état (page/recherche/tri) via TanStack Query avec
  `keepPreviousData` (pas de flash vide entre deux pages), et `DataTable`
  passe en mode entièrement contrôlé via la prop `server` :

  ```tsx
  const { items, total, isLoading, page, setPage, query, setQuery, sortKey, sortDir, setSort } =
    usePaginatedResourceQuery("invoices", invoicesService, { pageSize: 20, searchFields: (i) => i.reference });

  <DataTable
    columns={columns}
    data={items}                 // uniquement la page courante
    getRowId={(i) => i.id}
    searchable
    loading={isLoading}
    server={{ totalCount: total, page, onPageChange: setPage, query, onQueryChange: setQuery,
              sortKey, sortDir, onSortChange: setSort }}
  />
  ```

  En mode `server`, `DataTable` ne filtre/trie/pagine plus localement (tout
  vient déjà filtré/trié/paginé de `data`), et l'export CSV/Excel est
  désactivé (il faudrait charger toutes les pages). Voir la story
  `Tables/DataTable (mode serveur)` dans Storybook pour une démonstration
  sur un catalogue synthétique de 120 produits.

  Côté mock (`services/api/mockStore.ts`), `listPaged()` simule le
  filtrage/tri/pagination en mémoire ; côté backend réel, `createResource.ts`
  traduit les mêmes paramètres en query string REST (`?page=&pageSize=&search=&sortKey=&sortDir=`)
  — au backend de les interpréter.

  **Aucun des 3 modules e-commerce actuels n'utilise le mode serveur** : leurs
  jeux de données (quelques dizaines de lignes) ne le justifient pas. Cette
  infrastructure existe pour qu'un futur module à gros volume (factures,
  logs, transactions...) l'adopte directement sans redévelopper la logique
  de pagination.

## 4. Thème et Design System

Voir `DESIGN_SYSTEM.md` pour le détail. En résumé : tous les styles
consomment des variables CSS (`--color-*`, `--space-*`, `--radius-*`,
`--shadow-*`) injectées par `ThemeProvider` à partir de `theme/tokens.ts` et
de la palette active (`theme/themes/default.ts`). Basculer clair/sombre ou
créer un thème projet ne touche à aucun composant.

## 5. Routing et RBAC

`app/router/routes.tsx` centralise l'arbre de routes avec lazy loading
(`React.lazy` + `Suspense`). `app/router/ProtectedRoute.tsx` redirige vers
`/auth/login` si non connecté, ou `/403` si le rôle ne correspond pas
(`roles={["ADMIN", "MANAGER"]}` par exemple). Les rôles disponibles sont
`ADMIN | MANAGER | USER | READ_ONLY` (`services/auth/AuthProvider.tsx`).

La navigation (Sidebar) a une **source unique de vérité** :
`components/navigation/nav-config.ts`. Un élément avec `roles` n'apparaît
dans le menu que si l'utilisateur courant a l'un de ces rôles
(`hasRole()`), en cohérence avec les routes protégées.

## 6. Ajouter un nouveau module métier

Les 3 modules e-commerce (Produits, Commandes, Clients) suivent exactement
le même pattern. Pour en ajouter un nouveau (ex. "Factures") :

1. **Type** — ajouter l'interface dans `types/entities.ts`
2. **Mock** — `features/<module>/<module>.mock.ts` (données de démonstration)
3. **Service** — `services/api/<module>.ts` :
   ```ts
   export const invoicesService = createResourceService<Invoice>("invoices", mockInvoices);
   ```
4. **Page** — `features/<module>/<Module>Page.tsx` : `useResourceQuery` +
   `DataTable` (colonnes avec `sortValue`/`csvValue`) + `Card`
5. **Formulaire** (si CRUD) — schéma Zod + `<Module>FormModal.tsx` sur le
   modèle de `ProductFormModal.tsx` (utiliser `<Controller>` pour tout champ
   qui n'est pas un `<input>` natif, ex. `Select`)
6. **Route** — ajouter la page dans `app/router/routes.tsx` (lazy import)
7. **Navigation** — ajouter l'entrée dans `components/navigation/nav-config.ts`
8. **Tests** — au minimum un test du schéma Zod et, si le module ajoute un
   composant UI générique, un test de ce composant (voir §7)

Aucune autre étape n'est nécessaire : le layout, le thème, l'auth et le
routing protégé s'appliquent automatiquement.

## 7. Tests

- **Unitaires/composants** — Vitest + React Testing Library
  (`vitest.config.ts`, alias identiques à l'app). Un composant UI générique
  nouvellement créé doit avoir un `*.test.tsx` couvrant son comportement
  observable (pas les détails d'implémentation).
- **E2E** — Playwright (`playwright.config.ts`, dossier `e2e/`). Un seul
  fichier `critical-path.spec.ts` couvre le parcours de bout en bout demandé
  au cahier des charges (login → dashboard → recherche → CRUD → RBAC).
- **Storybook** — sert de documentation vivante et de terrain d'essai visuel,
  pas de remplacement aux tests : un composant peut avoir une story sans
  test, mais un composant avec une logique non triviale (DataTable, Select)
  doit avoir les deux.

## 8. Build et environnements

Trois environnements (`development`, `staging`, `production`), chacun avec
son `.env.<environment>` (`VITE_APP_ENV`, `VITE_API_BASE_URL`,
`VITE_USE_MOCKS`). `vite.config.ts` définit le code splitting manuel
(`vendor`, `charts` séparés) et les alias de chemin, repris à l'identique
dans `tsconfig.json`, `.storybook/main.ts` et `vitest.config.ts` — les
quatre doivent rester synchronisés si un nouvel alias est ajouté.

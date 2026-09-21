# Design System — Adaa Admin Portal

## 1. Principe

Aucune valeur de style "en dur" dans un composant : couleur, espacement,
rayon d'angle, ombre, police — tout passe par un **token**. Les tokens sont
définis une fois (`theme/tokens.ts`), traduits en variables CSS par
`ThemeProvider`, et consommés dans le CSS des composants via `var(--...)`.
Changer un token change toute l'application ; créer un thème projet ne
touche aucun composant.

## 2. Tokens (`theme/tokens.ts`)

| Catégorie | Échelle | Variable CSS |
|---|---|---|
| Spacing | `xs sm md lg xl 2xl 3xl` (4px → 64px) | `--space-*` |
| Radius | `none sm md lg xl full` | `--radius-*` |
| Shadow | `sm md lg xl` | `--shadow-*` |
| Breakpoints | `mobile tablet desktop wide` | *(utilisés en JS/media queries, pas en variable CSS)* |
| Typographie | familles, tailles `xs`→`4xl`, poids, line-height | `--font-family-base` (couleurs de texte via `--color-text*`) |

## 3. Couleurs et thèmes (`theme/themes/default.ts`)

Chaque thème définit une palette **claire** et une palette **sombre** :
`primary`, `primaryHover`, `secondary`, `success`, `warning`, `danger`,
`info`, `background`, `surface`, `surfaceMuted`, `border`, `text`,
`textMuted`, `textInverted`.

`ThemeProvider` (`theme/ThemeProvider.tsx`) :
- lit la préférence système au premier chargement, puis persiste le choix
  de l'utilisateur (`localStorage`) ;
- injecte chaque couleur en variable CSS `--color-<nom-en-kebab-case>`
  (ex. `primaryHover` → `--color-primary-hover`) sur `document.documentElement` ;
- expose `useTheme()` (`mode`, `colors`, `toggleMode`, `setMode`).

### Créer un thème projet

Quatre thèmes sont livrés prêts à l'emploi : `default`, `corporate`,
`fintech`, `healthcare` (`theme/themes/*.ts`), sélectionnables à l'exécution
depuis la page **Paramètres** (`features/settings/SettingsPage.tsx`) — utile
pour comparer les palettes, mais en production un projet dérivé du socle
fixera généralement son thème une fois pour toutes.

Pour ajouter un cinquième thème : dupliquer `theme/themes/default.ts` (ex.
`theme/themes/retail.ts`) avec une nouvelle palette, l'enregistrer dans
`theme/themes/index.ts` (`themeRegistry` + `themeOptions`), et ajouter son
nom à `ThemeName` dans `theme/types.ts`. Aucun composant n'a besoin d'être
modifié — c'est tout l'intérêt du système de tokens.

## 4. Catalogue de composants

Catalogue visuel complet dans Storybook (`npm run storybook`). Référence
rapide :

| Composant | Emplacement | Usage |
|---|---|---|
| `Button` | `components/ui/Button` | Variants `primary/secondary/outline/ghost/danger`, tailles `sm/md/lg`, état `loading` |
| `Card` | `components/ui/Card` | Conteneur standard avec `title`/`actions` optionnels |
| `Badge` | `components/ui/Badge` | Étiquette de statut, tons `primary/success/warning/danger/info/neutral` |
| `StatCard` | `components/ui/StatCard` | KPI avec tendance (`trendType`) |
| `Modal` | `components/ui/Modal` | Dialogue bloquant, `footer` pour les actions |
| `Drawer` | `components/ui/Drawer` | Panneau latéral non bloquant (détail, filtres avancés) |
| `Tabs` | `components/ui/Tabs` | Navigation par onglets dans une même vue |
| `Accordion` | `components/ui/Accordion` | Contenu repliable, simple ou multi-ouvert |
| `Select` / `MultiSelect` | `components/ui/Select` | Listes déroulantes stylées, accessibles clavier |
| `DatePicker` | `components/ui/DatePicker` | Sélecteur de date, basé sur `Popover` |
| `TimePicker` | `components/ui/TimePicker` | Sélecteur d'heure (colonnes heures/minutes), basé sur `Popover` |
| `EmptyState` | `components/ui/EmptyState` | État vide illustré (icône + titre + description + action optionnelle) |
| `ErrorState` | `components/ui/ErrorState` | État d'erreur illustré, avec bouton "Réessayer" optionnel |
| `Popover` | `components/ui/Popover` | Primitive de positionnement, base d'autres composants |
| `Tooltip` | `components/ui/Tooltip` | Info-bulle au survol/focus |
| `DataTable` | `components/tables/DataTable` | Table générique : tri, recherche, pagination, sélection, export CSV et Excel (`utils/csv.ts`, `utils/excel.ts` — ce dernier chargé à la demande) |
| `FormField` | `components/forms/FormField` | Label + input + erreur, pensé pour React Hook Form |
| `ToastProvider` / `useToast` | `components/feedback/Toast` | Notifications non bloquantes |

**Quand créer un nouveau composant plutôt que d'en composer un existant ?**
Si le besoin se répète dans 2 modules ou plus, ou s'il s'agit d'un pattern
d'interaction générique (pas propre à "produits" ou "commandes").

## 5. Conventions CSS

- Nommage **BEM-like** : `.composant`, `.composant__partie`,
  `.composant__partie--modificateur` (ex. `.btn`, `.btn--primary`, `.btn--sm`).
- Un fichier CSS par composant, importé directement dans le `.tsx`
  correspondant (pas de fichier CSS global par dossier).
- Aucune couleur/espacement/rayon en valeur brute — toujours `var(--...)`.
- Responsive : `max-width` en `@media`, jamais de largeur fixe qui casse en
  dessous de 480px (voir `theme/global.css` pour le shell `.app-shell` /
  `.app-main` comme référence).

## 6. Accessibilité

- Tout élément interactif est un vrai `<button>`/`<a>`, jamais un `<div onClick>`.
- Les composants avec un état ouvert/fermé (`Select`, `Modal`, `Drawer`,
  `Popover`) gèrent `Échap` et le clic extérieur.
- Un composant sans label textuel visible (icône seule) porte un `aria-label`
  explicite (voir `Header.tsx` pour les boutons d'icône).
- Les champs de formulaire utilisent `<label htmlFor>` correctement associé
  à l'`id` du champ (`FormField` le fait automatiquement à partir du `name`).

## 7. Composition avec React Hook Form

Les composants natifs (`<input>` via `FormField`) se branchent avec
`register()`. Les composants contrôlés qui n'exposent pas l'API `<input>`
native (`Select`, `MultiSelect`, `DatePicker`) se branchent via
`<Controller>` — voir `ProductFormModal.tsx` pour l'exemple de référence
(champ "Catégorie").

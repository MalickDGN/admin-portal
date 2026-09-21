/**
 * Store en mémoire simulant un backend REST, avec latence réseau réaliste.
 * Utilisé uniquement quand VITE_USE_MOCKS !== "false" (voir createResource.ts).
 * Retirer ce fichier n'impacte aucune feature : elles ne connaissent que
 * l'interface renvoyée par createResourceService().
 */

const LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface ListPagedParams<T> {
  page: number;
  pageSize: number;
  search?: string;
  searchFields?: (item: T) => string;
  /** Nom de propriété de T à trier — les valeurs comparables directement (string/number) */
  sortKey?: keyof T;
  sortDir?: "asc" | "desc";
}

const stores = new Map<string, Map<string, unknown>>();

export function getMockStore<T extends { id: string }>(resource: string, seed: T[]) {
  if (!stores.has(resource)) {
    stores.set(resource, new Map(seed.map((item) => [item.id, item])));
  }
  const map = stores.get(resource) as Map<string, T>;

  return {
    list: async (params?: { search?: string; searchFields?: (item: T) => string }) => {
      let items = Array.from(map.values());
      if (params?.search && params.searchFields) {
        const q = params.search.toLowerCase();
        items = items.filter((item) => params.searchFields!(item).toLowerCase().includes(q));
      }
      return delay(items);
    },
    /**
     * Filtre + trie + pagine côté "serveur" (simulé), pour les modules à gros
     * volume qui ne peuvent pas charger l'intégralité des données en une fois.
     * Renvoie {items, total} — total permet au DataTable de calculer le
     * nombre de pages sans connaître l'ensemble des données.
     */
    listPaged: async (params: ListPagedParams<T>): Promise<PagedResult<T>> => {
      let items = Array.from(map.values());
      if (params.search && params.searchFields) {
        const q = params.search.toLowerCase();
        items = items.filter((item) => params.searchFields!(item).toLowerCase().includes(q));
      }
      if (params.sortKey && params.sortDir) {
        const key = params.sortKey;
        const dir = params.sortDir;
        items = [...items].sort((a, b) => {
          const av = a[key];
          const bv = b[key];
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return dir === "asc" ? cmp : -cmp;
        });
      }
      const total = items.length;
      const start = (params.page - 1) * params.pageSize;
      const pageItems = items.slice(start, start + params.pageSize);
      return delay({ items: pageItems, total });
    },
    getById: async (id: string) => {
      const item = map.get(id);
      if (!item) throw new Error(`${resource} "${id}" introuvable`);
      return delay(item);
    },
    create: async (data: Omit<T, "id">) => {
      const item = { ...data, id: crypto.randomUUID() } as T;
      map.set(item.id, item);
      return delay(item);
    },
    update: async (id: string, data: Partial<T>) => {
      const existing = map.get(id);
      if (!existing) throw new Error(`${resource} "${id}" introuvable`);
      const updated = { ...existing, ...data };
      map.set(id, updated);
      return delay(updated);
    },
    remove: async (id: string) => {
      map.delete(id);
      return delay(undefined as void);
    },
  };
}

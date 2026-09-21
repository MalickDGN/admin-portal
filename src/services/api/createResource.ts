import { apiClient } from "./client";
import { getMockStore, type ListPagedParams, type PagedResult } from "./mockStore";

// Bascule unique entre données simulées et backend réel.
// Mettre VITE_USE_MOCKS=false dans .env.<environment> quand l'API est prête —
// aucune feature ni composant n'a besoin d'être modifié.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

interface ListParams {
  search?: string;
  searchFields?: (item: unknown) => string;
  [key: string]: unknown;
}

/**
 * Fabrique un service CRUD standard pour une ressource REST.
 * Exemple :
 *   export const productsService = createResourceService<Product>("products", mockProducts);
 * Le composant appelant ne voit jamais la différence entre mock et vrai backend.
 *
 * `list()` charge l'intégralité de la ressource — adapté aux volumes
 * raisonnables (usage actuel : Produits, Commandes, Clients). Pour un module
 * à gros volume, préférer `listPaged()` avec `useResourcePaginationQuery`
 * (hooks/useResourcePaginationQuery.ts) et le mode "serveur" du DataTable
 * (voir ARCHITECTURE.md, section pagination).
 */
export function createResourceService<T extends { id: string }>(resource: string, seed: T[]) {
  const store = USE_MOCKS ? getMockStore<T>(resource, seed) : null;

  return {
    list: (params?: ListParams): Promise<T[]> =>
      store ? store.list(params as never) : apiClient.get<T[]>(`/${resource}`, { params: params as never }),
    listPaged: (params: ListPagedParams<T>): Promise<PagedResult<T>> =>
      store
        ? store.listPaged(params)
        : apiClient.get<PagedResult<T>>(`/${resource}`, {
            params: {
              page: params.page,
              pageSize: params.pageSize,
              search: params.search,
              sortKey: params.sortKey as string | undefined,
              sortDir: params.sortDir,
            },
          }),
    getById: (id: string): Promise<T> => (store ? store.getById(id) : apiClient.get<T>(`/${resource}/${id}`)),
    create: (data: Omit<T, "id">): Promise<T> =>
      store ? store.create(data) : apiClient.post<T>(`/${resource}`, data),
    update: (id: string, data: Partial<T>): Promise<T> =>
      store ? store.update(id, data) : apiClient.put<T>(`/${resource}/${id}`, data),
    remove: (id: string): Promise<void> => (store ? store.remove(id) : apiClient.delete<void>(`/${resource}/${id}`)),
  };
}

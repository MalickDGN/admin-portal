import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PagedResult, ListPagedParams } from "@services/api/mockStore";

interface PaginatedResourceService<T> {
  listPaged: (params: ListPagedParams<T>) => Promise<PagedResult<T>>;
}

/**
 * Pendant serveur de useResourceQuery, pour les modules à gros volume :
 * délègue filtrage, tri et pagination à l'API (ou au mock store), plutôt
 * que de charger toute la ressource en mémoire côté client.
 *
 * À utiliser avec DataTable en mode `serverMode` (voir ARCHITECTURE.md).
 * `keepPreviousData` évite un flash de contenu vide pendant le chargement
 * de la page suivante.
 */
export function usePaginatedResourceQuery<T extends { id: string }>(
  queryKey: string,
  service: PaginatedResourceService<T>,
  options: { pageSize?: number; searchFields?: (item: T) => string } = {},
) {
  const { pageSize = 10, searchFields } = options;
  const [page, setPage] = useState(1);
  const [query, setQueryState] = useState("");
  const [sortKey, setSortKeyState] = useState<keyof T | undefined>(undefined);
  const [sortDir, setSortDirState] = useState<"asc" | "desc" | undefined>(undefined);

  const result = useQuery({
    queryKey: [queryKey, "paged", { page, pageSize, query, sortKey, sortDir }],
    queryFn: () =>
      service.listPaged({
        page,
        pageSize,
        search: query || undefined,
        searchFields,
        sortKey,
        sortDir,
      }),
    placeholderData: keepPreviousData,
  });

  function setQuery(next: string) {
    setQueryState(next);
    setPage(1);
  }

  function setSort(key: keyof T | undefined, dir: "asc" | "desc" | undefined) {
    setSortKeyState(key);
    setSortDirState(dir);
    setPage(1);
  }

  return {
    items: result.data?.items ?? [],
    total: result.data?.total ?? 0,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    refetch: result.refetch,
    page,
    setPage,
    pageSize,
    query,
    setQuery,
    sortKey,
    sortDir,
    setSort,
  };
}

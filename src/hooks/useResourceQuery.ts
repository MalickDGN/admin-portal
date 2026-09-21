import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ResourceService<T> {
  list: (params?: Record<string, unknown>) => Promise<T[]>;
  create: (data: Omit<T, "id">) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

/**
 * Hook générique CRUD basé sur TanStack Query, pour éviter de dupliquer
 * la logique query/mutation/invalidation dans chaque feature.
 * Utilisation : const { items, create, update, remove, isLoading } = useResourceQuery(queryKey, service);
 */
export function useResourceQuery<T extends { id: string }>(
  queryKey: string,
  service: ResourceService<T>,
  listParams?: Record<string, unknown>,
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKey, listParams],
    queryFn: () => service.list(listParams),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  const createMutation = useMutation({
    mutationFn: (data: Omit<T, "id">) => service.create(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: invalidate,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<T>) => updateMutation.mutateAsync({ id, data }),
    remove: removeMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || removeMutation.isPending,
  };
}

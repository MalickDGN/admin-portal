import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePaginatedResourceQuery } from "./usePaginatedResourceQuery";

interface Item {
  id: string;
  name: string;
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("usePaginatedResourceQuery", () => {
  it("charge la première page au montage", async () => {
    const listPaged = vi.fn().mockResolvedValue({ items: [{ id: "1", name: "A" }], total: 25 });
    const { result } = renderHook(() => usePaginatedResourceQuery("items", { listPaged }, { pageSize: 10 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual([{ id: "1", name: "A" }]);
    expect(result.current.total).toBe(25);
    expect(listPaged).toHaveBeenCalledWith(expect.objectContaining({ page: 1, pageSize: 10 }));
  });

  it("ramène la page à 1 quand la recherche change", async () => {
    const listPaged = vi.fn().mockResolvedValue({ items: [], total: 0 });
    const { result } = renderHook(() => usePaginatedResourceQuery("items", { listPaged }, { pageSize: 10 }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.setPage(3));
    await waitFor(() => expect(result.current.page).toBe(3));

    act(() => result.current.setQuery("bougie"));
    await waitFor(() => expect(result.current.page).toBe(1));
    expect(result.current.query).toBe("bougie");
  });

  it("transmet la clé et la direction de tri au service", async () => {
    const listPaged = vi.fn().mockResolvedValue({ items: [], total: 0 });
    const { result } = renderHook(() => usePaginatedResourceQuery<Item>("items", { listPaged }, { pageSize: 10 }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.setSort("name", "asc"));
    await waitFor(() =>
      expect(listPaged).toHaveBeenCalledWith(expect.objectContaining({ sortKey: "name", sortDir: "asc", page: 1 })),
    );
  });
});

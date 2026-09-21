import { useMemo, useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, Download, SearchX } from "lucide-react";
import clsx from "clsx";
import { downloadCsv } from "@utils/csv";
import { EmptyState } from "@ui/EmptyState/EmptyState";
import { ErrorState } from "@ui/ErrorState/ErrorState";
import "./DataTable.css";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  /** Valeur texte utilisée pour l'export CSV. Par défaut : sortValue, sinon la colonne est exclue de l'export. */
  csvValue?: (row: T) => string | number;
  sortable?: boolean;
  width?: string;
}

interface DataTableServerControl {
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  sortKey?: string | null;
  sortDir?: SortDirection;
  onSortChange?: (key: string | null, dir: SortDirection) => void;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Recherche appliquée sur ces champs texte (au-delà d'accessor) si fourni */
  searchFields?: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  rowActions?: (row: T) => ReactNode;
  emptyLabel?: string;
  emptyDescription?: string;
  loading?: boolean;
  /** Affiche un état d'erreur illustré à la place du tableau, avec un bouton "Réessayer" si onRetry est fourni */
  error?: boolean;
  errorLabel?: string;
  onRetry?: () => void;
  /** Active le bouton d'export CSV (données filtrées/triées, toutes pages confondues). Ignoré en mode serveur. */
  exportable?: boolean;
  /** Active un second bouton d'export Excel (.xlsx), réutilise les mêmes csvValue. Ignoré en mode serveur. */
  excelExportable?: boolean;
  exportFileName?: string;
  /**
   * Mode "serveur" : `data` ne contient que la page courante (déjà filtrée/triée
   * par l'API ou le mock), et recherche/tri/pagination sont pilotés par le
   * parent via ces callbacks — typiquement `usePaginatedResourceQuery()`.
   * Pensé pour les modules à gros volume (voir ARCHITECTURE.md). Désactive
   * l'export (qui nécessiterait de charger toutes les pages).
   */
  server?: DataTableServerControl;
}

type SortDirection = "asc" | "desc" | null;

/**
 * Table de données générique et réutilisable : tri, recherche, pagination,
 * sélection multiple et actions par ligne. Utilisation :
 *
 * <DataTable columns={columns} data={products} getRowId={(p) => p.id} searchable selectable />
 */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  searchable,
  searchPlaceholder = "Rechercher...",
  searchFields,
  pageSize = 8,
  selectable,
  onSelectionChange,
  rowActions,
  emptyLabel = "Aucune donnée",
  emptyDescription,
  loading,
  error,
  errorLabel,
  onRetry,
  exportable,
  excelExportable,
  exportFileName = "export",
  server,
}: DataTableProps<T>) {
  const [localQuery, setLocalQuery] = useState("");
  const [localSortKey, setLocalSortKey] = useState<string | null>(null);
  const [localSortDir, setLocalSortDir] = useState<SortDirection>(null);
  const [localPage, setLocalPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const isServer = Boolean(server);
  const query = isServer ? (server!.query ?? "") : localQuery;
  const sortKey = isServer ? (server!.sortKey ?? null) : localSortKey;
  const sortDir = isServer ? (server!.sortDir ?? null) : localSortDir;

  const filtered = useMemo(() => {
    if (isServer) return data;
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) => {
      const haystack = searchFields ? searchFields(row) : columns.map((c) => String(c.accessor(row) ?? "")).join(" ");
      return haystack.toLowerCase().includes(q);
    });
  }, [data, query, searchFields, columns, isServer]);

  const sorted = useMemo(() => {
    if (isServer) return filtered;
    if (!sortKey || !sortDir) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns, isServer]);

  const totalCount = isServer ? server!.totalCount : sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageSafe = isServer ? server!.page : Math.min(localPage, totalPages);
  const paginated = isServer ? data : sorted.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  function handleQueryChange(value: string) {
    if (isServer) {
      server!.onQueryChange?.(value);
    } else {
      setLocalQuery(value);
      setLocalPage(1);
    }
  }

  function handlePageChange(next: number) {
    if (isServer) {
      server!.onPageChange(next);
    } else {
      setLocalPage(next);
    }
  }

  function toggleSort(col: DataTableColumn<T>) {
    if (!col.sortable) return;
    let nextKey: string | null;
    let nextDir: SortDirection;
    if (sortKey !== col.key) {
      nextKey = col.key;
      nextDir = "asc";
    } else if (sortDir === "asc") {
      nextKey = col.key;
      nextDir = "desc";
    } else {
      nextKey = null;
      nextDir = null;
    }
    if (isServer) {
      server!.onSortChange?.(nextKey, nextDir);
    } else {
      setLocalSortKey(nextKey);
      setLocalSortDir(nextDir);
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  }

  function toggleAll() {
    const next = selected.size === paginated.length ? new Set<string>() : new Set(paginated.map(getRowId));
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  }

  function handleExport() {
    const exportableColumns = columns.filter((c) => c.csvValue || c.sortValue);
    const headers = exportableColumns.map((c) => c.header);
    const rows = sorted.map((row) => exportableColumns.map((c) => (c.csvValue ?? c.sortValue)!(row)));
    downloadCsv(exportFileName, headers, rows);
  }

  function handleExportExcel() {
    const exportableColumns = columns.filter((c) => c.csvValue || c.sortValue);
    const headers = exportableColumns.map((c) => c.header);
    const rows = sorted.map((row) => exportableColumns.map((c) => (c.csvValue ?? c.sortValue)!(row)));
    // Import différé : la librairie SheetJS (~300 Ko) n'est téléchargée que si
    // l'utilisateur clique réellement sur "Exporter Excel" (§17 — chargement à la demande).
    import("@utils/excel").then(({ downloadXlsx }) => downloadXlsx(exportFileName, exportFileName, headers, rows));
  }

  return (
    <div className="data-table">
      {(searchable || (!isServer && (exportable || excelExportable))) && (
        <div className="data-table__toolbar">
          {searchable ? (
            <div className="data-table__search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />
            </div>
          ) : (
            <span />
          )}
          <div className="data-table__toolbar-right">
            {selected.size > 0 && <span className="data-table__selection-count">{selected.size} sélectionné(s)</span>}
            {!isServer && exportable && (
              <button type="button" className="data-table__export-btn" onClick={handleExport}>
                <Download size={14} /> {excelExportable ? "Exporter CSV" : "Exporter"}
              </button>
            )}
            {!isServer && excelExportable && (
              <button type="button" className="data-table__export-btn" onClick={handleExportExcel}>
                <Download size={14} /> Exporter Excel
              </button>
            )}
          </div>
        </div>
      )}

      <div className="data-table__scroll">
        <table>
          <thead>
            <tr>
              {selectable && (
                <th className="data-table__checkbox-col">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selected.size === paginated.length}
                    onChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  <button
                    type="button"
                    className={clsx("data-table__sort-btn", !col.sortable && "data-table__sort-btn--static")}
                    onClick={() => toggleSort(col)}
                  >
                    {col.header}
                    {col.sortable && sortKey === col.key && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </button>
                </th>
              ))}
              {rowActions && <th aria-label="Actions" />}
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="data-table__state">
                  <ErrorState title={errorLabel} onRetry={onRetry} />
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="data-table__state">
                  Chargement...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="data-table__state">
                  <EmptyState
                    icon={query.trim() ? SearchX : undefined}
                    title={query.trim() ? "Aucun résultat" : emptyLabel}
                    description={query.trim() ? `Aucune ligne ne correspond à "${query}".` : emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              paginated.map((row) => {
                const id = getRowId(row);
                return (
                  <tr key={id}>
                    {selectable && (
                      <td className="data-table__checkbox-col">
                        <input type="checkbox" checked={selected.has(id)} onChange={() => toggleRow(id)} aria-label="Sélectionner la ligne" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key}>{col.accessor(row)}</td>
                    ))}
                    {rowActions && <td className="data-table__actions-col">{rowActions(row)}</td>}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="data-table__pagination">
          <span>
            Page {pageSafe} / {totalPages} · {totalCount} résultat(s)
          </span>
          <div className="data-table__pagination-controls">
            <button type="button" disabled={pageSafe <= 1} onClick={() => handlePageChange(pageSafe - 1)} aria-label="Page précédente">
              <ChevronLeft size={16} />
            </button>
            <button type="button" disabled={pageSafe >= totalPages} onClick={() => handlePageChange(pageSafe + 1)} aria-label="Page suivante">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

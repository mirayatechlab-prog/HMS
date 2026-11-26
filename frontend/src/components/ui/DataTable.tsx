import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { EmptyState, SkeletonBlock } from './States';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  isLoading?: boolean;
  caption?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  searchPlaceholder = 'Search records...',
  searchFilter,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filter criteria.',
  isLoading = false,
  caption,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchFilter || !query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) => searchFilter(row, q));
  }, [data, query, searchFilter]);

  return (
    <div className="rounded-lg border border-surface-border bg-surface shadow-sm">
      {searchFilter ? (
        <div className="border-b border-surface-border px-4 py-3">
          <div className="relative max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full rounded-md border border-surface-border bg-surface-muted py-1.5 pl-9 pr-3 text-sm text-navy-950 placeholder:text-slate-400 focus:border-teal-600 focus:bg-surface focus:outline-none"
            />
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2 p-4">
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-8 w-3/4" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {caption ? <caption className="sr-only">{caption}</caption> : null}
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted text-xs font-semibold uppercase tracking-wide text-slate-600">
                {columns.map((col) => (
                  <th key={col.key} scope="col" className={cn('px-4 py-2.5', col.className)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((row) => (
                <tr key={getRowKey(row)} className="hover:bg-surface-muted/70">
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-4 py-2.5 text-navy-950', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { StatusBadge, bedStatusBadgeProps } from '@/components/ui/StatusBadge';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useDemoInfrastructureStore } from '@/stores/demoInfrastructureStore';
import { type BedOperationalStatus, computeCapacityMetrics } from '@/types/infrastructure';

const STATUS_OPTIONS: BedOperationalStatus[] = [
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'CLEANING',
  'MAINTENANCE',
  'BLOCKED',
];

export function BedBoardPreview() {
  const { wards, categories, rooms, beds, updateBedStatus } = useDemoInfrastructureStore();
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const metrics = computeCapacityMetrics(beds);

  const roomMap = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
  const wardMap = useMemo(() => new Map(wards.map((w) => [w.id, w])), [wards]);
  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filteredBeds = useMemo(
    () =>
      beds.filter((bed) => {
        const room = roomMap.get(bed.roomId);
        if (wardFilter !== 'ALL' && room?.wardId !== wardFilter) return false;
        if (catFilter !== 'ALL' && room?.categoryId !== catFilter) return false;
        if (statusFilter !== 'ALL' && bed.status !== statusFilter) return false;
        return true;
      }),
    [beds, roomMap, wardFilter, catFilter, statusFilter],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Bed Board"
        subtitle="Real-time bed operational statuses separated from active/archived lifecycle state."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Live Bed Board' }]}
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryCard title="Available" value={metrics.availableBeds} accent="teal" />
        <SummaryCard title="Occupied" value={metrics.occupiedBeds} />
        <SummaryCard title="Reserved" value={metrics.reservedBeds} />
        <SummaryCard title="Cleaning" value={metrics.cleaningBeds} accent="warning" />
        <SummaryCard title="Maintenance" value={metrics.maintenanceBeds} accent="danger" />
        <SummaryCard title="Blocked" value={metrics.blockedBeds} />
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-surface-border bg-surface p-3">
        <select
          aria-label="Filter by ward"
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="rounded-md border border-surface-border px-2.5 py-1.5 text-xs"
        >
          <option value="ALL">All Wards</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by room category"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-md border border-surface-border px-2.5 py-1.5 text-xs"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by bed status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-surface-border px-2.5 py-1.5 text-xs"
        >
          <option value="ALL">All Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {filteredBeds.length === 0 ? (
        <EmptyState
          title="No beds match current filters"
          description="Adjust ward, category, or status filters or configure beds in Infrastructure."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredBeds.map((bed) => {
            const room = roomMap.get(bed.roomId);
            const ward = room ? wardMap.get(room.wardId) : undefined;
            const cat = room ? catMap.get(room.categoryId) : undefined;
            const badge = bedStatusBadgeProps(bed.status);
            return (
              <div
                key={bed.id}
                className="flex flex-col justify-between rounded-lg border border-surface-border bg-surface p-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-navy-950">{bed.bedCode}</span>
                    <StatusBadge label={badge.label} tone={badge.tone} icon={badge.icon} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {ward?.name ?? 'Unassigned'} • {cat?.name ?? 'Standard'}
                  </p>
                  {bed.occupantLabel ? (
                    <p className="mt-1.5 text-xs font-medium text-navy-900">{bed.occupantLabel}</p>
                  ) : null}
                </div>
                <div className="mt-3 border-t border-surface-border pt-2">
                  <label className="sr-only" htmlFor={`status-${bed.id}`}>
                    Change status for {bed.bedCode}
                  </label>
                  <select
                    id={`status-${bed.id}`}
                    value={bed.status}
                    onChange={(e) => updateBedStatus(bed.id, e.target.value as BedOperationalStatus)}
                    className="w-full rounded border border-surface-border bg-surface-muted px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge, bedStatusBadgeProps } from '@/components/ui/StatusBadge';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { formatINR } from '@/lib/utils';
import { useDemoInfrastructureStore } from '@/stores/demoInfrastructureStore';
import { computeCapacityMetrics } from '@/types/infrastructure';

export function InfrastructurePreview() {
  const {
    buildings,
    floors,
    wards,
    categories,
    rooms,
    beds,
    loadPreset,
    addBuilding,
    addRoomWithBeds,
    removeBed,
    toggleBedActive,
  } = useDemoInfrastructureStore();

  const metrics = computeCapacityMetrics(beds);
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newRoomNum, setNewRoomNum] = useState('301');
  const [newRoomBeds, setNewRoomBeds] = useState(2);
  const [selectedWardId, setSelectedWardId] = useState(wards[0]?.id ?? '');
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id ?? '');

  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;
    addBuilding(newBuildingName.trim(), newBuildingName.trim().slice(0, 4));
    setNewBuildingName('');
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const wardId = selectedWardId || wards[0]?.id;
    const catId = selectedCatId || categories[0]?.id;
    if (!wardId || !catId || !newRoomNum.trim()) return;
    addRoomWithBeds(wardId, catId, newRoomNum.trim(), newRoomBeds);
    setNewRoomNum(String(Number(newRoomNum) + 1 || 302));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dynamic Hospital Infrastructure"
        subtitle="Hierarchy: Hospital → Building → Floor → Ward → Room → Bed. Zero hardcoded capacities."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Infrastructure' }]}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {(['zero', 'five', 'thirty', 'hundred'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => loadPreset(preset)}
                className="rounded-md border border-surface-border bg-surface px-2.5 py-1 text-xs font-medium text-navy-900 hover:bg-surface-subtle"
              >
                {preset === 'zero' ? '0 Beds' : preset === 'five' ? '5 Beds' : preset === 'thirty' ? '30 Beds' : '100 Beds'}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard title="Buildings" value={buildings.length} />
        <SummaryCard title="Floors" value={floors.length} />
        <SummaryCard title="Wards" value={wards.length} />
        <SummaryCard title="Rooms" value={rooms.length} />
        <SummaryCard
          title="Configured Beds"
          value={metrics.configuredBeds}
          subtitle={`${metrics.activeBeds} active • ${metrics.inactiveBeds} inactive`}
          accent="teal"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleAddBuilding}
          className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-navy-950">Add Fictional Building</h2>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newBuildingName}
              onChange={(e) => setNewBuildingName(e.target.value)}
              placeholder="e.g., Diagnostic Annex"
              aria-label="New building name"
              className="flex-1 rounded-md border border-surface-border px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </form>

        <form
          onSubmit={handleAddRoom}
          className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-navy-950">Add Room with Mixed Bed Capacity</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <select
              aria-label="Select ward"
              value={selectedWardId || wards[0]?.id || ''}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="rounded-md border border-surface-border px-2 py-1.5 text-xs"
              disabled={wards.length === 0}
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Select room category"
              value={selectedCatId || categories[0]?.id || ''}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="rounded-md border border-surface-border px-2 py-1.5 text-xs"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({formatINR(c.baseTariffPerDay)})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newRoomNum}
              onChange={(e) => setNewRoomNum(e.target.value)}
              placeholder="Room #"
              aria-label="Room number"
              className="rounded-md border border-surface-border px-2 py-1.5 text-xs"
            />
            <div className="flex gap-1.5">
              <input
                type="number"
                min={0}
                max={20}
                value={newRoomBeds}
                onChange={(e) => setNewRoomBeds(Number(e.target.value))}
                aria-label="Beds in room"
                className="w-16 rounded-md border border-surface-border px-2 py-1.5 text-xs"
              />
              <button
                type="submit"
                disabled={wards.length === 0}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-teal-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Room
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-navy-950">
          Configured Individual Beds ({beds.length})
        </h2>
        {beds.length === 0 ? (
          <p className="mt-2 text-xs text-slate-600">
            Zero beds configured — valid initial onboarding state. Add a room or load a preset above.
          </p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {beds.slice(0, 35).map((bed) => {
              const badge = bedStatusBadgeProps(bed.status);
              return (
                <div
                  key={bed.id}
                  className="flex flex-col justify-between rounded-md border border-surface-border bg-surface-muted p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-navy-950">{bed.bedCode}</span>
                    <button
                      type="button"
                      onClick={() => removeBed(bed.id)}
                      aria-label={`Remove bed ${bed.bedCode}`}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <StatusBadge label={badge.label} tone={badge.tone} icon={badge.icon} />
                    <button
                      type="button"
                      onClick={() => toggleBedActive(bed.id)}
                      className="text-[11px] font-medium text-teal-700 hover:underline"
                    >
                      {bed.isActive ? 'Active' : 'Archived'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

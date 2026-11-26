import { Activity, BedDouble, CalendarCheck, FlaskConical, IndianRupee, Pill, UserCheck } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { DEMO_LAB_ORDERS, DEMO_OPD_QUEUE, DEMO_PHARMACY_BATCHES } from '@/features/previews/mockData';
import { formatINR } from '@/lib/utils';
import { useDemoInfrastructureStore } from '@/stores/demoInfrastructureStore';
import { computeCapacityMetrics } from '@/types/infrastructure';

export function CommandCenterPreview() {
  const beds = useDemoInfrastructureStore((s) => s.beds);
  const loadPreset = useDemoInfrastructureStore((s) => s.loadPreset);
  const metrics = computeCapacityMetrics(beds);

  const pendingLabCount = DEMO_LAB_ORDERS.filter((o) => o.orderStatus !== 'RELEASED').length;
  const pharmacyAlertCount = DEMO_PHARMACY_BATCHES.filter((b) => b.status !== 'ACTIVE').length;

  const opdColumns: DataTableColumn<(typeof DEMO_OPD_QUEUE)[number]>[] = [
    { key: 'token', header: 'Token', render: (r) => <span className="font-mono text-xs font-semibold">{r.token}</span> },
    { key: 'patient', header: 'Patient (Demo)', render: (r) => <span>{r.patientName}</span> },
    { key: 'doctor', header: 'Doctor', render: (r) => <span className="text-slate-600">{r.doctorName}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <StatusBadge
          label={r.status.replace('_', ' ')}
          tone={r.status === 'COMPLETED' ? 'success' : r.status === 'IN_CONSULTATION' ? 'teal' : 'warning'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Command Center"
        subtitle="Dynamic operational overview derived from live configured bed records (Fictional Preview)."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Command Center' }]}
        actions={
          <div className="flex flex-wrap gap-1.5">
            {(['zero', 'five', 'thirty', 'hundred'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => loadPreset(preset)}
                className="rounded-md border border-surface-border bg-surface px-2.5 py-1 text-xs font-medium text-navy-900 hover:bg-surface-subtle"
              >
                Load {preset === 'zero' ? '0' : preset === 'five' ? '5' : preset === 'thirty' ? '30' : '100'} Beds
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Bed Occupancy"
          value={`${metrics.occupancyRatePercent}%`}
          subtitle={`${metrics.occupiedBeds} occupied / ${metrics.activeBeds} active (${metrics.inactiveBeds} inactive)`}
          icon={<BedDouble className="h-5 w-5" />}
          accent="teal"
        />
        <SummaryCard
          title="Today's OPD"
          value={DEMO_OPD_QUEUE.length}
          subtitle="1 in consultation • 1 waiting"
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <SummaryCard
          title="Admissions / Discharges"
          value="4 / 2"
          subtitle="Fictional today count (IST)"
          icon={<UserCheck className="h-5 w-5" />}
        />
        <SummaryCard
          title="Illustrative Collections"
          value={formatINR(48750)}
          subtitle="OPD + IPD Advances + Pharmacy"
          icon={<IndianRupee className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Available Beds"
          value={metrics.availableBeds}
          subtitle={`Out of ${metrics.configuredBeds} configured`}
          icon={<Activity className="h-5 w-5" />}
        />
        <SummaryCard
          title="Pending Lab Reports"
          value={pendingLabCount}
          subtitle="External lab turnaround tracking"
          icon={<FlaskConical className="h-5 w-5" />}
          accent="warning"
        />
        <SummaryCard
          title="Pharmacy Alerts"
          value={pharmacyAlertCount}
          subtitle="Low stock, near-expiry, quarantined"
          icon={<Pill className="h-5 w-5" />}
          accent="danger"
        />
      </div>

      <section aria-labelledby="cmd-opd-heading" className="space-y-3">
        <h2 id="cmd-opd-heading" className="text-sm font-semibold text-navy-950">
          Live OPD Queue Snapshot (Fictional)
        </h2>
        <DataTable
          data={DEMO_OPD_QUEUE}
          columns={opdColumns}
          getRowKey={(r) => r.id}
          caption="Fictional OPD queue snapshot"
        />
      </section>
    </div>
  );
}

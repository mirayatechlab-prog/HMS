import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessibleAlert } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_PHARMACY_BATCHES } from '@/features/previews/mockData';
import { formatDateIST, formatINR } from '@/lib/utils';

export function PharmacyPreview() {
  const columns: DataTableColumn<(typeof DEMO_PHARMACY_BATCHES)[number]>[] = [
    {
      key: 'med',
      header: 'Medicine',
      render: (b) => (
        <div>
          <p className="font-medium text-navy-950">{b.medicineName}</p>
          <p className="text-xs text-slate-500">{b.genericName}</p>
        </div>
      ),
    },
    { key: 'batch', header: 'Batch No.', render: (b) => <span className="font-mono text-xs">{b.batchNo}</span> },
    { key: 'expiry', header: 'Expiry', render: (b) => <span>{formatDateIST(b.expiryDate)}</span> },
    { key: 'stock', header: 'Stock (Units)', render: (b) => <span className="font-semibold">{b.stockUnits}</span> },
    { key: 'mrp', header: 'MRP', render: (b) => <span>{formatINR(b.mrpInr)}</span> },
    {
      key: 'status',
      header: 'Batch Status',
      render: (b) => (
        <StatusBadge
          label={b.status.replace('_', ' ')}
          tone={
            b.status === 'ACTIVE'
              ? 'success'
              : b.status === 'QUARANTINED'
                ? 'danger'
                : 'warning'
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="In-House Pharmacy Workspace"
        subtitle="Batch-based FEFO inventory, expiry quarantine, and OPD/IPD dispensing (Fictional Preview)."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Pharmacy' }]}
      />

      <AccessibleAlert tone="warning" title="FEFO & Quarantine Policy">
        Expired and quarantined batches (e.g., CEF-24Z) are strictly blocked from dispensing.
      </AccessibleAlert>

      <DataTable
        data={DEMO_PHARMACY_BATCHES}
        columns={columns}
        getRowKey={(b) => b.id}
        searchPlaceholder="Search medicine or batch..."
        searchFilter={(b, q) =>
          b.medicineName.toLowerCase().includes(q) ||
          b.genericName.toLowerCase().includes(q) ||
          b.batchNo.toLowerCase().includes(q)
        }
      />
    </div>
  );
}

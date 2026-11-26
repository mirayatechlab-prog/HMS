import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessibleAlert } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_LAB_ORDERS } from '@/features/previews/mockData';

export function LaboratoryPreview() {
  const columns: DataTableColumn<(typeof DEMO_LAB_ORDERS)[number]>[] = [
    { key: 'order', header: 'Order #', render: (o) => <span className="font-mono text-xs font-semibold">{o.orderNumber}</span> },
    { key: 'patient', header: 'Patient', render: (o) => <span>{o.patientName}</span> },
    { key: 'test', header: 'Test', render: (o) => <span className="font-medium">{o.testName}</span> },
    {
      key: 'sample',
      header: 'Specimen',
      render: (o) => <StatusBadge label={o.sampleType} tone={o.sampleType === 'Blood' ? 'danger' : 'info'} />,
    },
    { key: 'collector', header: 'External Collector', render: (o) => <span className="text-xs">{o.collectorName}</span> },
    { key: 'lab', header: 'External Lab', render: (o) => <span className="text-xs">{o.externalLab}</span> },
    {
      key: 'status',
      header: 'State',
      render: (o) => (
        <StatusBadge
          label={o.orderStatus.replace('_', ' ')}
          tone={o.orderStatus === 'RELEASED' ? 'success' : o.orderStatus === 'REPORT_UPLOADED' ? 'teal' : 'warning'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="External Laboratory & Sample Collection"
        subtitle="Blood & urine specimen handoff to external collectors and partner diagnostic labs (Fictional Preview)."
        breadcrumbs={[{ label: 'Previews' }, { label: 'External Lab' }]}
      />

      <AccessibleAlert tone="info" title="Least-Privilege Collector & Private Storage">
        External collectors only view assigned collection details. Uploaded PDF reports are stored in
        private S3-compatible storage and served via short-lived authorized links.
      </AccessibleAlert>

      <DataTable
        data={DEMO_LAB_ORDERS}
        columns={columns}
        getRowKey={(o) => o.id}
        searchPlaceholder="Search order, test, or collector..."
        searchFilter={(o, q) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.testName.toLowerCase().includes(q) ||
          o.collectorName.toLowerCase().includes(q)
        }
      />
    </div>
  );
}

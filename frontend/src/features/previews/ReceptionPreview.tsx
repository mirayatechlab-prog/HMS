import { UserPlus } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { TextField } from '@/components/ui/FormFields';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_OPD_QUEUE } from '@/features/previews/mockData';

export function ReceptionPreview() {
  const columns: DataTableColumn<(typeof DEMO_OPD_QUEUE)[number]>[] = [
    { key: 'token', header: 'Token', render: (r) => <span className="font-mono text-xs font-bold">{r.token}</span> },
    { key: 'uhid', header: 'Permanent UHID', render: (r) => <span className="font-mono text-xs">{r.uhid}</span> },
    { key: 'patient', header: 'Patient Name', render: (r) => <span className="font-medium">{r.patientName}</span> },
    { key: 'type', header: 'Visit Type', render: (r) => <span>{r.visitType}</span> },
    { key: 'doctor', header: 'Assigned Doctor', render: (r) => <span>{r.doctorName}</span> },
    {
      key: 'status',
      header: 'Queue Status',
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
        title="Reception Workspace"
        subtitle="Patient registration (UHID), OPD appointment/walk-in queue, and receipt desk (Fictional Preview)."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Reception' }]}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
          >
            <UserPlus className="h-3.5 w-3.5" /> Register Patient (Demo)
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-navy-950">Quick Walk-in Lookup (Demo)</h2>
          <div className="mt-3 space-y-3">
            <TextField label="UHID or Mobile Number" placeholder="e.g., DEMO-UHID-00104" />
            <TextField label="Patient Full Name" placeholder="Fictional patient name" />
            <p className="text-xs text-slate-500">
              Receptionists cannot modify signed clinical notes; role boundaries enforced in Phase 1.
            </p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <DataTable
            data={DEMO_OPD_QUEUE}
            columns={columns}
            getRowKey={(r) => r.id}
            searchPlaceholder="Search token, UHID, or patient..."
            searchFilter={(r, q) =>
              r.token.toLowerCase().includes(q) ||
              r.uhid.toLowerCase().includes(q) ||
              r.patientName.toLowerCase().includes(q)
            }
          />
        </div>
      </div>
    </div>
  );
}

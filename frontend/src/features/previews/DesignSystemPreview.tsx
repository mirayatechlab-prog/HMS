import { useState } from 'react';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { DateTimeField, SelectField, TextField } from '@/components/ui/FormFields';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessibleAlert, EmptyState, ErrorState, SkeletonBlock } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SummaryCard } from '@/components/ui/SummaryCard';

export function DesignSystemPreview() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="MediCore Design System Gallery"
        subtitle="WCAG 2.2 AA accessible primitives for clinical, operational, and financial workflows."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Design System' }]}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-950">Semantic Status Indicators (Icon + Text + Color)</h2>
        <div className="flex flex-wrap gap-2 rounded-lg border border-surface-border bg-surface p-4">
          <StatusBadge label="Available" tone="success" />
          <StatusBadge label="Occupied" tone="teal" />
          <StatusBadge label="Reserved" tone="info" />
          <StatusBadge label="Cleaning" tone="warning" />
          <StatusBadge label="Maintenance" tone="danger" />
          <StatusBadge label="Blocked" tone="neutral" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-950">Summary Cards</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard title="Default Card" value="128" subtitle="Neutral metric" />
          <SummaryCard title="Teal Accent" value="94.2%" subtitle="Clinical / operational" accent="teal" />
          <SummaryCard title="Warning Accent" value="3" subtitle="Requires review" accent="warning" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-950">Accessible Form Controls</h2>
        <div className="grid gap-4 rounded-lg border border-surface-border bg-surface p-4 sm:grid-cols-3">
          <TextField label="Standard Input" placeholder="Enter value..." hint="Helper text" />
          <SelectField
            label="Room Category"
            options={[
              { value: 'GEN', label: 'General Ward' },
              { value: 'SEMI', label: 'Semi-Special' },
              { value: 'SPEC', label: 'Special / Private' },
            ]}
          />
          <DateTimeField label="Effective From (IST)" error="Example validation message" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-950">Dialogs, Alerts & States</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
          >
            Open Modal Dialog
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100"
          >
            Open Confirmation Dialog
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <AccessibleAlert tone="info" title="Information Alert">
            System running in Asia/Kolkata timezone with INR currency formatting.
          </AccessibleAlert>
          <ErrorState message="Simulated API error state with retry action." onRetry={() => undefined} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState title="Empty State" description="Shown cleanly when zero records are configured." />
          <div className="space-y-2 rounded-lg border border-surface-border bg-surface p-4">
            <p className="text-xs font-semibold text-slate-600">Skeleton Loading</p>
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-5 w-full" />
            <SkeletonBlock className="h-5 w-1/2" />
          </div>
        </div>
      </section>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Sample Clinical Dialog"
        description="Keyboard-accessible modal with Escape key support."
      >
        <p className="text-sm text-slate-700">Modal body content.</p>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => undefined}
        title="Archive Bed?"
        message="Archived beds cannot receive new admissions while preserving historical assignments."
        confirmLabel="Archive"
        tone="danger"
      />
    </div>
  );
}

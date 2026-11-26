import { FileText, FlaskConical, Pill } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessibleAlert } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function DoctorPreview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Consultation Workspace"
        subtitle="Encounter-scoped clinical notes, vitals, prescriptions, and lab requests (Fictional Preview)."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Doctor Workspace' }]}
      />

      <AccessibleAlert tone="info" title="Clinical Safety & Audit Invariant">
        Signed clinical notes are immutable; subsequent corrections create timestamped append-only
        amendments. Visiting doctors only access assigned patient encounters.
      </AccessibleAlert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Active Encounter
          </p>
          <h2 className="mt-1 text-base font-bold text-navy-950">Aarav Patel (Demo)</h2>
          <p className="font-mono text-xs text-slate-600">UHID: DEMO-UHID-00104 • 34y / M</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <StatusBadge label="Penicillin Allergy" tone="danger" />
            <StatusBadge label="OPD-014" tone="teal" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-surface-border pt-3 text-xs">
            <div>
              <dt className="text-slate-500">BP</dt>
              <dd className="font-semibold">124/80 mmHg</dd>
            </div>
            <div>
              <dt className="text-slate-500">Temp</dt>
              <dd className="font-semibold">98.6 °F</dd>
            </div>
            <div>
              <dt className="text-slate-500">Pulse</dt>
              <dd className="font-semibold">76 bpm</dd>
            </div>
            <div>
              <dt className="text-slate-500">SpO2</dt>
              <dd className="font-semibold">99%</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <FileText className="h-4 w-4 text-teal-700" /> Clinical Observations & Diagnosis
            </div>
            <p className="mt-2 rounded-md bg-surface-muted p-3 text-xs text-slate-700">
              Demo Note: Mild upper respiratory tract symptoms for 2 days. No respiratory distress.
              Recorded by Dr. Kavita Desai (Permanent).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <Pill className="h-4 w-4 text-teal-700" /> Prescription Orders
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Paracetamol 650 mg — 1 tab SOS (Max 3/day) • 5 days
              </p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <FlaskConical className="h-4 w-4 text-teal-700" /> External Lab Requests
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Complete Blood Count (CBC) — Blood • External Collector Assigned
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

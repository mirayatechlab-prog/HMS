import { Check, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useState } from 'react';
import { TextField } from '@/components/ui/FormFields';
import { PageHeader } from '@/components/ui/PageHeader';
import { AccessibleAlert } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

const WIZARD_STEPS = [
  '1. Hospital Profile',
  '2. Buildings & Floors',
  '3. Wards & Categories',
  '4. Rooms & Beds',
  '5. Doctors',
  '6. Staff & RBAC',
  '7. Pharmacy & Labs',
  '8. Tariffs & Billing',
  '9. Validate & Activate',
];

export function SetupWizardPreview() {
  const [step, setStep] = useState(0);
  const [hospitalName, setHospitalName] = useState('Arogya Demo Multi-Specialty Hospital');
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Setup Wizard (Phase 1 Design Preview)"
        subtitle="9-step configurable onboarding supporting draft save and zero-bed initial state."
        breadcrumbs={[{ label: 'Previews' }, { label: 'Setup Wizard' }]}
        actions={
          <button
            type="button"
            onClick={() => setDraftSavedAt(new Date().toLocaleTimeString('en-IN'))}
            className="inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-navy-900 hover:bg-surface-subtle"
          >
            <Save className="h-3.5 w-3.5" /> Save Draft
          </button>
        }
      />

      {draftSavedAt ? (
        <AccessibleAlert tone="success" title="Draft Saved (Demo)">
          Configuration draft saved locally at {draftSavedAt}.
        </AccessibleAlert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-4">
        <ol className="space-y-1 rounded-lg border border-surface-border bg-surface p-3 shadow-sm">
          {WIZARD_STEPS.map((label, idx) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => setStep(idx)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium',
                  step === idx
                    ? 'bg-teal-700 text-white'
                    : idx < step
                      ? 'bg-teal-50 text-teal-900'
                      : 'text-slate-600 hover:bg-surface-subtle',
                )}
              >
                <span>{label}</span>
                {idx < step ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ol>

        <div className="rounded-lg border border-surface-border bg-surface p-5 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="text-base font-semibold text-navy-950">{WIZARD_STEPS[step]}</h2>
            <StatusBadge label={`Step ${step + 1} of 9`} tone="info" />
          </div>

          <div className="mt-4 space-y-4">
            {step === 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Hospital Display Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                />
                <TextField label="Default Timezone & Currency" value="Asia/Kolkata • INR (₹)" readOnly />
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                Interactive Phase 0 design preview for <strong>{WIZARD_STEPS[step]}</strong>.
                Administrators can configure arbitrary counts or skip bed creation during initial
                onboarding and add resources post-activation.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-between border-t border-surface-border pt-4">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-navy-900 hover:bg-surface-subtle disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              type="button"
              disabled={step === WIZARD_STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}
              className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

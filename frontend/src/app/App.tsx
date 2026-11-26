import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, SkeletonBlock } from '@/components/ui/States';
import { AppShell } from '@/layouts/AppShell';

const BedBoardPreview = lazy(() =>
  import('@/features/previews/BedBoardPreview').then((m) => ({ default: m.BedBoardPreview })),
);
const CommandCenterPreview = lazy(() =>
  import('@/features/previews/CommandCenterPreview').then((m) => ({
    default: m.CommandCenterPreview,
  })),
);
const DesignSystemPreview = lazy(() =>
  import('@/features/previews/DesignSystemPreview').then((m) => ({
    default: m.DesignSystemPreview,
  })),
);
const DoctorPreview = lazy(() =>
  import('@/features/previews/DoctorPreview').then((m) => ({ default: m.DoctorPreview })),
);
const InfrastructurePreview = lazy(() =>
  import('@/features/previews/InfrastructurePreview').then((m) => ({
    default: m.InfrastructurePreview,
  })),
);
const LaboratoryPreview = lazy(() =>
  import('@/features/previews/LaboratoryPreview').then((m) => ({ default: m.LaboratoryPreview })),
);
const PharmacyPreview = lazy(() =>
  import('@/features/previews/PharmacyPreview').then((m) => ({ default: m.PharmacyPreview })),
);
const ReceptionPreview = lazy(() =>
  import('@/features/previews/ReceptionPreview').then((m) => ({ default: m.ReceptionPreview })),
);
const SetupWizardPreview = lazy(() =>
  import('@/features/previews/SetupWizardPreview').then((m) => ({
    default: m.SetupWizardPreview,
  })),
);

/**
 * Phase 0 demonstration previews are strictly restricted to development mode (DEV=true)
 * AND explicit opt-in via VITE_ENABLE_PHASE0_PREVIEWS=true.
 * Production builds (PROD=true) always fail closed regardless of env flag misconfiguration.
 */
export function isPhase0PreviewsEnabled(
  env: { DEV?: boolean; PROD?: boolean; VITE_ENABLE_PHASE0_PREVIEWS?: string } = import.meta.env,
): boolean {
  if (env.PROD) return false;
  return Boolean(env.DEV) && env.VITE_ENABLE_PHASE0_PREVIEWS === 'true';
}

export function ProductionGateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-6">
      <div className="max-w-md rounded-lg border border-surface-border bg-surface p-6 text-center shadow-sm">
        <h1 className="text-lg font-bold text-navy-950">MediCore HMS</h1>
        <p className="mt-2 text-sm text-slate-600">
          Phase 0 demonstration previews are disabled in production builds.
        </p>
      </div>
    </div>
  );
}

export function App() {
  if (!isPhase0PreviewsEnabled()) {
    return (
      <ErrorBoundary>
        <ProductionGateFallback />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<SkeletonBlock className="h-48 w-full" />}>
            <Routes>
              <Route path="/" element={<Navigate to="/previews/command-center" replace />} />
              <Route path="/previews/command-center" element={<CommandCenterPreview />} />
              <Route path="/previews/infrastructure" element={<InfrastructurePreview />} />
              <Route path="/previews/bed-board" element={<BedBoardPreview />} />
              <Route path="/previews/reception" element={<ReceptionPreview />} />
              <Route path="/previews/doctor" element={<DoctorPreview />} />
              <Route path="/previews/pharmacy" element={<PharmacyPreview />} />
              <Route path="/previews/laboratory" element={<LaboratoryPreview />} />
              <Route path="/previews/setup-wizard" element={<SetupWizardPreview />} />
              <Route path="/previews/design-system" element={<DesignSystemPreview />} />
              <Route path="*" element={<Navigate to="/previews/command-center" replace />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

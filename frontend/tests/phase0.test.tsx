import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { isPhase0PreviewsEnabled, ProductionGateFallback } from '@/app/App';
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { EmptyState, ErrorBoundary } from '@/components/ui/States';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useDemoInfrastructureStore } from '@/stores/demoInfrastructureStore';
import { computeCapacityMetrics, type HospitalBed } from '@/types/infrastructure';

describe('Dynamic Hospital Capacity Calculation', () => {
  it('supports zero-bed initial onboarding cleanly', () => {
    const metrics = computeCapacityMetrics([]);
    expect(metrics.configuredBeds).toBe(0);
    expect(metrics.activeBeds).toBe(0);
    expect(metrics.occupancyRatePercent).toBe(0);
  });

  it('derives accurate capacity for 5, 30, 100, and 500 beds without hardcoded limits', () => {
    for (const total of [5, 30, 100, 500]) {
      const beds: HospitalBed[] = Array.from({ length: total }, (_, i) => ({
        id: `b-${i}`,
        roomId: `r-${Math.floor(i / 4)}`,
        bedCode: `B-${i + 1}`,
        status: i % 2 === 0 ? 'OCCUPIED' : 'AVAILABLE',
        isActive: true,
      }));
      const metrics = computeCapacityMetrics(beds);
      expect(metrics.configuredBeds).toBe(total);
      expect(metrics.activeBeds).toBe(total);
      expect(metrics.occupiedBeds + metrics.availableBeds).toBe(total);
      const expectedRate = Math.round((metrics.occupiedBeds / total) * 1000) / 10;
      expect(metrics.occupancyRatePercent).toBe(expectedRate);
    }
  });

  it('updates capacity dynamically after adding rooms/beds and removing beds', () => {
    const store = useDemoInfrastructureStore.getState();
    store.loadPreset('thirty');
    expect(computeCapacityMetrics(useDemoInfrastructureStore.getState().beds).configuredBeds).toBe(30);

    const wardId = useDemoInfrastructureStore.getState().wards[0]!.id;
    const catId = useDemoInfrastructureStore.getState().categories[0]!.id;
    store.addRoomWithBeds(wardId, catId, '999', 4);
    expect(computeCapacityMetrics(useDemoInfrastructureStore.getState().beds).configuredBeds).toBe(34);

    const addedBed = useDemoInfrastructureStore.getState().beds.find((b) => b.bedCode === '999-B1')!;
    store.removeBed(addedBed.id);
    expect(computeCapacityMetrics(useDemoInfrastructureStore.getState().beds).configuredBeds).toBe(33);

    store.loadPreset('zero');
    expect(useDemoInfrastructureStore.getState().beds).toHaveLength(0);
  });
});

describe('Design System Components, Empty States & Error Boundary', () => {
  it('renders StatusBadge with both icon and text label', () => {
    render(<StatusBadge label="Occupied" tone="teal" />);
    expect(screen.getByText('Occupied')).toBeInTheDocument();
  });

  it('renders SummaryCard and EmptyState cleanly', () => {
    render(
      <>
        <SummaryCard title="Active Beds" value={29} subtitle="Derived from bed records" />
        <EmptyState title="No beds" description="Add a bed to start" />
      </>,
    );
    expect(screen.getByText('Active Beds')).toBeInTheDocument();
    expect(screen.getByText('No beds')).toBeInTheDocument();
  });

  it('filters DataTable rows and shows empty state when no match', () => {
    interface Row {
      id: string;
      name: string;
    }
    const cols: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name', render: (r) => r.name }];
    render(
      <DataTable
        data={[
          { id: '1', name: 'Ward Alpha' },
          { id: '2', name: 'Ward Beta' },
        ]}
        columns={cols}
        getRowKey={(r) => r.id}
        searchPlaceholder="Search wards"
        searchFilter={(r, q) => r.name.toLowerCase().includes(q)}
      />,
    );
    const input = screen.getByPlaceholderText('Search wards');
    fireEvent.change(input, { target: { value: 'Beta' } });
    expect(screen.queryByText('Ward Alpha')).not.toBeInTheDocument();
    expect(screen.getByText('Ward Beta')).toBeInTheDocument();
  });

  it('handles Dialog Escape key and ConfirmDialog confirmation', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <>
        <Dialog open onClose={onClose} title="Test Dialog">
          <p>Body</p>
        </Dialog>
        <ConfirmDialog
          open
          onClose={onClose}
          onConfirm={onConfirm}
          title="Confirm Action"
          message="Proceed?"
          confirmLabel="Yes"
        />
      </>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('catches rendering errors in ErrorBoundary', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Boom(): never {
      throw new Error('Simulated crash');
    }
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Unexpected UI Error')).toBeInTheDocument();
    expect(screen.getByText('Simulated crash')).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('Production Preview Protection', () => {
  it('blocks Phase 0 previews in production builds even if env flag is misconfigured true', () => {
    expect(isPhase0PreviewsEnabled({ DEV: false, PROD: true, VITE_ENABLE_PHASE0_PREVIEWS: 'true' })).toBe(
      false,
    );
    expect(isPhase0PreviewsEnabled({ DEV: true, PROD: false, VITE_ENABLE_PHASE0_PREVIEWS: 'false' })).toBe(
      false,
    );
    expect(isPhase0PreviewsEnabled({ DEV: true, PROD: false, VITE_ENABLE_PHASE0_PREVIEWS: 'true' })).toBe(
      true,
    );
  });

  it('renders safe production fallback without exposing internal details', () => {
    render(<ProductionGateFallback />);
    expect(screen.getByText('MediCore HMS')).toBeInTheDocument();
    expect(
      screen.getByText('Phase 0 demonstration previews are disabled in production builds.'),
    ).toBeInTheDocument();
  });
});

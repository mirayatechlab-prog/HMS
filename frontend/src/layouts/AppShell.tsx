import {
  Activity,
  BedDouble,
  Building2,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Palette,
  Pill,
  Search,
  Stethoscope,
  Wand2,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { useDemoInfrastructureStore } from '@/stores/demoInfrastructureStore';

const PREVIEW_NAV = [
  { to: '/previews/command-center', label: 'Command Center', icon: LayoutDashboard },
  { to: '/previews/infrastructure', label: 'Infrastructure', icon: Building2 },
  { to: '/previews/bed-board', label: 'Live Bed Board', icon: BedDouble },
  { to: '/previews/reception', label: 'Reception', icon: ClipboardList },
  { to: '/previews/doctor', label: 'Doctor Workspace', icon: Stethoscope },
  { to: '/previews/pharmacy', label: 'Pharmacy', icon: Pill },
  { to: '/previews/laboratory', label: 'External Lab', icon: FlaskConical },
  { to: '/previews/setup-wizard', label: 'Setup Wizard', icon: Wand2 },
  { to: '/previews/design-system', label: 'Design System', icon: Palette },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hospitalName = useDemoInfrastructureStore((s) => s.hospitalName);

  const navContent = (
    <div className="flex h-full flex-col bg-navy-950 text-slate-100">
      <div className="flex items-center gap-2.5 border-b border-navy-800 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-600 text-white">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-white">MediCore HMS</p>
          <p className="truncate text-[11px] text-teal-100/80">Phase 0 Foundation</p>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Demo Previews (Dev Only)
        </p>
        {PREVIEW_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-navy-800 px-4 py-3 text-[11px] text-slate-400">
        <p>Locale: en-IN • INR (₹)</p>
        <p>Timezone: Asia/Kolkata</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-surface-muted text-navy-950">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{navContent}</aside>

      {/* Mobile/Tablet Drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-navy-950/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 w-64">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-2 top-3 rounded-md p-1.5 text-slate-300 hover:bg-navy-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phase 0 Demo Banner */}
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs font-medium text-amber-900">
          PHASE 0 DEMONSTRATION PREVIEW — Fictional data only. Not a production clinical module.
        </div>

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-surface-border bg-surface px-4 py-2.5 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-md border border-surface-border p-1.5 text-navy-900 hover:bg-surface-subtle lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-950">{hospitalName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global search preview..."
                aria-label="Global search preview"
                className="w-56 rounded-md border border-surface-border bg-surface-muted py-1.5 pl-8 pr-3 text-xs text-navy-950 placeholder:text-slate-400 focus:border-teal-600 focus:bg-surface focus:outline-none"
              />
            </div>
            <StatusBadge label="Demo Environment" tone="warning" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

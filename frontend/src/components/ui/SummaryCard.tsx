import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: 'default' | 'teal' | 'warning' | 'danger';
  className?: string;
}

const ACCENT_BORDER: Record<NonNullable<SummaryCardProps['accent']>, string> = {
  default: 'border-surface-border',
  teal: 'border-l-4 border-l-teal-600 border-surface-border',
  warning: 'border-l-4 border-l-amber-500 border-surface-border',
  danger: 'border-l-4 border-l-rose-500 border-surface-border',
};

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'default',
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-surface p-4 shadow-sm',
        ACCENT_BORDER[accent],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-navy-950">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-slate-600">{subtitle}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-md bg-surface-subtle p-2 text-teal-700" aria-hidden="true">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

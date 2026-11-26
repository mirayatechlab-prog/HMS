import {
  AlertTriangle,
  Ban,
  BedDouble,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SemanticTone = 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'teal';

const TONE_STYLES: Record<SemanticTone, string> = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  teal: 'bg-teal-50 text-teal-800 border-teal-200',
};

const TONE_ICONS: Record<SemanticTone, ReactNode> = {
  success: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  warning: <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  info: <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  danger: <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  neutral: <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  teal: <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
};

interface StatusBadgeProps {
  label: string;
  tone?: SemanticTone;
  icon?: ReactNode;
  className?: string;
}

/**
 * Accessible status indicator. Always pairs semantic color with an icon and text label
 * so clinical and financial statuses are never communicated by color alone.
 */
export function StatusBadge({ label, tone = 'neutral', icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONE_STYLES[tone],
        className,
      )}
    >
      {icon ?? TONE_ICONS[tone]}
      <span>{label}</span>
    </span>
  );
}

export function bedStatusBadgeProps(status: string): { label: string; tone: SemanticTone; icon?: ReactNode } {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Available', tone: 'success' };
    case 'OCCUPIED':
      return { label: 'Occupied', tone: 'teal' };
    case 'RESERVED':
      return { label: 'Reserved', tone: 'info' };
    case 'CLEANING':
      return {
        label: 'Cleaning',
        tone: 'warning',
        icon: <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
      };
    case 'MAINTENANCE':
      return {
        label: 'Maintenance',
        tone: 'danger',
        icon: <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
      };
    case 'BLOCKED':
      return { label: 'Blocked', tone: 'neutral' };
    default:
      return { label: status, tone: 'neutral' };
  }
}

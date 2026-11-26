import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label: string;
  hint?: string;
  error?: string;
}

type TextFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-xs font-semibold text-navy-900">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 text-sm text-navy-950 placeholder:text-slate-400 focus:outline-none',
            error
              ? 'border-rose-500 focus:border-rose-600'
              : 'border-surface-border focus:border-teal-600',
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-err`} className="text-xs font-medium text-rose-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
TextField.displayName = 'TextField';

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly { value: string; label: string }[];
  };

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, hint, error, options, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
      <div className="space-y-1">
        <label htmlFor={selectId} className="block text-xs font-semibold text-navy-900">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 text-sm text-navy-950 focus:outline-none',
            error
              ? 'border-rose-500 focus:border-rose-600'
              : 'border-surface-border focus:border-teal-600',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
        {error ? (
          <p className="text-xs font-medium text-rose-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
SelectField.displayName = 'SelectField';

export function DateTimeField(props: TextFieldProps) {
  return <TextField type="datetime-local" {...props} />;
}

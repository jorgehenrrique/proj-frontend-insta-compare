import type { InputHTMLAttributes, ReactNode } from 'react';

type CheckboxSize = 'sm' | 'md';
type LabelPosition = 'start' | 'end';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
  size?: CheckboxSize;
  labelPosition?: LabelPosition;
  labelClassName?: string;
}

const boxSize: Record<CheckboxSize, string> = {
  sm: 'h-5 w-5 rounded-lg',
  md: 'h-6 w-6 rounded-xl',
};

const iconSize: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
};

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 6.2 5 8.7 9.5 3.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  size = 'sm',
  labelPosition = 'end',
  disabled,
  className = '',
  labelClassName = '',
  id,
  ...inputProps
}: CheckboxProps) {
  const labelContent =
    children !== undefined ? (
      <span className={labelClassName}>{children}</span>
    ) : null;

  return (
    <label
      htmlFor={id}
      className={`group inline-flex cursor-pointer items-center gap-2 select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      {labelPosition === 'start' && labelContent}
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <input
          {...inputProps}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`${boxSize[size]} border border-border bg-surface shadow-sm transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-mid/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface peer-checked:border-transparent peer-checked:bg-linear-to-br peer-checked:from-brand-start peer-checked:via-brand-mid peer-checked:to-brand-end peer-checked:shadow-[0_2px_8px_color-mix(in_srgb,var(--color-brand-mid)_35%,transparent)] peer-disabled:cursor-not-allowed ${
            disabled ? '' : 'group-hover:border-brand-mid/50'
          }`}
        />
        <CheckIcon
          className={`pointer-events-none absolute text-white opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100 scale-75 ${iconSize[size]}`}
        />
      </span>
      {labelPosition === 'end' && labelContent}
    </label>
  );
}

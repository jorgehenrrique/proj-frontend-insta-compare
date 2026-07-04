import type { ReactNode } from 'react';

interface CollapseToggleIconProps {
  open: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const containerSize = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
} as const;

const iconSize = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
} as const;

export function CollapseToggleIcon({ open, size = 'md', className = '' }: CollapseToggleIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted text-ink-muted transition-all duration-150 group-hover:border-brand-mid/45 group-hover:bg-brand-mid/10 group-hover:text-brand-mid group-active:scale-95 ${containerSize[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className={`transition-transform duration-200 ${iconSize[size]} ${open ? 'rotate-180' : ''}`}
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface BackButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function BackButton({ onClick, children, className = '' }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-muted/60 px-3.5 py-2 text-sm font-medium text-ink-muted transition-all duration-150 hover:border-brand-mid/40 hover:bg-brand-mid/10 hover:text-brand-mid active:scale-[0.98] ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
        aria-hidden="true"
      >
        <path
          d="M12.5 15 7.5 10 12.5 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </button>
  );
}

interface PrimaryNavButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function PrimaryNavButton({ onClick, children, className = '' }: PrimaryNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:brightness-110 hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--color-brand-mid)_40%,transparent)] active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

interface ExtrasNavButtonProps {
  onClick: () => void;
  className?: string;
}

export function ExtrasNavButton({ onClick, className = '' }: ExtrasNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-xl border border-brand-mid/35 bg-brand-mid/8 px-3.5 py-2 text-sm font-medium text-brand-mid transition-all duration-150 hover:border-brand-mid/55 hover:bg-brand-mid/14 active:scale-[0.98] ${className}`}
    >
      Conteúdos extras
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path
          d="M7.5 5 12.5 10 7.5 15"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

interface ClearAllButtonProps {
  onClick: () => void;
  className?: string;
}

export function ClearAllButton({ onClick, className = '' }: ClearAllButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition-all duration-150 hover:border-red-400/45 hover:bg-red-500/10 hover:text-red-600 active:scale-[0.98] dark:hover:text-red-400 ${className}`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-110"
        aria-hidden="true"
      >
        <path
          d="M7.5 3.5h5M4.5 5.5h11M6 5.5l.5 9.5h7L14 5.5M8.5 8v4M11.5 8v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Limpar tudo
    </button>
  );
}

export const collapseTriggerClassName =
  'group flex w-full items-center justify-between gap-3 text-left transition-colors duration-150 hover:bg-surface-muted/70 active:bg-surface-muted';

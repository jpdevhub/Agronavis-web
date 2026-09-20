'use client';

import type { ReactNode } from 'react';

const variants = {
  filled: 'bg-accent text-on-accent',
  tonal: 'bg-accent-soft text-accent',
  outlined: 'border border-hairline-strong text-ink',
  text: 'text-accent',
} as const;

export function Button({
  children,
  variant = 'filled',
  type = 'button',
  disabled,
  onClick,
  className = '',
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`md-state inline-flex h-10 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium tracking-[0.00625em] transition-colors disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`md-state inline-flex h-8 items-center rounded-sm border px-3 text-[0.8125rem] font-medium transition-colors ${
        selected
          ? 'border-transparent bg-accent-soft text-accent'
          : 'border-hairline-strong text-ink-muted'
      }`}
    >
      {label}
    </button>
  );
}

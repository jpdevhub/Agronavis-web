'use client';

import type { ReactNode } from 'react';

type Props = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  supporting?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'url';
};

function Supporting({ error, supporting }: { error?: string; supporting?: string }) {
  const text = error ?? supporting;
  if (!text) return null;
  return (
    <p className={`px-4 pt-1.5 text-xs leading-4 ${error ? 'text-error' : 'text-ink-faint'}`}>{text}</p>
  );
}

function Shell({
  name,
  error,
  children,
  supporting,
}: {
  name: string;
  error?: string;
  supporting?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="md-field" data-invalid={error ? 'true' : 'false'}>
        {children}
      </div>
      <Supporting error={error} supporting={supporting} />
      <span id={`${name}-error`} className="sr-only" role="alert">
        {error ?? ''}
      </span>
    </div>
  );
}

export function TextField({ name, label, error, required, supporting, type = 'text', ...rest }: Props) {
  return (
    <Shell name={name} error={error} supporting={supporting}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="md-input peer"
        {...rest}
      />
      <label htmlFor={name} className="md-label">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
    </Shell>
  );
}

export function TextArea({
  name,
  label,
  error,
  required,
  supporting,
  rows = 5,
}: Props & { rows?: number }) {
  return (
    <Shell name={name} error={error} supporting={supporting}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="md-input"
      />
      <label htmlFor={name} className="md-label">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
    </Shell>
  );
}

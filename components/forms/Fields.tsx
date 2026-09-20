'use client';

import type { ReactNode } from 'react';

const INPUT =
  'w-full rounded-md border bg-raised px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:outline-none disabled:opacity-60';

const border = (error?: string) =>
  error ? 'border-red-400/60 focus:border-red-400' : 'border-hairline-strong focus:border-accent-line';

type Base = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

function Wrap({ name, label, required, error, children }: Base & { children: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint"
      >
        {label}
        {!required && <span className="ml-1.5 normal-case tracking-normal opacity-70">optional</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[0.8125rem] text-red-400">{error}</p>}
    </div>
  );
}

export function Field({ type = 'text', autoComplete, ...p }: Base & { type?: string; autoComplete?: string }) {
  return (
    <Wrap {...p}>
      <input
        id={p.name}
        name={p.name}
        type={type}
        required={p.required}
        placeholder={p.placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!p.error}
        className={`${INPUT} ${border(p.error)}`}
      />
    </Wrap>
  );
}

export function TextArea({ rows = 5, ...p }: Base & { rows?: number }) {
  return (
    <Wrap {...p}>
      <textarea
        id={p.name}
        name={p.name}
        rows={rows}
        required={p.required}
        placeholder={p.placeholder}
        aria-invalid={!!p.error}
        className={`${INPUT} ${border(p.error)} resize-y leading-relaxed`}
      />
    </Wrap>
  );
}

export function Select({ options, ...p }: Base & { options: { value: string; label: string }[] }) {
  return (
    <Wrap {...p} required>
      <select
        id={p.name}
        name={p.name}
        aria-invalid={!!p.error}
        className={`${INPUT} ${border(p.error)} appearance-none`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-raised text-ink">
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

/** Hidden from people, filled by bots. The API treats any value as automated. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function SubmitButton({ status, idle, sending }: { status: string; idle: string; sending: string }) {
  return (
    <button
      type="submit"
      disabled={status === 'sending'}
      className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[0.9375rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
    >
      {status === 'sending' ? sending : idle}
    </button>
  );
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/5 px-4 py-3 text-[0.9375rem] text-red-300">
      {children}
    </p>
  );
}

export function SuccessPanel({ title, body }: { title: string; body: string }) {
  return (
    <div role="status" className="rounded-lg border border-accent-line bg-accent-soft p-7">
      <p className="text-lg font-semibold tracking-tight text-ink">{title}</p>
      <p className="mt-2 text-[0.9375rem] font-light leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

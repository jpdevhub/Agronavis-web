'use client';

import { useFormSubmit } from '@/components/forms/useFormSubmit';

export default function NewsletterForm() {
  const { status, error, fieldErrors, handleSubmit } = useFormSubmit('newsletter');

  if (status === 'sent') {
    return (
      <p role="status" className="mt-8 text-[0.9375rem] font-medium text-accent">
        You are on the list. Check your inbox.
      </p>
    );
  }

  const message = fieldErrors.email || error;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-lg">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@yourfarm.com"
          aria-label="Email address"
          aria-invalid={!!message}
          className={`min-w-[240px] flex-1 rounded-full border bg-raised px-5 py-3.5 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:outline-none ${
            message ? 'border-red-400/60' : 'border-hairline-strong focus:border-accent-line'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full bg-accent px-6 py-3.5 text-[0.9375rem] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-70"
        >
          {status === 'sending' ? 'Signing up' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <p role="alert" className="mt-3 text-[0.8125rem] text-red-400">
          {message}
        </p>
      )}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useFormSubmit } from './useFormSubmit';
import { TextField, TextArea } from '@/components/md3/Field';
import { Button, Chip } from '@/components/md3/Button';

const SCOPES = [
  { value: 'account', label: 'Delete my whole account' },
  { value: 'data', label: 'Delete my data, keep the account' },
] as const;

export default function DeletionForm() {
  const { status, error, fieldErrors, handleSubmit } = useFormSubmit('account-deletion');
  const [scope, setScope] = useState<string>(SCOPES[0].value);

  if (status === 'sent') {
    return (
      <div role="status" className="md-elevation-1 rounded-lg border border-accent-line bg-accent-soft p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-on-accent">
          <Check size={22} />
        </div>
        <h2 className="text-xl font-medium tracking-tight text-ink">Request received</h2>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
          A confirmation is on its way to the address you gave. We action deletion within 30 days
          and write to you once it is done. If you do not see the confirmation, check your spam
          folder before assuming it failed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="mb-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
          What should we delete
        </legend>
        <div role="radiogroup" aria-label="What to delete" className="flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <Chip key={s.value} label={s.label} selected={scope === s.value} onSelect={() => setScope(s.value)} />
          ))}
        </div>
        <input type="hidden" name="scope" value={scope} />
      </fieldset>

      <TextField
        name="email"
        label="Email on the account"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        supporting="We reply here, so use the address you signed up with."
        error={fieldErrors.email}
      />

      <TextField name="name" label="Name" autoComplete="name" error={fieldErrors.name} />

      <TextArea
        name="reason"
        label="Anything you want to tell us"
        rows={4}
        supporting="Not required, and it does not affect the request."
        error={fieldErrors.reason}
      />

      {error && (
        <p role="alert" className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-[0.9375rem] text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Request deletion'}
        </Button>
        <p className="text-[0.8125rem] text-ink-faint">No account or login needed.</p>
      </div>
    </form>
  );
}

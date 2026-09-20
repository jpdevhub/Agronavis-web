'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useFormSubmit } from './useFormSubmit';
import { TextField, TextArea } from '@/components/md3/Field';
import FileField from '@/components/md3/FileField';
import { Button, Chip } from '@/components/md3/Button';

const OTHER = 'Something else';

export default function CareersForm({ roles }: { roles: string[] }) {
  const options = [...roles, OTHER];
  const { status, error, fieldErrors, handleSubmit, reset } = useFormSubmit('careers', {
    multipart: true,
  });
  const [role, setRole] = useState<string>(options[0] ?? OTHER);

  if (status === 'sent') {
    return (
      <div role="status" className="md-elevation-1 rounded-lg border border-accent-line bg-accent-soft p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-on-accent">
          <Check size={22} />
        </div>
        <h3 className="text-xl font-medium tracking-tight text-ink">Application received</h3>
        <p className="mt-2 max-w-[46ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
          It is saved and a confirmation is on its way to your inbox. A person reads every one of
          these, so you will hear back either way.
        </p>
        <Button variant="text" onClick={reset} className="mt-5 -ml-6">
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate encType="multipart/form-data" className="flex flex-col gap-6">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="mb-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
          Which area
        </legend>
        <div role="radiogroup" aria-label="Role" className="flex flex-wrap gap-2">
          {options.map((r) => (
            <Chip key={r} label={r} selected={role === r} onSelect={() => setRole(r)} />
          ))}
        </div>
        <input type="hidden" name="role" value={role} />
        {role === OTHER && (
          <div className="mt-4">
            <TextField
              name="role_other"
              label="Which role"
              required
              error={fieldErrors.role_other}
            />
          </div>
        )}
        {fieldErrors.role && <p className="pt-1.5 text-xs text-error">{fieldErrors.role}</p>}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Full name" required autoComplete="name" error={fieldErrors.name} />
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={fieldErrors.email}
        />
      </div>

      <TextField
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        error={fieldErrors.phone}
      />

      <FileField name="resume" label="Attach your CV" error={fieldErrors.resume} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="portfolio_url"
          label="Portfolio"
          type="url"
          inputMode="url"
          supporting="https://"
          error={fieldErrors.portfolio_url}
        />
        <TextField
          name="github_url"
          label="GitHub"
          type="url"
          inputMode="url"
          supporting="https://"
          error={fieldErrors.github_url}
        />
      </div>

      <TextField
        name="linkedin_url"
        label="LinkedIn"
        type="url"
        inputMode="url"
        supporting="https://"
        error={fieldErrors.linkedin_url}
      />

      <TextArea
        name="message"
        label="What would you build or fix first"
        required
        rows={6}
        supporting="Look at the product and be specific. This is the part we actually read."
        error={fieldErrors.message}
      />

      {error && (
        <p role="alert" className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-[0.9375rem] text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Submit application'}
        </Button>
        <p className="text-[0.8125rem] text-ink-faint">We reply to every application.</p>
      </div>
    </form>
  );
}

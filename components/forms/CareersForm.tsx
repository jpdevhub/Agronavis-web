'use client';

import { useFormSubmit } from './useFormSubmit';
import { Field, TextArea, Honeypot, SubmitButton, FormError, SuccessPanel } from './Fields';

export default function CareersForm({ defaultRole = '' }: { defaultRole?: string }) {
  const { status, error, fieldErrors, handleSubmit } = useFormSubmit('careers');

  if (status === 'sent') {
    return (
      <SuccessPanel
        title="Application in."
        body="It lands in the pile we actually read. You will hear back either way."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" required autoComplete="name" error={fieldErrors.name} />
        <Field
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="role"
          label="Role"
          required
          placeholder={defaultRole || 'Which one'}
          error={fieldErrors.role}
        />
        <Field
          name="portfolio"
          label="Portfolio, GitHub or LinkedIn"
          type="url"
          placeholder="https://"
          error={fieldErrors.portfolio}
        />
      </div>
      <TextArea
        name="message"
        label="What would you fix first"
        required
        placeholder="Look at the product and tell us what is wrong with it. That is the whole application."
        error={fieldErrors.message}
      />
      <FormError>{error}</FormError>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton status={status} idle="Send application" sending="Sending" />
        <p className="text-[0.8125rem] text-ink-faint">We read all of them. We reply to all of them.</p>
      </div>
    </form>
  );
}

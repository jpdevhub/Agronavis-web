'use client';

import { useFormSubmit } from './useFormSubmit';
import { Field, TextArea, Honeypot, SubmitButton, FormError, SuccessPanel } from './Fields';

export default function DemoForm() {
  const { status, error, fieldErrors, handleSubmit } = useFormSubmit('demo');

  if (status === 'sent') {
    return (
      <SuccessPanel
        title="Request received."
        body="Our enterprise team will come back with a rollout plan inside 48 hours."
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
          label="Work email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="organisation"
          label="Organisation"
          required
          autoComplete="organization"
          error={fieldErrors.organisation}
        />
        <Field name="role" label="Your role" error={fieldErrors.role} />
      </div>
      <Field
        name="hectares"
        label="Roughly how many hectares"
        placeholder="e.g. 40,000"
        error={fieldErrors.hectares}
      />
      <TextArea
        name="message"
        label="What you want to see"
        rows={4}
        placeholder="Regions, crops, systems you would want this wired into."
        error={fieldErrors.message}
      />
      <FormError>{error}</FormError>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton status={status} idle="Request a demo" sending="Sending" />
        <p className="text-[0.8125rem] text-ink-faint">No sales sequence. One human, one reply.</p>
      </div>
    </form>
  );
}

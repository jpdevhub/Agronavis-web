'use client';

import { useFormSubmit } from './useFormSubmit';
import { Field, TextArea, Select, Honeypot, SubmitButton, FormError, SuccessPanel } from './Fields';

const topics = [
  { value: 'crop', label: 'Crop health' },
  { value: 'soil', label: 'Soil' },
  { value: 'pest', label: 'Pest management' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'account', label: 'Account or billing' },
  { value: 'other', label: 'Something else' },
];

export default function ContactForm() {
  const { status, error, fieldErrors, handleSubmit } = useFormSubmit('contact');

  if (status === 'sent') {
    return (
      <SuccessPanel
        title="Message sent."
        body="A specialist will pick this up, usually within one working day. Check your inbox for the confirmation."
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
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" error={fieldErrors.phone} />
        <Select name="topic" label="Topic" options={topics} error={fieldErrors.topic} />
      </div>
      <TextArea
        name="message"
        label="What is going on"
        required
        placeholder="Describe what you are seeing in the field. Photos and details help."
        error={fieldErrors.message}
      />
      <FormError>{error}</FormError>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton status={status} idle="Send it" sending="Sending" />
        <p className="text-[0.8125rem] text-ink-faint">We reply from contact@agronavis.in.</p>
      </div>
    </form>
  );
}

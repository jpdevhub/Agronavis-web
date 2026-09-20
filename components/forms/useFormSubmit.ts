'use client';

import { useCallback, useState } from 'react';
import { submitForm, type FormEndpoint } from '@/lib/api';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function useFormSubmit(endpoint: FormEndpoint, { multipart = false } = {}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === 'sending') return;

      const form = event.currentTarget;
      const data = new FormData(form);
      const payload = multipart
        ? data
        : Object.fromEntries(Array.from(data.entries()).map(([k, v]) => [k, String(v)]));

      setStatus('sending');
      setError('');
      setFieldErrors({});

      const result = await submitForm(endpoint, payload);

      if (result.ok) {
        setStatus('sent');
        form.reset();
        return;
      }

      setStatus('error');
      setError(result.error);
      setFieldErrors(result.fields ?? {});
    },
    [endpoint, multipart, status],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError('');
    setFieldErrors({});
  }, []);

  return { status, error, fieldErrors, handleSubmit, reset };
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { isValidIdFormat, normaliseId } from '@/lib/certificates';

export default function VerifyForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = normaliseId(value);
    if (!isValidIdFormat(id)) {
      setError('That does not look like a certificate identifier. It reads AGN-2026-XXXXXX.');
      return;
    }
    setError('');
    setBusy(true);
    router.push(`/verify/${id}`);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="md-field" data-invalid={error ? 'true' : 'false'}>
        <input
          id="certificate-id"
          name="certificate-id"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          placeholder=" "
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={error ? 'certificate-id-error' : undefined}
          className="md-input font-mono tracking-wide"
        />
        <label htmlFor="certificate-id" className="md-label">
          Certificate identifier
        </label>
      </div>

      <p id="certificate-id-error" className={`px-4 text-xs leading-4 ${error ? 'text-error' : 'text-ink-faint'}`} role={error ? 'alert' : undefined}>
        {error || 'Printed on the certificate, for example AGN-2026-K7M2X9.'}
      </p>

      <button
        type="submit"
        disabled={busy}
        className="md-state inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-accent px-7 text-sm font-medium text-on-accent disabled:opacity-60"
      >
        {busy ? 'Checking' : 'Verify'}
        {!busy && <ArrowRight size={16} />}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';

/**
 * /verify-certificate — Certificate verification landing page.
 * Allows users to enter a certificate ID and verify it.
 */
export default function VerifyCertificatePage() {
  const router = useRouter();
  const [certId, setCertId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = certId.trim().toUpperCase();
    if (id) {
      router.push(`/verify-certificate/${id}`);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent-soft">
          <ShieldCheck size={32} className="text-accent" />
        </div>
        <h1 className="type-h2">Verify Certificate</h1>
        <p className="mx-auto mt-3 max-w-[40ch] text-sm text-ink-muted">
          Enter the certificate ID printed on your Agronavis internship
          certificate to verify its authenticity.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value.toUpperCase())}
              placeholder="e.g. AGI-2026-A8F3K2"
              className="h-14 w-full rounded-xl border border-hairline bg-surface pl-12 pr-4 text-center text-lg font-semibold tracking-wider outline-none transition-colors focus:border-accent placeholder:text-ink-faint placeholder:tracking-wider placeholder:font-normal"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!certId.trim()}
            className="md-state mt-4 h-12 w-full rounded-full bg-accent text-sm font-semibold text-on-accent transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            Verify Certificate
          </button>
        </form>

        <p className="mt-6 text-xs text-ink-faint">
          The certificate ID is typically in the format AGI-YYYY-XXXXXX
          and is printed at the bottom of the certificate document.
        </p>
      </div>
    </section>
  );
}

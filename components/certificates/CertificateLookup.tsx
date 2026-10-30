'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function CertificateLookup({
  defaultValue,
  cta,
}: {
  defaultValue?: string;
  cta: string;
}) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const raw = (data.get('id') as string | null)?.trim() ?? '';
    if (!raw) return;
    // Navigate to the path-based URL so the statically pre-generated page matches
    router.push(`/verify/${encodeURIComponent(raw)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="md-field min-w-[16rem] flex-1">
        <input
          id="id"
          name="id"
          required
          defaultValue={defaultValue}
          placeholder=" "
          autoComplete="off"
          spellCheck={false}
          className="md-input font-mono tracking-tight"
        />
        <label htmlFor="id" className="md-label">Certificate number</label>
      </div>
      <button
        type="submit"
        className="md-state inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-on-accent"
      >
        {cta} <ArrowRight size={16} />
      </button>
    </form>
  );
}

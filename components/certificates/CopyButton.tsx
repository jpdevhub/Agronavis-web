'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked; the value is on screen to copy by hand */
        }
      }}
      className="md-state inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-ink-faint transition-colors hover:text-ink"
    >
      {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
    </button>
  );
}

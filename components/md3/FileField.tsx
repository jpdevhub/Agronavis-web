'use client';

import { useRef, useState } from 'react';
import { FileText, Paperclip, X } from 'lucide-react';

const MAX_BYTES = 12 * 1024 * 1024;
const ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic';

const readable = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function FileField({
  name,
  label,
  error,
  supporting,
}: {
  name: string;
  label: string;
  error?: string;
  supporting?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [local, setLocal] = useState('');
  const [dragging, setDragging] = useState(false);

  function accept(selected: File | undefined) {
    if (!selected) return;
    if (selected.size > MAX_BYTES) {
      setLocal(`That file is ${readable(selected.size)}. The limit is 12 MB.`);
      setFile(null);
      if (input.current) input.current.value = '';
      return;
    }
    setLocal('');
    setFile(selected);
  }

  function clear() {
    setFile(null);
    setLocal('');
    if (input.current) input.current.value = '';
  }

  const message = local || error;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped && input.current) {
            const dt = new DataTransfer();
            dt.items.add(dropped);
            input.current.files = dt.files;
            accept(dropped);
          }
        }}
        className={`rounded-md border border-dashed p-4 transition-colors ${
          message
            ? 'border-error/60 bg-error/5'
            : dragging
              ? 'border-accent bg-accent-soft'
              : 'border-hairline-strong bg-white/[0.03]'
        }`}
      >
        <input
          ref={input}
          id={name}
          name={name}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0])}
        />

        {file ? (
          <div className="flex items-center gap-3">
            <FileText size={18} className="shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-faint">{readable(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              aria-label="Remove file"
              className="md-state rounded-full p-1.5 text-ink-muted"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="md-state flex w-full items-center gap-3 rounded-sm text-left"
          >
            <Paperclip size={18} className="shrink-0 text-ink-muted" />
            <span className="flex-1">
              <span className="block text-sm font-medium text-ink">{label}</span>
              <span className="block text-xs text-ink-faint">
              PDF, Word, or a photo of it. Up to 12 MB, compressed after upload.
            </span>
            </span>
          </button>
        )}
      </div>
      {(message || supporting) && (
        <p className={`px-1 pt-1.5 text-xs leading-4 ${message ? 'text-error' : 'text-ink-faint'}`}>
          {message || supporting}
        </p>
      )}
    </div>
  );
}

import Link from 'next/link';
import { playUrl } from '@/lib/links';

/** The Play triangle, drawn rather than fetched so it never 404s or flashes. */
function PlayGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d="M3.6 1.8a1.5 1.5 0 0 0-.5 1.1v18.2c0 .45.19.85.5 1.1l.1.08L13.8 12v-.24L3.7 1.73l-.1.07Z" fill="#00D2FF" />
      <path d="M17.2 15.4 13.8 12v-.24l3.4-3.4.08.05 4.02 2.28c1.15.65 1.15 1.72 0 2.38l-4.02 2.28-.08.05Z" fill="#FFCE00" />
      <path d="m17.28 15.35-3.48-3.47L3.6 22.2c.38.4 1 .45 1.71.05l11.97-6.9" fill="#FF3A44" />
      <path d="M17.28 8.41 5.31 1.52C4.6 1.11 3.98 1.16 3.6 1.56l10.2 10.2 3.48-3.35Z" fill="#00E676" />
    </svg>
  );
}

export default function PlayBadge({
  source,
  size = 'default',
  className = '',
}: {
  source: string;
  size?: 'default' | 'small';
  className?: string;
}) {
  const small = size === 'small';
  return (
    <Link
      href={playUrl(source)}
      target="_blank"
      rel="noopener"
      aria-label="Get Agronavis on Google Play"
      className={`group inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-white/25 bg-raised text-ink transition-all duration-200 ease-[var(--ease-emphasized)] hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        small ? 'px-4 py-2.5' : 'px-6 py-3.5'
      } ${className}`}
    >
      <PlayGlyph size={small ? 18 : 22} />
      <span className="text-left leading-none">
        <span className={`block ${small ? 'text-[0.5rem]' : 'text-[0.5625rem]'} font-medium tracking-[0.14em] uppercase text-ink-muted`}>
          Get it on
        </span>
        <span className={`mt-0.5 block font-semibold tracking-tight ${small ? 'text-sm' : 'text-base'}`}>
          Google Play
        </span>
      </span>
    </Link>
  );
}

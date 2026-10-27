/** Lucide dropped brand marks in v1, so these are drawn from the official glyphs. */

export function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M22.1 7.4a2.8 2.8 0 0 0-1.95-1.97C18.4 4.95 12 4.95 12 4.95s-6.4 0-8.15.48A2.8 2.8 0 0 0 1.9 7.4 29.2 29.2 0 0 0 1.42 12a29.2 29.2 0 0 0 .48 4.6 2.8 2.8 0 0 0 1.95 1.95c1.75.48 8.15.48 8.15.48s6.4 0 8.15-.48a2.8 2.8 0 0 0 1.95-1.95A29.2 29.2 0 0 0 22.58 12a29.2 29.2 0 0 0-.48-4.6Z" />
      <path d="m10.1 15.1 5.2-3.1-5.2-3.1v6.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

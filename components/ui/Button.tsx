import Link from 'next/link';
import type { ReactNode } from 'react';

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  outline: 'border border-hairline-strong text-ink hover:border-white/35 hover:bg-white/5',
  quiet: 'text-ink-muted hover:text-ink',
} as const;

export default function Button({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold leading-none whitespace-nowrap transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

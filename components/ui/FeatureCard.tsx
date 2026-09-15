import type { ReactNode } from 'react';

export default function FeatureCard({
  icon,
  title,
  body,
  className = '',
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`h-full rounded-lg border border-hairline bg-surface p-7 transition-colors duration-200 hover:border-hairline-strong ${className}`}>
      {icon && (
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-accent-line bg-accent-soft text-accent">
          {icon}
        </div>
      )}
      <h3 className="mb-2.5 text-base font-semibold tracking-tight text-ink">{title}</h3>
      <p className="text-[0.9rem] font-light leading-[1.75] text-ink-muted">{body}</p>
    </div>
  );
}

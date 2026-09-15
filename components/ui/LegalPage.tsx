import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  summary,
  sections,
  contact,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  summary: string[];
  sections: LegalSection[];
  contact: { line: string; email: string };
}) {
  return (
    <>
      {/* HEADER */}
      <section className="px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-12">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal y={36}>
            <EyebrowLabel>{eyebrow}</EyebrowLabel>
            <h1 className="type-display text-balance">{title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">{intro}</p>
            <p className="mt-6 text-[0.8125rem] tracking-wide text-ink-faint">Last updated {updated}</p>
          </Reveal>
        </div>
      </section>

      {/* SHORT VERSION */}
      <section className="px-6 pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <div className="rounded-lg border border-accent-line bg-accent-soft p-7">
              <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-accent">
                The short version
              </p>
              <ul className="flex flex-col gap-3">
                {summary.map((line) => (
                  <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.8125rem] font-light text-ink-muted">
                The short version is a summary, not a substitute. The sections below are the actual terms.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="border-t border-hairline px-6 py-20">
        <div className="mx-auto w-full max-w-3xl">
          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={0.02 * i}>
              <div className="border-b border-hairline py-9 first:pt-0 last:border-b-0">
                <h2 className="mb-4 flex items-baseline gap-3 text-xl font-semibold tracking-tight text-ink">
                  <span className="text-[0.8125rem] font-semibold text-ink-faint tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mb-4 text-[0.9375rem] font-light leading-[1.85] text-ink-muted last:mb-0">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[0.9375rem] font-light leading-[1.75] text-ink-muted">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-hairline bg-surface px-6 py-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <Reveal>
            <h2 className="type-h2">Questions about this?</h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[0.9375rem] font-light leading-[1.75] text-ink-muted">
              {contact.line}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-6 inline-block text-[0.9375rem] font-semibold text-accent transition-opacity hover:opacity-80"
            >
              {contact.email}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

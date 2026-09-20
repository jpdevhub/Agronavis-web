import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import CareersForm from '@/components/forms/CareersForm';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Apply to work on Agronavis. Internships carry a monthly stipend of ₹1,500 to ₹4,500. One form, and a person reads every application.',
};

const facts = [
  { label: 'Stipend', value: '₹1,500 – ₹4,500', note: 'Per month, set by scope and experience.' },
  { label: 'Mode', value: 'Remote or Bengaluru', note: 'Field roles travel to farms.' },
  { label: 'Reply', value: 'Every applicant', note: 'Including the ones we cannot take.' },
];

export default function CareersPage() {
  return (
    <>
      <section className="border-b border-hairline px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-14">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal y={36}>
            <EyebrowLabel>Careers</EyebrowLabel>
            <h1 className="type-display max-w-[15ch] text-balance">
              Come build the boring parts that matter.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Small team, real users, satellites involved. There is one form, it takes a few minutes,
              and nothing about it is screened by a keyword filter.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 grid gap-8 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-xl font-medium tracking-tight text-ink">{f.value}</dd>
                  <dd className="mt-1 text-[0.875rem] font-light text-ink-muted">{f.note}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section id="apply" className="scroll-mt-nav px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <h2 className="type-h2">Apply</h2>
            <p className="mt-3 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
              Attach a CV if you have one. Links are fine on their own if you do not.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <CareersForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

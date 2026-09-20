import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import CareersForm from '@/components/forms/CareersForm';
import { getOpenings, formatStipend, stipendRange } from '@/lib/openings';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Open roles at Agronavis across engineering, machine learning, geospatial, design, growth and field operations. One form, and a person reads every application.',
};

export const revalidate = 300;

export default async function CareersPage() {
  const openings = await getOpenings();
  const band = stipendRange(openings);

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
              <div>
                <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                  Open roles
                </dt>
                <dd className="mt-2 text-xl font-medium tracking-tight text-ink">{openings.length}</dd>
                <dd className="mt-1 text-[0.875rem] font-light text-ink-muted">Across six teams.</dd>
              </div>
              {band && (
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                    Stipend
                  </dt>
                  <dd className="mt-2 text-xl font-medium tracking-tight text-ink">{band}</dd>
                  <dd className="mt-1 text-[0.875rem] font-light text-ink-muted">
                    Per month, by role and experience.
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                  Reply
                </dt>
                <dd className="mt-2 text-xl font-medium tracking-tight text-ink">Every applicant</dd>
                <dd className="mt-1 text-[0.875rem] font-light text-ink-muted">
                  Including the ones we cannot take.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <h2 className="type-h2">What is open</h2>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-lg border border-hairline">
            {openings.map((o) => {
              const stipend = formatStipend(o);
              return (
                <div
                  key={o.title}
                  className="flex flex-col gap-3 border-b border-hairline bg-surface px-6 py-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] font-medium tracking-tight text-ink">{o.title}</p>
                    {o.summary && (
                      <p className="mt-1 text-[0.9rem] font-light leading-relaxed text-ink-muted">
                        {o.summary}
                      </p>
                    )}
                    <p className="mt-2 text-[0.8125rem] text-ink-faint">
                      {[o.team, o.location, o.commitment].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {stipend && (
                    <p className="shrink-0 text-[0.9375rem] font-medium text-accent sm:text-right">
                      {stipend}
                      <span className="block text-[0.75rem] font-normal text-ink-faint">per month</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-nav border-t border-hairline px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <h2 className="type-h2">Apply</h2>
            <p className="mt-3 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
              Attach a CV if you have one. Links are fine on their own if you do not.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <CareersForm roles={openings.map((o) => o.title)} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

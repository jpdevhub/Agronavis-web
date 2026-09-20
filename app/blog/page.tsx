import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import NewsletterForm from '@/components/blog/NewsletterForm';

export const metadata: Metadata = {
  title: 'Field Notes',
  description:
    'Case studies, field tips and product notes from Agronavis. Nothing published yet; the list goes out when there is something real to say.',
};

const planned = [
  {
    kind: 'Case studies',
    body: 'What changed on a specific farm over a season, with the numbers that farm actually recorded.',
  },
  {
    kind: 'Field tips',
    body: 'How to read what the satellite is telling you, in plain language rather than agronomy jargon.',
  },
  {
    kind: 'Product notes',
    body: 'What we shipped and what we got wrong first. The second half is usually the useful part.',
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="px-6 pt-[calc(var(--spacing-nav)+6rem)] pb-14">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal y={36}>
            <EyebrowLabel>Field Notes</EyebrowLabel>
            <h1 className="type-display max-w-[14ch] text-balance">Stuff we learn in the dirt.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Nothing is published yet. We would rather have an empty page than invent a case study,
              so the first post goes up when a real season has produced a real result.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline px-6 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <h2 className="type-h2">What will be here</h2>
          </Reveal>
          <div className="mt-10 flex flex-col">
            {planned.map((p) => (
              <Reveal key={p.kind}>
                <div className="border-b border-hairline py-6 first:pt-0 last:border-b-0">
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-accent">
                    {p.kind}
                  </p>
                  <p className="mt-2 max-w-[56ch] text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist" className="scroll-mt-nav border-t border-hairline bg-surface px-6 py-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Be there when it opens
            </h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-[0.9375rem] font-light text-ink-muted">
              Agronavis is not open to the public yet. Leave your address and we will write once when
              it is, plus Field Notes when there is something worth reading.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

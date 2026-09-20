import type { Metadata } from 'next';
import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Agronavis exists because the best agricultural technology on earth was unavailable to the people growing the food. Here is what we believe and how we work.',
};

const values = [
  {
    title: 'Accuracy first',
    body: 'We would rather say we are not sure than guess. Confidently wrong is still wrong, and on a farm it costs a season.',
  },
  {
    title: 'Your language, not ours',
    body: 'Advice should not require fluency in English, or in jargon invented at a conference. We answer in the language the question was asked in.',
  },
  {
    title: 'Free stays free',
    body: 'The Civilian plan is free forever. Not a trial, not a funnel, not a countdown. Baseline satellite intelligence should not be a luxury item.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-24">
        <Image src="/images/hero-about.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-canvas/66" />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal y={44}>
            <h1 className="type-display max-w-[16ch] text-balance">
              Built to put a satellite in every farmer&rsquo;s pocket.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[56ch] text-[1.0625rem] font-light leading-[1.8] text-white/65">
              The most capable earth-observation technology ever built was, for a long time, available to
              basically everyone except the people growing the food. That is a strange way to run a planet. We
              fixed our corner of it.
            </p>
            <div className="mt-8 h-[3px] w-10 rounded-sm bg-accent" />
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <EyebrowLabel>Our mission</EyebrowLabel>
            <h2 className="type-h2 max-w-[18ch] text-balance">Orbital technology, ground-level manners.</h2>
            <p className="mt-5 max-w-[44ch] text-base font-light leading-[1.8] text-ink-muted">
              We do not measure ourselves in server uptime or funding rounds. We measure ourselves in harvests
              that did not fail. Every feature on this site exists because a farmer told us about a problem and
              we could not stop thinking about it.
            </p>
          </Reveal>

          <Stagger className="flex flex-col gap-5">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="rounded-lg border border-hairline bg-surface p-7 transition-colors hover:border-hairline-strong">
                  <h3 className="mb-2 text-base font-semibold tracking-tight text-accent">{v.title}</h3>
                  <p className="text-[0.9rem] font-light leading-[1.75] text-ink-muted">{v.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-h2 mx-auto max-w-[18ch] text-balance">We are early. Come be early with us.</h2>
            <p className="mx-auto mt-5 max-w-[42ch] text-base font-light text-ink-muted">
              Five acres, free, today. Bring the other farm later.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/pricing">Start free</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

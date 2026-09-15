import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import StatBlock from '@/components/ui/StatBlock';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Enterprise: every hectare, accounted for',
  description:
    'Verified crop telemetry across 100M+ hectares and 28 states, with full API access and a named account team. Built for institutional decisions.',
};

const stats = [
  { value: '100M+', label: 'Hectares monitored' },
  { value: '28', label: 'States covered' },
  { value: 'Tier 1', label: 'Satellite partners' },
];

const features = [
  {
    title: 'National-scale monitoring',
    body: 'Every agricultural region ingested at once and reported in one place. No regional spreadsheet named FINAL_v7_revised.',
  },
  {
    title: 'Programmatic API access',
    body: 'REST and WebSocket endpoints with sub-minute refresh, plus documentation an actual human wrote. Wire it into whatever you already run.',
  },
  {
    title: 'Verified institutional insight',
    body: 'Every data point cross-validated across sensors before it lands in a policy memo, a subsidy model or a lending decision.',
  },
  {
    title: 'A named account team',
    body: 'One technical account manager who knows your deployment and answers the phone. Not a ticket queue with a friendly avatar.',
  },
];

export default function ForEnterprisePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-24 text-center">
        <Image src="/images/hero-orbital.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-canvas/64" />

        <div className="relative mx-auto w-full max-w-4xl">
          <Reveal y={44}>
            <h1 className="type-display text-balance">Every hectare, accounted for.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              Verified crop telemetry for the people who have to answer for an entire region. Including the
              hectares nobody has physically visited since 2019.
            </p>
            <div className="mt-10 flex justify-center">
              <Button href="/consult" variant="outline">
                Request a demo <ArrowRight size={16} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-hairline px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <Stagger className="grid gap-12 text-center sm:grid-cols-3 sm:gap-8">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <StatBlock value={s.value} label={s.label} accent />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>Command</EyebrowLabel>
            <h2 className="type-h2 max-w-[20ch] text-balance">Serious infrastructure, boring in the good way.</h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {features.map((f) => (
              <StaggerItem key={f.title} className="h-full">
                <FeatureCard title={f.title} body={f.body} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-h2">Ready to deploy at scale?</h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-base font-light text-ink-muted">
              Send us the acreage and we come back with a rollout plan inside 48 hours. Nobody will suggest we
              circle back next quarter.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/consult">Request a demo</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

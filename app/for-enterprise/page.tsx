import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';
import DemoForm from '@/components/forms/DemoForm';

export const metadata: Metadata = {
  title: 'Enterprise: every hectare, accounted for',
  description:
    'Crop telemetry at regional scale, with API access and a named account team. Built for institutional decisions.',
};

const features = [
  {
    title: 'National-scale monitoring',
    body: 'Every region you cover ingested on one schedule and reported in one place. No regional spreadsheet named FINAL_v7_revised.',
  },
  {
    title: 'Programmatic API access',
    body: 'REST and WebSocket endpoints with sub-minute refresh, plus documentation an actual human wrote. Wire it into whatever you already run.',
  },
  {
    title: 'Verified institutional insight',
    body: 'Optical and radar readings are cross-checked against each other before anything lands in a policy memo, a subsidy model or a lending decision.',
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
              Crop telemetry for the people who have to answer for an entire region. Including the hectares
              nobody has physically visited in years.
            </p>
            <div className="mt-10 flex justify-center">
              <Button href="#demo" variant="outline">
                Request a demo <ArrowRight size={16} />
              </Button>
            </div>
          </Reveal>
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

      {/* DEMO FORM */}
      <section id="demo" className="scroll-mt-nav border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <Reveal>
            <EyebrowLabel>Request a demo</EyebrowLabel>
            <h2 className="type-h2 max-w-[18ch] text-balance">Send us the acreage.</h2>
            <p className="mt-5 max-w-[42ch] text-base font-light leading-[1.8] text-ink-muted">
              We come back with a rollout plan inside 48 hours. Nobody will suggest we circle back next
              quarter.
            </p>
            <p className="mt-6 text-[0.9375rem] font-light text-ink-muted">
              Procurement or security review?{' '}
              <a href="mailto:contact@agronavis.in" className="text-accent hover:opacity-80">
                contact@agronavis.in
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <DemoForm />
          </Reveal>
        </div>
      </section>

    </>
  );
}

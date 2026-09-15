import type { Metadata } from 'next';
import Image from 'next/image';
import { Leaf, TriangleAlert, MonitorOff, MessageSquare } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'For farmers: know your field before you put your boots on',
  description:
    'Satellite crop monitoring for small farms, delivered as plain messages in your own language. Free for up to five acres.',
};

const painPoints = [
  {
    icon: <Leaf size={19} />,
    text: 'You farm two to five acres and cannot personally inspect every plant before breakfast.',
  },
  {
    icon: <TriangleAlert size={19} />,
    text: 'You have lost a harvest to something you noticed exactly one week too late.',
  },
  {
    icon: <MonitorOff size={19} />,
    text: 'You are not learning enterprise software just to find out whether the soil is dry.',
  },
  {
    icon: <MessageSquare size={19} />,
    text: 'You would rather get advice as a message, in your own language, like a normal person.',
  },
];

const steps = [
  { num: '01', title: 'Draw your field', body: 'Trace the boundary on a map once. That is the entire setup. It takes about ninety seconds.' },
  { num: '02', title: 'We watch it', body: 'Satellites pass daily and compare today against every day before it. You do nothing here.' },
  { num: '03', title: 'You get a message', body: 'Something looks off, you hear about it. Nothing is wrong, we leave you alone. Revolutionary.' },
];

export default function ForFarmersPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-24">
        <Image
          src="/images/hero-farmer.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-canvas/64" />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal y={44}>
            <h1 className="type-display max-w-[14ch] text-balance">Know your field before you put your boots on.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[48ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              Satellite insight in your language, sent to the phone already in your pocket. Nothing new to buy,
              nothing extra to charge, no training required.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/pricing">Start free</Button>
              <Button href="/features" variant="outline">
                See how it works
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>Sound familiar</EyebrowLabel>
            <h2 className="type-h2 max-w-[18ch] text-balance">Built for people who are already busy.</h2>
            <p className="mt-5 max-w-[52ch] text-base font-light leading-[1.8] text-ink-muted">
              We did not build this for a pitch deck. We built it because of four complaints we heard on repeat.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
            {painPoints.map((point) => (
              <StaggerItem key={point.text} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-lg border border-hairline bg-surface p-7 transition-colors hover:border-hairline-strong">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent-line bg-accent-soft text-accent">
                    {point.icon}
                  </div>
                  <p className="text-[1.0625rem] font-medium leading-snug text-ink">{point.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* HOW IT SHOWS UP */}
      <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>The whole process</EyebrowLabel>
            <h2 className="type-h2 max-w-[20ch] text-balance">Three steps, and two of them are us.</h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <StaggerItem key={step.num}>
                <div className="type-stat text-accent">{step.num}</div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2.5 text-[0.9rem] font-light leading-[1.75] text-ink-muted">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CONSULT CTA */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-h2">Need an actual human?</h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-base font-light text-ink-muted">
              Soil scientists, agronomists and pest specialists. On a call in minutes, not next Thursday between
              two and four.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/consult">Talk to an expert</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageSquare, Zap, Video, Check } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Consult: talk to someone who studied soil for nine years',
  description:
    'Agronomists, soil scientists and pest specialists on a call in minutes, in your own language. Free student experts, or certified specialists from ₹40/min.',
};

const steps = [
  {
    num: '01',
    icon: <MessageSquare size={18} />,
    title: 'Describe the problem',
    body: 'Type it, record a voice note, or send a photo of the one sad leaf. Your words, your language, no form to fill.',
  },
  {
    num: '02',
    icon: <Zap size={18} />,
    title: 'Get matched',
    body: 'Soil, pest or irrigation: you go straight to the right specialist instead of a queue that routes you nowhere.',
  },
  {
    num: '03',
    icon: <Video size={18} />,
    title: 'Talk in minutes',
    body: 'Live video or voice, right in the app. The average wait is shorter than the time it takes to boil water.',
  },
];

const experts = [
  { name: 'Dr. Ananya Rao', specialty: 'Soil scientist', rate: '₹40/min', initials: 'AR' },
  { name: 'Thomas Miller', specialty: 'Pest management', rate: '₹45/min', initials: 'TM' },
  { name: 'Priya Sharma', specialty: 'Irrigation', rate: 'Student expert, free', initials: 'PS' },
];

const tiers = [
  {
    label: 'Student experts',
    price: 'Free',
    desc: 'Trained agriculture students answering the questions that come up every season.',
    features: ['Crop disease identification', 'Soil health questions', 'Advice over WhatsApp', 'Reply within two hours'],
    cta: 'Start free',
    href: '/pricing',
    featured: false,
  },
  {
    label: 'Certified specialists',
    price: 'From ₹40/min',
    desc: 'Certified soil, pest and irrigation experts for the problems that will not wait until tomorrow.',
    features: ['Live video consultation', 'They read your satellite data first', 'Written treatment plan', 'Follow-up included'],
    cta: 'Talk to a specialist',
    href: '/pricing',
    featured: true,
  },
];

export default function ConsultPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-28">
        <Image src="/images/hero-expert.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-canvas/66" />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal y={44}>
            <h1 className="type-display max-w-[15ch] text-balance">Talk to someone who studied soil for nine years.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[48ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              Agronomists, soil scientists and pest specialists. In your language, on a call before your tea goes
              cold.
            </p>
            <div className="mt-10">
              <Button href="#experts">Find an expert</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>How it works</EyebrowLabel>
            <h2 className="type-h2 max-w-[20ch] text-balance">Three steps. No hold music.</h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <StaggerItem key={step.num}>
                <div className="mb-5 flex items-center gap-3 text-accent">
                  <span className="text-2xl font-bold tracking-tighter">{step.num}</span>
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2.5 text-[0.9rem] font-light leading-[1.75] text-ink-muted">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* EXPERTS */}
      <section id="experts" className="scroll-mt-nav border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>The network</EyebrowLabel>
            <h2 className="type-h2 max-w-[22ch] text-balance">Real people. Real credentials. Online right now.</h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => (
              <StaggerItem key={expert.name} className="h-full">
                <div className="h-full rounded-lg border border-hairline bg-surface p-7 text-center transition-colors hover:border-hairline-strong">
                  <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full border-2 border-accent-line bg-accent-soft text-lg font-semibold text-accent">
                    {expert.initials}
                  </div>
                  <div className="mb-3 flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-[0.6875rem] tracking-[0.12em] uppercase text-ink-faint">Available</span>
                  </div>
                  <p className="font-semibold tracking-tight text-ink">{expert.name}</p>
                  <p className="mt-1 text-[0.875rem] font-light text-ink-muted">{expert.specialty}</p>
                  <span
                    className={`mt-4 inline-block rounded-full border border-hairline bg-raised px-3.5 py-1.5 text-[0.8125rem] font-medium ${
                      expert.rate.includes('free') ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {expert.rate}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>What it costs</EyebrowLabel>
            <h2 className="type-h2 max-w-[22ch] text-balance">Free if you can wait. Cheap if you cannot.</h2>
          </Reveal>

          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {tiers.map((tier) => (
              <StaggerItem key={tier.label} className="h-full">
                <div
                  className={`flex h-full flex-col gap-4 rounded-lg border bg-canvas p-7 ${
                    tier.featured ? 'border-accent-line' : 'border-hairline'
                  }`}
                >
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                    {tier.label}
                  </p>
                  <div className="text-2xl font-semibold tracking-tight text-ink">{tier.price}</div>
                  <p className="text-[0.9rem] font-light leading-[1.7] text-ink-muted">{tier.desc}</p>
                  <ul className="flex flex-1 flex-col gap-2.5 pt-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[0.9rem] font-light text-ink-muted">
                        <Check size={15} className="mt-1 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button href={tier.href} variant={tier.featured ? 'primary' : 'outline'} className="mt-2 w-full">
                    {tier.cta}
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

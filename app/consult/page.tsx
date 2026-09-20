import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageSquare, Zap, Video } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Talk to an expert',
  description:
    'The Agronavis expert network opens soon. Until it does, send your question here and a person answers it.',
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
    title: 'Talk it through',
    body: 'Live video or voice, right in the app, once you and the specialist agree a time.',
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
            <h1 className="type-display max-w-[15ch] text-balance">
              Talk to someone who studied soil for nine years.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              We are building a network of agronomists, soil scientists and pest specialists who
              answer in the language you ask in. It is not open yet.
            </p>
            <p className="mt-4 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              In the meantime, ask us directly. A person reads it and replies.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#ask">Ask a question</Button>
              <Button href="/blog#waitlist" variant="outline">
                Tell me when it opens
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WILL WORK */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>How it will work</EyebrowLabel>
            <h2 className="type-h2 max-w-[20ch] text-balance">Three steps. No hold music.</h2>
            <p className="mt-5 max-w-[50ch] text-base font-light leading-[1.8] text-ink-muted">
              This is what the network looks like when it opens. Nothing below is live yet, so we are
              describing a plan rather than a product.
            </p>
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

      {/* ASK NOW */}
      <section id="ask" className="scroll-mt-nav border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <Reveal>
            <EyebrowLabel>Ask a question</EyebrowLabel>
            <h2 className="type-h2 max-w-[16ch] text-balance">Tell us what your field is doing.</h2>
            <p className="mt-5 max-w-[42ch] text-base font-light leading-[1.8] text-ink-muted">
              This part works today. Describe the problem in your own words and we will come back to
              you, usually within a working day.
            </p>
            <p className="mt-6 text-[0.9375rem] font-light text-ink-muted">
              Would rather write an email?{' '}
              <a href="mailto:contact@agronavis.in" className="text-accent hover:opacity-80">
                contact@agronavis.in
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

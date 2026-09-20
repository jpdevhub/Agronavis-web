import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Platform: every feature has one job',
  description:
    'What Agronavis reads from orbit, how it reaches you, and what it can and cannot tell you. Explained without the jargon.',
};

const capabilities = [
  { label: 'Optical imagery', value: 'Sentinel-2 multispectral' },
  { label: 'Radar imagery', value: 'Sentinel-1 SAR' },
  { label: 'Derived layers', value: 'Vegetation and moisture indices' },
  { label: 'Context', value: 'Weather and terrain' },
];

export default function FeaturesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-28">
        <Image
          src="/images/hero-orbital.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-canvas/62" />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal y={44}>
            <h1 className="type-display max-w-[15ch] text-balance">
              Every feature. One job. <span className="text-accent">Your yield.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              No dashboards that need a tutorial. No metrics invented to look impressive on a slide. Just the
              satellite data that changes what you do on Monday.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ORBITAL PRECISION */}
      <section className="relative overflow-hidden border-t border-hairline px-6 py-24 md:py-32">
        <Image
          src="/images/hero-orbital.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-[center_60%] opacity-20"
        />
        <div className="absolute inset-0 bg-canvas/78" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <EyebrowLabel>Satellite mapping</EyebrowLabel>
            <h2 className="type-h2">The whole field, from very far away</h2>
            <p className="mt-5 max-w-[44ch] text-base font-light leading-[1.8] text-ink-muted">
              Public Earth observation programmes photograph your land on a fixed schedule whether you ask them
              to or not. We read those passes, compare them against every earlier one, and tell you what changed.
              Which means &ldquo;I&rsquo;ll walk it this weekend&rdquo; stops being your monitoring strategy.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="overflow-hidden rounded-lg border border-hairline">
              {capabilities.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between gap-4 px-6 py-4 ${
                    i % 2 === 0 ? 'bg-white/[0.025]' : 'bg-white/[0.012]'
                  }`}
                >
                  <span className="text-[0.8125rem] text-ink-faint">{row.label}</span>
                  <span className="text-right text-[0.875rem] font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.8125rem] font-light text-ink-faint">
              Radar sees through cloud, which is why it sits alongside the optical imagery. Neither one can see
              your neighbour&rsquo;s business.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SEE THE THIRST */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <Image
          src="/images/hero-farmland.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-canvas/78" />

        <div className="relative mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>Hydration intelligence</EyebrowLabel>
            <h2 className="type-h2 max-w-[12ch]">See the thirst</h2>
            <p className="mt-5 max-w-[44ch] text-base font-light leading-[1.8] text-ink-muted">
              Moisture stress shows up in the data before it shows up in the crop. We flag the patch while you
              can still do something about it, instead of after it becomes a story you tell at the co-op.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-32 text-center md:py-40">
        <Image
          src="/images/hero-farmer.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-canvas/68" />

        <div className="relative mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-display mx-auto max-w-[14ch] text-balance">See it on your own field.</h2>
            <div className="mt-10 flex justify-center">
              <Button href="/pricing">
                Start free <ArrowRight size={16} />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

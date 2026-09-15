import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import StatBlock from '@/components/ui/StatBlock';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Platform: every feature has one job',
  description:
    'Daily satellite passes, ±2cm accuracy, moisture stress detection and irrigation advice. The whole Agronavis platform, explained without the jargon.',
};

const specs = [
  { label: 'Revisit frequency', value: 'Daily' },
  { label: 'Resolution', value: '0.5m GSD' },
  { label: 'Spectral bands', value: 'RGB + NIR + SWIR' },
  { label: 'Positional accuracy', value: '±2cm CE90' },
  { label: 'Cloud penetration', value: 'SAR-enabled' },
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
            <h2 className="type-h2">Precision, from very far away</h2>
            <p className="mt-5 max-w-[44ch] text-base font-light leading-[1.8] text-ink-muted">
              Thousands of acres measured down to a couple of centimetres, refreshed every single day. Which means
              &ldquo;I&rsquo;ll walk it this weekend&rdquo; stops being your monitoring strategy.
            </p>
            <div className="mt-10">
              <StatBlock value="±2cm" label="Positional accuracy" accent />
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="overflow-hidden rounded-lg border border-hairline">
              {specs.map((row, i) => (
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
              Yes, it sees through clouds. No, it cannot see your neighbour&rsquo;s business.
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
              Moisture stress turns up in thermal data weeks before it turns up in your crop. We flag the exact
              patch while you can still fix it, instead of after it becomes a story you tell at the co-op.
            </p>
            <div className="mt-10">
              <StatBlock value="30%" label="Water saved" accent />
            </div>
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

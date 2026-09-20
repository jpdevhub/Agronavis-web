import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Satellite, Droplets, Sprout, ArrowRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import FeatureCard from '@/components/ui/FeatureCard';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Agronavis: satellite intel for people who actually farm',
  description:
    'Your field has been talking. We turned on subtitles. Satellite crop monitoring explained in plain language, free to start.',
};

const capabilities = [
  {
    icon: <Satellite size={19} />,
    title: 'Satellite crop mapping',
    body: 'Optical and radar passes map every acre on a fixed schedule, clouds or no clouds. Your field gets a checkup even when the weather refuses to cooperate.',
  },
  {
    icon: <Droplets size={19} />,
    title: 'Moisture stress detection',
    body: 'Thermal sensors catch thirst weeks before anything looks wilted. Think of it as a group chat where your crops complain early, for once.',
  },
  {
    icon: <Sprout size={19} />,
    title: 'Irrigation that makes sense',
    body: 'We tell you which zone needs water, how much, and when. No more soaking forty acres because one sad patch near the road caught your eye.',
  },
];

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-24 text-center">
        <Image
          src="/images/hero-farmland.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-canvas/62" />

        <div className="relative mx-auto max-w-5xl">
          <Reveal y={44}>
            <h1 className="type-display text-balance">
              Your field has been talking.
              <br />
              We turned on subtitles.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-[52ch] text-[1.0625rem] font-light leading-[1.75] text-white/70">
              Satellite intelligence for your farm, in words a human uses. No agronomy degree, no forty-tab
              dashboard, no vibes-based irrigation.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href="/blog#waitlist">Join the waitlist</Button>
              <Button href="/features" variant="outline">
                See how it works
              </Button>
            </div>
            <p className="mt-6 text-[0.8125rem] text-white/45">
              Launching soon. No card, no demo call, no one named Chad emailing you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-hairline">
              <Image
                src="/images/hero-about.jpg"
                alt="Farmland seen from above"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <EyebrowLabel>The platform</EyebrowLabel>
            <h2 className="type-h2 text-balance">Walking every acre is cardio. It is not a monitoring system.</h2>
            <p className="mt-5 max-w-[46ch] text-base font-light leading-[1.8] text-ink-muted">
              Boots on the ground show you one row at a time, usually a week after it mattered. We read the whole
              field from orbit in multiple spectral bands, then translate it into something useful, like{' '}
              <span className="text-ink">the northeast corner is thirsty and you have about four days</span>.
            </p>
            <Link
              href="/features"
              className="mt-8 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent transition-opacity hover:opacity-80"
            >
              See the whole platform <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>What it actually does</EyebrowLabel>
            <h2 className="type-h2 max-w-[18ch] text-balance">Three jobs. Done properly.</h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.title} className="h-full">
                <FeatureCard icon={cap.icon} title={cap.title} body={cap.body} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-h2 mx-auto max-w-[20ch] text-balance">Go touch grass. We will watch the rest.</h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-base font-light text-ink-muted">
              The free plan will cover five acres forever. Not a trial, not a hook. We will tell you
              the day it opens.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/blog#waitlist">Join the waitlist</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

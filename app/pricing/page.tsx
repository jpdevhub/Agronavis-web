import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import FaqAccordion from '@/components/ui/FaqAccordion';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Pricing without asterisks',
  description:
    'Free forever for five acres, ₹999 a month for fifty, custom at scale. The plans Agronavis opens with, in twenty seconds.',
};

const tiers = [
  {
    name: 'Civilian',
    price: 'Free',
    suffix: 'forever',
    desc: 'For anyone with a field and a phone.',
    features: ['Up to 5 acres', 'Weekly satellite scans', 'WhatsApp alerts', 'Free student expert access'],
    cta: 'Join the waitlist',
    href: '/for-farmers',
    variant: 'outline' as const,
    featured: false,
  },
  {
    name: 'Grower',
    price: '₹999',
    suffix: '/month',
    desc: 'For people whose harvest pays the bills.',
    features: [
      'Up to 50 acres',
      'Daily satellite scans',
      'Moisture and pest alerts',
      'Priority expert booking',
      'End-of-season report',
    ],
    cta: 'Join the waitlist',
    href: '/consult',
    variant: 'primary' as const,
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    suffix: '',
    desc: 'For states, co-ops and anyone counting hectares in millions.',
    features: ['Unlimited acreage', 'Full API access', 'Multi-sensor verification', 'Named account team'],
    cta: 'Talk to us',
    href: '/for-enterprise',
    variant: 'outline' as const,
    featured: false,
  },
];

const comparison: { feature: string; civilian: string | boolean; grower: string | boolean; enterprise: string | boolean }[] = [
  { feature: 'Coverage', civilian: '5 acres', grower: '50 acres', enterprise: 'Unlimited' },
  { feature: 'Scan frequency', civilian: 'Weekly', grower: 'Daily', enterprise: 'Daily' },
  { feature: 'Alerts', civilian: 'Basic', grower: 'Full', enterprise: 'Full' },
  { feature: 'Expert access', civilian: 'Students', grower: 'Priority', enterprise: 'Dedicated' },
  { feature: 'API access', civilian: false, grower: false, enterprise: true },
  { feature: 'Account team', civilian: false, grower: false, enterprise: true },
];

const faqs = [
  {
    q: 'Is the free plan actually free?',
    a: 'Yes, and forever. No card, no countdown timer quietly running in the background. Nothing is charged today because nothing is open for signup yet.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Any time, from your account. Everything you have collected so far comes with you, seasons included.',
  },
  {
    q: 'Is there a contract on Grower?',
    a: 'Monthly. Cancel in two taps from the app. Nobody from retention will call to ask how you are feeling.',
  },
  {
    q: 'What counts as an acre?',
    a: 'Whatever you draw on the map. Overlapping shapes count once, because we are not monsters about it.',
  },
  {
    q: 'Will you sell my field data?',
    a: 'No. It is your field and your data. We make money from subscriptions, which is a refreshingly boring business model.',
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check size={16} className="mx-auto text-accent" />
    ) : (
      <X size={16} className="mx-auto text-ink-faint" />
    );
  }
  return <>{value}</>;
}

export default function PricingPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 pt-[calc(var(--spacing-nav)+6rem)] pb-16 text-center">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal y={40}>
            <h1 className="type-display text-balance">Pricing with no asterisks.</h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-[46ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Read the whole thing in twenty seconds. There is no page two and nothing in grey
              six-point type. Nothing is charged yet either: these are the plans for launch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TIERS */}
      <section className="px-6 pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <Stagger className="grid gap-5 lg:grid-cols-3">
            {tiers.map((tier) => (
              <StaggerItem key={tier.name} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-lg border bg-surface p-7 ${
                    tier.featured ? 'border-accent-line' : 'border-hairline'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute top-6 right-6 rounded-full border border-accent-line bg-accent-soft px-3 py-1 text-[0.625rem] font-bold tracking-[0.1em] uppercase text-accent">
                      Planned default
                    </span>
                  )}
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
                    {tier.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-tighter text-ink">
                      {tier.price}
                    </span>
                    {tier.suffix && <span className="text-sm text-ink-faint">{tier.suffix}</span>}
                  </div>
                  <p className="mt-3 text-[0.9rem] font-light leading-[1.7] text-ink-muted">{tier.desc}</p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[0.9rem] font-light text-ink-muted">
                        <Check size={15} className="mt-1 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button href={tier.href} variant={tier.variant} className="mt-7 w-full">
                    {tier.cta}
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <EyebrowLabel className="text-center">Side by side</EyebrowLabel>
            <h2 className="type-h2 text-center">Still deciding?</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto">
              <div className="min-w-[560px] overflow-hidden rounded-lg border border-hairline">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-surface px-6 py-4 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-ink-faint">
                  <span>Feature</span>
                  <span className="text-center">Civilian</span>
                  <span className="text-center">Grower</span>
                  <span className="text-center">Enterprise</span>
                </div>
                {comparison.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 text-[0.9375rem] ${
                      i < comparison.length - 1 ? 'border-b border-hairline' : ''
                    } ${i % 2 === 1 ? 'bg-white/[0.015]' : ''}`}
                  >
                    <span className="text-ink-muted">{row.feature}</span>
                    <span className="text-center text-ink-muted">
                      <Cell value={row.civilian} />
                    </span>
                    <span className="text-center font-medium text-ink">
                      <Cell value={row.grower} />
                    </span>
                    <span className="text-center text-ink-muted">
                      <Cell value={row.enterprise} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <h2 className="type-h2 text-center">Questions people actually ask</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <FaqAccordion faqs={faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <h2 className="type-h2 mx-auto max-w-[20ch] text-balance">The free one will always be free.</h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-base font-light text-ink-muted">
              Join the waitlist and we will tell you the day plans open.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/for-farmers">Join the waitlist</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import DeletionForm from '@/components/forms/DeletionForm';

export const metadata: Metadata = {
  title: 'Delete your account',
  description:
    'Request deletion of your Agronavis account and data. Works without the app installed, and no login is required.',
};

const removed = [
  'Your profile, including name, email, phone number and photograph',
  'Your farms and fields, their boundaries and calculated areas',
  'Scans and the photographs attached to them',
  'Tasks, advisories and community posts',
  'Your notification token, so alerts stop',
];

const kept = [
  {
    what: 'Billing records',
    why: 'Indian tax law requires these to be held for seven years. They are not used for anything else.',
  },
  {
    what: 'District soil records, mandi prices and similar public data',
    why: 'Not personal to you, and shared across everyone using the app.',
  },
  {
    what: 'Encrypted backups',
    why: 'Overwritten on their normal cycle, so anything already deleted is gone from these within 90 days.',
  },
];

export default function DeleteAccountPage() {
  return (
    <>
      <section className="border-b border-hairline px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-14">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal y={36}>
            <EyebrowLabel>Account deletion</EyebrowLabel>
            <h1 className="type-display max-w-[14ch] text-balance">Delete your account.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              You can do this from inside the app under Profile, then Security, where it happens
              immediately. Use the form below if you have already uninstalled the app, cannot sign
              in, or would simply rather we did it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <h2 className="type-h2">What gets deleted</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {removed.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[54ch] text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
              Deletion is permanent and cannot be undone. Conversations with Sahayak never reach us
              in the first place, because that model runs on your own phone.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="type-h2 mt-16">What we keep, and why</h2>
            <dl className="mt-6 flex flex-col">
              {kept.map((k) => (
                <div key={k.what} className="border-b border-hairline py-5 last:border-b-0">
                  <dt className="text-[0.9375rem] font-medium text-ink">{k.what}</dt>
                  <dd className="mt-1 max-w-[54ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    {k.why}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 className="type-h2 mt-16">How long it takes</h2>
            <p className="mt-4 max-w-[54ch] text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
              In the app, immediately. Through this form, we confirm the request belongs to the
              account holder and then action it within 30 days, usually sooner. We write to you
              when it is done. Encrypted backups catch up within 90 days.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="request" className="scroll-mt-nav border-t border-hairline bg-surface px-6 py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <h2 className="type-h2">Request deletion</h2>
            <p className="mt-3 max-w-[50ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
              Use the email address on the account so we can match the request to it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10">
              <DeletionForm />
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 text-[0.875rem] font-light leading-relaxed text-ink-faint">
              Prefer email? Write to{' '}
              <a href="mailto:contact@agronavis.in" className="text-accent hover:opacity-80">
                contact@agronavis.in
              </a>{' '}
              from the address on the account. See the{' '}
              <Link href="/privacy" className="text-accent hover:opacity-80">
                privacy policy
              </Link>{' '}
              for what we hold and how long.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

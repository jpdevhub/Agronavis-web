import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import VerifyForm from '@/components/certificates/VerifyForm';

export const metadata: Metadata = {
  title: 'Verify a certificate',
  description:
    'Check that an Agronavis internship or completion certificate is genuine. Enter the identifier printed on it.',
};

export default function VerifyPage() {
  return (
    <>
      <section className="border-b border-hairline px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-14">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal y={36}>
            <EyebrowLabel>Verification</EyebrowLabel>
            <h1 className="type-display max-w-[16ch] text-balance">Check a certificate is real.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[54ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Every certificate Agronavis issues carries an identifier. Enter it below, or scan the
              code on the document, and you will see the record exactly as it was issued.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-xl">
          <Reveal>
            <VerifyForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-lg border border-hairline bg-surface p-7">
              <div className="mb-3 flex items-center gap-2.5 text-accent">
                <ShieldCheck size={18} />
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase">
                  What verification proves
                </p>
              </div>
              <p className="text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
                A match means Agronavis issued that certificate to that person for that programme,
                on the date shown. The register is held in our published source code, so a record
                cannot be altered after the fact without leaving a trace.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

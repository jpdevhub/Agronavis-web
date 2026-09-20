import type { Metadata } from 'next';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';

export const metadata: Metadata = {
  title: 'Satellite status',
  description:
    'What Agronavis runs, and where to hear about it when something breaks. Incidents are published whether or not they make us look good.',
};

const components = [
  { name: 'Satellite ingest', detail: 'Optical and radar passes' },
  { name: 'Analysis pipeline', detail: 'Vegetation and moisture indices' },
  { name: 'Alerts and messaging', detail: 'WhatsApp, SMS and push delivery' },
  { name: 'Mobile app', detail: 'Android and iOS clients' },
  { name: 'Website and forms', detail: 'agronavis.in and the public API' },
];

export default function StatusPage() {
  return (
    <>
      <section className="px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-12">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal y={36}>
            <EyebrowLabel>Status</EyebrowLabel>
            <h1 className="type-display text-balance">Satellite status</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Automated status reporting is not live yet. Rather than publish numbers we cannot stand
              behind, this page lists what we run and how to reach us when something is wrong.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-hairline px-6 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <h2 className="type-h2">What we run</h2>
          </Reveal>
          <Stagger className="mt-8 overflow-hidden rounded-lg border border-hairline">
            {components.map((c) => (
              <StaggerItem key={c.name}>
                <div className="flex items-center justify-between gap-4 border-b border-hairline bg-surface px-6 py-5 last:border-b-0">
                  <div>
                    <p className="font-medium tracking-tight text-ink">{c.name}</p>
                    <p className="mt-1 text-[0.875rem] font-light text-ink-muted">{c.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface px-6 py-16">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <h2 className="type-h2">Reporting a problem</h2>
            <p className="mt-4 max-w-[52ch] text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
              If something is not working, tell us and we will tell you what we find. When this page
              starts publishing live figures, they will be measured rather than estimated, and
              incidents will be written up whether or not they make us look good.
            </p>
            <p className="mt-6 text-[0.9375rem] font-light text-ink-muted">
              <a href="mailto:contact@agronavis.in" className="text-accent hover:opacity-80">
                contact@agronavis.in
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

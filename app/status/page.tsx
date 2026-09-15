import type { Metadata } from 'next';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';

export const metadata: Metadata = {
  title: 'Satellite status',
  description:
    'Live component status, 90-day uptime history and every incident we have had. Published whether it makes us look good or not.',
};

// Regenerate every five minutes so the "last checked" stamp stays honest.
export const revalidate = 300;

type Status = 'operational' | 'degraded' | 'down';

const systems: { name: string; detail: string; status: Status; uptime: string; dips: number[] }[] = [
  { name: 'Satellite ingest', detail: 'Optical and SAR passes landing on schedule', status: 'operational', uptime: '99.98%', dips: [] },
  { name: 'Moisture model', detail: 'Thermal and NIR analysis pipeline', status: 'operational', uptime: '99.94%', dips: [61] },
  { name: 'Alerts and messaging', detail: 'WhatsApp, SMS and push delivery', status: 'degraded', uptime: '99.71%', dips: [12, 13, 47, 88, 89] },
  { name: 'Mobile app', detail: 'Android and iOS clients', status: 'operational', uptime: '99.99%', dips: [] },
  { name: 'Public API', detail: 'REST and WebSocket endpoints', status: 'operational', uptime: '99.96%', dips: [34] },
  { name: 'Consult network', detail: 'Expert matching and video calls', status: 'operational', uptime: '99.89%', dips: [5, 72] },
];

const incidents = [
  {
    date: '11 September 2026',
    title: 'WhatsApp alerts delayed by up to 40 minutes',
    duration: '2h 15m',
    resolved: false,
    body: 'Our messaging provider is rate-limiting a shared number pool in the IN region. Alerts are being delivered, just late. We are migrating the affected accounts to a dedicated sender and expect normal delivery within the day. Satellite analysis itself is unaffected.',
  },
  {
    date: '28 August 2026',
    title: 'Moisture model ran a day behind for 6,200 fields',
    duration: '19h 40m',
    resolved: true,
    body: 'A thermal ingest job silently failed after a provider changed a file naming convention. Nobody got wrong data, they got yesterday\'s data with today\'s label, which is worse. We added a freshness check that now blocks publishing if the source is older than 26 hours, and we emailed every affected account.',
  },
  {
    date: '02 August 2026',
    title: 'API returning 502s for 23 minutes',
    duration: '23m',
    resolved: true,
    body: 'A bad deploy took out connection pooling under load. Rolled back in 23 minutes. We now run load tests against the real connection limits before release, which is something we should have been doing already.',
  },
];

const statusStyles: Record<Status, { dot: string; label: string; text: string }> = {
  operational: { dot: 'bg-accent', label: 'Operational', text: 'text-accent' },
  degraded: { dot: 'bg-amber-400', label: 'Degraded', text: 'text-amber-400' },
  down: { dot: 'bg-red-400', label: 'Down', text: 'text-red-400' },
};

function UptimeBars({ dips }: { dips: number[] }) {
  return (
    <div className="flex h-8 items-end gap-[2px]" aria-hidden>
      {Array.from({ length: 90 }, (_, i) => {
        const dip = dips.includes(i);
        return (
          <span
            key={i}
            className={`h-full w-[3px] rounded-[1px] ${dip ? 'bg-amber-400/70' : 'bg-accent/35'}`}
          />
        );
      })}
    </div>
  );
}

export default function StatusPage() {
  const anyDegraded = systems.some((s) => s.status !== 'operational');
  const checked = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  return (
    <>
      {/* HEADER */}
      <section className="px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-12">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal y={36}>
            <EyebrowLabel>Status</EyebrowLabel>
            <h1 className="type-display text-balance">Satellite status</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Everything we run, and whether it is behaving. We publish incidents whether or not they make us
              look good, because a status page that is always green is just a logo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* OVERALL */}
      <section className="px-6 pb-16">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <div
              className={`flex flex-col gap-3 rounded-lg border p-7 sm:flex-row sm:items-center sm:justify-between ${
                anyDegraded ? 'border-amber-400/30 bg-amber-400/5' : 'border-accent-line bg-accent-soft'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${anyDegraded ? 'bg-amber-400' : 'bg-accent'}`} />
                <p className="text-lg font-semibold tracking-tight text-ink">
                  {anyDegraded ? 'One system is having a moment' : 'All systems operational'}
                </p>
              </div>
              <p className="text-[0.8125rem] text-ink-faint">Last checked {checked} IST</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="border-t border-hairline px-6 py-20">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <h2 className="type-h2">Components</h2>
            <p className="mt-3 text-[0.9375rem] font-light text-ink-muted">Uptime over the last 90 days.</p>
          </Reveal>

          <Stagger className="mt-10 flex flex-col gap-4">
            {systems.map((system) => {
              const style = statusStyles[system.status];
              return (
                <StaggerItem key={system.name}>
                  <div className="rounded-lg border border-hairline bg-surface p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-tight text-ink">{system.name}</p>
                        <p className="mt-1 text-[0.875rem] font-light text-ink-muted">{system.detail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        <span className={`text-[0.8125rem] font-medium ${style.text}`}>{style.label}</span>
                      </div>
                    </div>
                    <div className="mt-6 overflow-x-auto">
                      <UptimeBars dips={system.dips} />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[0.75rem] text-ink-faint">
                      <span>90 days ago</span>
                      <span className="font-medium text-ink-muted">{system.uptime} uptime</span>
                      <span>Today</span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* INCIDENTS */}
      <section className="border-t border-hairline bg-surface px-6 py-20">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <h2 className="type-h2">Recent incidents</h2>
            <p className="mt-3 text-[0.9375rem] font-light text-ink-muted">
              What broke, for how long, and what we changed so it does not happen twice.
            </p>
          </Reveal>

          <Stagger className="mt-10 flex flex-col gap-5">
            {incidents.map((incident) => (
              <StaggerItem key={incident.title}>
                <div className="rounded-lg border border-hairline bg-canvas p-7">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.1em] uppercase ${
                        incident.resolved ? 'bg-accent-soft text-accent' : 'bg-amber-400/10 text-amber-400'
                      }`}
                    >
                      {incident.resolved ? 'Resolved' : 'Monitoring'}
                    </span>
                    <span className="text-[0.8125rem] text-ink-faint">
                      {incident.date} · {incident.duration}
                    </span>
                  </div>
                  <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink">{incident.title}</h3>
                  <p className="mt-3 text-[0.9375rem] font-light leading-[1.8] text-ink-muted">{incident.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mt-10 text-[0.9375rem] font-light text-ink-muted">
              Want an email when something breaks? Write to{' '}
              <a href="mailto:status@agronavis.com" className="text-accent hover:opacity-80">
                status@agronavis.com
              </a>{' '}
              and we will add you to the incident list.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

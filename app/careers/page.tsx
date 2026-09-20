import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import Button from '@/components/ui/Button';
import CareersForm from '@/components/forms/CareersForm';

export const metadata: Metadata = {
  title: 'Careers: come build the boring parts that matter',
  description:
    'Open roles at Agronavis. Small team, real users, satellites involved. Remote-friendly across India, with field visits that are actually in fields.',
};

const roles = [
  { title: 'Senior Frontend Engineer', team: 'Product', location: 'Bengaluru or remote', type: 'Full-time' },
  { title: 'Geospatial Data Scientist', team: 'Intelligence', location: 'Bengaluru', type: 'Full-time' },
  { title: 'Backend Engineer, Ingest', team: 'Platform', location: 'Remote (IST ±3)', type: 'Full-time' },
  { title: 'Agronomist, Consult Network', team: 'Field', location: 'Pune or Nashik', type: 'Full-time' },
  { title: 'Regional Community Lead', team: 'Growth', location: 'Jaipur', type: 'Contract' },
  { title: 'Design Engineer', team: 'Product', location: 'Remote (IST ±3)', type: 'Full-time' },
];

const perks = [
  {
    title: 'You will meet the users',
    body: 'Everyone visits farms in their first month. You cannot design for a person you have never stood in a field with.',
  },
  {
    title: 'Small team, real ownership',
    body: 'Nineteen people. No layer of managers repeating things. You ship, you watch it land, you fix what broke.',
  },
  {
    title: 'Paid to stop working',
    body: 'Unlimited leave is a trap, so we do 28 days and actually check that you took them.',
  },
  {
    title: 'Hardware that works',
    body: 'Your choice of machine, a real monitor, and a field kit that survives being dropped in a canal.',
  },
];

export default function CareersPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden px-6 pt-[calc(var(--spacing-nav)+4rem)] pb-20">
        <Image src="/images/hero-farmland.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-canvas/72" />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal y={44}>
            <EyebrowLabel>Careers</EyebrowLabel>
            <h1 className="type-display max-w-[16ch] text-balance">
              Come build the boring parts that matter.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-white/65">
              Nineteen people, a satellite pipeline, and ten thousand farms that notice immediately when we get it
              wrong. No ping-pong table. There is a very good filter coffee machine.
            </p>
            <div className="mt-10">
              <Button href="#roles">See open roles</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>What it is like</EyebrowLabel>
            <h2 className="type-h2 max-w-[20ch] text-balance">Fewer meetings. More consequences.</h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
            {perks.map((perk) => (
              <StaggerItem key={perk.title} className="h-full">
                <div className="h-full rounded-lg border border-hairline bg-surface p-7 transition-colors hover:border-hairline-strong">
                  <h3 className="mb-2 text-base font-semibold tracking-tight text-ink">{perk.title}</h3>
                  <p className="text-[0.9rem] font-light leading-[1.75] text-ink-muted">{perk.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="scroll-mt-nav border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <EyebrowLabel>Open roles</EyebrowLabel>
            <h2 className="type-h2">Six seats, currently empty.</h2>
          </Reveal>

          <Stagger className="mt-12 overflow-hidden rounded-lg border border-hairline">
            {roles.map((role) => (
              <StaggerItem key={role.title}>
                <a
                  href="#apply"
                  className="group flex flex-col gap-2 border-b border-hairline bg-canvas px-6 py-6 transition-colors last:border-b-0 hover:bg-raised sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="text-[1.0625rem] font-semibold tracking-tight text-ink">{role.title}</p>
                    <p className="mt-1 text-[0.875rem] font-light text-ink-muted">
                      {role.team} · {role.location} · {role.type}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-semibold text-accent">
                    Apply
                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mt-8 text-[0.9375rem] font-light leading-[1.75] text-ink-muted">
              Every role uses the same form below. We read all of them, and we reply to all of them,
              which is a promise we are told is unusual.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-hairline px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <EyebrowLabel>Hiring process</EyebrowLabel>
            <h2 className="type-h2 max-w-[22ch] text-balance">Three conversations. No take-home from hell.</h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              { num: '01', title: 'A real conversation', body: 'Thirty minutes about your work and ours. Not a quiz on algorithms you last used in college.' },
              { num: '02', title: 'A paid work session', body: 'Four hours on a real problem from our backlog, paid at your rate. You keep the work either way.' },
              { num: '03', title: 'Meet the team', body: 'You talk to the people you would sit with, and you ask us the uncomfortable questions.' },
            ].map((step) => (
              <StaggerItem key={step.num}>
                <div className="type-stat text-accent">{step.num}</div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2.5 text-[0.9rem] font-light leading-[1.75] text-ink-muted">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      {/* APPLY */}
      <section id="apply" className="scroll-mt-nav border-t border-hairline bg-surface px-6 py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <Reveal>
            <EyebrowLabel>Apply</EyebrowLabel>
            <h2 className="type-h2 max-w-[16ch] text-balance">One form. No account to create.</h2>
            <p className="mt-5 max-w-[42ch] text-base font-light leading-[1.8] text-ink-muted">
              Nothing on the list fits but you are certain you belong here? Put your own title in the
              role field and tell us what you would fix first.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <CareersForm />
          </Reveal>
        </div>
      </section>

    </>
  );
}

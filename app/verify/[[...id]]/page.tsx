import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Lock, Mail, OctagonX, SearchX, ShieldCheck } from 'lucide-react';
import CopyButton from '@/components/certificates/CopyButton';
import CertificateLookup from '@/components/certificates/CertificateLookup';
import { CERTIFICATES, ISSUER, duration, findCertificate, formatDate } from '@/data/certificates';

export const metadata: Metadata = {
  title: 'Verify a certificate',
  description: 'Confirm that an Agronavis certificate is genuine. Free, instant, no account needed.',
  robots: { index: false },
};

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ id: [c.id] }));
}

type Props = {
  params: Promise<{ id?: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

const SITE = 'https://agronavis.in';

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">{label}</dt>
      <dd className={`mt-1.5 text-[0.9375rem] text-ink ${mono ? 'font-mono tracking-tight' : 'font-medium'}`}>
        {value}
      </dd>
    </div>
  );
}



export default async function VerifyPage({ params, searchParams }: Props) {
  const { id: segments } = await params;
  const { id: typed } = await searchParams;
  const query = (segments?.[0] ?? typed ?? '').trim();
  const cert = query ? findCertificate(query) : null;
  const revoked = cert?.revoked;

  const image =
    cert && existsSync(path.join(process.cwd(), 'public/certificates', `${cert.id}.png`))
      ? `/certificates/${cert.id}.png`
      : null;

  /* ── Landing ──────────────────────────────────────────────────────────── */
  if (!query) {
    return (
      <section className="px-6 pt-[calc(var(--spacing-nav)+5rem)] pb-24">
        <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-accent">
              Verify a certificate
            </p>
            <h1 className="type-display max-w-[12ch] text-balance">Check that a certificate is really ours.</h1>
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Employers, colleges and anyone else can confirm an Agronavis certificate in seconds.
              Scan its QR code, or type the number printed on it.
            </p>
            <div className="mt-10">
              <CertificateLookup cta="Verify" />
            </div>
            <p className="mt-4 px-1 text-[0.8125rem] text-ink-faint">
              Free and instant. No account needed. Capital letters and dashes do not matter.
            </p>
          </div>

          <aside className="rounded-xl border border-hairline bg-surface p-7">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">
              Where to find the number
            </p>
            <div className="mt-5 rounded-md border border-hairline bg-[#f7f5ec] px-5 py-4 text-center">
              <p className="inline-block rounded border-2 border-accent px-3 py-1 font-mono text-[0.8125rem] font-semibold text-[#14532d]">
                Certificate No. agn-h4kq7m2xnp
              </p>
              <p className="mt-2 text-[0.75rem] text-[#4b5d52]">Issued 30 October 2026 · agronavis.in</p>
              <p className="mt-1 font-mono text-[0.7rem] font-semibold text-[#14532d]">
                Verify at agronavis.in/verify/agn-h4kq7m2xnp
              </p>
            </div>
            <p className="mt-5 text-[0.9375rem] font-light leading-[1.75] text-ink-muted">
              It is printed at the bottom centre of every Agronavis certificate, starting with{' '}
              <span className="font-mono text-ink">agn-</span>, next to the link you are on now.
            </p>
            <div className="mt-6 flex gap-3 border-t border-hairline pt-5">
              <Mail size={17} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-[0.875rem] font-light leading-relaxed text-ink-muted">
                No number, or it will not verify? Email{' '}
                <a href={`mailto:${ISSUER.email}`} className="text-accent hover:opacity-80">{ISSUER.email}</a>{' '}
                and we will check our records for you.
              </p>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  /* ── Not found ────────────────────────────────────────────────────────── */
  if (!cert) {
    return (
      <section className="px-6 pt-[calc(var(--spacing-nav)+4.5rem)] pb-24">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-hairline-strong">
            <SearchX size={24} className="text-ink-muted" />
          </div>
          <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-ink-faint">
            Certificate check
          </p>
          <h1 className="type-h2">No certificate found</h1>
          <p className="mt-5 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
            Nothing in our records matches <span className="font-mono text-ink">{query}</span>. Compare it
            with the number printed on the certificate. One wrong character is enough to miss.
          </p>
          <div className="mt-9">
            <CertificateLookup defaultValue={query} cta="Check again" />
          </div>
          <div className="mt-10 flex gap-3 rounded-lg border border-hairline bg-surface p-6">
            <Mail size={18} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-semibold text-ink">Still not found?</p>
              <p className="mt-1.5 text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                A certificate that is not in our records was not issued by Agronavis. Email{' '}
                <a href={`mailto:${ISSUER.email}`} className="text-accent hover:opacity-80">{ISSUER.email}</a>{' '}
                with a photo of it and we will look into it.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Verified or revoked ──────────────────────────────────────────────── */
  const verifyUrl = `${SITE}/verify/${cert.id}`;
  const linkedIn =
    'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME' +
    `&name=${encodeURIComponent(`${cert.kind} — ${cert.role}`)}` +
    `&organizationName=${encodeURIComponent(ISSUER.organisation)}` +
    `&issueYear=${cert.issuedOn.slice(0, 4)}&issueMonth=${Number(cert.issuedOn.slice(5, 7))}` +
    `&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(cert.id)}`;

  return (
    <section className="px-6 pt-[calc(var(--spacing-nav)+3.5rem)] pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-accent">
          Certificate verification
        </p>

        {/* Verdict */}
        <div
          className={`flex flex-col gap-6 rounded-xl border p-8 lg:flex-row lg:items-center lg:justify-between ${
            revoked ? 'border-error/40 bg-error/5' : 'border-accent-line bg-accent-soft'
          }`}
        >
          <div className="flex items-start gap-5">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
                revoked ? 'border-error/40 bg-error/10' : 'border-accent-line bg-accent-soft'
              }`}
            >
              {revoked ? <OctagonX size={24} className="text-error" /> : <ShieldCheck size={24} className="text-accent" />}
            </div>
            <div>
              <h1 className="type-h2">{revoked ? 'Revoked' : 'Verified'}</h1>
              <p className="mt-2 max-w-[52ch] text-[1.0625rem] font-light leading-relaxed text-ink-muted">
                {revoked ? (
                  <>
                    Agronavis issued this certificate, then withdrew it on{' '}
                    <span className="font-medium text-ink">{formatDate(revoked.on)}</span>. It is no
                    longer valid.
                  </>
                ) : (
                  <>
                    Agronavis issued this certificate to{' '}
                    <span className="font-medium text-ink">{cert.name}</span>, and it matches our records.
                  </>
                )}
              </p>
              {revoked && (
                <div className="mt-5 border-t border-error/20 pt-4">
                  <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">Reason</p>
                  <p className="mt-1.5 text-[0.9375rem] text-ink">{revoked.reason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 lg:text-right">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">
              Verification ID
            </p>
            <div className="mt-2 flex items-center gap-1 lg:justify-end">
              <code className="rounded-sm border border-hairline bg-raised px-3 py-1.5 font-mono text-[0.875rem] text-ink">
                {cert.id}
              </code>
              <CopyButton value={cert.id} label="Copy the verification ID" />
            </div>
          </div>
        </div>

        {/* Document + record */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-hairline bg-surface p-6">
            {image ? (
              <a
                href={image}
                target="_blank"
                rel="noopener"
                aria-label={`Open the full certificate issued to ${cert.name}`}
                className="group block overflow-hidden rounded-lg bg-raised p-3 transition-colors hover:bg-white/[0.06]"
              >
                <Image
                  src={image}
                  alt={`Certificate of ${cert.kind.toLowerCase()} issued to ${cert.name}`}
                  width={1365}
                  height={966}
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className={`h-auto w-full rounded-sm shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-black/40 transition-opacity ${
                    revoked ? 'opacity-50 grayscale' : 'group-hover:opacity-95'
                  }`}
                />
              </a>
            ) : (
              <div className="flex min-h-[18rem] items-center justify-center rounded-lg bg-raised p-10 text-center">
                <p className="max-w-[34ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                  No image is on file for this certificate. The record beside it is the authoritative
                  version.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.9375rem] font-medium text-ink">The document as issued</p>
                <p className="mt-0.5 text-[0.8125rem] text-ink-faint">
                  Issued {formatDate(cert.issuedOn)}
                </p>
              </div>
              {!revoked && image && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={image}
                    download
                    className="md-state inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
                  >
                    <Download size={15} /> Download
                  </a>
                  <a
                    href={linkedIn}
                    target="_blank"
                    rel="noopener"
                    className="md-state inline-flex h-10 items-center gap-2 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink"
                  >
                    Add to LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface p-7">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">Issued to</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{cert.name}</p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-hairline pt-6">
              <Detail label="Certificate" value={cert.kind} />
              <Detail label="Role" value={cert.role} />
              <div className="col-span-2">
                <Detail
                  label={revoked ? 'Was valid' : 'Duration'}
                  value={`${formatDate(cert.startedOn)} – ${formatDate(cert.endedOn)} · ${duration(cert.startedOn, cert.endedOn)}`}
                />
              </div>
              <Detail label="Issued on" value={formatDate(cert.issuedOn)} />
              <Detail label="Certificate no." value={cert.id} mono />
            </dl>

            <div className="mt-7 border-t border-hairline pt-6">
              <p className="text-[0.625rem] font-semibold tracking-[0.16em] uppercase text-ink-faint">Issued by</p>
              <p className="mt-2 font-medium text-ink">{ISSUER.organisation}</p>
              <p className="mt-1 text-[0.875rem] font-light text-ink-muted">{ISSUER.registration}</p>
              <p className="text-[0.875rem] font-light text-ink-muted">{ISSUER.place}</p>
            </div>
          </div>
        </div>

        {/* Anti-forgery guidance */}
        <div className="mt-20">
          <h2 className="type-h2">Make sure you are on the real page</h2>
          <p className="mt-3 max-w-[58ch] text-[0.9375rem] font-light text-ink-muted">
            A copied page can look exactly like this one. These three checks cannot be faked.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-hairline bg-surface p-7">
              <p className="mb-3 text-[0.9375rem] font-semibold text-ink">
                <span className="mr-2 font-mono text-accent">01</span> Check the address
              </p>
              <code className="flex items-center gap-2 rounded-sm border border-hairline bg-raised px-3 py-2 font-mono text-[0.8125rem] text-ink-muted">
                <Lock size={13} className="shrink-0 text-accent" />
                <span className="truncate"><span className="text-ink">agronavis.in</span>/verify/{cert.id}</span>
              </code>
              <p className="mt-3 text-[0.875rem] font-light leading-relaxed text-ink-muted">
                Nothing should come between https:// and agronavis.in.
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-7">
              <p className="mb-3 text-[0.9375rem] font-semibold text-ink">
                <span className="mr-2 font-mono text-accent">02</span> Match the details
              </p>
              <p className="text-[0.875rem] font-light leading-relaxed text-ink-muted">
                The name, role, dates and certificate number here must match the printed copy exactly.
                One different letter means it is not ours.
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-7">
              <p className="mb-3 text-[0.9375rem] font-semibold text-ink">
                <span className="mr-2 font-mono text-accent">03</span> Ask us directly
              </p>
              <p className="text-[0.875rem] font-light leading-relaxed text-ink-muted">
                Still unsure? Write to{' '}
                <a href={`mailto:${ISSUER.email}`} className="text-accent hover:opacity-80">{ISSUER.email}</a>{' '}
                with the verification ID and we will confirm by email.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-[0.8125rem] text-ink-faint">
          <Link href="/verify" className="text-accent hover:opacity-80">Check another certificate</Link>
        </p>
      </div>
    </section>
  );
}

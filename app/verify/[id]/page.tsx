import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, CircleSlash, Download, Search } from 'lucide-react';
import {
  allCertificateIds,
  findCertificate,
  formatDate,
  isValidIdFormat,
  normaliseId,
} from '@/lib/certificates';

export const dynamicParams = true;

export function generateStaticParams() {
  return allCertificateIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cert = findCertificate(id);
  if (!cert) return { title: 'Certificate not found', robots: { index: false } };
  return {
    title: `${cert.name} — ${cert.id}`,
    description: `Verification record for ${cert.name}, ${cert.programme}, issued by Agronavis on ${formatDate(cert.issuedOn)}.`,
    robots: { index: false },
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-hairline py-4 last:border-b-0">
      <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">
        {label}
      </dt>
      <dd className="mt-1.5 text-[1.0625rem] font-medium text-ink">{value}</dd>
    </div>
  );
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const id = normaliseId(raw);
  const cert = findCertificate(id);

  if (!cert && !isValidIdFormat(id)) notFound();

  const revoked = cert?.revoked;

  return (
    <section className="px-6 pt-[calc(var(--spacing-nav)+3.5rem)] pb-20">
      <div className="mx-auto w-full max-w-6xl">
        {/* ── Status ─────────────────────────────────────────────── */}
        <div
          className={`flex flex-col gap-3 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between ${
            !cert
              ? 'border-hairline-strong bg-surface'
              : revoked
                ? 'border-error/40 bg-error/5'
                : 'border-accent-line bg-accent-soft'
          }`}
        >
          <div className="flex items-center gap-3">
            {!cert ? (
              <Search size={22} className="shrink-0 text-ink-muted" />
            ) : revoked ? (
              <CircleSlash size={22} className="shrink-0 text-error" />
            ) : (
              <BadgeCheck size={22} className="shrink-0 text-accent" />
            )}
            <div>
              <p className="text-lg font-semibold tracking-tight text-ink">
                {!cert ? 'No record found' : revoked ? 'Certificate revoked' : 'Certificate verified'}
              </p>
              <p className="mt-0.5 text-[0.875rem] font-light text-ink-muted">
                {!cert
                  ? 'No certificate has been issued with this identifier.'
                  : revoked
                    ? `Withdrawn on ${formatDate(revoked.on)}. ${revoked.reason}`
                    : 'This is an authentic record issued by Agronavis.'}
              </p>
            </div>
          </div>
          <p className="shrink-0 font-mono text-[0.8125rem] tracking-wide text-ink-faint">{id}</p>
        </div>

        {!cert ? (
          <div className="mt-8 max-w-[58ch]">
            <p className="text-[0.9375rem] font-light leading-[1.8] text-ink-muted">
              Check the identifier against the one printed on the certificate. It is six characters
              after the year, and the letters exclude anything that could be misread, so there is no
              O, I, Z, or the digits 0 and 1.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/verify"
                className="md-state inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent"
              >
                Try another identifier
              </Link>
              <a
                href="mailto:contact@agronavis.in"
                className="md-state inline-flex h-10 items-center rounded-full border border-hairline-strong px-6 text-sm font-medium text-ink"
              >
                Ask us about it
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            {/* ── The document ─────────────────────────────────────── */}
            <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
              {cert.hasPdf ? (
                <>
                  <iframe
                    src={`/certificates/${cert.id}.pdf#view=FitH`}
                    title={`Certificate ${cert.id}`}
                    className="h-[30rem] w-full border-0 bg-raised lg:h-[36rem]"
                  />
                  <div className="flex items-center justify-between gap-4 border-t border-hairline px-5 py-3">
                    <p className="text-[0.8125rem] text-ink-faint">Issued document</p>
                    <a
                      href={`/certificates/${cert.id}.pdf`}
                      download
                      className="md-state inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-accent"
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-line bg-accent-soft">
                    <BadgeCheck size={26} className="text-accent" />
                  </div>
                  <p className="max-w-[34ch] text-[0.9375rem] font-light leading-relaxed text-ink-muted">
                    This record is held in the register rather than as a document. The details
                    beside it are the authoritative version.
                  </p>
                </div>
              )}
            </div>

            {/* ── The record ───────────────────────────────────────── */}
            <div className="rounded-lg border border-hairline bg-surface p-7">
              <dl>
                <Row label="Issued to" value={cert.name} />
                <Row label="Programme" value={cert.programme} />
                <Row label="Type" value={cert.kind} />
                {cert.startedOn && cert.endedOn && (
                  <Row
                    label="Period"
                    value={`${formatDate(cert.startedOn)} to ${formatDate(cert.endedOn)}`}
                  />
                )}
                <Row label="Issue date" value={formatDate(cert.issuedOn)} />
                <Row label="Organisation" value="Agronavis" />
                <Row label="Certificate ID" value={cert.id} />
              </dl>
              <p className="mt-6 border-t border-hairline pt-5 text-[0.8125rem] font-light leading-relaxed text-ink-faint">
                Issued by Agronavis, MSME Udyam UDYAM-WB-14-0290868, Kolkata. Questions about this
                record go to{' '}
                <a href="mailto:contact@agronavis.in" className="text-accent hover:opacity-80">
                  contact@agronavis.in
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

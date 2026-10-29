'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  AlertCircle,
  Loader2,
  Download,
  Calendar,
  User,
  Briefcase,
  Building,
  Award,
  FileWarning,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface PublicCertificate {
  certificateId: string;
  recipientName: string;
  certificateType: string;
  role: string;
  department: string;
  startDate: string;
  completionDate: string;
  issueDate: string;
  issuer: string;
  signatory: string;
  signatoryDesignation: string;
  status: 'active' | 'revoked';
  pdfAvailable: boolean;
  revokedAt: string | null;
  revocationReason: string | null;
}

type VerifyState =
  | { type: 'loading' }
  | { type: 'verified'; certificate: PublicCertificate }
  | { type: 'revoked'; certificate: PublicCertificate }
  | { type: 'not_found' }
  | { type: 'error'; message: string };

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function VerifyCertificatePage() {
  const params = useParams();
  const certificateId = params.certificateId as string;
  const [state, setState] = useState<VerifyState>({ type: 'loading' });
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (!certificateId) {
      setState({ type: 'not_found' });
      return;
    }

    fetch(`/api/verify/${encodeURIComponent(certificateId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (data.status === 'verified') {
          setState({ type: 'verified', certificate: data.certificate });
        } else if (data.status === 'revoked') {
          setState({ type: 'revoked', certificate: data.certificate });
        } else {
          setState({ type: 'not_found' });
        }
      })
      .catch(() => {
        setState({
          type: 'error',
          message: 'Verification service temporarily unavailable',
        });
      });
  }, [certificateId]);

  // Loading
  if (state.type === 'loading') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-accent" />
          <p className="mt-4 text-sm text-ink-muted">Verifying certificate…</p>
        </div>
      </div>
    );
  }

  // Not found
  if (state.type === 'not_found') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-error/20 bg-error/10">
            <ShieldAlert size={32} className="text-error" />
          </div>
          <h1 className="text-xl font-bold">Certificate Not Found</h1>
          <p className="mt-3 text-sm text-ink-muted">
            No certificate was found matching the ID{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs font-semibold">
              {certificateId}
            </code>
          </p>
          <p className="mt-2 text-xs text-ink-faint">
            Please check the certificate ID and try again. If you believe this
            is an error, contact Agronavis.
          </p>
          <Link
            href="/verify-certificate"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Try another ID
          </Link>
        </div>
      </div>
    );
  }

  // Error
  if (state.type === 'error') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-faint/20 bg-white/5">
            <AlertCircle size={32} className="text-ink-muted" />
          </div>
          <h1 className="text-xl font-bold">Verification Unavailable</h1>
          <p className="mt-3 text-sm text-ink-muted">{state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex h-10 items-center rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Verified or Revoked
  const cert = state.certificate;
  const isRevoked = state.type === 'revoked';

  return (
    <section className="px-6 py-8 pt-[calc(var(--spacing-nav)+2rem)]">
      <div className="mx-auto max-w-6xl">
        {/* Status Banner */}
        <div
          className={`mb-8 rounded-xl border p-5 ${
            isRevoked
              ? 'border-error/25 bg-error/5'
              : 'border-accent/25 bg-accent-soft'
          }`}
        >
          <div className="flex items-center gap-3">
            {isRevoked ? (
              <ShieldOff size={28} className="text-error" />
            ) : (
              <ShieldCheck size={28} className="text-accent" />
            )}
            <div>
              <h1 className="text-lg font-bold">
                {isRevoked ? 'Certificate Revoked' : 'Certificate Verified'}
              </h1>
              <p className="text-sm text-ink-muted">
                {isRevoked
                  ? 'This certificate has been revoked by the issuer and is no longer valid.'
                  : 'This certificate has been verified as authentic and issued by Agronavis.'}
              </p>
            </div>
          </div>
          {isRevoked && cert.revocationReason && (
            <div className="mt-3 rounded-md bg-error/10 px-3 py-2">
              <p className="text-xs font-medium text-error">
                Reason: {cert.revocationReason}
              </p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: PDF Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-[calc(var(--spacing-nav)+1.5rem)]">
              <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] uppercase text-ink-faint">
                Certificate Document
              </h2>
              {cert.pdfAvailable && !pdfError ? (
                <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
                  <div className="aspect-[8.5/11] w-full">
                    <iframe
                      src={`/api/verify/${encodeURIComponent(cert.certificateId)}/pdf`}
                      title="Certificate PDF"
                      className="h-full w-full"
                      onError={() => setPdfError(true)}
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5">
                    <span className="text-xs text-ink-faint">
                      {cert.certificateId}.pdf
                    </span>
                    <a
                      href={`/api/verify/${encodeURIComponent(cert.certificateId)}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-accent transition-opacity hover:opacity-80"
                    >
                      <Download size={13} />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface py-20">
                  <FileWarning size={32} className="mb-3 text-ink-faint" />
                  <p className="text-sm font-medium text-ink-muted">
                    {pdfError
                      ? 'Unable to load document'
                      : 'Document not available'}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {cert.status === 'active'
                      ? 'The certificate record exists, but the document could not be loaded at this time.'
                      : 'This certificate has been revoked.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Verification Details */}
          <div className="order-1 lg:order-2">
            <h2 className="mb-3 text-xs font-semibold tracking-[0.14em] uppercase text-ink-faint">
              Verification Details
            </h2>
            <div className="rounded-xl border border-hairline bg-surface p-5">
              {/* Status + ID */}
              <div className="mb-5 flex items-center gap-3 pb-4 border-b border-hairline">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isRevoked ? 'bg-error/15' : 'bg-accent-soft'
                  }`}
                >
                  {isRevoked ? (
                    <ShieldOff size={22} className="text-error" />
                  ) : (
                    <ShieldCheck size={22} className="text-accent" />
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isRevoked ? 'text-error' : 'text-accent'
                    }`}
                  >
                    {isRevoked ? 'REVOKED' : 'VERIFIED'}
                  </p>
                  <code className="text-xs font-semibold text-ink-muted">
                    {cert.certificateId}
                  </code>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-4">
                <InfoRow
                  icon={<User size={15} />}
                  label="Recipient"
                  value={cert.recipientName}
                  highlighted
                />
                <InfoRow
                  icon={<Award size={15} />}
                  label="Certificate Type"
                  value={cert.certificateType}
                />
                <InfoRow
                  icon={<Briefcase size={15} />}
                  label="Role / Designation"
                  value={cert.role}
                />
                <InfoRow
                  icon={<Building size={15} />}
                  label="Department"
                  value={cert.department}
                />
                <InfoRow
                  icon={<Calendar size={15} />}
                  label="Internship Period"
                  value={`${formatDate(cert.startDate)} — ${formatDate(
                    cert.completionDate
                  )}`}
                />
                <InfoRow
                  icon={<Calendar size={15} />}
                  label="Issue Date"
                  value={formatDate(cert.issueDate)}
                />

                <div className="border-t border-hairline pt-4">
                  <InfoRow
                    icon={
                      <Image
                        src="/logo.png"
                        alt=""
                        width={30}
                        height={30}
                        className="h-[15px] w-[15px]"
                      />
                    }
                    label="Issuing Organisation"
                    value={cert.issuer}
                  />
                  <div className="mt-3">
                    <InfoRow
                      icon={<User size={15} />}
                      label="Authorised Signatory"
                      value={`${cert.signatory}, ${cert.signatoryDesignation}`}
                    />
                  </div>
                </div>

                {isRevoked && cert.revokedAt && (
                  <div className="border-t border-hairline pt-4">
                    <InfoRow
                      icon={<ShieldOff size={15} />}
                      label="Revoked On"
                      value={formatDate(cert.revokedAt)}
                    />
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="mt-5 rounded-lg bg-white/[0.03] p-3">
                <p className="text-[0.6875rem] leading-relaxed text-ink-faint">
                  {isRevoked ? (
                    <>
                      This certificate was previously issued by Agronavis but has since
                      been revoked by the issuer. It should not be relied upon as a valid
                      credential.
                    </>
                  ) : (
                    <>
                      This certificate has been verified against Agronavis&apos;s
                      authoritative records. The information displayed above matches the
                      official certificate record. This verification confirms that the
                      certificate was issued by Agronavis; it does not independently verify
                      that the contents of any PDF document have not been altered after
                      issuance.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function InfoRow({
  icon,
  label,
  value,
  highlighted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-ink-faint">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6875rem] font-medium text-ink-faint">{label}</p>
        <p
          className={`mt-0.5 text-sm ${
            highlighted ? 'font-semibold' : 'text-ink-muted'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

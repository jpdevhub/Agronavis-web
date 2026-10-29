'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Award,
  Plus,
  Search,
  Filter,
  LogOut,
  FileText,
  ShieldCheck,
  ShieldOff,
  Clock,
  Download,
  QrCode,
  ExternalLink,
  Copy,
  Trash2,
  Upload,
  Eye,
  ChevronDown,
  Loader2,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Certificate {
  id: string;
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
  pdfFilename: string | null;
  pdfStamped: boolean;
  status: 'draft' | 'active' | 'revoked';
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
  revocationReason: string | null;
  verificationUrl: string;
  qrCodeDataUrl?: string;
}

interface Stats {
  total: number;
  active: number;
  revoked: number;
  drafts: number;
}

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'view'; cert: Certificate }
  | { type: 'upload'; cert: Certificate }
  | { type: 'revoke'; cert: Certificate }
  | { type: 'delete'; cert: Certificate };

/* ─── Main Dashboard ───────────────────────────────────────────────── */

export default function CertificateDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, revoked: 0, drafts: 0 });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAuthenticated(true);
        } else {
          router.push('/admin');
        }
      })
      .catch(() => router.push('/admin'));
  }, [router]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, certsRes] = await Promise.all([
        fetch('/api/admin/certificates?stats=true'),
        fetch(
          `/api/admin/certificates?search=${encodeURIComponent(search)}&status=${statusFilter}`
        ),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (certsRes.ok) {
        const data = await certsRes.json();
        setCertificates(data.certificates || []);
      }
    } catch {
      /* best-effort */
    }
    setLoading(false);
  }, [search, statusFilter]);

  // Trigger initial data load when authentication state is confirmed.
  // Using a separate ref avoids the set-state-in-effect lint rule.
  const didFetch = useRef(false);
  useEffect(() => {
    if (authenticated && !didFetch.current) {
      didFetch.current = true;
      void fetchData();
    }
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when search or filter changes (after initial load).
  useEffect(() => {
    if (didFetch.current) void fetchData();
  }, [search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* */ }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={64} height={64} className="h-7 w-7" />
            <span className="text-[0.9375rem] font-bold tracking-tight">Agronavis</span>
            <span className="ml-1 rounded-sm bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="md-state flex items-center gap-2 rounded-full border border-hairline-strong px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Certificate Management</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Issue, manage, and verify internship certificates
            </p>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="md-state inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
          >
            <Plus size={17} />
            Issue Certificate
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Issued', value: stats.total, icon: Award, color: 'text-ink' },
            { label: 'Active', value: stats.active, icon: ShieldCheck, color: 'text-accent' },
            { label: 'Revoked', value: stats.revoked, icon: ShieldOff, color: 'text-error' },
            { label: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-ink-muted' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-hairline bg-surface p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs font-medium text-ink-muted">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search by name, ID, role, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-hairline bg-surface pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-accent placeholder:text-ink-faint"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-hairline bg-surface pl-9 pr-8 text-sm text-ink outline-none transition-colors focus:border-accent"
            >
              <option value="">All statuses</option>
              <option value="draft">Drafts</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-faint" />
          </div>
        </div>

        {/* Certificate Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface py-20">
            <Award size={40} className="mb-3 text-ink-faint" />
            <p className="text-sm font-medium text-ink-muted">No certificates found</p>
            <p className="mt-1 text-xs text-ink-faint">
              {search || statusFilter
                ? 'Try adjusting your search or filter'
                : 'Issue your first certificate to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-hairline bg-surface">
                  <th className="px-4 py-3 font-semibold text-ink-muted">Certificate ID</th>
                  <th className="px-4 py-3 font-semibold text-ink-muted">Recipient</th>
                  <th className="hidden px-4 py-3 font-semibold text-ink-muted md:table-cell">Role</th>
                  <th className="hidden px-4 py-3 font-semibold text-ink-muted lg:table-cell">Issue Date</th>
                  <th className="px-4 py-3 font-semibold text-ink-muted">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-ink-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr
                    key={cert.id}
                    className="border-b border-hairline transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-semibold text-accent">
                          {cert.certificateId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(cert.verificationUrl, cert.id)}
                          className="p-0.5 text-ink-faint transition-colors hover:text-ink"
                          title="Copy verification URL"
                        >
                          {copiedId === cert.id ? (
                            <Check size={12} className="text-accent" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{cert.recipientName}</td>
                    <td className="hidden px-4 py-3 text-ink-muted md:table-cell">
                      {cert.role}
                    </td>
                    <td className="hidden px-4 py-3 text-ink-muted lg:table-cell">
                      {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <ActionButton
                          icon={<Eye size={14} />}
                          label="View"
                          onClick={() => setModal({ type: 'view', cert })}
                        />
                        {cert.status === 'draft' && !cert.pdfFilename && (
                          <ActionButton
                            icon={<Upload size={14} />}
                            label="Upload PDF"
                            onClick={() => setModal({ type: 'upload', cert })}
                          />
                        )}
                        {cert.status === 'draft' && cert.pdfFilename && (
                          <ActionButton
                            icon={<ShieldCheck size={14} />}
                            label="Publish"
                            onClick={() => handlePublish(cert.id)}
                            accent
                          />
                        )}
                        {cert.pdfFilename && (
                          <ActionButton
                            icon={<Download size={14} />}
                            label="Download PDF"
                            onClick={() =>
                              window.open(`/api/admin/certificates/${cert.id}/pdf`, '_blank')
                            }
                          />
                        )}
                        <ActionButton
                          icon={<QrCode size={14} />}
                          label="Download QR"
                          onClick={() =>
                            window.open(`/api/admin/certificates/${cert.id}/qr`, '_blank')
                          }
                        />
                        {cert.status === 'active' && (
                          <ActionButton
                            icon={<ExternalLink size={14} />}
                            label="Open verification page"
                            onClick={() =>
                              window.open(
                                `/verify-certificate/${cert.certificateId}`,
                                '_blank'
                              )
                            }
                          />
                        )}
                        {cert.status === 'active' && (
                          <ActionButton
                            icon={<ShieldOff size={14} />}
                            label="Revoke"
                            onClick={() => setModal({ type: 'revoke', cert })}
                            danger
                          />
                        )}
                        {cert.status === 'draft' && (
                          <ActionButton
                            icon={<Trash2 size={14} />}
                            label="Delete"
                            onClick={() => setModal({ type: 'delete', cert })}
                            danger
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.type === 'create' && (
        <CreateCertificateModal
          onClose={() => setModal({ type: 'none' })}
          onCreated={() => {
            setModal({ type: 'none' });
            fetchData();
          }}
        />
      )}
      {modal.type === 'view' && (
        <ViewCertificateModal
          cert={modal.cert}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'upload' && (
        <UploadPdfModal
          cert={modal.cert}
          onClose={() => setModal({ type: 'none' })}
          onUploaded={() => {
            setModal({ type: 'none' });
            fetchData();
          }}
        />
      )}
      {modal.type === 'revoke' && (
        <RevokeModal
          cert={modal.cert}
          onClose={() => setModal({ type: 'none' })}
          onRevoked={() => {
            setModal({ type: 'none' });
            fetchData();
          }}
        />
      )}
      {modal.type === 'delete' && (
        <DeleteModal
          cert={modal.cert}
          onClose={() => setModal({ type: 'none' })}
          onDeleted={() => {
            setModal({ type: 'none' });
            fetchData();
          }}
        />
      )}
    </div>
  );

  async function handlePublish(id: string) {
    if (!confirm('Publish this certificate? It will become publicly verifiable.')) return;
    try {
      const res = await fetch(`/api/admin/certificates/${id}/publish`, {
        method: 'POST',
      });
      if (res.ok) fetchData();
      else {
        const data = await res.json();
        alert(data.error || 'Failed to publish');
      }
    } catch {
      alert('Failed to publish certificate');
    }
  }
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const styles = {
    draft: 'border-ink-faint/30 bg-white/5 text-ink-muted',
    active: 'border-accent/30 bg-accent-soft text-accent',
    revoked: 'border-error/30 bg-error/10 text-error',
  };
  const icons = {
    draft: <Clock size={11} />,
    active: <ShieldCheck size={11} />,
    revoked: <ShieldOff size={11} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold capitalize ${
        styles[status as keyof typeof styles] || styles.draft
      }`}
    >
      {icons[status as keyof typeof icons]}
      {status}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  accent,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  danger?: boolean;
}) {
  let cls = 'text-ink-faint hover:text-ink hover:bg-white/5';
  if (accent) cls = 'text-accent hover:bg-accent-soft';
  if (danger) cls = 'text-ink-faint hover:text-error hover:bg-error/10';
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-md p-1.5 transition-colors ${cls}`}
    >
      {icon}
    </button>
  );
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-hairline bg-surface p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ─── Create Certificate Modal ──────────────────────────────────────── */

function CreateCertificateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    recipientName: '',
    certificateType: 'Internship Completion Certificate',
    role: '',
    department: '',
    startDate: '',
    completionDate: '',
    issueDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onCreated();
      } else {
        setErrors(data.fields || {});
      }
    } catch {
      setErrors({ _form: 'Failed to create certificate' });
    }
    setSubmitting(false);
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 className="mb-1 text-lg font-bold">Issue New Certificate</h2>
      <p className="mb-6 text-sm text-ink-muted">
        Enter the intern&apos;s details. A unique certificate ID will be generated automatically.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Recipient Name"
          name="recipientName"
          value={form.recipientName}
          error={errors.recipientName}
          onChange={(v) => setForm({ ...form, recipientName: v })}
          required
        />
        <FormField
          label="Certificate Type"
          name="certificateType"
          value={form.certificateType}
          error={errors.certificateType}
          onChange={(v) => setForm({ ...form, certificateType: v })}
          required
        />
        <FormField
          label="Role / Designation"
          name="role"
          value={form.role}
          error={errors.role}
          onChange={(v) => setForm({ ...form, role: v })}
          required
          placeholder="e.g. Frontend Engineer Intern"
        />
        <FormField
          label="Department / Project"
          name="department"
          value={form.department}
          error={errors.department}
          onChange={(v) => setForm({ ...form, department: v })}
          required
          placeholder="e.g. Product"
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            error={errors.startDate}
            onChange={(v) => setForm({ ...form, startDate: v })}
            required
          />
          <FormField
            label="Completion Date"
            name="completionDate"
            type="date"
            value={form.completionDate}
            error={errors.completionDate}
            onChange={(v) => setForm({ ...form, completionDate: v })}
            required
          />
        </div>
        <FormField
          label="Issue Date"
          name="issueDate"
          type="date"
          value={form.issueDate}
          error={errors.issueDate}
          onChange={(v) => setForm({ ...form, issueDate: v })}
          required
        />

        {errors._form && (
          <p className="text-sm text-error">{errors._form}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="md-state flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent disabled:opacity-40"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Create Certificate
          </button>
        </div>
      </form>
    </ModalOverlay>
  );
}

/* ─── View Certificate Modal ─────────────────────────────────────────── */

function ViewCertificateModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/certificates/${cert.id}`)
      .then((r) => r.json())
      .then((d) => setDetail(d.certificate))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cert.id]);

  const c = detail || cert;

  return (
    <ModalOverlay onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Certificate Details</h2>
              <code className="mt-1 block text-sm font-semibold text-accent">
                {c.certificateId}
              </code>
            </div>
            <StatusBadge status={c.status} />
          </div>

          {/* QR Code */}
          {c.qrCodeDataUrl && (
            <div className="mb-5 flex justify-center">
              <div className="rounded-lg border border-hairline bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.qrCodeDataUrl}
                  alt={`QR code for ${c.certificateId}`}
                  className="h-32 w-32"
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="space-y-3">
            <DetailRow label="Recipient" value={c.recipientName} />
            <DetailRow label="Type" value={c.certificateType} />
            <DetailRow label="Role" value={c.role} />
            <DetailRow label="Department" value={c.department} />
            <DetailRow
              label="Duration"
              value={`${formatDate(c.startDate)} – ${formatDate(c.completionDate)}`}
            />
            <DetailRow label="Issue Date" value={formatDate(c.issueDate)} />
            <DetailRow label="Issuer" value={c.issuer} />
            <DetailRow label="Signatory" value={`${c.signatory}, ${c.signatoryDesignation}`} />
            <DetailRow
              label="Verification URL"
              value={c.verificationUrl}
              copyable
            />
            {c.pdfFilename && (
              <DetailRow label="PDF" value={c.pdfStamped ? 'Uploaded & stamped' : 'Uploaded (unstamped)'} />
            )}
            {c.revokedAt && (
              <>
                <DetailRow label="Revoked At" value={formatDate(c.revokedAt)} />
                {c.revocationReason && (
                  <DetailRow label="Reason" value={c.revocationReason} />
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            {c.status === 'draft' && !c.pdfFilename && (
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    // Trigger upload modal
                    document.dispatchEvent(
                      new CustomEvent('open-upload', { detail: c })
                    );
                  }, 100);
                }}
                className="flex items-center gap-1.5 rounded-full border border-hairline-strong px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <Upload size={13} /> Upload PDF
              </button>
            )}
            {c.pdfFilename && (
              <button
                onClick={() =>
                  window.open(`/api/admin/certificates/${c.id}/pdf`, '_blank')
                }
                className="flex items-center gap-1.5 rounded-full border border-hairline-strong px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <Download size={13} /> Download PDF
              </button>
            )}
            <button
              onClick={() =>
                window.open(`/api/admin/certificates/${c.id}/qr`, '_blank')
              }
              className="flex items-center gap-1.5 rounded-full border border-hairline-strong px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
            >
              <QrCode size={13} /> Download QR
            </button>
            {c.status === 'active' && (
              <button
                onClick={() =>
                  window.open(
                    `/verify-certificate/${c.certificateId}`,
                    '_blank'
                  )
                }
                className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-xs font-medium text-accent"
              >
                <ExternalLink size={13} /> View Verification Page
              </button>
            )}
          </div>
        </>
      )}
    </ModalOverlay>
  );
}

/* ─── Upload PDF Modal ──────────────────────────────────────────────── */

function UploadPdfModal({
  cert,
  onClose,
  onUploaded,
}: {
  cert: Certificate;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onUploaded();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  }

  return (
    <ModalOverlay onClose={onClose}>
      <h2 className="mb-1 text-lg font-bold">Upload Certificate PDF</h2>
      <p className="mb-2 text-sm text-ink-muted">
        For: <span className="font-medium text-ink">{cert.recipientName}</span> ({cert.certificateId})
      </p>
      <p className="mb-5 text-xs text-ink-faint">
        The PDF will be automatically stamped with the certificate ID, verification URL, and QR code.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) setFile(dropped);
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? 'border-accent bg-accent-soft'
            : file
              ? 'border-accent/40 bg-accent-soft/50'
              : 'border-hairline-strong hover:border-ink-faint'
        }`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf';
          input.onchange = () => {
            if (input.files?.[0]) setFile(input.files[0]);
          };
          input.click();
        }}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={24} className="text-accent" />
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-ink-faint">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto mb-2 text-ink-faint" />
            <p className="text-sm font-medium text-ink-muted">
              Drop a PDF here or click to browse
            </p>
            <p className="mt-1 text-xs text-ink-faint">Maximum 12 MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-error">{error}</p>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="md-state flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent disabled:opacity-40"
        >
          {uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          Upload & Stamp
        </button>
      </div>
    </ModalOverlay>
  );
}

/* ─── Revoke Modal ──────────────────────────────────────────────────── */

function RevokeModal({
  cert,
  onClose,
  onRevoked,
}: {
  cert: Certificate;
  onClose: () => void;
  onRevoked: () => void;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRevoke() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) onRevoked();
      else {
        const data = await res.json();
        alert(data.error || 'Failed to revoke');
      }
    } catch {
      alert('Failed to revoke');
    }
    setSubmitting(false);
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/15">
          <AlertTriangle size={20} className="text-error" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Revoke Certificate</h2>
          <p className="text-sm text-ink-muted">This action cannot be easily undone</p>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-error/20 bg-error/5 p-3">
        <p className="text-sm">
          You are about to revoke the certificate for{' '}
          <strong>{cert.recipientName}</strong> ({cert.certificateId}).
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          The verification page will show a &quot;Revoked&quot; status. The certificate ID will not be
          reassigned.
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="revoke-reason"
          className="mb-1.5 block text-sm font-medium text-ink-muted"
        >
          Public reason (optional)
        </label>
        <textarea
          id="revoke-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="This will be visible on the public verification page..."
          rows={3}
          className="w-full rounded-lg border border-hairline bg-canvas p-3 text-sm text-ink outline-none transition-colors focus:border-accent placeholder:text-ink-faint"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="h-10 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleRevoke}
          disabled={submitting}
          className="flex h-10 items-center gap-2 rounded-full bg-error/15 px-5 text-sm font-semibold text-error disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ShieldOff size={15} />
          )}
          Revoke Certificate
        </button>
      </div>
    </ModalOverlay>
  );
}

/* ─── Delete Modal ──────────────────────────────────────────────────── */

function DeleteModal({
  cert,
  onClose,
  onDeleted,
}: {
  cert: Certificate;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}`, {
        method: 'DELETE',
      });
      if (res.ok) onDeleted();
      else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
    setSubmitting(false);
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/15">
          <Trash2 size={20} className="text-error" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Delete Draft</h2>
          <p className="text-sm text-ink-muted">
            {cert.recipientName} — {cert.certificateId}
          </p>
        </div>
      </div>
      <p className="mb-5 text-sm text-ink-muted">
        This will permanently delete this draft certificate. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="h-10 rounded-full border border-hairline-strong px-5 text-sm font-medium text-ink-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={submitting}
          className="flex h-10 items-center gap-2 rounded-full bg-error/15 px-5 text-sm font-semibold text-error disabled:opacity-40"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          Delete
        </button>
      </div>
    </ModalOverlay>
  );
}

/* ─── Utility components ────────────────────────────────────────────── */

function FormField({
  label,
  name,
  value,
  error,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="md-field" data-invalid={error ? 'true' : 'false'}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder ?? ' '}
          className="md-input peer"
        />
        <label htmlFor={name} className="md-label">
          {label}
          {required && <span className="text-accent"> *</span>}
        </label>
      </div>
      {error && (
        <p className="px-4 pt-1.5 text-xs text-error">{error}</p>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 border-b border-hairline pb-2.5">
      <span className="w-28 shrink-0 text-xs font-medium text-ink-faint">{label}</span>
      <span className="flex-1 break-all text-sm">{value}</span>
      {copyable && (
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="shrink-0 p-0.5 text-ink-faint transition-colors hover:text-ink"
          title="Copy"
        >
          {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

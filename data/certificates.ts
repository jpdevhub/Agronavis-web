/**
 * The certificate register.
 *
 * Kept in the repository on purpose: verification then needs no database and
 * no API, so it cannot be broken by an outage or a sleeping instance, and
 * every issuance is a commit with an author and a date.
 *
 * Issuing one means adding a record below and dropping the certificate image
 * at public/certificates/<id>.png. Everything else on the page is shared.
 */

/** Shared by every certificate. Change once, changes everywhere. */
export const ISSUER = {
  organisation: 'Agronavis',
  tagline: 'Every field in India, advised',
  registration: 'MSME Udyam UDYAM-WB-14-0290868',
  place: 'Kolkata, West Bengal',
  email: 'contact@agronavis.in',
} as const;

export type Certificate = {
  /** The certificate number, printed on the document and used in its URL. */
  id: string;
  name: string;
  /** Internship, Completion, Participation. */
  kind: string;
  role: string;
  /** ISO dates. */
  startedOn: string;
  endedOn: string;
  issuedOn: string;
  /** Set when withdrawn; the page then says so instead of denying the record. */
  revoked?: { on: string; reason: string };
};

export const CERTIFICATES: Certificate[] = [
  {
    id: 'agn-h4kq7m2xnp',
    name: 'Aman Singh',
    kind: 'Internship',
    role: 'Backend Engineer',
    startedOn: '2026-08-12',
    endedOn: '2026-09-25',
    issuedOn: '2026-10-30',
  },
  {
    id: 'agn-9mvxyf9n2a',
    name: 'Amrit Kumar',
    kind: 'Internship',
    role: 'Frontend Developer',
    startedOn: '2026-08-12',
    endedOn: '2026-09-25',
    issuedOn: '2026-10-30',
  },
  {
    id: 'agn-rgxhuxsvtk',
    name: 'Abhishek Kumar',
    kind: 'Internship',
    role: 'Frontend Developer',
    startedOn: '2026-05',
    endedOn: '2026-07',
    issuedOn: '2026-10-30',
  },
  {
    id: 'agn-7xyjnn226z',
    name: 'Niraj Kumar Verma',
    kind: 'Internship',
    role: 'Data Analyst',
    startedOn: '2026-08-12',
    endedOn: '2026-09-25',
    issuedOn: '2026-10-30',
  },
];

/** Strips everything that varies when a human retypes an identifier. */
const squash = (v: string) => v.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

/** Case, spaces and dashes are all ignored: these are retyped off paper. */
export function findCertificate(input: string): Certificate | null {
  const q = squash(input);
  return q ? (CERTIFICATES.find((c) => squash(c.id) === q) ?? null) : null;
}

/**
 * Dates are written at whatever precision the certificate states: YYYY-MM-DD
 * for an exact day, YYYY-MM when the paper only says the month. The page must
 * not claim a precision the document does not, because it tells verifiers the
 * dates have to match the printed copy exactly.
 */
export const formatDate = (iso: string): string =>
  new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    ...(iso.length === 7 ? {} : { day: 'numeric' }),
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** A human span, kept to the precision the dates were given in. */
export function duration(from: string, to: string): string {
  if (from.length === 7 || to.length === 7) {
    const [fy, fm] = from.split('-').map(Number);
    const [ty, tm] = to.split('-').map(Number);
    const months = (ty! - fy!) * 12 + (tm! - fm!) + 1;
    return `${months} month${months === 1 ? '' : 's'}`;
  }
  const days =
    Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;
  if (days < 14) return `${days} days`;
  const weeks = Math.floor(days / 7);
  return weeks >= 8 ? `${Math.round(days / 30.44)} months` : `${weeks} weeks`;
}

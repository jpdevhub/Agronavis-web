/**
 * The certificate register.
 *
 * This is the authoritative record behind every agronavis.in/verify link, kept
 * in the repository on purpose: verification then needs no database and no API,
 * cannot be broken by an outage, and every issuance and revocation is a commit
 * with an author and a date.
 *
 * To issue one, append a record and deploy. Use `npm run cert:new` to mint an
 * identifier that cannot collide with an existing one.
 */

export type Certificate = {
  /** AGN-YYYY-XXXXXX. Never reused, never edited once published. */
  id: string;
  /** The holder's full name, as it should appear. */
  name: string;
  /** What they did. */
  programme: string;
  /** Internship, Completion, Participation. */
  kind: string;
  /** ISO dates, YYYY-MM-DD. */
  issuedOn: string;
  startedOn?: string;
  endedOn?: string;
  /** Optional: a PDF at public/certificates/<id>.pdf */
  hasPdf?: boolean;
  /** Set when withdrawn. The page then says so rather than 404ing. */
  revoked?: { on: string; reason: string };
};

export const CERTIFICATES: Certificate[] = [
  // Nothing issued yet. Add records with `npm run cert:new`.
];

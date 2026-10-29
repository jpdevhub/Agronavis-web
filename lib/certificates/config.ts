/**
 * Certificate system configuration.
 * All production-sensitive values come from environment variables.
 */

/** The canonical production domain used in verification URLs and QR codes. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.agronavis.in';

/** Admin credentials — set via environment, never committed. */
export const ADMIN_USERNAME = process.env.CERT_ADMIN_USERNAME ?? '';
export const ADMIN_PASSWORD_HASH = process.env.CERT_ADMIN_PASSWORD_HASH ?? '';

/** Secret used to sign admin session tokens. */
export const SESSION_SECRET = process.env.CERT_SESSION_SECRET ?? '';

/** Maximum uploaded PDF size in bytes (default 12 MB). */
export const MAX_PDF_BYTES = 12 * 1024 * 1024;

/** Allowed MIME types for certificate uploads. */
export const ALLOWED_MIME_TYPES = ['application/pdf'] as const;

/** Directory where certificate PDFs are stored. */
export const CERT_STORAGE_DIR =
  process.env.CERT_STORAGE_DIR ?? './data/certificates';

/** Directory where the certificate database JSON lives. */
export const CERT_DB_PATH =
  process.env.CERT_DB_PATH ?? './data/certificates.json';

/** Public verification route prefix. */
export const VERIFY_ROUTE = '/verify-certificate';

/** Build the full verification URL for a given certificate ID. */
export function verificationUrl(certificateId: string): string {
  return `${SITE_URL}${VERIFY_ROUTE}/${certificateId}`;
}

/** Issuer constants. */
export const ISSUER = {
  organisation: 'Agronavis',
  signatory: 'Karan Singh',
  signatoryDesignation: 'CEO',
} as const;

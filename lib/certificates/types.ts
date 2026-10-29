/**
 * Certificate data model and types.
 */

/** Certificate verification status. */
export type CertificateStatus = 'draft' | 'active' | 'revoked';

/** The full certificate record stored in the database. */
export interface Certificate {
  /** Internal database record ID (UUID). */
  id: string;

  /** Unique public certificate ID, e.g. AGI-2026-A8F3K2. */
  certificateId: string;

  /** Recipient's full name. */
  recipientName: string;

  /** Certificate type, e.g. "Internship Completion Certificate". */
  certificateType: string;

  /** Internship role or designation. */
  role: string;

  /** Department, domain, or project. */
  department: string;

  /** Internship start date (ISO string YYYY-MM-DD). */
  startDate: string;

  /** Internship completion date (ISO string YYYY-MM-DD). */
  completionDate: string;

  /** Certificate issue date (ISO string YYYY-MM-DD). */
  issueDate: string;

  /** Issuing organisation. */
  issuer: string;

  /** Authorised signatory. */
  signatory: string;

  /** Signatory designation. */
  signatoryDesignation: string;

  /** Filename of the stored PDF (relative to storage dir). */
  pdfFilename: string | null;

  /** SHA-256 hash of the uploaded PDF for integrity verification. */
  pdfHash: string | null;

  /** Whether the PDF has been stamped with the verification footer. */
  pdfStamped: boolean;

  /** Certificate status. */
  status: CertificateStatus;

  /** Record creation timestamp (ISO string). */
  createdAt: string;

  /** Record last updated timestamp (ISO string). */
  updatedAt: string;

  /** Revocation timestamp (ISO string), if applicable. */
  revokedAt: string | null;

  /** Public-safe revocation explanation, if applicable. */
  revocationReason: string | null;
}

/** Data required to create a new certificate. */
export interface CreateCertificateInput {
  recipientName: string;
  certificateType: string;
  role: string;
  department: string;
  startDate: string;
  completionDate: string;
  issueDate: string;
}

/** Data that can be edited on an existing certificate. */
export interface UpdateCertificateInput {
  recipientName?: string;
  certificateType?: string;
  role?: string;
  department?: string;
  startDate?: string;
  completionDate?: string;
  issueDate?: string;
}

/** Public-facing certificate data for the verification page. */
export interface PublicCertificate {
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
  status: CertificateStatus;
  pdfAvailable: boolean;
  revokedAt: string | null;
  revocationReason: string | null;
}

/** Convert a full certificate to its public representation. */
export function toPublicCertificate(cert: Certificate): PublicCertificate {
  return {
    certificateId: cert.certificateId,
    recipientName: cert.recipientName,
    certificateType: cert.certificateType,
    role: cert.role,
    department: cert.department,
    startDate: cert.startDate,
    completionDate: cert.completionDate,
    issueDate: cert.issueDate,
    issuer: cert.issuer,
    signatory: cert.signatory,
    signatoryDesignation: cert.signatoryDesignation,
    status: cert.status,
    pdfAvailable: !!cert.pdfFilename,
    revokedAt: cert.revokedAt,
    revocationReason: cert.revocationReason,
  };
}

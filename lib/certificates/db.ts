/**
 * JSON-file-based certificate database.
 *
 * Production note: this is appropriate for a low-volume certificate system
 * (hundreds to low thousands of records). For higher scale, replace with
 * a proper database (PostgreSQL, MongoDB, etc.) behind the same interface.
 *
 * File locking uses a simple write-lock to prevent concurrent corruption.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CERT_DB_PATH, ISSUER } from './config';
import { generateCertificateId } from './id-generator';
import type {
  Certificate,
  CertificateStatus,
  CreateCertificateInput,
  UpdateCertificateInput,
} from './types';

interface Database {
  certificates: Certificate[];
  version: number;
}

const EMPTY_DB: Database = { certificates: [], version: 1 };

let writeLock: Promise<void> = Promise.resolve();

/** Ensure the directory for the DB file exists. */
async function ensureDir(): Promise<void> {
  const dir = path.dirname(path.resolve(CERT_DB_PATH));
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/** Read the full database from disk. */
async function readDb(): Promise<Database> {
  await ensureDir();
  const filePath = path.resolve(CERT_DB_PATH);
  if (!existsSync(filePath)) {
    await writeFile(filePath, JSON.stringify(EMPTY_DB, null, 2), 'utf-8');
    return { ...EMPTY_DB, certificates: [] };
  }
  const raw = await readFile(filePath, 'utf-8');
  try {
    return JSON.parse(raw) as Database;
  } catch {
    return { ...EMPTY_DB, certificates: [] };
  }
}

/** Write the database back to disk (serialised via lock). */
async function writeDb(db: Database): Promise<void> {
  await ensureDir();
  const filePath = path.resolve(CERT_DB_PATH);
  await writeFile(filePath, JSON.stringify(db, null, 2), 'utf-8');
}

/** Serialise write operations to prevent concurrent corruption. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = writeLock;
  let resolve: () => void;
  writeLock = new Promise<void>((r) => {
    resolve = r;
  });
  return prev.then(fn).finally(() => resolve!());
}

// ─── Public API ──────────────────────────────────────────────────────────

/** Get all certificates (for admin dashboard). */
export async function getAllCertificates(): Promise<Certificate[]> {
  const db = await readDb();
  return db.certificates.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Get a certificate by its internal UUID. */
export async function getCertificateById(
  id: string
): Promise<Certificate | null> {
  const db = await readDb();
  return db.certificates.find((c) => c.id === id) ?? null;
}

/** Get a certificate by its public certificate ID (for verification). */
export async function getCertificateByPublicId(
  certificateId: string
): Promise<Certificate | null> {
  const db = await readDb();
  return db.certificates.find((c) => c.certificateId === certificateId) ?? null;
}

/** Get dashboard statistics. */
export async function getStats(): Promise<{
  total: number;
  active: number;
  revoked: number;
  drafts: number;
  recent: Certificate[];
}> {
  const db = await readDb();
  const certs = db.certificates;
  return {
    total: certs.length,
    active: certs.filter((c) => c.status === 'active').length,
    revoked: certs.filter((c) => c.status === 'revoked').length,
    drafts: certs.filter((c) => c.status === 'draft').length,
    recent: certs
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10),
  };
}

/** Create a new certificate (initially as draft). */
export async function createCertificate(
  input: CreateCertificateInput
): Promise<Certificate> {
  return withLock(async () => {
    const db = await readDb();
    const now = new Date().toISOString();

    // Generate unique certificate ID with collision handling
    let certificateId: string;
    let attempts = 0;
    do {
      certificateId = generateCertificateId();
      attempts++;
      if (attempts > 100) {
        throw new Error(
          'Failed to generate a unique certificate ID after 100 attempts'
        );
      }
    } while (db.certificates.some((c) => c.certificateId === certificateId));

    const cert: Certificate = {
      id: uuidv4(),
      certificateId,
      recipientName: input.recipientName.trim(),
      certificateType: input.certificateType.trim(),
      role: input.role.trim(),
      department: input.department.trim(),
      startDate: input.startDate,
      completionDate: input.completionDate,
      issueDate: input.issueDate,
      issuer: ISSUER.organisation,
      signatory: ISSUER.signatory,
      signatoryDesignation: ISSUER.signatoryDesignation,
      pdfFilename: null,
      pdfHash: null,
      pdfStamped: false,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      revokedAt: null,
      revocationReason: null,
    };

    db.certificates.push(cert);
    await writeDb(db);
    return cert;
  });
}

/** Update editable fields on a certificate. */
export async function updateCertificate(
  id: string,
  input: UpdateCertificateInput
): Promise<Certificate | null> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const cert = db.certificates[idx];
    if (input.recipientName !== undefined)
      cert.recipientName = input.recipientName.trim();
    if (input.certificateType !== undefined)
      cert.certificateType = input.certificateType.trim();
    if (input.role !== undefined) cert.role = input.role.trim();
    if (input.department !== undefined)
      cert.department = input.department.trim();
    if (input.startDate !== undefined) cert.startDate = input.startDate;
    if (input.completionDate !== undefined)
      cert.completionDate = input.completionDate;
    if (input.issueDate !== undefined) cert.issueDate = input.issueDate;
    cert.updatedAt = new Date().toISOString();

    db.certificates[idx] = cert;
    await writeDb(db);
    return cert;
  });
}

/** Set the PDF reference on a certificate. */
export async function setCertificatePdf(
  id: string,
  pdfFilename: string,
  pdfHash: string,
  stamped: boolean
): Promise<Certificate | null> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    db.certificates[idx].pdfFilename = pdfFilename;
    db.certificates[idx].pdfHash = pdfHash;
    db.certificates[idx].pdfStamped = stamped;
    db.certificates[idx].updatedAt = new Date().toISOString();
    await writeDb(db);
    return db.certificates[idx];
  });
}

/** Publish a certificate (draft → active). */
export async function publishCertificate(
  id: string
): Promise<Certificate | null> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const cert = db.certificates[idx];
    if (cert.status !== 'draft') {
      throw new Error(`Cannot publish a certificate with status "${cert.status}"`);
    }
    if (!cert.pdfFilename) {
      throw new Error('Cannot publish a certificate without a PDF');
    }

    cert.status = 'active';
    cert.updatedAt = new Date().toISOString();
    db.certificates[idx] = cert;
    await writeDb(db);
    return cert;
  });
}

/** Revoke a certificate (active → revoked). */
export async function revokeCertificate(
  id: string,
  reason: string
): Promise<Certificate | null> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const cert = db.certificates[idx];
    if (cert.status !== 'active') {
      throw new Error(`Cannot revoke a certificate with status "${cert.status}"`);
    }

    const now = new Date().toISOString();
    cert.status = 'revoked';
    cert.revokedAt = now;
    cert.revocationReason = reason.trim() || null;
    cert.updatedAt = now;
    db.certificates[idx] = cert;
    await writeDb(db);
    return cert;
  });
}

/** Delete a draft certificate. Only drafts can be deleted. */
export async function deleteCertificate(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    if (db.certificates[idx].status !== 'draft') {
      throw new Error('Only draft certificates can be deleted');
    }

    db.certificates.splice(idx, 1);
    await writeDb(db);
    return true;
  });
}

/** Search/filter certificates. */
export async function searchCertificates(query: {
  search?: string;
  status?: CertificateStatus;
}): Promise<Certificate[]> {
  const db = await readDb();
  let results = db.certificates;

  if (query.status) {
    results = results.filter((c) => c.status === query.status);
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    results = results.filter(
      (c) =>
        c.certificateId.toLowerCase().includes(s) ||
        c.recipientName.toLowerCase().includes(s) ||
        c.role.toLowerCase().includes(s) ||
        c.department.toLowerCase().includes(s)
    );
  }

  return results.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

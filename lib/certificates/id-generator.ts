/**
 * Certificate ID generation.
 *
 * Format: AGI-YYYY-XXXXXX
 *   AGI    = Agronavis Internship
 *   YYYY   = Four-digit year
 *   XXXXXX = Six-character alphanumeric random component (uppercase, no ambiguous chars)
 *
 * The random component uses crypto.getRandomValues for security.
 * Uniqueness is enforced at the database level; this module handles generation
 * and collision retry.
 */

import { randomBytes } from 'crypto';

/**
 * Characters used in the random component.
 * Excludes ambiguous characters: 0/O, 1/I/L to avoid confusion in printed certificates.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const RANDOM_LENGTH = 6;

/** Generate a single random certificate ID. */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const bytes = randomBytes(RANDOM_LENGTH);
  let random = '';
  for (let i = 0; i < RANDOM_LENGTH; i++) {
    random += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `AGI-${year}-${random}`;
}

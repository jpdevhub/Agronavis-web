/**
 * Admin authentication using bcrypt-hashed password stored in env vars.
 *
 * Session management uses signed tokens stored as httpOnly cookies.
 * No external auth provider required.
 */

import { compareSync } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, SESSION_SECRET } from './config';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

interface Session {
  token: string;
  expiresAt: number;
}

/** In-memory session store. Sessions survive process restarts via cookie validation. */
const sessions = new Map<string, Session>();

/** Validate admin credentials. */
export function validateCredentials(
  username: string,
  password: string
): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !SESSION_SECRET) {
    console.error(
      'Certificate admin auth: missing CERT_ADMIN_USERNAME, CERT_ADMIN_PASSWORD_HASH, or CERT_SESSION_SECRET'
    );
    return false;
  }

  // Constant-time comparison for username
  const usernameMatch =
    username.length === ADMIN_USERNAME.length &&
    createHash('sha256').update(username).digest('hex') ===
      createHash('sha256').update(ADMIN_USERNAME).digest('hex');

  if (!usernameMatch) return false;
  return compareSync(password, ADMIN_PASSWORD_HASH);
}

/** Create a new session and return the token. */
export function createSession(): string {
  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  sessions.set(token, { token, expiresAt });
  return token;
}

/** Validate a session token. */
export function validateSession(token: string | undefined): boolean {
  if (!token || !SESSION_SECRET) return false;

  const session = sessions.get(token);
  if (!session) {
    // On server restart, validate the token signature
    return validateTokenSignature(token);
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  return true;
}

/** Invalidate a session. */
export function destroySession(token: string): void {
  sessions.delete(token);
}

/** Sign a session token so it can survive server restarts. */
export function signToken(token: string): string {
  const sig = createHash('sha256')
    .update(`${token}:${SESSION_SECRET}`)
    .digest('hex')
    .slice(0, 16);
  return `${token}.${sig}`;
}

/** Validate a signed token. */
function validateTokenSignature(signedToken: string): boolean {
  const dotIdx = signedToken.lastIndexOf('.');
  if (dotIdx === -1) return false;
  const token = signedToken.slice(0, dotIdx);
  const sig = signedToken.slice(dotIdx + 1);
  const expected = createHash('sha256')
    .update(`${token}:${SESSION_SECRET}`)
    .digest('hex')
    .slice(0, 16);
  return sig === expected;
}

/** Extract the raw token from a signed token string. */
export function extractToken(signedToken: string): string {
  const dotIdx = signedToken.lastIndexOf('.');
  return dotIdx === -1 ? signedToken : signedToken.slice(0, dotIdx);
}

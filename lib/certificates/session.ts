/**
 * Server-side authentication guard for API routes.
 * Validates the session cookie on every admin request.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { validateSession, signToken, extractToken } from './auth';

const COOKIE_NAME = 'cert_session';

/** Check if the current request is authenticated. Returns true if valid. */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validateSession(token);
}

/** Return a 401 response if not authenticated. */
export async function requireAuth(): Promise<NextResponse | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  return null;
}

/** Set the session cookie after login. */
export async function setSessionCookie(rawToken: string): Promise<void> {
  const signed = signToken(rawToken);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours
  });
}

/** Clear the session cookie on logout. */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Get the raw token from the session cookie. */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return extractToken(token);
}

export { COOKIE_NAME };

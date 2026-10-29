/**
 * POST /api/admin/logout
 * Destroy session and clear cookie.
 */

import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/certificates/auth';
import {
  clearSessionCookie,
  getSessionToken,
} from '@/lib/certificates/session';

export async function POST() {
  try {
    const token = await getSessionToken();
    if (token) {
      destroySession(token);
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/login
 * Authenticate admin and set session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSession } from '@/lib/certificates/auth';
import { setSessionCookie } from '@/lib/certificates/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createSession();
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

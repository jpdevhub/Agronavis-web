/**
 * GET /api/admin/session
 * Check if the current session is valid.
 */

import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/certificates/session';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

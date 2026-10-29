/**
 * POST /api/admin/certificates/[id]/revoke
 * Revoke an active certificate.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import { revokeCertificate } from '@/lib/certificates/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { reason?: string };

    const cert = await revokeCertificate(id, body.reason ?? '');
    if (!cert) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ certificate: cert });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to revoke';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

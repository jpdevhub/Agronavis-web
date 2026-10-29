/**
 * POST /api/admin/certificates/[id]/publish
 * Publish a draft certificate (draft → active).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import { publishCertificate } from '@/lib/certificates/db';
import { verificationUrl } from '@/lib/certificates/config';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const cert = await publishCertificate(id);
    if (!cert) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      certificate: {
        ...cert,
        verificationUrl: verificationUrl(cert.certificateId),
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to publish';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

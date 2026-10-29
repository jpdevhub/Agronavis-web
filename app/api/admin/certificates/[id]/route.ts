/**
 * GET    /api/admin/certificates/[id]  — Get a single certificate
 * PATCH  /api/admin/certificates/[id]  — Update certificate metadata
 * DELETE /api/admin/certificates/[id]  — Delete a draft certificate
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import {
  getCertificateById,
  updateCertificate,
  deleteCertificate,
} from '@/lib/certificates/db';
import { verificationUrl } from '@/lib/certificates/config';
import { generateQrCodeDataUrl } from '@/lib/certificates/pdf';
import type { UpdateCertificateInput } from '@/lib/certificates/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const cert = await getCertificateById(id);
    if (!cert) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    const qrCodeDataUrl = await generateQrCodeDataUrl(cert.certificateId);

    return NextResponse.json({
      certificate: {
        ...cert,
        verificationUrl: verificationUrl(cert.certificateId),
        qrCodeDataUrl,
      },
    });
  } catch (err) {
    console.error('Failed to get certificate:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve certificate' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateCertificateInput;

    const cert = await updateCertificate(id, body);
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
    console.error('Failed to update certificate:', err);
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const deleted = await deleteCertificate(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Certificate not found or not deletable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

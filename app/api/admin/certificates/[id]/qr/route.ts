/**
 * GET /api/admin/certificates/[id]/qr
 * Download the QR code as a PNG image.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import { getCertificateById } from '@/lib/certificates/db';
import { generateQrCodeBuffer } from '@/lib/certificates/pdf';

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

    const pngBuffer = await generateQrCodeBuffer(cert.certificateId);

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${cert.certificateId}-qr.png"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

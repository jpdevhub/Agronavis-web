/**
 * GET /api/admin/certificates/[id]/pdf
 * Download the stored certificate PDF.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import { getCertificateById } from '@/lib/certificates/db';
import { readPdf } from '@/lib/certificates/pdf';

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
    if (!cert || !cert.pdfFilename) {
      return NextResponse.json(
        { error: 'Certificate or PDF not found' },
        { status: 404 }
      );
    }

    const pdfBuffer = await readPdf(cert.pdfFilename);
    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'PDF file not found in storage' },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cert.certificateId}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Failed to download PDF:', err);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}

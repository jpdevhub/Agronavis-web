/**
 * GET /api/verify/[certificateId]/pdf
 * Serve the certificate PDF for public viewing (active certificates only).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCertificateByPublicId } from '@/lib/certificates/db';
import { readPdf } from '@/lib/certificates/pdf';

type RouteContext = { params: Promise<{ certificateId: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { certificateId } = await context.params;

    if (!/^[A-Z0-9-]+$/i.test(certificateId)) {
      return NextResponse.json(
        { error: 'Invalid certificate ID' },
        { status: 404 }
      );
    }

    const cert = await getCertificateByPublicId(
      certificateId.toUpperCase()
    );

    if (!cert || cert.status === 'draft' || !cert.pdfFilename) {
      return NextResponse.json(
        { error: 'Certificate PDF not available' },
        { status: 404 }
      );
    }

    const pdfBuffer = await readPdf(cert.pdfFilename);
    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Certificate document unavailable' },
        { status: 404 }
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${cert.certificateId}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Failed to serve certificate PDF:', err);
    return NextResponse.json(
      { error: 'Failed to load certificate document' },
      { status: 500 }
    );
  }
}

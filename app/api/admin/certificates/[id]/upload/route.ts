/**
 * POST /api/admin/certificates/[id]/upload
 * Upload a PDF and stamp it with verification footer + QR code.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import { getCertificateById, setCertificatePdf } from '@/lib/certificates/db';
import {
  computeHash,
  savePdf,
  stampPdfWithVerification,
} from '@/lib/certificates/pdf';
import { MAX_PDF_BYTES } from '@/lib/certificates/config';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
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

    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        {
          error: `File is too large. Maximum size is ${MAX_PDF_BYTES / 1024 / 1024} MB`,
        },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate PDF magic bytes (%PDF-)
    const magic = buffer.slice(0, 5).toString('ascii');
    if (!magic.startsWith('%PDF')) {
      return NextResponse.json(
        { error: 'File does not appear to be a valid PDF' },
        { status: 400 }
      );
    }

    // Stamp the PDF with verification footer and QR code
    let stampedBuffer: Buffer;
    let stamped = false;
    try {
      stampedBuffer = await stampPdfWithVerification(
        buffer,
        cert.certificateId
      );
      stamped = true;
    } catch (stampErr) {
      console.warn(
        'PDF stamping failed, saving original:',
        stampErr
      );
      stampedBuffer = buffer;
      stamped = false;
    }

    // Save the PDF
    const filename = `${cert.certificateId}.pdf`;
    await savePdf(filename, stampedBuffer);

    // Compute hash for integrity verification
    const hash = computeHash(stampedBuffer);

    // Update certificate record
    const updated = await setCertificatePdf(id, filename, hash, stamped);

    return NextResponse.json({
      certificate: updated,
      stamped,
      message: stamped
        ? 'PDF uploaded and stamped with verification footer'
        : 'PDF uploaded (stamping was not possible; original saved)',
    });
  } catch (err) {
    console.error('Failed to upload PDF:', err);
    return NextResponse.json(
      { error: 'Failed to upload PDF' },
      { status: 500 }
    );
  }
}

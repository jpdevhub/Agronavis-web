/**
 * GET  /api/admin/certificates       — List all / search certificates
 * POST /api/admin/certificates       — Create a new certificate
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/certificates/session';
import {
  createCertificate,
  searchCertificates,
  getStats,
} from '@/lib/certificates/db';
import type { CertificateStatus, CreateCertificateInput } from '@/lib/certificates/types';
import { verificationUrl } from '@/lib/certificates/config';
import { generateQrCodeDataUrl } from '@/lib/certificates/pdf';

export async function GET(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? undefined;
    const status = (searchParams.get('status') as CertificateStatus) ?? undefined;
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      const stats = await getStats();
      return NextResponse.json(stats);
    }

    const certificates = await searchCertificates({ search, status });

    // Enrich with verification URLs
    const enriched = certificates.map((cert) => ({
      ...cert,
      verificationUrl: verificationUrl(cert.certificateId),
    }));

    return NextResponse.json({ certificates: enriched });
  } catch (err) {
    console.error('Failed to list certificates:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve certificates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as CreateCertificateInput;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!body.recipientName?.trim())
      errors.recipientName = 'Recipient name is required';
    if (!body.certificateType?.trim())
      errors.certificateType = 'Certificate type is required';
    if (!body.role?.trim()) errors.role = 'Role is required';
    if (!body.department?.trim()) errors.department = 'Department is required';
    if (!body.startDate) errors.startDate = 'Start date is required';
    if (!body.completionDate)
      errors.completionDate = 'Completion date is required';
    if (!body.issueDate) errors.issueDate = 'Issue date is required';

    // Date validation
    if (body.startDate && body.completionDate) {
      if (new Date(body.completionDate) < new Date(body.startDate)) {
        errors.completionDate =
          'Completion date must be after start date';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', fields: errors },
        { status: 400 }
      );
    }

    const cert = await createCertificate(body);
    const qrCodeDataUrl = await generateQrCodeDataUrl(cert.certificateId);

    return NextResponse.json(
      {
        certificate: {
          ...cert,
          verificationUrl: verificationUrl(cert.certificateId),
          qrCodeDataUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Failed to create certificate:', err);
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    );
  }
}

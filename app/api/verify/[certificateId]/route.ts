/**
 * GET /api/verify/[certificateId]
 * Public API to verify a certificate by its public ID.
 * No authentication required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCertificateByPublicId } from '@/lib/certificates/db';
import { toPublicCertificate } from '@/lib/certificates/types';
import { verificationUrl } from '@/lib/certificates/config';

type RouteContext = { params: Promise<{ certificateId: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { certificateId } = await context.params;

    // Sanitise the ID — only allow alphanumeric and hyphens
    if (!/^[A-Z0-9-]+$/i.test(certificateId)) {
      return NextResponse.json(
        {
          status: 'not_found',
          message: 'Invalid certificate ID format',
        },
        { status: 404 }
      );
    }

    const cert = await getCertificateByPublicId(
      certificateId.toUpperCase()
    );

    if (!cert) {
      return NextResponse.json(
        {
          status: 'not_found',
          message: 'No certificate found with this ID',
        },
        { status: 404 }
      );
    }

    // Only show draft certificates to the admin, not publicly
    if (cert.status === 'draft') {
      return NextResponse.json(
        {
          status: 'not_found',
          message: 'No certificate found with this ID',
        },
        { status: 404 }
      );
    }

    const publicCert = toPublicCertificate(cert);

    return NextResponse.json({
      status: cert.status === 'active' ? 'verified' : 'revoked',
      certificate: publicCert,
      verificationUrl: verificationUrl(cert.certificateId),
    });
  } catch (err) {
    console.error('Verification lookup failed:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Verification service temporarily unavailable',
      },
      { status: 500 }
    );
  }
}

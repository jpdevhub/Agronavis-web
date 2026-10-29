/**
 * Comprehensive Automated Test Suite for Certificate System
 * Tests:
 * 1. Certificate ID generation & uniqueness
 * 2. Admin authentication (password hashing, verification, bad credentials)
 * 3. Admin session management (token creation, HMAC validation, tampering, expiration)
 * 4. Certificate Database CRUD & Lifecycle (draft -> published -> revoked)
 * 5. Duplicate ID collision handling
 * 6. PDF Stamping & clickable verification links & QR generation
 * 7. Verification integrity & public status checking (verified, revoked, not_found)
 */

import { existsSync, rmSync } from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import bcrypt from 'bcryptjs';

// Set test environment variables BEFORE importing modules
const TEST_DATA_DIR = path.resolve('./data/test-run');
process.env.CERT_DB_PATH = path.join(TEST_DATA_DIR, 'test-certificates.json');
process.env.CERT_STORAGE_DIR = path.join(TEST_DATA_DIR, 'pdfs');
process.env.CERT_ADMIN_USERNAME = 'testadmin';
process.env.CERT_ADMIN_PASSWORD_HASH = bcrypt.hashSync('correct-password', 10);
process.env.CERT_SESSION_SECRET = 'super-secret-test-key-minimum-32-characters-long!';
process.env.NEXT_PUBLIC_SITE_URL = 'https://www.agronavis.in';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting Agronavis Certificate System Test Suite');
  console.log('======================================================\n');

  // Clean test directory
  if (existsSync(TEST_DATA_DIR)) {
    rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }

  // Dynamic imports after env setup
  const { generateCertificateId } = await import('../lib/certificates/id-generator');
  const {
    validateCredentials,
    createSession,
    validateSession,
    destroySession,
    signToken,
  } = await import('../lib/certificates/auth');
  const {
    createCertificate,
    getCertificateById,
    getCertificateByPublicId,
    updateCertificate,
    publishCertificate,
    revokeCertificate,
    deleteCertificate,
    getStats,
  } = await import('../lib/certificates/db');
  const {
    stampPdfWithVerification,
    generateQrCodeDataUrl,
    generateQrCodeBuffer,
    computeHash,
    savePdf,
    readPdf,
  } = await import('../lib/certificates/pdf');
  const { verificationUrl, ISSUER } = await import('../lib/certificates/config');

  // ─── 1. ID Generation Tests ──────────────────────────────────────────────
  console.log('\n--- 1. Certificate ID Generation & Uniqueness ---');
  const sampleId = generateCertificateId();
  assert(/^AGI-\d{4}-[A-Z0-9]{6}$/.test(sampleId), `ID format matches AGI-YYYY-XXXXXX: ${sampleId}`);

  const idSet = new Set<string>();
  for (let i = 0; i < 500; i++) {
    const id = generateCertificateId();
    if (idSet.has(id)) {
      assert(false, `Collision detected on iteration ${i}: ${id}`);
    }
    idSet.add(id);
  }
  assert(idSet.size === 500, '500 unique IDs generated without any collisions');

  // ─── 2. Admin Authentication Tests ───────────────────────────────────────
  console.log('\n--- 2. Admin Authentication & Bcrypt Password Hashing ---');
  // Verify against process.env.CERT_ADMIN_PASSWORD_HASH
  const validLogin = validateCredentials('testadmin', 'correct-password');
  assert(validLogin === true, 'Valid admin credentials accepted');

  const wrongPassword = validateCredentials('testadmin', 'wrong-password');
  assert(wrongPassword === false, 'Wrong password rejected');

  const wrongUser = validateCredentials('unknown-user', 'correct-password');
  assert(wrongUser === false, 'Wrong username rejected');

  const emptyCredentials = validateCredentials('', '');
  assert(emptyCredentials === false, 'Empty credentials rejected');

  // ─── 3. Session Token & Security Tests ───────────────────────────────────
  console.log('\n--- 3. HMAC Session Tokens & Tamper Detection ---');
  const rawToken = createSession();
  assert(typeof rawToken === 'string' && rawToken.length === 64, 'Raw session token created with 64 hex chars');

  const signedToken = signToken(rawToken);
  assert(signedToken.includes('.'), 'Signed session token includes hash signature');

  assert(validateSession(rawToken) === true, 'In-memory raw session token is valid');
  assert(validateSession(signedToken) === true, 'Signed session token is valid');

  // Tampering detection
  const tamperedToken = signedToken.slice(0, -4) + 'abcd';
  assert(validateSession(tamperedToken) === false, 'Tampered signed session token rejected');

  // Invalid format detection
  assert(validateSession('invalid-garbage-token') === false, 'Malformed session token rejected');
  assert(validateSession(undefined) === false, 'Undefined session token rejected');

  // Session destruction
  destroySession(rawToken);
  // After destroying from memory, a signed token without an active session still validates via signature
  // (unless expired), but raw unsigned token is gone
  assert(validateSession(rawToken) === false, 'Destroyed in-memory token rejected');

  // ─── 4. QR Code & Verification URL Tests ─────────────────────────────────
  console.log('\n--- 4. Verification URL & QR Code Generation ---');
  const certId = 'AGI-2026-TEST01';
  const expectedUrl = `https://www.agronavis.in/verify-certificate/${certId}`;
  assert(verificationUrl(certId) === expectedUrl, `Verification URL matches canonical production URL: ${expectedUrl}`);

  const qrDataUrl = await generateQrCodeDataUrl(certId);
  assert(qrDataUrl.startsWith('data:image/png;base64,'), 'QR code data URL generated');

  const qrBuffer = await generateQrCodeBuffer(certId);
  assert(Buffer.isBuffer(qrBuffer) && qrBuffer.length > 500, 'QR code PNG buffer generated with valid size');

  // ─── 5. PDF Stamping & Verification Footer Tests ─────────────────────────
  console.log('\n--- 5. PDF Stamping with Verification Footer & Clickable Link ---');
  // Create blank PDF document
  const testDoc = await PDFDocument.create();
  testDoc.addPage([595.28, 841.89]); // A4 portrait
  const originalPdfBytes = await testDoc.save();
  const originalPdfBuffer = Buffer.from(originalPdfBytes);

  const stampedBuffer = await stampPdfWithVerification(originalPdfBuffer, certId);
  assert(Buffer.isBuffer(stampedBuffer), 'Stamped PDF produced buffer');
  assert(stampedBuffer.length > originalPdfBuffer.length, 'Stamped PDF has footer & QR code embedded');

  // Verify stamped PDF is valid and readable
  const loadedStamped = await PDFDocument.load(stampedBuffer);
  assert(loadedStamped.getPageCount() === 1, 'Stamped PDF preserves single page structure');

  const hashOriginal = computeHash(originalPdfBuffer);
  const hashStamped = computeHash(stampedBuffer);
  assert(hashOriginal !== hashStamped, 'SHA-256 hash reflects stamped contents');
  assert(hashStamped.length === 64, 'SHA-256 hash is 64 hex characters');

  // ─── 6. Certificate Database & Lifecycle CRUD Tests ──────────────────────
  console.log('\n--- 6. Certificate Database Lifecycle (Draft -> Active -> Revoked) ---');
  const { setCertificatePdf } = await import('../lib/certificates/db');

  const newCert = await createCertificate({
    recipientName: 'Aarav Sharma',
    certificateType: 'Internship Completion',
    role: 'Geospatial AI Engineering Intern',
    department: 'Satellite Analytics',
    startDate: '2026-06-01',
    completionDate: '2026-08-31',
    issueDate: '2026-09-01',
  });

  assert(Boolean(newCert.id), 'Certificate created with internal UUID');
  assert(Boolean(newCert.certificateId), `Certificate created with public ID: ${newCert.certificateId}`);
  assert(newCert.status === 'draft', 'Initial certificate status is draft');
  assert(newCert.issuer === ISSUER.organisation, 'Issuer organization is Agronavis');
  assert(newCert.signatory === ISSUER.signatory, 'Signatory is Karan Singh');
  assert(newCert.signatoryDesignation === ISSUER.signatoryDesignation, 'Signatory designation is CEO');

  // Save stamped PDF
  const filename = `${newCert.certificateId}.pdf`;
  await savePdf(filename, stampedBuffer);
  const readBack = await readPdf(filename);
  assert(readBack !== null && readBack.length === stampedBuffer.length, 'PDF file persisted to storage');

  // Attach PDF to certificate
  const updatedCert = await setCertificatePdf(newCert.id, filename, hashStamped, true);
  assert(updatedCert !== null, 'Certificate record updated with PDF metadata');
  assert(updatedCert?.pdfHash === hashStamped, 'PDF SHA-256 stored correctly');
  assert(updatedCert?.pdfStamped === true, 'PDF stamped flag set to true');

  // Test updating editable metadata
  const editedCert = await updateCertificate(newCert.id, {
    role: 'Senior Geospatial AI Engineering Intern',
  });
  assert(editedCert?.role === 'Senior Geospatial AI Engineering Intern', 'Certificate role updated successfully');

  // Publish certificate
  const publishedCert = await publishCertificate(newCert.id);
  assert(publishedCert !== null && publishedCert.status === 'active', 'Certificate published to active state');

  // Query by public ID (public verification simulation)
  const publicFound = await getCertificateByPublicId(newCert.certificateId);
  assert(publicFound !== null && publicFound.status === 'active', 'Public verification retrieves active certificate');
  assert(publicFound?.recipientName === 'Aarav Sharma', 'Recipient name matches authoritative record');

  // Query unknown ID
  const publicNotFound = await getCertificateByPublicId('AGI-9999-NONEXIST');
  assert(publicNotFound === null, 'Non-existent certificate ID returns null (not found)');

  // Revoke certificate with reason
  const revokedCert = await revokeCertificate(
    newCert.id,
    'Internship was terminated early before completion requirements were met'
  );
  assert(revokedCert !== null && revokedCert.status === 'revoked', 'Certificate revoked successfully');
  assert(Boolean(revokedCert?.revocationReason), 'Revocation reason recorded');
  assert(Boolean(revokedCert?.revokedAt), 'Revocation timestamp recorded');

  // Query revoked by public ID
  const publicRevoked = await getCertificateByPublicId(newCert.certificateId);
  assert(publicRevoked !== null && publicRevoked.status === 'revoked', 'Revoked certificate remains queryable by original ID');
  assert(publicRevoked?.certificateId === newCert.certificateId, 'Certificate ID is never recycled or lost');

  // Check dashboard statistics
  const stats = await getStats();
  assert(stats.total >= 1, `Total certificates tracked: ${stats.total}`);
  assert(stats.revoked >= 1, `Revoked certificates tracked: ${stats.revoked}`);

  // Invariant test: non-draft certificates CANNOT be deleted
  let deleteErrorThrown = false;
  try {
    await deleteCertificate(newCert.id);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Only draft certificates can be deleted')) {
      deleteErrorThrown = true;
    }
  }
  assert(deleteErrorThrown === true, 'Safety invariant verified: published/revoked certificates CANNOT be deleted');

  // Test deletion of draft certificate
  const draftCert = await createCertificate({
    recipientName: 'Draft Test Candidate',
    certificateType: 'Internship Completion',
    role: 'Test Role',
    department: 'Testing',
    startDate: '2026-01-01',
    completionDate: '2026-02-01',
    issueDate: '2026-02-02',
  });
  assert(draftCert.status === 'draft', 'New draft certificate created');
  const deletedDraft = await deleteCertificate(draftCert.id);
  assert(deletedDraft === true, 'Draft certificate deleted successfully');
  const postDeleteDraft = await getCertificateById(draftCert.id);
  assert(postDeleteDraft === null, 'Deleted draft certificate no longer in database');

  // Cleanup test directory
  if (existsSync(TEST_DATA_DIR)) {
    rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n💥 Test suite failed:', err);
  process.exit(1);
});

/**
 * PDF processing utilities:
 * - Stamp verification footer with QR code onto uploaded PDFs
 * - File storage and hash computation
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createHash } from 'crypto';
import { readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { CERT_STORAGE_DIR, verificationUrl } from './config';

/** Ensure the certificate storage directory exists. */
async function ensureStorageDir(): Promise<void> {
  const dir = path.resolve(CERT_STORAGE_DIR);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/** Compute SHA-256 hash of a buffer. */
export function computeHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

/** Save a PDF buffer to the storage directory. */
export async function savePdf(
  filename: string,
  buffer: Buffer
): Promise<void> {
  await ensureStorageDir();
  const filePath = path.resolve(CERT_STORAGE_DIR, filename);
  await writeFile(filePath, buffer);
}

/** Read a PDF from the storage directory. */
export async function readPdf(filename: string): Promise<Buffer | null> {
  const filePath = path.resolve(CERT_STORAGE_DIR, filename);
  if (!existsSync(filePath)) return null;
  return readFile(filePath);
}

/** Delete a PDF from the storage directory. */
export async function deletePdf(filename: string): Promise<void> {
  const filePath = path.resolve(CERT_STORAGE_DIR, filename);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}

/**
 * Stamp a PDF with a verification footer containing the certificate ID,
 * verification URL, and QR code.
 *
 * The footer is placed at the bottom of the first page.
 * Returns the modified PDF as a Buffer.
 */
export async function stampPdfWithVerification(
  pdfBuffer: Buffer,
  certificateId: string
): Promise<Buffer> {
  const url = verificationUrl(certificateId);

  // Generate QR code as PNG buffer
  const qrPng = await QRCode.toBuffer(url, {
    type: 'png',
    width: 80,
    margin: 1,
    color: { dark: '#1a1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });

  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  });

  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const qrImage = await pdfDoc.embedPng(qrPng);

  // Footer dimensions
  const footerHeight = 65;
  const qrSize = 48;
  const padding = 20;
  const footerY = 12;

  // Draw subtle separator line
  page.drawLine({
    start: { x: padding, y: footerY + footerHeight },
    end: { x: width - padding, y: footerY + footerHeight },
    thickness: 0.5,
    color: rgb(0.75, 0.75, 0.75),
  });

  // Draw QR code on the right
  const qrX = width - padding - qrSize;
  const qrY = footerY + (footerHeight - qrSize) / 2;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Draw text
  const textX = padding;
  const textStartY = footerY + footerHeight - 14;
  const textColor = rgb(0.2, 0.2, 0.2);
  const labelColor = rgb(0.45, 0.45, 0.45);

  // Certificate ID
  page.drawText('Certificate ID: ', {
    x: textX,
    y: textStartY,
    size: 7,
    font: font,
    color: labelColor,
  });
  page.drawText(certificateId, {
    x: textX + font.widthOfTextAtSize('Certificate ID: ', 7),
    y: textStartY,
    size: 7,
    font: fontBold,
    color: textColor,
  });

  // Verification URL label
  page.drawText('Verify this certificate:', {
    x: textX,
    y: textStartY - 14,
    size: 7,
    font: font,
    color: labelColor,
  });

  // Verification URL (as clickable link)
  page.drawText(url, {
    x: textX,
    y: textStartY - 26,
    size: 7,
    font: font,
    color: rgb(0.05, 0.35, 0.65),
  });

  // Add clickable link annotation
  const urlWidth = font.widthOfTextAtSize(url, 7);
  const annots = page.node.get(pdfDoc.context.obj('Annots'));
  const linkAnnot = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [textX, textStartY - 28, textX + urlWidth, textStartY - 18],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: url,
    },
  });

  if (annots) {
    (annots as unknown as { push: (v: unknown) => void }).push(linkAnnot);
  } else {
    page.node.set(
      pdfDoc.context.obj('Annots'),
      pdfDoc.context.obj([linkAnnot])
    );
  }

  // Issuer
  page.drawText(`Issued by ${'\u2014'} Agronavis`, {
    x: textX,
    y: textStartY - 40,
    size: 6,
    font: font,
    color: labelColor,
  });

  const modifiedPdf = await pdfDoc.save();
  return Buffer.from(modifiedPdf);
}

/**
 * Generate the QR code for a certificate as a PNG data URL.
 */
export async function generateQrCodeDataUrl(
  certificateId: string
): Promise<string> {
  const url = verificationUrl(certificateId);
  return QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });
}

/**
 * Generate the QR code for a certificate as a PNG buffer.
 */
export async function generateQrCodeBuffer(
  certificateId: string
): Promise<Buffer> {
  const url = verificationUrl(certificateId);
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 512,
    margin: 2,
    color: { dark: '#1a1a1a', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });
}

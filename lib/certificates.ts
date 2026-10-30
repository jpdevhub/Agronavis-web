import { CERTIFICATES, type Certificate } from '@/data/certificates';

export type { Certificate };

/** Printed on certificates, so it has to survive being read off paper. */
const ID_PATTERN = /^AGN-\d{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;

export const isValidIdFormat = (id: string) => ID_PATTERN.test(normaliseId(id));

/** Accepts what someone actually types: spaces, lowercase, missing dashes. */
export function normaliseId(input: string): string {
  const bare = input.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (bare.length !== 13 || !bare.startsWith('AGN')) return input.trim().toUpperCase();
  return `AGN-${bare.slice(3, 7)}-${bare.slice(7)}`;
}

export function findCertificate(id: string): Certificate | null {
  const wanted = normaliseId(id);
  return CERTIFICATES.find((c) => c.id === wanted) ?? null;
}

export const allCertificateIds = () => CERTIFICATES.map((c) => c.id);

export const certificateUrl = (id: string) => `/verify/${id}`;

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

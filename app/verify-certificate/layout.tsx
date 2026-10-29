import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Certificate',
  description:
    'Verify the authenticity of an Agronavis internship certificate using its unique certificate ID.',
};

export default function VerifyCertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

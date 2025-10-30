import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Literature Review System - FHE Awards Platform',
  description: 'Confidential Literary Awards Platform with Fully Homomorphic Encryption',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

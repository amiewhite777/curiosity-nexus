import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Curiosity Nexus',
  description: 'A simulation engine exploring the dynamics of curiosity through chaos, entropy, and emergence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

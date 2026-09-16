import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PULSE — Student Academic Operating System',
  description: 'Evidence-driven academic operations for JEE and NEET.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

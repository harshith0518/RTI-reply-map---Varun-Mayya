import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RTI Reply Map — Understand related RTI replies',
  description:
    'An independent, synthetic hackathon prototype that maps original RTI questions to exact reply passages and related registration branches.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}

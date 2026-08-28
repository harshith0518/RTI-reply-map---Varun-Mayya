import type { Metadata } from 'next';
import './globals.css';
import './workspace.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rti-reply-map.harshith794.chatgpt.site'),
  title: 'RTI Reply Map — Turn RTI records into a case tree',
  description:
    'A no-login, local-first prototype that turns RTI registrations, replies, and appeals into a dependency tree and evidence-linked Reply Map.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RTI Reply Map',
    description: 'Turn scattered RTI records into one dependency tree and evidence-linked Reply Map.',
    url: '/',
    siteName: 'RTI Reply Map',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og.png', alt: 'RTI Reply Map — understand related RTI records in one clear map' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTI Reply Map',
    description: 'Turn scattered RTI records into one dependency tree and evidence-linked Reply Map.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}

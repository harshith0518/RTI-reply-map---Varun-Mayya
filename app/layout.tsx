import type { Metadata } from 'next';
import './globals.css';
import './workspace.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rti-reply-map.harshith794.chatgpt.site'),
  title: 'RTI Reply Map — One case, every branch and next step',
  description:
    'A no-login citizen-side redesign that connects RTI registrations and replies, checks every question, and prepares the relevant next step.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RTI Reply Map',
    description: 'Connect every RTI branch, question, reply and next step in one citizen view.',
    url: '/',
    siteName: 'RTI Reply Map',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og.png', alt: 'RTI Reply Map — understand related RTI records in one clear map' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTI Reply Map',
    description: 'Connect every RTI branch, question, reply and next step in one citizen view.',
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

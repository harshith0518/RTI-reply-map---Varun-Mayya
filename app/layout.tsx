import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rti-reply-map.harshith794.chatgpt.site'),
  title: 'RTI Reply Map — Understand related RTI replies',
  description:
    'An independent, synthetic hackathon prototype that maps original RTI questions to exact reply passages and related registration branches.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RTI Reply Map',
    description: 'One request. Three replies. One clear, evidence-linked map.',
    url: '/',
    siteName: 'RTI Reply Map',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og.png', alt: 'RTI Reply Map — one request, three replies, one clear map' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTI Reply Map',
    description: 'One request. Three replies. One clear, evidence-linked map.',
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

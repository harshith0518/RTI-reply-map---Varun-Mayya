import type { Metadata } from 'next';
import './globals.css';
import './workspace.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rti-reply-map.harshith794.chatgpt.site'),
  title: 'RTI Reply Navigator — Making RTI smooth as butter',
  description:
    'One request. Every branch. Every reply. A no-login citizen view for following an RTI case and preparing the next step.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RTI Reply Navigator — Making RTI smooth as butter',
    description: 'One request. Every branch. Every reply.',
    url: '/',
    siteName: 'RTI Reply Navigator',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/og.png', alt: 'RTI Reply Navigator — one request, every branch, every reply' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTI Reply Navigator — Making RTI smooth as butter',
    description: 'One request. Every branch. Every reply.',
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

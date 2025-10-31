import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - AI Chat & Romance Story Generator',
  description: 'Discover powerful AI features: intelligent romantic chat, interactive storytelling, character dialogue, custom spice levels, and AI-generated visuals. Premium romance experiences await.',
  keywords: ['AI chat features', 'romance story features', 'interactive storytelling', 'AI conversation', 'romance generator features', 'AI image generation'],
  openGraph: {
    title: 'Features - AI Chat & Romance Story Generator | RomanceCanvas',
    description: 'Discover powerful AI features: intelligent romantic chat, interactive storytelling, and AI-generated visuals.',
    url: 'https://romancecanvas.com/features',
    siteName: 'RomanceCanvas',
    images: [
      {
        url: 'https://romancecanvas.com/og-features.png',
        width: 1200,
        height: 630,
        alt: 'RomanceCanvas Features',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - AI Chat & Romance Story Generator | RomanceCanvas',
    description: 'Discover powerful AI features for romance and chat',
    images: ['https://romancecanvas.com/twitter-features.png'],
  },
  alternates: {
    canonical: 'https://romancecanvas.com/features',
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

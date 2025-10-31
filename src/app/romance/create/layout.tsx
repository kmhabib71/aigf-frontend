import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Romance Story - Interactive AI Storytelling | RomanceCanvas',
  description: 'Create your own interactive romance story with AI-powered storytelling. Choose characters, make decisions, and experience personalized romantic adventures. Begin your journey now!',
  keywords: ['create romance story', 'AI story generator', 'interactive romance', 'custom romance story', 'AI storytelling', 'romantic fiction creator', 'choose your adventure romance'],
  openGraph: {
    title: 'Create Your Romance Story - RomanceCanvas',
    description: 'Create your own interactive romance story with AI-powered storytelling and custom characters.',
    url: 'https://romancecanvas.com/romance/create',
    siteName: 'RomanceCanvas',
    images: [
      {
        url: 'https://romancecanvas.com/og-create.jpg',
        width: 1200,
        height: 630,
        alt: 'RomanceCanvas - Create Your Romance Story',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Romance Story - RomanceCanvas',
    description: 'Create your own interactive romance story with AI-powered storytelling',
    images: ['https://romancecanvas.com/twitter-create.jpg'],
  },
  alternates: {
    canonical: 'https://romancecanvas.com/romance/create',
  },
};

export default function RomanceCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

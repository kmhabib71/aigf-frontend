import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Romantic Chat - Flirty Conversations & Image Generation | RomanceCanvas',
  description: 'Experience immersive AI romantic conversations with custom personas, flirty dialogue, and AI-generated images. Chat naturally with intelligent romantic AI partners. Start free today!',
  keywords: ['AI romantic chat', 'romantic chatbot', 'AI girlfriend chat', 'flirty AI', 'romantic AI conversation', 'AI chat with images', 'custom persona chat'],
  openGraph: {
    title: 'AI Romantic Chat - RomanceCanvas',
    description: 'Experience immersive AI romantic conversations with custom personas and AI-generated images.',
    url: 'https://romancecanvas.com/chat',
    siteName: 'RomanceCanvas',
    images: [
      {
        url: 'https://romancecanvas.com/og-chat.png',
        width: 1200,
        height: 630,
        alt: 'RomanceCanvas - AI Romantic Chat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Romantic Chat - RomanceCanvas',
    description: 'Experience immersive AI romantic conversations with custom personas',
    images: ['https://romancecanvas.com/twitter-chat.png'],
  },
  alternates: {
    canonical: 'https://romancecanvas.com/chat',
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

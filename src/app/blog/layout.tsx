import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Romance Writing Tips & AI Storytelling',
  description: 'Explore guides on romance writing, AI storytelling tips, interactive fiction creation, and relationship advice. Learn how to craft compelling romantic narratives.',
  keywords: ['romance writing tips', 'AI storytelling guide', 'interactive fiction', 'romance writing advice', 'creative writing', 'AI romance tips'],
  openGraph: {
    title: 'Blog - Romance Writing Tips & AI Storytelling | RomanceCanvas',
    description: 'Explore guides on romance writing, AI storytelling, and interactive fiction creation.',
    url: 'https://romancecanvas.com/blog',
    siteName: 'RomanceCanvas',
    images: [
      {
        url: 'https://romancecanvas.com/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'RomanceCanvas Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Romance Writing Tips & AI Storytelling | RomanceCanvas',
    description: 'Explore guides on romance writing and AI storytelling',
    images: ['https://romancecanvas.com/twitter-blog.png'],
  },
  alternates: {
    canonical: 'https://romancecanvas.com/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

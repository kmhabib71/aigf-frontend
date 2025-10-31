import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Ultimate Guide to Writing Romance Stories with AI',
  description: 'Discover proven techniques to craft compelling romance narratives using AI. Learn about character development, plot structures, and emotional arcs that captivate readers. Expert tips for romance writers.',
  keywords: ['romance writing guide', 'AI romance writing', 'how to write romance', 'romance story tips', 'character development', 'romance plot structure', 'AI storytelling'],
  authors: [{ name: 'RomanceCanvas Team' }],
  openGraph: {
    title: 'The Ultimate Guide to Writing Romance Stories with AI | RomanceCanvas',
    description: 'Discover proven techniques to craft compelling romance narratives using AI. Expert character development and plot structure tips.',
    url: 'https://romancecanvas.com/blog/ultimate-guide-writing-romance-stories',
    siteName: 'RomanceCanvas',
    images: [
      {
        url: 'https://romancecanvas.com/blog/romance-writing-guide.jpg',
        width: 1200,
        height: 630,
        alt: 'Ultimate Guide to Writing Romance Stories',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: '2024-12-15T00:00:00.000Z',
    authors: ['RomanceCanvas Team'],
    tags: ['romance writing', 'AI tools', 'storytelling', 'beginner guide'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ultimate Guide to Writing Romance Stories with AI',
    description: 'Discover proven techniques to craft compelling romance narratives using AI',
    images: ['https://romancecanvas.com/blog/romance-writing-guide.jpg'],
  },
  alternates: {
    canonical: 'https://romancecanvas.com/blog/ultimate-guide-writing-romance-stories',
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Article Schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Ultimate Guide to Writing Romance Stories with AI',
    description: 'Discover proven techniques to craft compelling romance narratives using AI. Learn about character development, plot structures, and emotional arcs that captivate readers.',
    image: 'https://romancecanvas.com/blog/romance-writing-guide.jpg',
    author: {
      '@type': 'Organization',
      name: 'RomanceCanvas Team',
      url: 'https://romancecanvas.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RomanceCanvas',
      logo: {
        '@type': 'ImageObject',
        url: 'https://romancecanvas.com/logo.png',
      },
    },
    datePublished: '2024-12-15T00:00:00.000Z',
    dateModified: '2024-12-15T00:00:00.000Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://romancecanvas.com/blog/ultimate-guide-writing-romance-stories',
    },
    keywords: ['romance writing', 'AI tools', 'storytelling', 'character development', 'plot structure'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}

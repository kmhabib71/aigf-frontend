import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

// Helper function to truncate text for descriptions
function truncateText(text: string, maxLength: number = 155): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

// Helper function to extract first scene content for preview
function getStoryPreview(story: any): string {
  if (story.scenes && story.scenes.length > 0) {
    const firstScene = story.scenes[0];
    return truncateText(firstScene.content || '', 155);
  }
  return truncateText(story.prompt || '', 155);
}

// Fetch story data for metadata generation
async function fetchStoryData(id: string) {
  try {
    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/romance/story/${id}`, {
      cache: 'no-store', // Always fetch fresh data for metadata
    });

    if (!response.ok) {
      return null;
    }

    const story = await response.json();
    return story;
  } catch (error) {
    console.error('Error fetching story for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await fetchStoryData(id);

  // Handle story not found or private
  if (!story) {
    return {
      title: 'Story Not Found | RomanceCanvas',
      description: 'The story you are looking for could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Check if story is public
  const isPublic = story.visibility === 'public';

  // Private stories should not be indexed
  if (!isPublic) {
    return {
      title: `${story.title} | RomanceCanvas`,
      description: 'Private romance story on RomanceCanvas',
      robots: {
        index: false,
        follow: false,
        noarchive: true,
      },
    };
  }

  // Generate description from story content
  const description = getStoryPreview(story);

  // Get character names for richer metadata
  const characterNames = story.metadata?.characters
    ?.map((char: any) => char.name)
    .filter(Boolean)
    .join(', ') || '';

  // Generate keywords from tropes and metadata
  const keywords = [
    'interactive romance story',
    'AI romance',
    story.title,
    ...(story.metadata?.tropes || []),
    ...characterNames.split(', ').filter(Boolean),
    'romance fiction',
    'love story',
  ];

  // Get cover image or first scene image
  const storyImage = story.scenes?.[0]?.sceneImageUrl ||
                     story.scenes?.[0]?.visualMoments?.[0]?.imageUrl ||
                     'https://romancecanvas.com/og-story-default.png';

  return {
    title: `${story.title} - Interactive Romance Story`,
    description: description || `Experience ${story.title}, an immersive AI-powered interactive romance story. ${characterNames ? `Follow ${characterNames} ` : ''}Make choices that shape your romantic journey.`,
    keywords: keywords,
    authors: [{ name: story.userId || 'RomanceCanvas Author' }],
    openGraph: {
      title: `${story.title} | RomanceCanvas`,
      description: description || `An interactive romance story featuring ${characterNames || 'unforgettable characters'}`,
      url: `https://romancecanvas.com/romance/story/${id}`,
      siteName: 'RomanceCanvas',
      images: [
        {
          url: storyImage,
          width: 1200,
          height: 630,
          alt: `${story.title} - Romance Story Cover`,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: story.createdAt,
      modifiedTime: story.updatedAt || story.createdAt,
      authors: ['RomanceCanvas Community'],
      tags: story.metadata?.tropes || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${story.title} | RomanceCanvas`,
      description: description,
      images: [storyImage],
    },
    alternates: {
      canonical: `https://romancecanvas.com/romance/story/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Schema markup is added client-side via StorySchema component
  // in the page.tsx file for better performance

  return <>{children}</>;
}

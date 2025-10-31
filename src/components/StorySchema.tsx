'use client';

import { useEffect } from 'react';

interface StorySchemaProps {
  story: {
    _id: string;
    title: string;
    prompt?: string;
    scenes?: Array<{
      content: string;
      sceneImageUrl?: string;
      visualMoments?: Array<{
        imageUrl: string;
      }>;
    }>;
    metadata?: {
      tropes?: string[];
      characters?: Array<{
        name: string;
      }>;
      heartScore?: number;
    };
    createdAt: string;
    updatedAt?: string;
    visibility?: string;
  };
}

export default function StorySchema({ story }: StorySchemaProps) {
  useEffect(() => {
    // Only add schema for public stories
    if (story.visibility !== 'public') {
      return;
    }

    // Get first scene content for description
    const description = story.scenes && story.scenes.length > 0
      ? story.scenes[0].content.slice(0, 200) + '...'
      : story.prompt?.slice(0, 200) + '...' || '';

    // Get story image
    const storyImage = story.scenes?.[0]?.sceneImageUrl ||
                       story.scenes?.[0]?.visualMoments?.[0]?.imageUrl ||
                       'https://romancecanvas.com/og-story-default.jpg';

    // Create Article schema
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `https://romancecanvas.com/romance/story/${story._id}`,
      headline: story.title,
      description: description,
      image: storyImage,
      datePublished: story.createdAt,
      dateModified: story.updatedAt || story.createdAt,
      author: {
        '@type': 'Organization',
        name: 'RomanceCanvas Community',
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
      genre: ['Romance', 'Interactive Fiction', ...(story.metadata?.tropes || [])],
      keywords: [
        'interactive romance',
        'AI story',
        story.title,
        ...(story.metadata?.tropes || []),
      ].join(', '),
      interactionStatistic: story.metadata?.heartScore ? {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: story.metadata.heartScore,
      } : undefined,
      character: story.metadata?.characters?.map(char => ({
        '@type': 'Person',
        name: char.name,
      })) || [],
      inLanguage: 'en-US',
      isFamilyFriendly: true,
    };

    // Remove undefined values
    Object.keys(articleSchema).forEach(key => {
      if (articleSchema[key as keyof typeof articleSchema] === undefined) {
        delete articleSchema[key as keyof typeof articleSchema];
      }
    });

    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    script.id = 'story-schema';

    // Add to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('story-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [story]);

  return null; // This component doesn't render anything
}

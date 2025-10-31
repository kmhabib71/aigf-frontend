'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassEffect from '@/components/GlassEffect';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export default function BlogPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { id: 'all', label: 'All Posts', icon: '📚' },
    { id: 'writing-tips', label: 'Writing Tips', icon: '✍️' },
    { id: 'ai-storytelling', label: 'AI Storytelling', icon: '🤖' },
    { id: 'romance-guides', label: 'Romance Guides', icon: '💕' },
    { id: 'tutorials', label: 'Tutorials', icon: '🎓' },
  ];

  // Sample blog posts - these would come from a CMS or markdown files
  const blogPosts: BlogPost[] = [
    {
      slug: 'ultimate-guide-writing-romance-stories',
      title: 'The Ultimate Guide to Writing Romance Stories with AI',
      excerpt: 'Discover proven techniques to craft compelling romance narratives using AI. Learn about character development, plot structures, and emotional arcs that captivate readers.',
      author: 'RomanceCanvas Team',
      date: '2024-12-15',
      readTime: '8 min read',
      category: 'writing-tips',
      image: '/blog/romance-writing-guide.jpg',
      tags: ['romance writing', 'AI tools', 'storytelling', 'beginner guide'],
    },
    {
      slug: '10-best-ai-story-generators-2024',
      title: '10 Best AI Story Generators in 2024: Complete Comparison',
      excerpt: 'Compare the top AI story generators available today. We analyze features, pricing, output quality, and specializations to help you find the perfect tool.',
      author: 'Sarah Mitchell',
      date: '2024-12-10',
      readTime: '12 min read',
      category: 'ai-storytelling',
      image: '/blog/ai-generators-comparison.jpg',
      tags: ['AI tools', 'comparison', 'story generators', 'review'],
    },
    {
      slug: 'create-interactive-fiction-beginners',
      title: 'How to Create Interactive Fiction: A Beginner\'s Guide',
      excerpt: 'Step-by-step tutorial on creating engaging interactive fiction. Learn about branching narratives, choice design, and player engagement techniques.',
      author: 'Alex Chen',
      date: '2024-12-05',
      readTime: '10 min read',
      category: 'tutorials',
      image: '/blog/interactive-fiction-guide.jpg',
      tags: ['interactive fiction', 'tutorial', 'game design', 'storytelling'],
    },
    {
      slug: 'romance-writing-prompts-generator',
      title: '50+ Romance Writing Prompts to Spark Your Creativity',
      excerpt: 'Get inspired with our curated collection of romance writing prompts. From meet-cutes to dramatic conflicts, find the perfect starting point for your story.',
      author: 'Emma Rodriguez',
      date: '2024-11-28',
      readTime: '6 min read',
      category: 'writing-tips',
      image: '/blog/writing-prompts.jpg',
      tags: ['writing prompts', 'creativity', 'inspiration', 'romance'],
    },
    {
      slug: 'ai-romance-chat-guide',
      title: 'AI Romance Chat: Everything You Need to Know in 2024',
      excerpt: 'Explore the world of AI romantic companions. Learn about technology, ethics, features, and how to get the most out of romantic AI chat experiences.',
      author: 'Dr. James Park',
      date: '2024-11-20',
      readTime: '15 min read',
      category: 'ai-storytelling',
      image: '/blog/ai-romance-chat.jpg',
      tags: ['AI chat', 'romance AI', 'technology', 'guide'],
    },
    {
      slug: 'character-development-romance-novels',
      title: 'Mastering Character Development in Romance Novels',
      excerpt: 'Create memorable, three-dimensional characters that readers fall in love with. Expert tips on personality, backstory, and character arcs.',
      author: 'Victoria Barnes',
      date: '2024-11-15',
      readTime: '9 min read',
      category: 'romance-guides',
      image: '/blog/character-development.jpg',
      tags: ['character development', 'romance writing', 'techniques', 'craft'],
    },
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50"
      style={{
        backgroundImage: 'url("/image.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 animate-float-slow"
          style={{
            background:
              'radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.2) 50%, transparent 100%)',
            top: '-20%',
            right: '-10%',
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-20 animate-float-slow animation-delay-2000"
          style={{
            background:
              'radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.2) 50%, transparent 100%)',
            bottom: '-15%',
            left: '-10%',
          }}
        />
      </div>

      {/* Mouse Glow */}
      <div
        className="hidden lg:block fixed w-[400px] h-[400px] rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(251, 207, 232, 0.1) 0%, transparent 70%)',
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Romance & AI Storytelling Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Expert guides, tips, and insights on romance writing, AI storytelling, and interactive fiction
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <GlassEffect
                className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                borderRadius="1.5rem"
                intensity={{
                  blur: 4,
                  saturation: 120,
                  brightness: 115,
                  displacement: 50,
                }}
                backgroundOpacity={25}
              >
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                    {categories.find(c => c.id === post.category)?.icon || '📝'}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-purple-600">
                      {categories.find(c => c.id === post.category)?.label}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </GlassEffect>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <GlassEffect
            className="max-w-3xl mx-auto p-12"
            borderRadius="2rem"
            intensity={{
              blur: 4,
              saturation: 120,
              brightness: 115,
              displacement: 50,
            }}
            backgroundOpacity={30}
          >
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Ready to Create Your Own Romance?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Start crafting AI-powered interactive romance stories or chat with romantic AI companions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/romance/create"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Create Story
              </Link>
              <Link
                href="/chat"
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-purple-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border-2 border-purple-200"
              >
                Start Chatting
              </Link>
            </div>
          </GlassEffect>
        </div>
      </main>

      <Footer />

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.05);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

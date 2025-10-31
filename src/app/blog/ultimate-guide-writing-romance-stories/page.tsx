'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassEffect from '@/components/GlassEffect';

export default function BlogPostPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Background Effects */}
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
      </div>

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

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-purple-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-purple-600">Blog</Link></li>
            <li>/</li>
            <li className="text-purple-600 font-semibold">The Ultimate Guide to Writing Romance Stories</li>
          </ol>
        </nav>

        <GlassEffect
          className="overflow-hidden"
          borderRadius="2rem"
          intensity={{
            blur: 4,
            saturation: 120,
            brightness: 115,
            displacement: 50,
          }}
          backgroundOpacity={30}
        >
          <article className="p-8 md:p-12">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold">
                  Writing Tips
                </span>
                <span className="text-gray-600">8 min read</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                The Ultimate Guide to Writing Romance Stories with AI
              </h1>

              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span className="font-semibold">By RomanceCanvas Team</span>
                <span>•</span>
                <time dateTime="2024-12-15">December 15, 2024</time>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed">
                Discover proven techniques to craft compelling romance narratives using AI. Learn about character development, plot structures, and emotional arcs that captivate readers.
              </p>
            </header>

            {/* Featured Image Placeholder */}
            <div className="mb-12 rounded-2xl overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
                <div className="text-8xl opacity-50">💕</div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why AI is Revolutionizing Romance Writing</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Artificial Intelligence has opened up new possibilities for romance writers. Whether you're a seasoned author or just starting your creative journey, AI tools like RomanceCanvas can help you craft more engaging, emotionally resonant stories in less time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                The key is understanding how to leverage AI as a collaborative partner rather than a replacement for your creativity. Let's explore the essential elements of crafting unforgettable romance stories.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. Creating Compelling Characters</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Great romance stories begin with characters readers can fall in love with. Here's how to develop protagonists that resonate:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
                <li><strong>Give them depth:</strong> Your characters should have flaws, dreams, fears, and unique quirks that make them feel real.</li>
                <li><strong>Create chemistry:</strong> The attraction between your protagonists should feel natural and inevitable, built on genuine connection.</li>
                <li><strong>Develop backstories:</strong> Past experiences shape who we are. Give your characters meaningful histories that inform their present actions.</li>
                <li><strong>Show growth:</strong> Romance is about transformation. Your characters should evolve through their relationship.</li>
              </ul>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-8 rounded-r-lg">
                <p className="text-gray-800 italic">
                  <strong>Pro Tip:</strong> Use AI to brainstorm character traits and backstories, but add your own unique touches to make them truly memorable. The best characters blend AI suggestions with your creative vision.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">2. Mastering Plot Structure</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Every great romance follows a structure that keeps readers engaged from the first page to the last. Here are the essential plot points:
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Meet-Cute</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Your protagonists' first meeting sets the tone for their entire relationship. Whether it's a chance encounter, a disastrous first impression, or instant attraction, make it memorable and relevant to your story's themes.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Building Tension</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                The heart of romance is the push-and-pull between desire and obstacles. Create meaningful conflicts—both internal and external—that test your characters' feelings and commitment.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Dark Moment</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Every romance needs a crisis point where all seems lost. This is where your characters' growth is tested and they must decide what they truly want.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">The Resolution</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Romance readers expect a satisfying conclusion. Deliver an ending that feels earned and emotionally fulfilling.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3. Crafting Emotional Depth</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The best romance stories make readers feel. Here's how to create emotional resonance:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
                <li>Show vulnerability in your characters</li>
                <li>Use sensory details to immerse readers in intimate moments</li>
                <li>Balance dialogue and internal thoughts to reveal emotions</li>
                <li>Create stakes that matter personally to your characters</li>
                <li>Don't shy away from difficult emotions—conflict creates growth</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">4. Using AI Effectively for Romance Writing</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                AI tools like RomanceCanvas can supercharge your writing process when used strategically:
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl my-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Best Practices:</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <strong>Brainstorming:</strong> Generate multiple plot ideas, character concepts, or scene variations
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <strong>Dialogue polish:</strong> Test different conversation styles to find the perfect tone
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎭</span>
                    <div>
                      <strong>Character development:</strong> Explore your characters' motivations and reactions to different scenarios
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <strong>Scene building:</strong> Quickly draft scenes, then refine with your unique voice
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">5. Common Romance Writing Mistakes to Avoid</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Even experienced writers fall into these traps. Here's what to watch out for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-3">
                <li><strong>Insta-love without foundation:</strong> Build believable attraction and connection over time</li>
                <li><strong>Weak conflict resolution:</strong> Conflicts should be resolved through character growth, not convenience</li>
                <li><strong>One-dimensional characters:</strong> Give all your characters depth, not just the leads</li>
                <li><strong>Telling instead of showing:</strong> Let readers experience emotions through actions and dialogue</li>
                <li><strong>Ignoring the ending:</strong> Plan your conclusion early to ensure a satisfying payoff</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">6. Interactive Elements in Modern Romance</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Today's readers crave immersive experiences. Interactive romance stories allow readers to shape the narrative through their choices, creating personalized emotional journeys.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                With platforms like RomanceCanvas, you can create branching storylines where readers decide key moments—from dialogue choices to major plot decisions. This interactivity deepens reader engagement and increases replay value.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Getting Started Today</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The best way to improve your romance writing is to start creating. Don't wait for the perfect idea—begin with what excites you and let the story evolve.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Whether you're writing traditional prose or creating interactive experiences, the fundamentals remain the same: compelling characters, emotional depth, and satisfying resolutions.
              </p>

              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white p-8 rounded-2xl my-12">
                <h3 className="text-2xl font-bold mb-4">Ready to Write Your Romance Story?</h3>
                <p className="mb-6 text-lg">
                  Start creating your AI-powered interactive romance story today with RomanceCanvas. No experience required!
                </p>
                <Link
                  href="/romance/create"
                  className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Create Your Story
                </Link>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About the Author</h3>
                  <p className="text-gray-700">
                    The RomanceCanvas Team consists of writers, AI specialists, and romance enthusiasts dedicated to helping creators craft compelling romantic narratives. We combine traditional storytelling wisdom with cutting-edge AI technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                romance writing
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                AI tools
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                storytelling
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                beginner guide
              </span>
            </div>
          </article>
        </GlassEffect>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/create-interactive-fiction-beginners" className="group">
              <GlassEffect
                className="p-6 hover:shadow-xl transition-all duration-300"
                borderRadius="1.5rem"
                intensity={{
                  blur: 4,
                  saturation: 120,
                  brightness: 115,
                  displacement: 50,
                }}
                backgroundOpacity={25}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  How to Create Interactive Fiction: A Beginner's Guide
                </h3>
                <p className="text-gray-600 text-sm">10 min read</p>
              </GlassEffect>
            </Link>
            <Link href="/blog/character-development-romance-novels" className="group">
              <GlassEffect
                className="p-6 hover:shadow-xl transition-all duration-300"
                borderRadius="1.5rem"
                intensity={{
                  blur: 4,
                  saturation: 120,
                  brightness: 115,
                  displacement: 50,
                }}
                backgroundOpacity={25}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Mastering Character Development in Romance Novels
                </h3>
                <p className="text-gray-600 text-sm">9 min read</p>
              </GlassEffect>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

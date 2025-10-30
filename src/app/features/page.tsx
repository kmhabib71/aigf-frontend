'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassEffect from '@/components/GlassEffect';
import PremiumGlassCard from '@/components/PremiumGlassCard';

export default function FeaturesPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { id: 'all', label: 'All Features', icon: '✨' },
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'story', label: 'Romance Canvas', icon: '💕' },
    { id: 'pro', label: 'Pro Features', icon: '⭐' },
  ];

  const features = [
    {
      id: 1,
      category: 'chat',
      title: 'Intelligent Conversations',
      description: 'Advanced AI that understands context, remembers your history, and adapts to your conversational style.',
      icon: '🧠',
      color: 'from-cyan-500 to-blue-500',
      features: [
        'Context-aware responses',
        'Conversation memory',
        'Persona customization',
        'Real-time streaming',
      ],
      badge: 'Core',
    },
    {
      id: 2,
      category: 'chat',
      title: 'Custom AI Personas',
      description: 'Define your AI companion\'s personality, tone, and expertise. Create the perfect conversational partner.',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Personality customization',
        'Tone adjustment',
        'Expert domains',
        'Save & switch personas',
      ],
      badge: 'Popular',
    },
    {
      id: 3,
      category: 'story',
      title: 'Interactive Romance Stories',
      description: 'Create and experience immersive romance narratives with AI-generated scenes, characters, and choices.',
      icon: '📖',
      color: 'from-pink-500 to-orange-500',
      features: [
        'AI-generated scenes',
        'Character development',
        'Multiple story paths',
        'Visual storytelling',
      ],
      badge: 'Core',
    },
    {
      id: 4,
      category: 'story',
      title: 'Spice Level Control',
      description: 'Tailor your story\'s intensity. From soft and sweet to steamy and passionate - you\'re in control.',
      icon: '🌶️',
      color: 'from-red-500 to-pink-500',
      features: [
        'Soft (💕) mode',
        'Medium (🌶️) mode',
        'Spicy (🔥) mode',
        'Age-appropriate content',
      ],
      badge: 'Unique',
    },
    {
      id: 5,
      category: 'story',
      title: 'Character Chat',
      description: 'Talk directly with your story characters. Deepen relationships and unlock new story branches.',
      icon: '💭',
      color: 'from-purple-500 to-cyan-500',
      features: [
        'In-character dialogue',
        'Relationship building',
        'Story branch unlocking',
        'Character memory',
      ],
      badge: 'Interactive',
    },
    {
      id: 6,
      category: 'story',
      title: 'AI Image Generation',
      description: 'Bring your stories to life with stunning AI-generated visuals for scenes and characters.',
      icon: '🎨',
      color: 'from-orange-500 to-pink-500',
      features: [
        'Scene illustrations',
        'Character portraits',
        'High-quality images',
        'Style customization',
      ],
      badge: 'Pro',
    },
    {
      id: 7,
      category: 'pro',
      title: 'Priority Generation',
      description: 'Skip the queue with priority processing for all your AI requests. Faster responses, better experience.',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Skip wait times',
        'Faster responses',
        'Priority queue',
        'Premium servers',
      ],
      badge: 'Pro',
    },
    {
      id: 8,
      category: 'pro',
      title: 'Enhanced Credits',
      description: 'Get more value with Pro tier. More credits, better rates, and exclusive bonuses.',
      icon: '💎',
      color: 'from-purple-500 to-blue-500',
      features: [
        'More credits per dollar',
        'Monthly bonuses',
        'Rollover credits',
        'Exclusive discounts',
      ],
      badge: 'Pro',
    },
    {
      id: 9,
      category: 'chat',
      title: 'Multi-Modal Input',
      description: 'Share images, files, and rich content in your conversations. AI understands it all.',
      icon: '📎',
      color: 'from-green-500 to-cyan-500',
      features: [
        'Image understanding',
        'File analysis',
        'Rich media support',
        'Context extraction',
      ],
      badge: 'Pro',
    },
    {
      id: 10,
      category: 'story',
      title: 'Story Branching',
      description: 'Experience true non-linear storytelling. Your choices create unique narrative paths.',
      icon: '🌳',
      color: 'from-green-500 to-purple-500',
      features: [
        'Multiple endings',
        'Choice-based paths',
        'Save states',
        'Replay different routes',
      ],
      badge: 'Core',
    },
    {
      id: 11,
      category: 'pro',
      title: 'Advanced Analytics',
      description: 'Track your usage, story stats, and AI insights. Understand your creative journey.',
      icon: '📊',
      color: 'from-blue-500 to-purple-500',
      features: [
        'Usage tracking',
        'Story statistics',
        'Credit history',
        'Engagement metrics',
      ],
      badge: 'Pro',
    },
    {
      id: 12,
      category: 'chat',
      title: 'Conversation Export',
      description: 'Save and export your conversations. Keep your favorite moments forever.',
      icon: '💾',
      color: 'from-cyan-500 to-purple-500',
      features: [
        'Export to PDF',
        'Save conversations',
        'Search history',
        'Favorite moments',
      ],
      badge: 'Plus',
    },
  ];

  const filteredFeatures = activeCategory === 'all'
    ? features
    : features.filter((f) => f.category === activeCategory);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Pro':
        return 'from-yellow-500 to-orange-500';
      case 'Plus':
        return 'from-purple-500 to-pink-500';
      case 'Core':
        return 'from-cyan-500 to-blue-500';
      case 'Popular':
        return 'from-pink-500 to-red-500';
      case 'Interactive':
        return 'from-purple-500 to-cyan-500';
      case 'Unique':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(12, 10, 20, 0.88), rgba(12, 10, 20, 0.95))',
          }}
        />
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(216, 180, 254, 0.5) 0%, rgba(216, 180, 254, 0.2) 30%, transparent 70%)',
            top: '-25%',
            right: '-15%',
            animation: 'float-slow 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(251, 207, 232, 0.5) 0%, rgba(251, 207, 232, 0.2) 30%, transparent 70%)',
            bottom: '-20%',
            left: '-15%',
            animation: 'float-slow 30s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(6, 182, 212, 0.2) 30%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-slow 35s ease-in-out infinite',
          }}
        />

        {/* Mouse glow - desktop only */}
        <div
          className="hidden lg:block absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251, 207, 232, 0.12) 0%, rgba(216, 180, 254, 0.08) 40%, transparent 70%)',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.2s, top 0.2s',
          }}
        />
      </div>

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 text-sm font-bold mb-4 shadow-lg">
              ✨ Premium Features
            </span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] mb-6">
            Powerful Features
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
            Everything you need for intelligent conversations and immersive storytelling.
            <br />
            <span className="text-lg text-purple-300">Built with cutting-edge AI technology.</span>
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 ${
                  activeCategory === cat.id ? 'shadow-[0_0_30px_rgba(216,180,254,0.5)]' : ''
                }`}
              >
                {activeCategory === cat.id ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-white flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-white/70 group-hover:text-white flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-12 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className="group relative"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute -inset-6 rounded-[3rem] blur-3xl transition-opacity duration-500 ${
                    hoveredFeature === feature.id ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                  }}
                />

                <GlassEffect
                  className="h-full p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105"
                  borderRadius="1.5rem"
                  backgroundOpacity={hoveredFeature === feature.id ? 20 : 12}
                  intensity={{
                    blur: hoveredFeature === feature.id ? 15 : 10,
                    saturation: 140,
                    brightness: 90,
                    displacement: hoveredFeature === feature.id ? 65 : 55,
                  }}
                >
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(to right, ${getBadgeColor(feature.badge).split(' ')[0].replace('from-', '')}, ${getBadgeColor(feature.badge).split(' ')[1].replace('to-', '')})`,
                      }}
                    >
                      {feature.badge}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-white mb-3 drop-shadow-lg">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 leading-relaxed mb-6 min-h-[80px]">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                          }}
                        />
                        <span className="text-white/70 group-hover:text-white/90 transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <div
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3"
                    style={{
                      background: `linear-gradient(to right, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Explore
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </GlassEffect>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white drop-shadow-lg mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-white/80 drop-shadow-md">
              Unlock features based on your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <GlassEffect
              className="p-8 rounded-3xl"
              borderRadius="1.5rem"
              backgroundOpacity={15}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-black text-white mb-2">Free</h3>
                <div className="text-4xl font-black text-white mb-2">$0</div>
                <p className="text-white/60 text-sm">Get started</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> 50 free credits
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> Basic chat
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> Simple stories
                </li>
                <li className="flex items-center gap-2 text-white/40">
                  <span className="text-red-400">✗</span> No priority
                </li>
                <li className="flex items-center gap-2 text-white/40">
                  <span className="text-red-400">✗</span> No images
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3 rounded-xl font-bold text-center bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Get Started
              </Link>
            </GlassEffect>

            {/* Plus Tier */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-[3rem] blur-2xl opacity-40" />
              <GlassEffect
                className="relative p-8 rounded-3xl border-2 border-purple-500/50"
                borderRadius="1.5rem"
                backgroundOpacity={20}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                  POPULAR
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-2xl font-black text-white mb-2">Plus</h3>
                  <div className="text-4xl font-black text-white mb-2">$9.99</div>
                  <p className="text-white/60 text-sm">per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="text-green-400">✓</span> 1000 credits/mo
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="text-green-400">✓</span> All features
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="text-green-400">✓</span> Priority queue
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="text-green-400">✓</span> Save conversations
                  </li>
                  <li className="flex items-center gap-2 text-white/80">
                    <span className="text-green-400">✓</span> Advanced stories
                  </li>
                </ul>
                <Link
                  href="/pricing"
                  className="block w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg"
                >
                  Upgrade to Plus
                </Link>
              </GlassEffect>
            </div>

            {/* Pro Tier */}
            <GlassEffect
              className="p-8 rounded-3xl"
              borderRadius="1.5rem"
              backgroundOpacity={15}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-2xl font-black text-white mb-2">Pro</h3>
                <div className="text-4xl font-black text-white mb-2">$19.99</div>
                <p className="text-white/60 text-sm">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> 2500 credits/mo
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> Everything in Plus
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> Highest priority
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> AI image generation
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <span className="text-green-400">✓</span> Advanced analytics
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 transition-all"
              >
                Upgrade to Pro
              </Link>
            </GlassEffect>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-[4rem] blur-3xl opacity-30" />
            <GlassEffect
              className="relative p-12 lg:p-16 rounded-[3rem]"
              borderRadius="3rem"
              backgroundOpacity={25}
              intensity={{
                blur: 16,
                saturation: 150,
                brightness: 95,
                displacement: 70,
              }}
            >
              <div className="text-center">
                <div className="flex justify-center gap-4 text-6xl mb-8">
                  <span className="animate-bounce" style={{ animationDelay: '0s' }}>🚀</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💫</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 drop-shadow-lg">
                  Ready to Experience Premium Features?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  Join thousands of users creating amazing stories and having intelligent conversations.
                  Start your free trial today - no credit card required.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    href="/signup"
                    className="group relative overflow-hidden px-12 py-5 rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-white flex items-center gap-2">
                      Start Free Trial
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="px-12 py-5 rounded-2xl font-bold text-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
                  >
                    Learn How It Works
                  </Link>
                </div>
              </div>
            </GlassEffect>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-30px, 20px) scale(0.95); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

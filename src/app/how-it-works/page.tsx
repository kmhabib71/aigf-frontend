'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassEffect from '@/components/GlassEffect';

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Sign Up & Choose Your Adventure',
      description: 'Create your account in seconds. Pick between AI Chat for intelligent conversations or Romance Canvas for immersive story experiences.',
      icon: '🎭',
      features: ['Instant account creation', 'Free tier to start', 'No credit card required'],
      color: 'from-purple-500 to-pink-500',
      demo: {
        type: 'signup',
        content: 'Get started with 50 free credits'
      }
    },
    {
      number: 2,
      title: 'AI-Powered Chat Experience',
      description: 'Engage with advanced AI that understands context, remembers your conversations, and adapts to your style.',
      icon: '💬',
      features: ['Natural conversations', 'Context awareness', 'Persona customization'],
      color: 'from-cyan-500 to-blue-500',
      demo: {
        type: 'chat',
        content: 'Real-time streaming responses'
      }
    },
    {
      number: 3,
      title: 'Create Your Romance Story',
      description: 'Design your perfect interactive romance. Define characters, set the mood, and watch your story come alive with AI-generated scenes.',
      icon: '💕',
      features: ['Character creation', 'Spice level control', 'Visual storytelling'],
      color: 'from-pink-500 to-orange-500',
      demo: {
        type: 'story',
        content: 'Interactive narrative branching'
      }
    },
    {
      number: 4,
      title: 'Interactive Choices',
      description: 'Every decision matters. Choose from multiple paths, chat with characters, and shape your unique story experience.',
      icon: '🎯',
      features: ['Multiple endings', 'Character dialogue', 'Save & continue'],
      color: 'from-purple-500 to-cyan-500',
      demo: {
        type: 'choices',
        content: 'Your choices, your story'
      }
    },
    {
      number: 5,
      title: 'Upgrade for More',
      description: 'Love the experience? Upgrade to Plus or Pro for more credits, advanced features, and unlimited possibilities.',
      icon: '⭐',
      features: ['More credits', 'Priority generation', 'Exclusive features'],
      color: 'from-orange-500 to-pink-500',
      demo: {
        type: 'upgrade',
        content: 'Unlock premium features'
      }
    }
  ];

  const handleStepClick = (index: number) => {
    setIsAnimating(true);
    setActiveStep(index);
    setTimeout(() => setIsAnimating(false), 300);
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
            background: 'linear-gradient(to bottom, rgba(12, 10, 20, 0.85), rgba(12, 10, 20, 0.92))',
          }}
        />
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(216, 180, 254, 0.2) 30%, transparent 70%)',
            top: '-20%',
            right: '-10%',
            animation: 'float-slow 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(251, 207, 232, 0.2) 30%, transparent 70%)',
            bottom: '-15%',
            left: '-10%',
            animation: 'float-slow 25s ease-in-out infinite reverse',
          }}
        />

        {/* Mouse glow - desktop only */}
        <div
          className="hidden lg:block absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251, 207, 232, 0.15) 0%, rgba(216, 180, 254, 0.1) 30%, transparent 70%)',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.3s, top 0.3s',
          }}
        />
      </div>

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4">
              Interactive Guide
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-6">
            How It Works
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
            Your journey from sign-up to storytelling mastery in 5 simple steps.
            Click on any step to explore the details.
          </p>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:flex items-center justify-between mb-16 relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 -z-10" />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => handleStepClick(index)}
              >
                {/* Step Circle */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                    activeStep === index
                      ? 'scale-110 shadow-[0_0_40px_rgba(216,180,254,0.6)]'
                      : 'scale-100 group-hover:scale-105'
                  }`}
                  style={{
                    background: activeStep === index
                      ? `linear-gradient(to right, ${step.color.split(' ')[0].replace('from-', '')}, ${step.color.split(' ')[1].replace('to-', '')})`
                      : 'rgba(255, 255, 255, 0.1)',
                    border: activeStep === index ? '3px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {step.icon}
                </div>

                {/* Step Number */}
                <div className={`mt-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  activeStep === index ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
                }`}>
                  {step.number}
                </div>

                {/* Step Title */}
                <p className={`mt-2 text-sm font-semibold text-center max-w-[140px] transition-colors ${
                  activeStep === index ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                }`}>
                  {step.title.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden flex flex-col gap-4 mb-12">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                    : 'bg-white/5 border-2 border-white/10'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                    activeStep === index ? 'shadow-[0_0_20px_rgba(216,180,254,0.4)]' : ''
                  }`}
                  style={{
                    background: activeStep === index
                      ? `linear-gradient(to right, ${step.color.split(' ')[0].replace('from-', '')}, ${step.color.split(' ')[1].replace('to-', '')})`
                      : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {step.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      activeStep === index ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
                    }`}>
                      {step.number}
                    </span>
                    <h3 className={`font-bold ${activeStep === index ? 'text-white' : 'text-white/70'}`}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            <GlassEffect
              className="p-8 lg:p-12 rounded-3xl"
              borderRadius="1.5rem"
              backgroundOpacity={15}
              intensity={{
                blur: 12,
                saturation: 140,
                brightness: 90,
                displacement: 60,
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${steps[activeStep].color.split(' ')[0].replace('from-', '')}, ${steps[activeStep].color.split(' ')[1].replace('to-', '')})`,
                      }}
                    >
                      {steps[activeStep].icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-purple-300 mb-1">Step {steps[activeStep].number}</div>
                      <h2 className="text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                        {steps[activeStep].title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-lg text-white/80 leading-relaxed mb-8">
                    {steps[activeStep].description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {steps[activeStep].features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 group"
                        style={{
                          animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${steps[activeStep].color.split(' ')[0].replace('from-', '')}, ${steps[activeStep].color.split(' ')[1].replace('to-', '')})`,
                          }}
                        />
                        <span className="text-white/90 font-medium group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={activeStep === 1 ? '/chat' : activeStep === 2 ? '/romance/create' : '/signup'}
                      className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-center transition-all hover:scale-105"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to right, ${steps[activeStep].color.split(' ')[0].replace('from-', '')}, ${steps[activeStep].color.split(' ')[1].replace('to-', '')})`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: `linear-gradient(to right, ${steps[activeStep].color.split(' ')[0].replace('from-', '').replace('500', '400')}, ${steps[activeStep].color.split(' ')[1].replace('to-', '').replace('500', '400')})`,
                        }}
                      />
                      <span className="relative text-white">
                        {activeStep === 0 ? 'Sign Up Free' : activeStep === 4 ? 'View Pricing' : 'Try It Now'}
                      </span>
                    </Link>

                    {activeStep < 4 && (
                      <button
                        onClick={() => handleStepClick(activeStep + 1)}
                        className="px-8 py-4 rounded-2xl font-bold bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
                      >
                        Next Step →
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Interactive Demo Preview */}
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    {/* Demo Container */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${steps[activeStep].color.split(' ')[0].replace('from-', '').replace('500', '900')}/40, ${steps[activeStep].color.split(' ')[1].replace('to-', '').replace('500', '900')}/40)`,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {/* Demo Content */}
                      <div className="text-center p-8">
                        <div className="text-7xl mb-6 animate-bounce">
                          {steps[activeStep].icon}
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">
                          {steps[activeStep].demo.type.charAt(0).toUpperCase() + steps[activeStep].demo.type.slice(1)} Demo
                        </div>
                        <div className="text-white/80">
                          {steps[activeStep].demo.content}
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div
                      className="absolute top-4 right-4 w-16 h-16 rounded-full blur-2xl"
                      style={{
                        background: `radial-gradient(circle, ${steps[activeStep].color.split(' ')[0].replace('from-', '')}, transparent)`,
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                    <div
                      className="absolute bottom-4 left-4 w-20 h-20 rounded-full blur-3xl"
                      style={{
                        background: `radial-gradient(circle, ${steps[activeStep].color.split(' ')[1].replace('to-', '')}, transparent)`,
                        animation: 'pulse 2.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                </div>
              </div>
            </GlassEffect>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassEffect
            className="p-12 rounded-3xl"
            borderRadius="1.5rem"
            backgroundOpacity={20}
          >
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users creating amazing stories and having intelligent conversations with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group relative overflow-hidden px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-white">Start Free Trial</span>
              </Link>
              <Link
                href="/pricing"
                className="px-10 py-5 rounded-2xl font-bold text-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
          </GlassEffect>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
}

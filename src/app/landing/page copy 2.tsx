"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/Header";

export default function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 rounded-full border-2 border-purple-400 pointer-events-none z-50 mix-blend-difference transition-all duration-150"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900"></div>
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 animate-mesh-1"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            top: "10%",
            left: "10%",
          }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-mesh-2"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            top: "50%",
            right: "10%",
          }}
        ></div>
        <div
          className="absolute w-[550px] h-[550px] rounded-full blur-[120px] opacity-40 animate-mesh-3"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
            bottom: "10%",
            left: "30%",
          }}
        ></div>
      </div>

      {/* Mouse Follow Spotlight */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Header />

      <div className="relative z-30">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20" ref={heroRef}>
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl animate-fade-in-down"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-200">
                    AI-Powered Romance Platform
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl md:text-8xl font-black leading-none animate-fade-in-up">
                  <span className="block text-white mb-2">Create</span>
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                    Infinite
                  </span>
                  <span className="block text-white">Romance</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl animate-fade-in-up animation-delay-200">
                  Where AI meets emotion. Craft interactive stories, engage in
                  intimate conversations, and bring your romantic fantasies to
                  life with cutting-edge technology.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                  <button
                    onClick={() => router.push("/romance/create")}
                    className="group relative px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-transform"
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                      <div className="absolute inset-0 bg-white animate-shimmer"></div>
                    </div>
                    <span className="relative text-white flex items-center gap-2">
                      Start Creating
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="group px-8 py-4 rounded-2xl font-bold text-lg border-2 border-purple-500/30 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:border-purple-400/50 transition-all transform hover:scale-105"
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <span className="flex items-center gap-2">
                      Try Chat Mode
                      <span className="text-pink-400">💬</span>
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-12 pt-8 animate-fade-in-up animation-delay-600">
                  <div>
                    <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      50K+
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Active Users</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      1M+
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Stories Created
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      4.9★
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Rating</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Bento Grid */}
              <div className="relative animate-fade-in-up animation-delay-300">
                <div className="grid grid-cols-2 gap-4">
                  {/* Large Card */}
                  <div className="col-span-2 group">
                    <div
                      className="relative h-80 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl p-8 hover-tilt"
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs text-white font-medium">
                              Live Now
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Interactive Stories
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Create branching narratives with AI-powered characters
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden"
                            >
                              <div
                                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-progress"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small Card 1 */}
                  <div className="group">
                    <div
                      className="relative h-48 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 backdrop-blur-xl p-6 hover-tilt"
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                          🎨
                        </div>
                        <div>
                          <h4 className="text-white font-bold mb-1">
                            AI Visuals
                          </h4>
                          <p className="text-gray-400 text-xs">
                            Generate stunning scenes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small Card 2 */}
                  <div className="group">
                    <div
                      className="relative h-48 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-xl p-6 hover-tilt"
                      onMouseEnter={() => setCursorVariant("hover")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                          🔥
                        </div>
                        <div>
                          <h4 className="text-white font-bold mb-1">
                            Uncensored
                          </h4>
                          <p className="text-gray-400 text-xs">
                            No limits, full freedom
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-2xl opacity-60 animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 blur-2xl opacity-60 animate-float animation-delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-6" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Premium features designed for the ultimate romance experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Real-Time AI",
                  desc: "Instant responses with advanced streaming",
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: "🎭",
                  title: "Character Chat",
                  desc: "Deep conversations with story characters",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: "📚",
                  title: "Branching Stories",
                  desc: "Your choices create unique narratives",
                  gradient: "from-cyan-500 to-blue-500",
                },
                {
                  icon: "🎯",
                  title: "Trope Selection",
                  desc: "Choose from popular romance themes",
                  gradient: "from-pink-500 to-rose-500",
                },
                {
                  icon: "🌊",
                  title: "Immersive Worlds",
                  desc: "Rich, detailed story environments",
                  gradient: "from-cyan-500 to-purple-500",
                },
                {
                  icon: "✨",
                  title: "Smart Memory",
                  desc: "AI remembers every detail of your story",
                  gradient: "from-violet-500 to-purple-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl"
                    style={{
                      background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  ></div>
                  <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover-tilt transition-all duration-500 group-hover:border-white/20">
                    <div
                      className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] border border-white/20 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-2xl p-16 text-center">
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                  Ready to Begin?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Join thousands creating unforgettable stories and connections
                </p>
                <button
                  onClick={() => router.push("/signup")}
                  className="group relative px-12 py-5 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all"
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity">
                    <div className="absolute inset-0 bg-white animate-shimmer"></div>
                  </div>
                  <span className="relative text-white flex items-center gap-3">
                    Get Started Free
                    <svg
                      className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
                <p className="text-sm text-gray-500 mt-6">
                  No credit card required • Unlimited creativity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                💕
              </div>
              <span className="text-xl font-bold text-white">
                RomanceCanvas
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 RomanceCanvas. Crafting infinite romance.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes mesh-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes mesh-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(1.1);
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
          }
        }

        @keyframes mesh-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -30px) scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-mesh-1 {
          animation: mesh-1 20s ease-in-out infinite;
        }

        .animate-mesh-2 {
          animation: mesh-2 25s ease-in-out infinite;
        }

        .animate-mesh-3 {
          animation: mesh-3 30s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .hover-tilt {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .hover-tilt:hover {
          transform: perspective(1000px) rotateX(2deg) rotateY(-2deg)
            translateZ(10px);
        }
      `}</style>
    </div>
  );
}

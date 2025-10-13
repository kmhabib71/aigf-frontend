"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/Header";

export default function LandingPage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{
            background: "linear-gradient(135deg, #E9D5FF 0%, #F3E8FF 100%)",
            top: "10%",
            left: "10%",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{
            background: "linear-gradient(135deg, #BAE6FD 0%, #E0F2FE 100%)",
            top: "40%",
            right: "10%",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{
            background: "linear-gradient(135deg, #FEF08A 0%, #FEF9C3 100%)",
            bottom: "10%",
            left: "30%",
            animationDelay: "4s",
          }}
        ></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-200/50 shadow-lg">
                  <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ AI-Powered Romance Storytelling
                  </p>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent">
                  Create Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Perfect Romance
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Immerse yourself in interactive storytelling or enjoy intimate
                AI conversations. Your imagination, unlimited possibilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/romance/create")}
                  className="group relative overflow-hidden px-8 py-4 rounded-full font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center gap-2">
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
                  className="group px-8 py-4 rounded-full font-semibold bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-purple-200 hover:border-purple-400 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    Try Romantic Chat
                    <span className="text-pink-500">💬</span>
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    10K+
                  </p>
                  <p className="text-sm text-gray-500">Stories Created</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    50K+
                  </p>
                  <p className="text-sm text-gray-500">Happy Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                    4.9★
                  </p>
                  <p className="text-sm text-gray-500">User Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Premium Glass Cards */}
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute -top-8 -left-8 w-64 animate-float animation-delay-1000">
                  <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                        ✍️
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Story Mode
                        </p>
                        <p className="text-xs text-gray-500">
                          Interactive tales
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-progress"></div>
                      </div>
                      <p className="text-xs text-gray-600">Chapter 3 of 5</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-8 -right-8 w-64 animate-float animation-delay-2000">
                  <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-2xl">
                        💕
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Chat Mode
                        </p>
                        <p className="text-xs text-gray-500">
                          Intimate conversations
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-purple-100 rounded-lg"></div>
                      <div className="flex-1 h-8 bg-pink-100 rounded-lg"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">
                        💬
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="relative bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/80 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-purple-200 via-pink-200 to-cyan-200 rounded-3xl flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-cyan-400/20 animate-pulse-slow"></div>
                    <div className="relative text-8xl animate-float">📖</div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          Romance
                        </span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                          Fantasy
                        </span>
                      </div>
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Enchanted Hearts
                    </h3>
                    <p className="text-sm text-gray-600">
                      A tale of magic and romance in a world where dreams come
                      true...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to bring your romantic stories to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative animate-fade-in-up animation-delay-100">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  🎨
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  AI-Generated Visuals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Bring your scenes to life with stunning AI-generated images
                  that perfectly match your narrative vision.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative animate-fade-in-up animation-delay-200">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  🔓
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Uncensored AI
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Express yourself freely with our uncensored AI. Perfect for
                  mature romantic content without limitations.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative animate-fade-in-up animation-delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-violet-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Real-Time Streaming
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience smooth, real-time responses as your story unfolds
                  and conversations flow naturally.
                </p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative animate-fade-in-up animation-delay-400">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  🎭
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Character Chat
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Interact with your story characters in real-time. Deep
                  conversations that shape your narrative.
                </p>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group relative animate-fade-in-up animation-delay-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  📚
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Branching Stories
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your choices matter. Create multiple paths and endings in
                  your interactive romance narratives.
                </p>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="group relative animate-fade-in-up animation-delay-600">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Trope Selection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose from popular romance tropes and customize your story's
                  theme, mood, and intensity level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-[3rem] blur-2xl opacity-20"></div>
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 md:p-16 border border-white/80 shadow-2xl text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                  Ready to Start Your Story?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of romance enthusiasts creating unforgettable
                stories and connections.
              </p>
              <button
                onClick={() => router.push("/signup")}
                className="group relative overflow-hidden px-10 py-5 rounded-full font-bold text-white text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center gap-3">
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
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Start creating in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-purple-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
              <span className="text-xl">💕</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              RomanceCanvas
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Create your perfect romance story with AI
          </p>
          <p className="text-sm text-gray-500">
            © 2025 RomanceCanvas. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 75%;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-progress {
          animation: progress 2s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

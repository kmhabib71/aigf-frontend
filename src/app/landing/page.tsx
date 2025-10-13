"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../lib/auth/authService";
import Header from "../../components/layout/Header";

interface TrendingStory {
  id: string;
  title: string;
  description: string;
  heartScore: number;
  tropes: string[];
  characters: Array<{ name: string; personality: string }>;
  sceneCount: number;
  firstScenePreview: string;
  coverImage: string | null;
}

interface ContinueStory {
  id: string;
  title: string;
  characters: Array<{ name: string; personality: string }>;
  sceneCount: number;
  lastEdited: string;
  coverImage: string | null;
}

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [continueStories, setContinueStories] = useState<ContinueStory[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch trending stories on mount
  useEffect(() => {
    fetchTrendingStories();
  }, []);

  // Fetch user's recent stories if logged in
  useEffect(() => {
    if (user?.uid) {
      fetchContinueStories();
    }
  }, [user]);

  const fetchTrendingStories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/romance/stories/trending?limit=3");
      const data = await response.json();
      if (data.success) {
        setTrendingStories(data.stories);
      }
    } catch (error) {
      console.error("Failed to fetch trending stories:", error);
    }
  };

  const fetchContinueStories = async () => {
    if (!user?.uid) return;
    try {
      const token = await authService.getIdToken();
      if (!token) return;

      const response = await fetch(
        `http://localhost:3001/api/romance/stories/continue/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setContinueStories(data.stories);
      }
    } catch (error) {
      console.error("Failed to fetch continue stories:", error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(216, 180, 254, 0.6) 0%, rgba(233, 213, 255, 0.3) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        ></div>
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-30 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 207, 232, 0.6) 0%, rgba(252, 231, 243, 0.3) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        ></div>
      </div>

      {/* Mouse Follow Glow */}
      <div
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 207, 232, 0.15) 0%, transparent 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <Header />

      <div className="relative z-20">
        {/* ==================== SECTION 1: IMMEDIATE IMMERSION ==================== */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto w-full">
            {/* Centered Badge */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-purple-200/50 shadow-lg shadow-purple-100/50">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Start Instantly — No Signup Required
                </span>
              </div>
            </div>

            {/* Dual Choice Cards */}
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up animation-delay-200">
              {/* CHAT CARD */}
              <div
                onClick={() => router.push("/")}
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/60 shadow-2xl hover:shadow-purple-300/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-5xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      💬
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Romantic Chat
                  </h2>

                  {/* Description */}
                  <p className="text-center text-gray-600 text-lg mb-6">
                    Talk with your AI lover — free 3 messages.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Instant AI responses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Uncensored conversations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Memory across chats</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Start Chatting →
                  </button>

                  {/* Free Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      First 3 messages FREE
                    </span>
                  </div>
                </div>
              </div>

              {/* STORY CARD */}
              <div
                onClick={() => router.push("/romance/create")}
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/60 shadow-2xl hover:shadow-cyan-300/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-5xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      📖
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Create a Story
                  </h2>

                  {/* Description */}
                  <p className="text-center text-gray-600 text-lg mb-6">
                    Build your own romance — free 1 scene.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>AI-generated scenes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Beautiful illustrations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>Chat with characters</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Create Story →
                  </button>

                  {/* Free Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      First scene FREE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: STORY HOOKS ==================== */}
        <section className="py-24 px-6 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            {/* Personal Continuation (Logged-in Users Only) */}
            {user && continueStories.length > 0 && (
              <div className="mb-16 animate-fade-in-up">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">
                    💌 Continue Your Romance
                  </h2>
                  <p className="text-lg text-gray-600">
                    Pick up where you left off
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {continueStories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => router.push(`/romance/story/${story.id}`)}
                      className="group cursor-pointer bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                      {story.coverImage && (
                        <div className="aspect-[16/9] mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {story.title}
                      </h3>
                      {story.characters.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3">
                          Chat with:{" "}
                          <span className="font-semibold text-purple-600">
                            {story.characters[0].name}
                          </span>
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{story.sceneCount} scenes</span>
                        <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition-colors">
                          Resume →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Stories */}
            {trendingStories.length > 0 && (
              <div className="animate-fade-in-up animation-delay-300">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">
                    ✨ Love Lives Here
                  </h2>
                  <p className="text-lg text-gray-600">
                    Trending romance stories from our community
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {trendingStories.map((story, idx) => (
                    <div
                      key={story.id}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="relative h-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                        <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500">
                          {/* Cover Image */}
                          {story.coverImage && (
                            <div className="aspect-[4/3] mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                              <img
                                src={story.coverImage}
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* Tropes */}
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {story.tropes.slice(0, 2).map((trope, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                              >
                                {trope}
                              </span>
                            ))}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>❤️</span>
                              <span>{story.heartScore || 0}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            {story.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {story.description}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(`/romance/story/${story.id}`)
                              }
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                              Read Story
                            </button>
                            {story.characters.length > 0 && (
                              <button
                                onClick={() =>
                                  router.push(`/romance/story/${story.id}?chat=${story.characters[0].name}`)
                                }
                                className="px-4 py-2 bg-white border-2 border-purple-300 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                                title={`Chat with ${story.characters[0].name}`}
                              >
                                💬
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================== SECTION 3: EMOTIONAL CONVERSION ==================== */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 rounded-[3rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/60 shadow-2xl text-center">
                {/* Animated Hearts */}
                <div className="mb-6 flex justify-center gap-4">
                  <span className="text-5xl animate-bounce">💕</span>
                  <span
                    className="text-5xl animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ✨
                  </span>
                  <span
                    className="text-5xl animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    💫
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-5xl font-black text-gray-900 mb-4">
                  Every love story deserves to be finished
                </h2>

                {/* Subtext */}
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Start for free. Continue with signup. Unlock unlimited romance
                  with Pro.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => router.push("/signup")}
                    className="group relative px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl hover:shadow-purple-400/60 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative text-white flex items-center gap-3">
                      ❤️ Continue Your Story — Free Signup
                    </span>
                  </button>

                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-10 py-5 rounded-2xl font-bold text-lg bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transform hover:scale-105 transition-all duration-300"
                  >
                    ✨ Romance Pro — $9.99/mo
                  </button>
                </div>

                {/* Fine Print */}
                <p className="text-sm text-gray-500 mt-6">
                  No credit card required for signup • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-purple-100">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl shadow-lg">
                💕
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                RomanceCanvas
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 RomanceCanvas. Creating infinite love stories.
            </p>
          </div>
        </footer>
      </div>

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

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

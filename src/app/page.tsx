"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../lib/auth/authService";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import GlassEffect from "../components/GlassEffect";
import { backendUrl } from "../lib/config";
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
      const response = await fetch(
        `${backendUrl}/api/romance/stories/trending?limit=3`
      );
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
        `${backendUrl}/api/romance/stories/continue/${user.uid}`,
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
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50"
      style={{
        backgroundImage: 'url("/image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[500px] lg:h-[800px] rounded-full opacity-10 sm:opacity-15 lg:opacity-20 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.2) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[250px] sm:w-[400px] lg:w-[700px] h-[250px] sm:h-[400px] lg:h-[700px] rounded-full opacity-10 sm:opacity-15 lg:opacity-20 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.2) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        />
      </div>

      {/* Mouse Follow Glow - Desktop only */}
      <div
        className="hidden lg:block fixed w-[400px] h-[400px] rounded-full pointer-events-none z-10 transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 207, 232, 0.1) 0%, transparent 70%)",
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
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg shadow-purple-500/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  Start Instantly — No Signup Required
                </span>
              </div>
            </div>

            {/* Dual Choice Cards */}
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up animation-delay-200">
              {/* CHAT CARD */}
              <div
                onClick={() => router.push("/chat")}
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <GlassEffect
                  className="relative transform hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                  borderRadius="2.5rem"
                  backgroundOpacity={15}
                  intensity={{
                    blur: 12,
                    saturation: 130,
                    brightness: 90,
                    displacement: 60,
                  }}
                >
                  <div className="p-8 lg:p-10">
                  {/* Dark glossy overlay for glass morphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2.5rem] pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2.5rem] pointer-events-none"></div>

                  <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-5xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      💬
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-black text-center mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    Romantic Chat
                  </h2>

                  {/* Description */}
                  <p className="text-center text-white text-base lg:text-lg mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Talk with your AI lover — free 3 messages.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Instant AI responses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Uncensored conversations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Memory across chats</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-6 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300">
                    Start Chatting →
                  </button>

                  {/* Free Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
                      First 3 messages FREE
                    </span>
                  </div>
                  </div>
                  </div>
                </GlassEffect>
              </div>

              {/* STORY CARD */}
              <div
                onClick={() => router.push("/romance/create")}
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <GlassEffect
                  className="relative transform hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                  borderRadius="2.5rem"
                  backgroundOpacity={15}
                  intensity={{
                    blur: 12,
                    saturation: 130,
                    brightness: 90,
                    displacement: 60,
                  }}
                >
                  <div className="p-8 lg:p-10">
                  {/* Dark glossy overlay for glass morphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2.5rem] pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2.5rem] pointer-events-none"></div>

                  <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-5xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      📖
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl lg:text-4xl font-black text-center mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    Create a Story
                  </h2>

                  {/* Description */}
                  <p className="text-center text-white text-base lg:text-lg mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Build your own romance — free 1 scene.
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">AI-generated scenes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Beautiful illustrations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm lg:text-base text-white">
                      <span className="text-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✓</span>
                      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Chat with characters</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-6 py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300">
                    Create Story →
                  </button>

                  {/* Free Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
                      First scene FREE
                    </span>
                  </div>
                  </div>
                  </div>
                </GlassEffect>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: STORY HOOKS ==================== */}
        <section className="py-24 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            {/* Personal Continuation (Logged-in Users Only) */}
            {user && continueStories.length > 0 && (
              <div className="mb-16 animate-fade-in-up">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    💌 Continue Your Romance
                  </h2>
                  <p className="text-lg text-white drop-shadow-md">
                    Pick up where you left off
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {continueStories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => router.push(`/romance/story/${story.id}`)}
                      className="group cursor-pointer"
                    >
                      <GlassEffect
                        className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        borderRadius="1.5rem"
                        backgroundOpacity={12}
                        intensity={{
                          blur: 10,
                          saturation: 130,
                          brightness: 90,
                          displacement: 55,
                        }}
                      >
                        <div className="p-6">
                      {/* Dark glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[1.5rem] pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[1.5rem] pointer-events-none"></div>

                      <div className="relative z-10">
                      {story.coverImage && (
                        <div className="aspect-[16/9] mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2">
                        {story.title}
                      </h3>
                      {story.characters.length > 0 && (
                        <p className="text-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-3">
                          Chat with:{" "}
                          <span className="font-semibold text-purple-300">
                            {story.characters[0].name}
                          </span>
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        <span>{story.sceneCount} scenes</span>
                        <button className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                          Resume →
                        </button>
                      </div>
                      </div>
                        </div>
                      </GlassEffect>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Stories */}
            {trendingStories.length > 0 && (
              <div className="animate-fade-in-up animation-delay-300">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    ✨ Love Lives Here
                  </h2>
                  <p className="text-lg text-white drop-shadow-md">
                    Trending romance stories from our community
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {trendingStories.map((story, idx) => (
                    <div
                      key={story.id}
                      className="group animate-fade-in-up relative"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                      <GlassEffect
                        className="relative h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                        borderRadius="1.5rem"
                        backgroundOpacity={12}
                        intensity={{
                          blur: 10,
                          saturation: 130,
                          brightness: 90,
                          displacement: 55,
                        }}
                      >
                        <div className="p-6">
                          {/* Dark glossy overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[1.5rem] pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[1.5rem] pointer-events-none"></div>

                          <div className="relative z-10">
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
                            <div className="flex items-center gap-1 text-xs text-white">
                              <span>❤️</span>
                              <span>{story.heartScore || 0}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-3">
                            {story.title}
                          </h3>

                          {/* Description */}
                          <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed mb-4 line-clamp-3">
                            {story.description}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(`/romance/story/${story.id}`)
                              }
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                            >
                              Read Story
                            </button>
                            {story.characters.length > 0 && (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/romance/story/${story.id}?chat=${story.characters[0].name}`
                                  )
                                }
                                className="px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
                                title={`Chat with ${story.characters[0].name}`}
                              >
                                💬
                              </button>
                            )}
                          </div>
                          </div>
                        </div>
                      </GlassEffect>
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
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <GlassEffect
                className="relative text-center"
                borderRadius="3rem"
                backgroundOpacity={15}
                intensity={{
                  blur: 12,
                  saturation: 130,
                  brightness: 90,
                  displacement: 60,
                }}
              >
                <div className="p-10 lg:p-12">
                {/* Dark glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[3rem] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[3rem] pointer-events-none"></div>

                <div className="relative z-10">
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
                <h2 className="text-4xl lg:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4">
                  Every love story deserves to be finished
                </h2>

                {/* Subtext */}
                <p className="text-lg lg:text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-10 max-w-2xl mx-auto">
                  Start for free. Continue with signup. Unlock unlimited romance
                  with Pro.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => router.push("/signup")}
                    className="group relative px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-bold text-base lg:text-lg overflow-hidden shadow-2xl shadow-purple-500/40 hover:shadow-purple-400/60 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative text-white flex items-center gap-3">
                      ❤️ Continue Your Story — Free Signup
                    </span>
                  </button>

                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-8 lg:px-10 py-4 lg:py-5 rounded-2xl font-bold text-base lg:text-lg bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
                  >
                    ✨ Romance Pro — $9.99/mo
                  </button>
                </div>

                {/* Fine Print */}
                <p className="text-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-6">
                  No credit card required for signup • Cancel anytime
                </p>
                </div>
                </div>
              </GlassEffect>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="hidden">
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
        <Footer />
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

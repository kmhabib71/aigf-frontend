"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { sessionService } from "@/lib/auth/sessionService";
import { authService } from "@/lib/auth/authService";
import TropeSelector from "@/components/RomanceCanvas/TropeSelector";
import StreamingStoryCreation from "@/components/RomanceCanvas/StreamingStoryCreation";
import SoftGateModal from "@/components/SoftGateModal";
import GlassEffect from "@/components/GlassEffect";
import Header from "@/components/layout/Header";
import { backendUrl } from "@/lib/config";
export default function CreateStoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, anonymousSession, userProfile } = useAuth();
  const { socket, isConnected } = useSocket(); // Use global socket

  const [prompt, setPrompt] = useState(
    "A forbidden office romance between a CEO and their new intern, filled with tension and secret glances across the boardroom."
  );
  const [title, setTitle] = useState("Forbidden Office Romance");
  const [tropes, setTropes] = useState<string[]>(["slow-burn"]);
  const [narrativeStyle, setNarrativeStyle] = useState<
    "third-person" | "first-person"
  >("third-person");
  const [storyLength, setStoryLength] = useState(1500);
  const [spiceLevel, setSpiceLevel] = useState<"soft" | "medium" | "explicit">(
    "soft"
  );
  const [characterRef, setCharacterRef] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [useStreaming, setUseStreaming] = useState(true); // Default to streaming
  const [generateImages, setGenerateImages] = useState(false); // Default to OFF for testing

  // Soft gate state
  const [showSoftGate, setShowSoftGate] = useState(false);
  const [storyScenesCreated, setStoryScenesCreated] = useState(0);

  // Story limit modal state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalData, setLimitModalData] = useState<{
    storiesCreated: number;
    storyLimit: number;
  } | null>(null);

  const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setCharacterRef(file);
      setError("");
    }
  };

  const handleCreate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a story prompt");
      return;
    }

    if (prompt.trim().length < 10) {
      setError("Prompt must be at least 10 characters");
      return;
    }

    // Authentication is now required - redirect to login when user clicks generate
    if (!user) {
      // Save form data to localStorage so they don't lose their work
      localStorage.setItem('pendingStoryData', JSON.stringify({
        prompt: prompt.trim(),
        title: title.trim(),
        tropes,
        narrativeStyle,
        storyLength,
        spiceLevel
      }));
      // Redirect to login
      router.push('/login?redirect=/romance/create');
      return;
    }

    setIsGenerating(true);
    setError("");

    // If streaming is enabled and socket is connected, use streaming mode
    if (useStreaming && isConnected && socket) {
      // Streaming mode will be handled by StreamingStoryCreation component
      return;
    }

    // Fallback to original HTTP-based creation
    try {
      // Get auth token (required)
      const idToken = await authService.getIdToken();
      if (!idToken) {
        throw new Error("Authentication required. Please sign in to create stories.");
      }

      // Upload character reference if provided (optional for MVP)
      let characterRefUrl = null;
      if (characterRef) {
        // TODO: Implement image upload in Phase 2
        // For MVP, we'll skip character reference upload
        console.log("Character reference upload coming in Phase 2");
      }

      // Call API to create story
      const response = await fetch(`${backendUrl}/api/romance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          title: title.trim() || undefined,
          tropes,
          narrativeStyle,
          storyLength,
          spiceLevel,
          characterRef: characterRefUrl,
          generateImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle limit reached error
        if (data.limitReached) {
          setLimitModalData({
            storiesCreated: data.storiesCreated || 0,
            storyLimit: data.storyLimit || 5,
          });
          setShowLimitModal(true);
          setIsGenerating(false);
          return;
        }
        throw new Error(data.error || "Failed to create story");
      }

      console.log("✅ Story created:", data.story);
      console.log(`📊 Stories: ${data.storiesCreated}/${data.storyLimit} (Plan: ${data.userPlan})`);

      // Clear pending story data from localStorage after successful creation
      localStorage.removeItem('pendingStoryData');

      // Redirect to canvas view
      router.push(`/romance/story/${data.story.id}`);
    } catch (err: any) {
      console.error("Story creation error:", err);
      setError(err.message || "Failed to create story. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleStreamingComplete = (storyId: string) => {
    console.log("✅ Streaming story complete, redirecting to:", storyId);
    // Clear pending story data from localStorage after successful creation
    localStorage.removeItem('pendingStoryData');
    router.push(`/romance/story/${storyId}`);
  };

  const handleStreamingError = (errorMsg: string, data?: any) => {
    console.error("❌ Streaming error:", errorMsg, data);

    // Check if it's a limit error
    if (data?.upgradeRequired) {
      setShowLimitModal(true);
      setIsGenerating(false);
      return;
    }

    setError(errorMsg);
    setIsGenerating(false);
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Restore pending story data after login
  useEffect(() => {
    if (user) {
      const pendingData = localStorage.getItem('pendingStoryData');
      if (pendingData) {
        try {
          const data = JSON.parse(pendingData);
          setPrompt(data.prompt || '');
          setTitle(data.title || '');
          setTropes(data.tropes || ['slow-burn']);
          setNarrativeStyle(data.narrativeStyle || 'third-person');
          setStoryLength(data.storyLength || 1500);
          setSpiceLevel(data.spiceLevel || 'soft');
          localStorage.removeItem('pendingStoryData');
          console.log('✅ Restored pending story data after login');
        } catch (e) {
          console.error('Failed to restore pending story data:', e);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
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

      <div className="relative z-20 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
                  Create Your Romance Canvas 💕
                </h1>
                <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Describe your dream romance story and watch AI bring it to life with stunning visuals
                </p>
              </div>
            </div>
          </GlassEffect>

          {/* Error Message */}
          {error && (
            <GlassEffect
              borderRadius="2rem"
              backgroundOpacity={15}
              intensity={{
                blur: 12,
                saturation: 130,
                brightness: 90,
                displacement: 60,
              }}
            >
              <div className="p-4">
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 to-red-900/50 rounded-[2rem] pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-red-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {error}
                  </p>
                </div>
              </div>
            </GlassEffect>
          )}

          {/* Story Details Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-6">
                  Story Details
                </h2>

                {/* Story Title (Optional) */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Story Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Forbidden Office Romance"
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-black/30 backdrop-blur-sm text-white placeholder-white/60"
                    disabled={isGenerating}
                  />
                </div>

                {/* Story Prompt */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Story Prompt <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: A forbidden office romance between a CEO and their new intern, filled with tension and secret glances across the boardroom..."
                    rows={5}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none bg-black/30 backdrop-blur-sm text-white placeholder-white/60"
                    disabled={isGenerating}
                  />
                  <p className="text-sm text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-2">
                    {prompt.length} characters (minimum 10 required)
                  </p>
                </div>
              </div>
            </div>
          </GlassEffect>

          {/* Romance Tropes Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <TropeSelector selected={tropes} onChange={setTropes} />
              </div>
            </div>
          </GlassEffect>

          {/* Story Settings Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-6">
                  Story Settings
                </h2>

                {/* Narrative Style Toggle */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Narrative Style
                  </label>
                  <div className="flex gap-4 ">
                    <button
                      type="button"
                      onClick={() => setNarrativeStyle("third-person")}
                      disabled={isGenerating}
                      className={`cursor-pointer flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        narrativeStyle === "third-person"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                      } disabled:opacity-50`}
                    >
                      <div className="text-left">
                        <div className="font-bold">📖 Third Person</div>
                        <div className="text-sm opacity-80">
                          Cinematic storytelling
                        </div>
                        <div className="text-xs opacity-60 mt-1">
                          "He nervously waited..."
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNarrativeStyle("first-person")}
                      disabled={isGenerating}
                      className={`cursor-pointer flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        narrativeStyle === "first-person"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
                      } disabled:opacity-50`}
                    >
                      <div className="text-left">
                        <div className="font-bold">✍️ First Person</div>
                        <div className="text-sm opacity-80">
                          Personal diary style
                        </div>
                        <div className="text-xs opacity-60 mt-1">
                          "I nervously waited..."
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Story Length Slider */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Story Length
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={storyLength}
                      onChange={(e) => setStoryLength(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      disabled={isGenerating}
                    />
                    <span className="min-w-[120px] px-4 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/30 text-white rounded-lg font-medium text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {storyLength} words
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-2">
                    <span>Quick Read (500)</span>
                    <span>Standard (1500)</span>
                    <span>Epic (5000)</span>
                  </div>
                </div>

                {/* Intimacy Level - Button Group */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Intimacy Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Sweet Option */}
                    <button
                      type="button"
                      onClick={() => setSpiceLevel("soft")}
                      disabled={isGenerating}
                      className={`px-4 py-4 rounded-xl font-semibold transition-all ${
                        spiceLevel === "soft"
                          ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg ring-2 ring-white/50 scale-105"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20 hover:border-white/40"
                      } disabled:opacity-50`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">😊</div>
                        <div className="font-bold text-base">Sweet</div>
                        <div className="text-xs opacity-80 mt-1">Tender & Romantic</div>
                      </div>
                    </button>

                    {/* Passionate Option */}
                    <button
                      type="button"
                      onClick={() => setSpiceLevel("medium")}
                      disabled={isGenerating}
                      className={`px-4 py-4 rounded-xl font-semibold transition-all ${
                        spiceLevel === "medium"
                          ? "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg ring-2 ring-white/50 scale-105"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20 hover:border-white/40"
                      } disabled:opacity-50`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🔥</div>
                        <div className="font-bold text-base">Passionate</div>
                        <div className="text-xs opacity-80 mt-1">Sensual & Steamy</div>
                      </div>
                    </button>

                    {/* Explicit Option */}
                    <button
                      type="button"
                      onClick={() => setSpiceLevel("explicit")}
                      disabled={isGenerating}
                      className={`px-4 py-4 rounded-xl font-semibold transition-all ${
                        spiceLevel === "explicit"
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg ring-2 ring-white/50 scale-105"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20 hover:border-white/40"
                      } disabled:opacity-50`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌶️</div>
                        <div className="font-bold text-base">Explicit</div>
                        <div className="text-xs opacity-80 mt-1">Mature & Intense</div>
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-3 text-center">
                    Choose the level of romance and intimacy for your story
                  </p>
                </div>
              </div>
            </div>
          </GlassEffect>

          {/* Character Reference Section (Coming Soon) */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <label className="block text-lg font-semibold mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Character Reference (Optional - Coming Soon)
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center bg-black/20 backdrop-blur-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCharacterUpload}
                      className="hidden"
                      id="character-upload"
                      disabled={true} // Disabled for MVP
                    />
                    <label
                      htmlFor="character-upload"
                      className="cursor-not-allowed opacity-50"
                    >
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        Upload a character photo for consistent visuals
                      </p>
                      <p className="text-sm text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1">
                        (Feature coming in Phase 2)
                      </p>
                    </label>
                  </div>
              </div>
            </div>
          </GlassEffect>

          {/* Generation Options Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-6 lg:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-6">
                  Generation Options
                </h2>

                <div className="space-y-4">
                  {/* Streaming Toggle */}
                  <div className=" hidden  items-center justify-between p-4 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg">
                    <div className="flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useStreaming}
                          onChange={(e) => setUseStreaming(e.target.checked)}
                          disabled={isGenerating}
                          className="w-5 h-5 text-pink-500 bg-black/30 border-white/30 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-base font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            Real-Time Story Streaming ✨
                          </span>
                          <p className="text-sm text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1">
                            {useStreaming
                              ? "Watch your story come to life in real-time with progressive text generation"
                              : "Generate the complete story at once (faster but no preview)"}
                          </p>
                        </div>
                      </label>
                    </div>
                    {!isConnected && useStreaming && (
                      <div className="ml-4 px-3 py-1 bg-yellow-500/30 backdrop-blur-sm border border-yellow-400/30 text-yellow-200 text-xs rounded-full">
                        Connecting...
                      </div>
                    )}
                  </div>

                  {/* Image Generation Toggle */}
                  <div className="flex items-center justify-between p-4 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-lg">
                    <div className="flex-1">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generateImages}
                          onChange={(e) => setGenerateImages(e.target.checked)}
                          disabled={isGenerating}
                          className="w-5 h-5 text-orange-500 bg-black/30 border-white/30 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <div>
                          <span className="text-base font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            Generate Scene Images 🎨
                          </span>
                          {userProfile?.plan === 'free' && generateImages && (
                            <p className="text-sm text-green-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1">
                              ✨ FREE: You'll get 1 preview image (first scene). Upgrade for images on all scenes!
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassEffect>

          {/* Generate Button Section */}
          <GlassEffect
            borderRadius="2rem"
            backgroundOpacity={15}
            intensity={{
              blur: 12,
              saturation: 130,
              brightness: 90,
              displacement: 60,
            }}
          >
            <div className="p-0">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                {/* Generate Button */}
                <button
                  onClick={handleCreate}
                  disabled={
                    isGenerating || !prompt.trim() || prompt.length < 10
                  }
                  className={`
              w-full py-6 px-6 rounded-[2rem] font-bold text-lg transition-all transform hover:scale-[1.02]
              ${
                isGenerating || !prompt.trim() || prompt.length < 10
                  ? "bg-gray-600/30 backdrop-blur-sm text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
              }
            `}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Your Story... (30-60s)
                    </span>
                  ) : (
                    "✨ Generate Story"
                  )}
                </button>

                {/* Info Box */}
                <div className=" hidden p-5 bg-blue-500/10 backdrop-blur-sm border-t border-blue-400/20">
                  <p className="text-sm text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <strong>💡 Tip:</strong> The AI will generate a 5-8 scene
                    story with automatic visual moments
                  </p>
                </div>
              </div>
            </div>
          </GlassEffect>

          {/* Streaming Story Generation (shown below the form) */}
          {isGenerating && useStreaming && isConnected && socket && user && (
            <div className="mt-8">
              <StreamingStoryCreation
                prompt={prompt.trim()}
                title={title.trim() || "Untitled Romance"}
                tropes={tropes}
                narrativeStyle={narrativeStyle}
                storyLength={storyLength}
                spiceLevel={spiceLevel}
                userId={user.uid}
                socket={socket}
                generateImages={generateImages}
                onComplete={handleStreamingComplete}
                onError={handleStreamingError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Soft Gate Modal */}
      <SoftGateModal
        isOpen={showSoftGate}
        onClose={() => setShowSoftGate(false)}
        type="story"
        storyScenesCreated={storyScenesCreated}
      />

      {/* Story Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-8 text-white text-center relative">
              {/* Animated Icons */}
              <div className="absolute top-4 right-4 text-2xl animate-bounce">📚</div>
              <div className="absolute bottom-4 left-4 text-2xl animate-bounce animation-delay-300">✨</div>

              {/* Emoji Icon */}
              <div className="text-6xl mb-4">🔒</div>

              {/* Headline */}
              <h2 className="text-3xl font-black mb-2">Story Limit Reached!</h2>

              {/* Usage Info */}
              <p className="text-sm opacity-90">
                You've created {limitModalData?.storiesCreated || 0} of {limitModalData?.storyLimit || 5} free stories this month
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-gray-700 text-lg text-center mb-6">
                Upgrade to Premium to create unlimited stories with AI-generated images!
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Unlimited stories per month</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>AI-generated scene images</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Line-by-line image generation</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Priority generation speed</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  ✨ Upgrade to Premium
                </button>

                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  Maybe Later
                </button>
              </div>

              {/* Reset Info */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Your free stories reset on the 1st of each month
              </p>
            </div>
          </div>
        </div>
      )}

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

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
  const { user, isAuthenticated, anonymousSession } = useAuth();
  const { socket, isConnected } = useSocket(); // Use global socket

  const [prompt, setPrompt] = useState(
    "A forbidden office romance between a CEO and their new intern, filled with tension and secret glances across the boardroom."
  );
  const [title, setTitle] = useState("Forbidden Office Romance");
  const [tropes, setTropes] = useState<string[]>(["slow-burn"]);
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

    // Check anonymous session limits (only for non-authenticated users)
    if (!user && anonymousSession) {
      const canCreate = await sessionService.canCreateStory();
      if (!canCreate) {
        setShowSoftGate(true);
        return;
      }
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
      // Get auth token or sessionId
      let idToken = null;
      let sessionId = null;

      if (user) {
        idToken = await authService.getIdToken();
        if (!idToken) {
          throw new Error("Authentication required");
        }
      } else if (anonymousSession) {
        sessionId = anonymousSession.sessionId;
      } else {
        throw new Error("Session required");
      }

      // Upload character reference if provided (optional for MVP)
      let characterRefUrl = null;
      if (characterRef) {
        // TODO: Implement image upload in Phase 2
        // For MVP, we'll skip character reference upload
        console.log("Character reference upload coming in Phase 2");
      }

      // Call API to create story
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (idToken) {
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const response = await fetch(`${backendUrl}/api/romance/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: prompt.trim(),
          title: title.trim() || undefined,
          tropes,
          spiceLevel,
          characterRef: characterRefUrl,
          sessionId: sessionId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create story");
      }

      console.log("✅ Story created:", data.story);

      // Increment anonymous scene count if applicable
      if (!user && anonymousSession) {
        const count = await sessionService.incrementStorySceneCount();
        setStoryScenesCreated(count);

        // Show soft gate after first scene
        if (count >= 1) {
          setShowSoftGate(true);
        }
      }

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
    router.push(`/romance/story/${storyId}`);
  };

  const handleStreamingError = (errorMsg: string) => {
    console.error("❌ Streaming error:", errorMsg);
    setError(errorMsg);
    setIsGenerating(false);
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      <div className="max-w-4xl mx-auto">
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
          <div className="p-8 lg:p-10">
          {/* Dark glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

          <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
              Create Your Romance Canvas 💕
            </h1>
            <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Describe your dream romance story and watch AI bring it to life
              with stunning visuals
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 backdrop-blur-sm border border-red-500/50 rounded-lg">
              <p className="text-red-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{error}</p>
            </div>
          )}

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

          {/* Trope Selector */}
          <div className="mb-6">
            <TropeSelector selected={tropes} onChange={setTropes} />
          </div>

          {/* Spice Level Slider */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Intimacy Level
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="2"
                value={
                  spiceLevel === "soft" ? 0 : spiceLevel === "medium" ? 1 : 2
                }
                onChange={(e) => {
                  const levels: ("soft" | "medium" | "explicit")[] = [
                    "soft",
                    "medium",
                    "explicit",
                  ];
                  setSpiceLevel(levels[parseInt(e.target.value)]);
                }}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                disabled={isGenerating}
              />
              <span className="min-w-[100px] px-4 py-2 bg-pink-500/30 backdrop-blur-sm border border-pink-400/30 text-white rounded-lg font-medium text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {spiceLevel === "soft" && "😊 Sweet"}
                {spiceLevel === "medium" && "🔥 Passionate"}
                {spiceLevel === "explicit" && "🌶️ Explicit"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-2">
              <span>Sweet & Tender</span>
              <span>Passionate & Sensual</span>
              <span>Mature & Explicit</span>
            </div>
          </div>

          {/* Character Reference (Coming Soon) */}
          <div className="mb-6">
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

          {/* Generation Options */}
          <div className="mb-8 space-y-4">
            {/* Streaming Toggle */}
            <div className="flex items-center justify-between p-4 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg">
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
                      <span className="ml-2 px-2 py-0.5 bg-orange-400/30 backdrop-blur-sm border border-orange-300/30 text-white text-xs rounded-full">
                        {generateImages ? "COSTS TOKENS" : "TESTING MODE"}
                      </span>
                    </span>
                    <p className="text-sm text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1">
                      {generateImages
                        ? "⚠️ Will generate images for each scene (~$0.10-0.20 per story). Only enable after text streaming works!"
                        : "✅ Text-only generation for testing (saves money). Enable images once streaming is confirmed working."}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleCreate}
            disabled={isGenerating || !prompt.trim() || prompt.length < 10}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105
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
          <div className="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg">
            <p className="text-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <strong>💡 Tip:</strong> The AI will generate a 5-8 scene story
              (800-1500 words) with automatic visual moments. You can add more
              images and edit text in the canvas view!
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

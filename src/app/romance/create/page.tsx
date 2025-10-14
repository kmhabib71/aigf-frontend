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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Romance Canvas 💕
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Describe your dream romance story and watch AI bring it to life
              with stunning visuals
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Story Title (Optional) */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Story Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Forbidden Office Romance"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isGenerating}
            />
          </div>

          {/* Story Prompt */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Story Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A forbidden office romance between a CEO and their new intern, filled with tension and secret glances across the boardroom..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isGenerating}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {prompt.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Trope Selector */}
          <div className="mb-6">
            <TropeSelector selected={tropes} onChange={setTropes} />
          </div>

          {/* Spice Level Slider */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
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
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                disabled={isGenerating}
              />
              <span className="min-w-[100px] px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg font-medium text-center">
                {spiceLevel === "soft" && "😊 Sweet"}
                {spiceLevel === "medium" && "🔥 Passionate"}
                {spiceLevel === "explicit" && "🌶️ Explicit"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Sweet & Tender</span>
              <span>Passionate & Sensual</span>
              <span>Mature & Explicit</span>
            </div>
          </div>

          {/* Character Reference (Coming Soon) */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Character Reference (Optional - Coming Soon)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
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
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a character photo for consistent visuals
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  (Feature coming in Phase 2)
                </p>
              </label>
            </div>
          </div>

          {/* Generation Options */}
          <div className="mb-8 space-y-4">
            {/* Streaming Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useStreaming}
                    onChange={(e) => setUseStreaming(e.target.checked)}
                    disabled={isGenerating}
                    className="w-5 h-5 text-pink-500 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Real-Time Story Streaming ✨
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {useStreaming
                        ? "Watch your story come to life in real-time with progressive text generation"
                        : "Generate the complete story at once (faster but no preview)"}
                    </p>
                  </div>
                </label>
              </div>
              {!isConnected && useStreaming && (
                <div className="ml-4 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                  Connecting...
                </div>
              )}
            </div>

            {/* Image Generation Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateImages}
                    onChange={(e) => setGenerateImages(e.target.checked)}
                    disabled={isGenerating}
                    className="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Generate Scene Images 🎨
                      <span className="ml-2 px-2 py-0.5 bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-xs rounded-full">
                        {generateImages ? "COSTS TOKENS" : "TESTING MODE"}
                      </span>
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all
              ${
                isGenerating || !prompt.trim() || prompt.length < 10
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
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
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Tip:</strong> The AI will generate a 5-8 scene story
              (800-1500 words) with automatic visual moments. You can add more
              images and edit text in the canvas view!
            </p>
          </div>
        </div>

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

      {/* Soft Gate Modal */}
      <SoftGateModal
        isOpen={showSoftGate}
        onClose={() => setShowSoftGate(false)}
        type="story"
        storyScenesCreated={storyScenesCreated}
      />
    </div>
  );
}

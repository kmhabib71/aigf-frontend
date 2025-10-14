"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { io, Socket } from "socket.io-client";
import StoryCanvas from "@/components/RomanceCanvas/StoryCanvas";
import ChatWithCharacter from "@/components/RomanceCanvas/ChatWithCharacter";
import { auth } from "@/lib/firebase";
import { backendUrl } from "@/lib/config";
interface Story {
  _id: string;
  title: string;
  prompt: string;
  scenes: Array<{
    sceneNumber: number;
    content: string;
    headline?: string;
    sceneImageUrl?: string;
    sceneImagePrompt?: string;
    visualMoments: Array<{
      lineNumber: number;
      context: string;
      imageUrl: string;
      imagePrompt?: string;
    }>;
    comments: Array<{
      userId: string;
      displayName: string;
      text: string;
      lineNumber: number | null;
      reactions: string[];
      createdAt: string;
    }>;
    status: string;
  }>;
  metadata: {
    tropes: string[];
    spiceLevel: string;
    heartScore: number;
    characters?: Array<{
      name: string;
      role: string;
      traits?: string[];
      currentState?: {
        emotion?: string;
        location?: string;
      };
    }>;
  };
  visibility: string;
  createdAt: string;
}

export default function StoryViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [idToken, setIdToken] = useState<string>("");

  // Initialize Socket.io connection
  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io(`${backendUrl}`, {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket.io connected for Romance Canvas");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket.io disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/romance/story/" + storyId);
      return;
    }

    loadStory();
  }, [isAuthenticated, storyId]);

  const loadStory = async () => {
    try {
      // Get token from Firebase auth.currentUser instead of the AuthUser object
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      const token = await currentUser.getIdToken();
      setIdToken(token);

      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load story");
      }

      const data = await response.json();
      setStory(data);
    } catch (err: any) {
      console.error("Load story error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryUpdate = (updatedStory: Story) => {
    setStory(updatedStory);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your romantic story...
          </p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Story Not Found
          </h2>
          <p className="text-red-600 mb-6">
            {error ||
              "The story you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/romance/create")}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 shadow-lg"
            >
              ✨ Create New Story
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">
            {story.title}
          </h2>
          <button
            onClick={() => router.push("/romance/create")}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
          >
            ✨ New Story
          </button>
        </div>
      </div>

      {/* Main Story Canvas */}
      <div className="py-8">
        <StoryCanvas
          story={story}
          storyId={storyId}
          socket={socket}
          onStoryUpdate={handleStoryUpdate}
          idToken={idToken}
          chatButton={
            story.metadata.characters &&
            story.metadata.characters.length > 0 ? (
              <ChatWithCharacter
                storyId={storyId}
                socket={socket}
                characters={story.metadata.characters}
              />
            ) : undefined
          }
        />
      </div>

      {/* Phase 2 Feature Showcase */}
      <div className="max-w-900px mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            ✅ <span>Phase 2 Complete - Interactive Storyboard Canvas!</span>
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Your Romance Canvas now features real-time collaboration,
            interactive commenting, line-by-line image generation, and
            AI-powered story continuation!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>💬 Real-time comments with Socket.io broadcasting</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>🎨 Line-by-line image generation on demand</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>🔄 Continue Story with AI (Venice uncensored)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>🖼️ Inline visual moments embedded in text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

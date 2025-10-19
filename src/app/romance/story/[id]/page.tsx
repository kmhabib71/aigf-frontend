"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { io, Socket } from "socket.io-client";
import StoryCanvas from "@/components/RomanceCanvas/StoryCanvas";
import ChatWithCharacter from "@/components/RomanceCanvas/ChatWithCharacter";
import GlassEffect from "@/components/GlassEffect";
import Header from "@/components/layout/Header";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

    // Refresh token every 50 minutes (tokens expire after 60 minutes)
    const tokenRefreshInterval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const freshToken = await currentUser.getIdToken(true); // force refresh
        setIdToken(freshToken);
        console.log("🔄 Token refreshed");
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(tokenRefreshInterval);
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
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: 'url("/image.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Redirecting to login...
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Loading your romantic story...
          </p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
        </div>

        <div className="text-center max-w-md px-6 relative z-10">
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
            <div className="p-8">
              {/* Dark glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60 rounded-[2rem] pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
                  Story Not Found
                </h2>
                <p className="text-red-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-6">
                  {error ||
                    "The story you're looking for doesn't exist or you don't have permission to view it."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push("/romance/create")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
                  >
                    ✨ Create New Story
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
                  >
                    🏠 Back to Home
                  </button>
                </div>
              </div>
            </div>
          </GlassEffect>
        </div>
      </div>
    );
  }

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

      {/* Navigation Bar */}
      <div className="bg-black/40 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-white hover:text-purple-300 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-semibold transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] truncate max-w-md">
            {story.title}
          </h2>
          <button
            onClick={() => router.push("/romance/create")}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all shadow-md shadow-purple-500/30"
          >
            ✨ New Story
          </button>
        </div>
      </div>

      {/* Main Story Canvas */}
      <div className="py-8 relative z-20">
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

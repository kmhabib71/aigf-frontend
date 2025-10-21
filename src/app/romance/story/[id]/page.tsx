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
  userId: string;
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
  heartReactions?: string[];
  visibility: string;
  createdAt: string;
}

export default function StoryViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, userProfile } = useAuth();
  const storyId = params.id as string;

  const [story, setStory] = useState<(Story & { isOwner?: boolean }) | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [idToken, setIdToken] = useState<string>("");
  const [visibilityUpdating, setVisibilityUpdating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState<{
    title: string;
    scenes: Array<{
      sceneNumber: number;
      index: number;
      headline: string;
      content: string;
    }>;
  } | null>(null);
  const [savingEdits, setSavingEdits] = useState(false);
  const [editError, setEditError] = useState("");
  const [reactionUpdating, setReactionUpdating] = useState(false);

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
    if (!storyId) return;
    loadStory();
  }, [storyId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIdToken("");
      return;
    }

    let isMounted = true;

    const refreshToken = async (force = false) => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const freshToken = await currentUser.getIdToken(force);
      if (isMounted) {
        setIdToken(freshToken);
      }
    };

    refreshToken(true);

    // Refresh token every 50 minutes (tokens expire after 60 minutes)
    const tokenRefreshInterval = setInterval(() => {
      refreshToken(true);
    }, 50 * 60 * 1000); // 50 minutes

    return () => {
      isMounted = false;
      clearInterval(tokenRefreshInterval);
    };
  }, [isAuthenticated]);

  const loadStory = async () => {
    setLoading(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      let token = "";

      if (currentUser) {
        token = await currentUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken("");
      }

      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setStory(null);
          setError("Please sign in to view this story.");
          return;
        }

        if (response.status === 403) {
          setStory(null);
          setError("This story is private or you do not have access.");
          return;
        }

        throw new Error("Failed to load story");
      }

      const data = await response.json();
      setStory(data);
      setError("");
    } catch (err: any) {
      console.error("Load story error:", err);
      setError(err?.message || "Failed to load story");
      setStory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryUpdate = (updatedStory: Story) => {
    setStory((prev) => ({
      ...updatedStory,
      heartReactions:
        (updatedStory as any)?.heartReactions ?? prev?.heartReactions ?? [],
      isOwner: prev?.isOwner ?? (updatedStory as any)?.isOwner,
    }));
  };

  const handleVisibilityToggle = async () => {
    if (!story) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push(`/login?redirect=/romance/story/${storyId}`);
        return;
      }

      setVisibilityUpdating(true);
      const token = await currentUser.getIdToken();
      const nextVisibility =
        story.visibility === "public" ? "private" : "public";

      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ visibility: nextVisibility }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update visibility");
      }

      const data = await response.json();
      setStory(data.story);
    } catch (err: any) {
      console.error("Update visibility error:", err);
      alert(err?.message || "Failed to update story visibility");
    } finally {
      setVisibilityUpdating(false);
    }
  };

  const requireAuth = () => {
    router.push(`/login?redirect=/romance/story/${storyId}`);
  };

  const startEditing = () => {
    if (!story) return;

    setEditedStory({
      title: story.title,
      scenes: story.scenes.map((scene, index) => ({
        sceneNumber: scene.sceneNumber,
        index,
        headline: scene.headline || "",
        content: scene.content,
      })),
    });
    setEditError("");
    setIsEditing(true);
  };

  const handleTitleChange = (value: string) => {
    setEditedStory((prev) =>
      prev
        ? {
            ...prev,
            title: value,
          }
        : prev
    );
  };

  const handleSceneFieldChange = (
    sceneNumber: number,
    index: number,
    field: "headline" | "content",
    value: string
  ) => {
    setEditedStory((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        scenes: prev.scenes.map((scene) =>
          scene.sceneNumber === sceneNumber && scene.index === index
            ? { ...scene, [field]: value }
            : scene
        ),
      };
    });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedStory(null);
    setSavingEdits(false);
    setEditError("");
  };

  const handleSaveEdits = async () => {
    if (!editedStory) return;

    const trimmedTitle = editedStory.title.trim();
    if (!trimmedTitle) {
      setEditError("Story title cannot be empty.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      requireAuth();
      return;
    }

    setSavingEdits(true);
    setEditError("");

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trimmedTitle,
            scenes: editedStory.scenes.map((scene) => ({
              sceneNumber: scene.sceneNumber,
              index: scene.index,
              headline: scene.headline,
              content: scene.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save story edits");
      }

      const data = await response.json();

      setStory((prev) => ({
        ...(data.story as Story),
        isOwner: prev?.isOwner ?? true,
      }));
      setIsEditing(false);
      setEditedStory(null);
    } catch (err: any) {
      console.error("Save story edits error:", err);
      setEditError(err?.message || "Failed to save story edits");
    } finally {
      setSavingEdits(false);
    }
  };

  const handleToggleReaction = async () => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    if (reactionUpdating) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      requireAuth();
      return;
    }

    setReactionUpdating(true);
    if (!user?.uid) {
      requireAuth();
      return;
    }

    const previousHeartReactions = heartReactions;
    const nextHeartReactions = hasReacted
      ? previousHeartReactions.filter((id) => id !== user.uid)
      : [...previousHeartReactions, user.uid];

    setStory((prev) =>
      prev
        ? {
            ...prev,
            heartReactions: nextHeartReactions,
          }
        : prev
    );

    try {
      const token = await currentUser.getIdToken();
      setIdToken(token);

      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to react to story");
      }

      const data = await response.json();
      setStory((prev) =>
        prev
          ? {
              ...prev,
              heartReactions: data.heartReactions || [],
            }
          : prev
      );
    } catch (err: any) {
      console.error("Toggle reaction error:", err);
      // Rollback optimistic update
      setStory((prev) =>
        prev
          ? {
              ...prev,
              heartReactions: previousHeartReactions,
            }
          : prev
      );
      alert(err?.message || "Failed to update reaction");
    } finally {
      setReactionUpdating(false);
    }
  };

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
        Back
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
        Back
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
                    Create New Story
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

  const isOwner =
    story.isOwner !== undefined
      ? story.isOwner
      : !!(user?.uid && story.userId === user.uid);
  const isStoryPublic = story.visibility === "public";
  const canUseInteractiveFeatures = Boolean(idToken);
  const heartReactions = story.heartReactions || [];
  const hasReacted = user?.uid ? heartReactions.includes(user.uid) : false;
  const heartCount = heartReactions.length;
  const visibilityBadgeClasses = isStoryPublic
    ? "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-100 border border-emerald-300/40"
    : "px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20";
  const visibilityLabel = isStoryPublic ? "Public" : "Private";
  const loveButtonClasses = hasReacted
    ? "px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60 transition-all"
    : "px-3 py-2 bg-white/10 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all";
  const loveIconClasses = hasReacted
    ? "text-lg leading-none text-rose-100"
    : "text-lg leading-none text-white/80";

  const chatButtonNode =
    story.metadata.characters && story.metadata.characters.length > 0 ? (
      isAuthenticated ? (
        <ChatWithCharacter
          storyId={storyId}
          socket={socket}
          characters={story.metadata.characters}
        />
      ) : (
        <button
          onClick={requireAuth}
          className="px-6 py-3 bg-purple-400 border border-white/25 text-white rounded-full font-semibold shadow-lg hover:bg-purple-800/40 transition-all"
        >
          Chat with Character
        </button>
      )
    ) : undefined;

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
      {isEditing && editedStory && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-5xl max-h-full overflow-y-auto">
            <GlassEffect
              borderRadius="1.5rem"
              backgroundOpacity={18}
              intensity={{
                blur: 16,
                saturation: 140,
                brightness: 90,
                displacement: 40,
              }}
            >
              <div className="relative p-6 sm:p-8 space-y-6">
                <button
                  onClick={handleCancelEditing}
                  className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors text-xl"
                  aria-label="Close editor"
                >
                  &times;
                </button>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">
                    Manual Story Editor
                  </h3>
                  <p className="text-sm text-purple-100/80">
                    Fine-tune your scenes with custom wording. Changes are saved instantly to this story.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-purple-100/90">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={editedStory.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white shadow-inner shadow-black/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    maxLength={120}
                    placeholder="Enter your story title"
                  />
                </div>

                <div className="space-y-8">
                  {editedStory.scenes.map((scene) => (
                    <div
                      key={`${scene.sceneNumber}-${scene.index}`}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-lg shadow-purple-900/20"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <h4 className="text-lg font-semibold text-white">
                          Scene {scene.sceneNumber}
                        </h4>
                        <span className="text-xs uppercase tracking-wide text-purple-100/70">
                          Manual edit
                        </span>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={scene.headline}
                          onChange={(event) =>
                            handleSceneFieldChange(
                              scene.sceneNumber,
                              scene.index,
                              "headline",
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                          maxLength={160}
                          placeholder="Scene headline (optional)"
                        />
                        <textarea
                          value={scene.content}
                          onChange={(event) =>
                            handleSceneFieldChange(
                              scene.sceneNumber,
                              scene.index,
                              "content",
                              event.target.value
                            )
                          }
                          rows={10}
                          className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="Write or refine this scene..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {editError && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {editError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={handleCancelEditing}
                    className="px-5 py-3 rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-all disabled:opacity-60"
                    disabled={savingEdits}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdits}
                    disabled={savingEdits}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingEdits ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </GlassEffect>
          </div>
        </div>
      )}

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-white hover:text-purple-300 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-semibold transition-colors"
          >
            Back
          </button>
          <h2 className="text-lg font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex-1 text-center sm:text-left truncate">
            {story.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className={visibilityBadgeClasses}>{visibilityLabel}</span>
            <button
              onClick={handleToggleReaction}
              disabled={reactionUpdating}
              className={`${loveButtonClasses} flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
              aria-pressed={hasReacted}
            >
              <span className={loveIconClasses} aria-hidden="true">
                {hasReacted ? "♥" : "♡"}
              </span>
              <span>{reactionUpdating ? "..." : heartCount}</span>
              <span className="sr-only">
                {hasReacted ? "Remove love reaction" : "Add love reaction"}
              </span>
            </button>
            {isOwner && !isEditing && (
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
              >
                Edit Story
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleVisibilityToggle}
                disabled={visibilityUpdating}
                className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all disabled:opacity-60"
              >
                {visibilityUpdating
                  ? "Updating..."
                  : isStoryPublic
                  ? "Make Private"
                  : "Make Public"}
              </button>
            )}
            <button
              onClick={() => router.push("/romance/create")}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all shadow-md shadow-purple-500/30"
            >
              New Story
            </button>
          </div>
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
          canContinue={isOwner}
          allowInteractions={canUseInteractiveFeatures}
          onRequireAuth={!canUseInteractiveFeatures ? requireAuth : undefined}
          chatButton={chatButtonNode}
          userPlan={userProfile?.plan || 'free'}
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

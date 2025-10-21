"use client";

import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import SceneBlock from "./SceneBlock";
import { backendUrl } from "@/lib/config";
import "./StoryCanvas.css";

interface VisualMoment {
  lineNumber: number;
  context: string;
  imageUrl: string;
  imagePrompt?: string;
}

interface Comment {
  userId: string;
  displayName: string;
  text: string;
  lineNumber: number | null;
  reactions: string[];
  createdAt: string;
}

interface Scene {
  sceneNumber: number;
  content: string;
  headline?: string;
  sceneImageUrl?: string;
  sceneImagePrompt?: string;
  visualMoments: VisualMoment[];
  comments: Comment[];
  status: string;
}

interface Story {
  _id: string;
  title: string;
  prompt: string;
  scenes: Scene[];
  metadata: {
    tropes: string[];
    spiceLevel: string;
    heartScore: number;
  };
  visibility: string;
  createdAt: string;
}

interface StoryCanvasProps {
  story: Story;
  storyId: string;
  socket: Socket | null;
  onStoryUpdate: (story: Story) => void;
  idToken: string;
  canContinue: boolean;
  allowInteractions: boolean;
  onRequireAuth?: () => void;
  chatButton?: React.ReactNode;
  userPlan?: string;
}

// Spice level display mapping
const SPICE_LEVEL_DISPLAY: Record<string, string> = {
  soft: "😊 Sweet",
  medium: "🔥 Passionate",
  explicit: "🌶️ Explicit",
};

export default function StoryCanvas({
  story,
  storyId,
  socket,
  onStoryUpdate,
  idToken,
  canContinue,
  allowInteractions,
  onRequireAuth,
  chatButton,
  userPlan = 'free',
}: StoryCanvasProps) {
  const [localStory, setLocalStory] = useState<Story>(story);
  const [isContinuing, setIsContinuing] = useState(false);
  const [continueGuidance, setContinueGuidance] = useState("");
  const [showGuidanceInput, setShowGuidanceInput] = useState(false);
  const canvasEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRef = useRef(false);

  // Sync local story with prop changes
  useEffect(() => {
    setLocalStory(story);
  }, [story]);

  // Sync local story changes back to parent (prevents render-phase updates)
  useEffect(() => {
    if (localStory !== story) {
      onStoryUpdate(localStory);
    }
  }, [localStory]);

  useEffect(() => {
    if (!canContinue) {
      setShowGuidanceInput(false);
      setContinueGuidance("");
    }
  }, [canContinue]);

  // Socket.io real-time updates
  useEffect(() => {
    if (!socket || !storyId || hasJoinedRef.current) return;

    // Join story room (only once)
    socket.emit("join-story", storyId);
    hasJoinedRef.current = true;
    console.log(`📖 Joined story room: ${storyId}`);

    // Listen for story updates
    const handleStoryUpdate = (update: any) => {
      console.log("📡 Received story update:", update);

      // Log timing for image updates
      if (update.type === 'image_added' && update.visualMoment?.isTemporary) {
        console.log("⚡ RAW IMAGE RECEIVED - Displaying immediately!");
      } else if (update.type === 'image_updated') {
        console.log("✅ Permanent Firebase URL received - Replacing image");
      }

      setLocalStory((prevStory) => {
        const newStory = { ...prevStory };

        switch (update.type) {
          case "image_added":
            if (newStory.scenes[update.sceneIdx]) {
              // Check if visual moment already exists (prevent duplicates)
              const exists = newStory.scenes[
                update.sceneIdx
              ].visualMoments.some(
                (vm) => vm.lineNumber === update.visualMoment.lineNumber
              );
              if (!exists) {
                newStory.scenes[update.sceneIdx].visualMoments.push(
                  update.visualMoment
                );
                console.log("⚡ Raw image added immediately for display");
              } else {
                console.log(
                  "⭐️ Visual moment already exists, skipping duplicate"
                );
              }
            }
            break;

          case "image_updated":
            // Replace temporary base64 image with permanent Firebase URL
            if (newStory.scenes[update.sceneIdx]) {
              const visualMoment = newStory.scenes[
                update.sceneIdx
              ].visualMoments.find(
                (vm) => vm.lineNumber === update.visualMoment.lineNumber
              );
              if (visualMoment) {
                visualMoment.imageUrl = update.visualMoment.imageUrl;
                console.log("✅ Image URL updated to permanent Firebase URL");
              }
            }
            break;

          case "scene_added":
            // Check if scene already exists (prevent duplicates)
            const sceneExists = newStory.scenes.some(
              (s) => s.sceneNumber === update.scene.sceneNumber
            );
            if (!sceneExists) {
              newStory.scenes.push(update.scene);
              // Auto-scroll to new scene
              setTimeout(() => {
                canvasEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            } else {
              console.log("⭐️ Scene already exists, skipping duplicate");
            }
            break;

          case "comment_added":
            if (newStory.scenes[update.sceneIdx]) {
              // Check if comment already exists (prevent duplicates)
              const commentExists = newStory.scenes[
                update.sceneIdx
              ].comments.some(
                (c) =>
                  c.createdAt === update.comment.createdAt &&
                  c.text === update.comment.text
              );
              if (!commentExists) {
                newStory.scenes[update.sceneIdx].comments.push(update.comment);
              } else {
                console.log("⭐️ Comment already exists, skipping duplicate");
              }
            }
            break;

          default:
            break;
        }

        // Don't call onStoryUpdate here - it will be handled by useEffect
        return newStory;
      });
    };

    socket.on("story:updated", handleStoryUpdate);

    // Cleanup
    return () => {
      socket.off("story:updated", handleStoryUpdate);
      if (hasJoinedRef.current) {
        socket.emit("leave-story", storyId);
        hasJoinedRef.current = false;
        console.log(`📖 Left story room: ${storyId}`);
      }
    };
  }, [socket, storyId]);

  const handleContinueStory = async () => {
    if (isContinuing) return;

    setIsContinuing(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}/continue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            userGuidance: continueGuidance.trim(),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to continue story");
      }

      const data = await response.json();
      console.log("✅ Story continued:", data);

      setContinueGuidance("");
      setShowGuidanceInput(false);

      // Story will be updated via Socket.io, but we can also update locally
      // The socket event might arrive first, so we handle both cases
    } catch (error: any) {
      console.error("❌ Continue story error:", error);
      alert(`Failed to continue story: ${error.message}`);
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <div className="story-canvas-container">
      {/* Story Header */}
      <div className="story-header">
        <h1>{localStory.title}</h1>
        <div className="story-meta">
          <span className="tropes">
            {localStory.metadata.tropes.join(" • ")}
          </span>
          <span className="spice-level">
            {SPICE_LEVEL_DISPLAY[localStory.metadata.spiceLevel] || localStory.metadata.spiceLevel}
          </span>
          <span className="scenes-count">
            {localStory.scenes.length} scenes
          </span>
        </div>
      </div>

      {/* Story Canvas (Scrollable Scenes) */}
      <div className="story-canvas">
        {localStory.scenes.map((scene, sceneIdx) => (
          <SceneBlock
            key={sceneIdx}
            scene={scene}
            sceneIdx={sceneIdx}
            storyId={storyId}
            idToken={idToken}
            socket={socket}
            allowInteractions={allowInteractions}
            onRequireAuth={onRequireAuth}
            userPlan={userPlan}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={canvasEndRef} />
      </div>

      {/* Floating Action Buttons */}
      <div className="canvas-actions">
        {canContinue && showGuidanceInput && (
          <div className="guidance-input-container">
            <textarea
              placeholder="Optional: Guide the next scene (e.g., 'Add more tension' or 'They should kiss')"
              value={continueGuidance}
              onChange={(e) => setContinueGuidance(e.target.value)}
              maxLength={200}
              rows={2}
              className="guidance-input text-gray-900"
            />
            <button
              onClick={() => setShowGuidanceInput(false)}
              className="cancel-button"
              disabled={isContinuing}
            >
              Cancel
            </button>
          </div>
        )}

        {canContinue && (
          <button
            onClick={() => {
              if (showGuidanceInput) {
                handleContinueStory();
              } else {
                setShowGuidanceInput(true);
              }
            }}
            disabled={isContinuing}
            className="continue-button"
          >
            {isContinuing
              ? "Generating..."
              : showGuidanceInput
              ? "Generate Scene"
              : "Continue Story"}
          </button>
        )}

        {chatButton}
      </div>
    </div>
  );
}

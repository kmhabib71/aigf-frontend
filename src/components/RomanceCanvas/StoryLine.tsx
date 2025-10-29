"use client";

import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentsThread from "./CommentsThread";
import BlurredImagePlaceholder from "./BlurredImagePlaceholder";
import { backendUrl } from "@/lib/config";
import "./StoryLine.css";

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

interface StoryLineProps {
  line: string;
  lineIdx: number;
  sceneIdx: number;
  storyId: string;
  idToken: string;
  socket: Socket | null;
  visualMoments: VisualMoment[];
  comments: Comment[];
  allowInteractions: boolean;
  onRequireAuth?: () => void;
  userPlan?: string;
}

export default function StoryLine({
  line,
  lineIdx,
  sceneIdx,
  storyId,
  idToken,
  socket,
  visualMoments,
  comments,
  allowInteractions,
  onRequireAuth,
  userPlan = "free",
}: StoryLineProps) {
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const initialVisualMomentsCount = useRef(visualMoments.length);
  const lineRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  // Detect if device supports touch
  useEffect(() => {
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  // Reset loader when new visual moment arrives
  useEffect(() => {
    if (visualMoments.length > initialVisualMomentsCount.current) {
      setIsGeneratingImage(false);
      initialVisualMomentsCount.current = visualMoments.length;
    }
  }, [visualMoments]);

  // Actions visibility is per-line; no global coordination

  // Click/touch outside to close actions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (lineRef.current && !lineRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      // Use capture phase to handle clicks before they bubble
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [showActions]);

  const handleGenerateImage = async () => {
    if (!allowInteractions) {
      onRequireAuth?.();
      return;
    }

    if (isGeneratingImage) return;

    // Free users see blurred placeholder (no actual image generation)
    if (userPlan === "free") {
      setIsGeneratingImage(true);
      // Keep it in generating state to show the blurred placeholder
      return;
    }

    setIsGeneratingImage(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/romance/story/${storyId}/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            sceneIdx,
            lineIdx,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle premium required error
        if (data.premiumRequired) {
          // Show blurred placeholder
          setIsGeneratingImage(true); // Keep generating state to show placeholder
          return;
        }
        throw new Error(data.error || "Failed to generate image");
      }

      console.log("✅ Image generated:", data);

      // Image will be added via Socket.io real-time update
      // Don't set isGeneratingImage to false here - wait for the visual moment to arrive
    } catch (error: any) {
      console.error("❌ Generate image error:", error);
      alert(`Failed to generate image: ${error.message}`);
      setIsGeneratingImage(false);
    }
  };

  // Handle mouse enter (desktop only)
  const handleMouseEnter = () => {
    if (!isTouchDevice.current) {
      setShowActions(true);
    }
  };

  // Handle mouse leave (desktop only)
  const handleMouseLeave = () => {
    if (!isTouchDevice.current) {
      setShowActions(false);
    }
  };

  // Handle touch/click on the line (mobile)
  const handleLineClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't toggle if clicking on buttons or other interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest(".action-button") ||
      target.closest(".comment-badge") ||
      target.closest(".comment-button")
    ) {
      return;
    }

    // On touch devices, toggle the actions
    if (isTouchDevice.current) {
      setShowActions((prev) => !prev);
    }
  };

  return (
    <div
      ref={lineRef}
      className="story-line"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleLineClick}
    >
      {/* Line Text with Markdown Support */}
      <div className="line-text prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <span {...props} />,
            strong: ({ node, ...props }) => (
              <strong className="font-bold" {...props} />
            ),
            em: ({ node, ...props }) => <em className="italic" {...props} />,
          }}
        >
          {line}
        </ReactMarkdown>
      </div>

      {/* Image Generation Loader or Blurred Placeholder */}
      {isGeneratingImage &&
        (userPlan === "free" ? (
          <div className="my-4">
            <BlurredImagePlaceholder type="line" />
          </div>
        ) : (
          <div className="image-generation-loader">
            <div className="loader-content">
              <div className="spinner"></div>
              <span className="loader-text">Generating image with AI...</span>
            </div>
          </div>
        ))}

      {/* Embedded Images (Visual Moments) */}
      {visualMoments.length > 0 && (
        <div className="visual-moments">
          {visualMoments.map((vm, idx) => (
            <div key={idx} className="inline-visual-container">
              <img
                src={vm.imageUrl}
                alt={`Visual for: ${vm.context.substring(0, 50)}...`}
                className="inline-visual"
              />
              {/* {vm.imagePrompt && (
                <div className="visual-prompt-hint" title={vm.imagePrompt}>
                  🎨 AI Generated
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}

      {/* Comments Indicator */}
      {comments.length > 0 && (
        <button
          className="comment-badge"
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
        >
          💬 {comments.length}
        </button>
      )}

      {/* Comments Thread */}
      {showComments && (
        <CommentsThread
          comments={comments}
          sceneIdx={sceneIdx}
          lineIdx={lineIdx}
          storyId={storyId}
          idToken={idToken}
          socket={socket}
          canComment={allowInteractions}
          onRequireAuth={onRequireAuth}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Quick Actions (on hover/tap) */}
      {showActions && (
      <div className="line-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateImage();
            }}
            disabled={isGeneratingImage}
            className="action-button generate-image-button"
            title="Generate image for this line"
          >
            {isGeneratingImage ? "⏳" : "🎨"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!allowInteractions) {
                onRequireAuth?.();
              }
              setShowComments(!showComments);
            }}
            className="action-button comment-button"
            title="Add comment"
          >
            💬
          </button>
        </div>
      )}
    </div>
  );
}


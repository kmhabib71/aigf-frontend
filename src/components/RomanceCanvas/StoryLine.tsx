"use client";

import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentsThread from "./CommentsThread";
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
}: StoryLineProps) {
  const [showActions, setShowActions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const initialVisualMomentsCount = useRef(visualMoments.length);

  // Reset loader when new visual moment arrives
  useEffect(() => {
    if (visualMoments.length > initialVisualMomentsCount.current) {
      setIsGeneratingImage(false);
      initialVisualMomentsCount.current = visualMoments.length;
    }
  }, [visualMoments]);

  const handleGenerateImage = async () => {
    if (isGeneratingImage) return;

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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
        setIsGeneratingImage(false);
      }

      const data = await response.json();
      console.log("✅ Image generated:", data);

      // Image will be added via Socket.io real-time update
      // Don't set isGeneratingImage to false here - wait for the visual moment to arrive
    } catch (error: any) {
      console.error("❌ Generate image error:", error);
      alert(`Failed to generate image: ${error.message}`);
      setIsGeneratingImage(false);
    }
  };

  return (
    <div
      className="story-line"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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

      {/* Image Generation Loader */}
      {isGeneratingImage && (
        <div className="image-generation-loader">
          <div className="loader-content">
            <div className="spinner"></div>
            <span className="loader-text">Generating image with AI...</span>
          </div>
        </div>
      )}

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
              {vm.imagePrompt && (
                <div className="visual-prompt-hint" title={vm.imagePrompt}>
                  🎨 AI Generated
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comments Indicator */}
      {comments.length > 0 && (
        <button
          className="comment-badge"
          onClick={() => setShowComments(!showComments)}
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
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Quick Actions (on hover) */}
      {showActions && (
        <div className="line-actions">
          <button
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            className="action-button generate-image-button"
            title="Generate image for this line"
          >
            {isGeneratingImage ? "⏳" : "🎨"} Generate Image
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="action-button comment-button"
            title="Add comment"
          >
            💬 Comment
          </button>
        </div>
      )}
    </div>
  );
}

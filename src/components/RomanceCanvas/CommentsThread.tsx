"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import "./CommentsThread.css";

interface Comment {
  userId: string;
  displayName: string;
  text: string;
  lineNumber: number | null;
  reactions: string[];
  createdAt: string;
}

interface CommentsThreadProps {
  comments: Comment[];
  sceneIdx: number;
  lineIdx: number | null;
  storyId: string;
  idToken: string;
  socket: Socket | null;
  onClose: () => void;
}

export default function CommentsThread({
  comments,
  sceneIdx,
  lineIdx,
  storyId,
  idToken,
  socket,
  onClose,
}: CommentsThreadProps) {
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/romance/story/${storyId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            sceneIdx,
            lineIdx,
            text: newCommentText.trim(),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add comment");
      }

      const data = await response.json();
      console.log("✅ Comment added:", data);

      setNewCommentText("");

      // Comment will be added via Socket.io real-time update
    } catch (error: any) {
      console.error("❌ Add comment error:", error);
      alert(`Failed to add comment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="comments-thread">
      <div className="comments-thread-header">
        <h4>Comments</h4>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Existing Comments */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.displayName}</span>
                <span className="comment-time">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
              {comment.reactions && comment.reactions.length > 0 && (
                <div className="comment-reactions">
                  {comment.reactions.map((reaction, ridx) => (
                    <span key={ridx} className="reaction">
                      {reaction}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Comment Input */}
      <div className="new-comment-container">
        <textarea
          placeholder="Add your comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          rows={2}
          className="new-comment-input text-gray-900"
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubmitComment}
          disabled={!newCommentText.trim() || isSubmitting}
          className="submit-comment-button"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

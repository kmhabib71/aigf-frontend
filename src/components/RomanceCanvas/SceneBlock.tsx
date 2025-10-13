"use client";

import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import StoryLine from './StoryLine';
import './SceneBlock.css';

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

interface SceneBlockProps {
  scene: Scene;
  sceneIdx: number;
  storyId: string;
  idToken: string;
  socket: Socket | null;
}

export default function SceneBlock({ scene, sceneIdx, storyId, idToken, socket }: SceneBlockProps) {
  const [expanded, setExpanded] = useState(true);

  // Parse scene content into lines
  const lines = scene.content.split('\n').filter(line => line.trim());

  // Get comments count for this scene
  const sceneCommentsCount = scene.comments.length;

  return (
    <div className="scene-block">
      {/* Scene Header */}
      <div className="scene-header" onClick={() => setExpanded(!expanded)}>
        <div className="scene-header-left">
          <h3>{scene.headline || `Scene ${scene.sceneNumber}`}</h3>
          {sceneCommentsCount > 0 && (
            <span className="scene-comments-badge">💬 {sceneCommentsCount}</span>
          )}
        </div>
        <button className="scene-collapse-button">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Scene Image (if available) */}
      {expanded && scene.sceneImageUrl && (
        <div className="scene-image-container">
          <img
            src={scene.sceneImageUrl}
            alt={`Scene ${scene.sceneNumber}`}
            className="scene-image"
          />
          {scene.sceneImagePrompt && (
            <div className="scene-image-prompt-hint" title={scene.sceneImagePrompt}>
              🎨 AI Generated
            </div>
          )}
        </div>
      )}

      {/* Scene Content (Lines) - RESTORED with markdown support per line */}
      {expanded && (
        <div className="scene-content">
          {lines.map((line, lineIdx) => (
            <StoryLine
              key={lineIdx}
              line={line}
              lineIdx={lineIdx}
              sceneIdx={sceneIdx}
              storyId={storyId}
              idToken={idToken}
              socket={socket}
              visualMoments={scene.visualMoments.filter(vm => vm.lineNumber === lineIdx)}
              comments={scene.comments.filter(c => c.lineNumber === lineIdx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

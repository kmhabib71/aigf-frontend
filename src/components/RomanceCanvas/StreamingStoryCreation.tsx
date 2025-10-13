"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingStoryCreationProps {
  prompt: string;
  title: string;
  tropes: string[];
  spiceLevel: 'soft' | 'medium' | 'explicit';
  userId: string;
  socket: Socket | null;
  generateImages: boolean;
  onComplete: (storyId: string) => void;
  onError: (error: string) => void;
}

interface Scene {
  sceneNumber: number;
  content: string;
  headline?: string;
  sceneImageUrl?: string;
  isGenerating?: boolean;
}

export default function StreamingStoryCreation({
  prompt,
  title,
  tropes,
  spiceLevel,
  userId,
  socket,
  generateImages,
  onComplete,
  onError
}: StreamingStoryCreationProps) {
  const router = useRouter();
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(-1);
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  const streamingTextRef = useRef('');
  const hasStartedRef = useRef(false);
  const listenersRegisteredRef = useRef(false);

  useEffect(() => {
    if (!socket || !userId) {
      onError('Socket connection or user ID missing');
      return;
    }

    const roomId = `story-gen:${sessionId.current}`;

    console.log('🎧 [CLIENT] useEffect running, hasStarted:', hasStartedRef.current, 'listenersRegistered:', listenersRegisteredRef.current);

    // Listen for text streaming
    const handleTextChunk = (data: { chunk: string; fullContent: string }) => {
      console.log('📥 [CLIENT] *** handleTextChunk CALLED ***', data.chunk);
      console.log('📥 [CLIENT] Current streamingText length:', streamingText.length);
      streamingTextRef.current += data.chunk;
      setStreamingText(prevText => {
        const newText = prevText + data.chunk;
        console.log('📥 [CLIENT] Updated streamingText to length:', newText.length);
        return newText;
      });
    };

    // Listen for generation updates
    const handleGenerationUpdate = (data: any) => {
      try {
        console.log('📡 [CLIENT] Generation update received:', JSON.stringify(data));

        setStage(data.stage);
        setMessage(data.message);
        setProgress(data.progress || 0);

        console.log('📡 [CLIENT] State updated - Stage:', data.stage, 'Progress:', data.progress);

        switch (data.stage) {
          case 'scenes_parsed':
            console.log('📡 [CLIENT] Initializing scenes array with', data.sceneCount, 'scenes');
            setStoryTitle(data.title || title);
            // Initialize scenes array
            const initialScenes: Scene[] = [];
            for (let i = 0; i < data.sceneCount; i++) {
              initialScenes.push({
                sceneNumber: i + 1,
                content: '',
                isGenerating: false
              });
            }
            setScenes(initialScenes);
            break;

          case 'scene_streaming':
            console.log('📡 [CLIENT] Scene streaming update for scene', data.sceneIdx);
            setCurrentSceneIdx(data.sceneIdx);
            setScenes(prev => {
              const updated = [...prev];
              if (updated[data.sceneIdx]) {
                updated[data.sceneIdx].content = data.sceneContent;
                updated[data.sceneIdx].isGenerating = false;
              }
              return updated;
            });
            // Clear streaming text for next scene
            streamingTextRef.current = '';
            setStreamingText('');
            break;

          case 'image_generating':
            console.log('📡 [CLIENT] Image generating for scene', data.sceneIdx);
            setScenes(prev => {
              const updated = [...prev];
              if (updated[data.sceneIdx]) {
                updated[data.sceneIdx].isGenerating = true;
              }
              return updated;
            });
            break;

          case 'image_complete':
            console.log('📡 [CLIENT] Image complete for scene', data.sceneIdx);
            setScenes(prev => {
              const updated = [...prev];
              if (updated[data.sceneIdx]) {
                updated[data.sceneIdx].sceneImageUrl = data.imageUrl;
                updated[data.sceneIdx].isGenerating = false;
              }
              return updated;
            });
            break;

          case 'complete':
            console.log('✅ [CLIENT] Story generation complete!');
            break;

          default:
            console.log('📡 [CLIENT] Unhandled stage:', data.stage);
        }
      } catch (error) {
        console.error('❌ [CLIENT] Error in handleGenerationUpdate:', error);
      }
    };

    // Listen for success
    const handleSuccess = (data: { storyId: string; story: any }) => {
      console.log('✅ [CLIENT] Story created successfully:', data);
      setTimeout(() => {
        onComplete(data.storyId);
      }, 1500); // Brief delay to show completion
    };

    // Listen for errors
    const handleError = (data: { error: string }) => {
      console.error('❌ [CLIENT] Story generation error:', data);
      onError(data.error);
    };

    // Register event listeners (only if not already registered)
    if (!listenersRegisteredRef.current) {
      console.log('🎧 [CLIENT] Registering socket event listeners...');

      socket.on('story-text-chunk', handleTextChunk);
      socket.on('story-generation-update', handleGenerationUpdate);
      socket.on('story-generation-success', handleSuccess);
      socket.on('story-generation-error', handleError);

      listenersRegisteredRef.current = true;

      console.log('✅ [CLIENT] Event listeners registered');

      // Verify listeners are attached
      const chunkListeners = socket.listeners('story-text-chunk').length;
      const updateListeners = socket.listeners('story-generation-update').length;
      console.log(`🔍 [CLIENT] Listener counts:`, {
        'story-text-chunk': chunkListeners,
        'story-generation-update': updateListeners
      });
    } else {
      console.log('⏭️ [CLIENT] Listeners already registered, skipping');
    }

    // Emit the request (only once)
    if (!hasStartedRef.current) {
      console.log('📤 [CLIENT] Emitting create-story-streaming event to server...');
      socket.emit('create-story-streaming', {
        prompt,
        characterRef: null,
        title,
        tropes,
        spiceLevel,
        userId,
        sessionId: sessionId.current,
        generateImages
      });
      hasStartedRef.current = true;
    } else {
      console.log('⏭️ [CLIENT] Event already emitted, skipping');
    }

    // Cleanup - DON'T remove listeners on unmount (they should persist)
    // Only cleanup when component is truly destroyed
    return () => {
      console.log('🧹 [CLIENT] Cleanup function called (React Strict Mode unmount)');
      // Don't remove listeners here - let them persist across re-mounts
    };
  }, [socket, userId, prompt, title, tropes, spiceLevel, generateImages, onComplete, onError]);

  // Debug: Log all state changes
  console.log('[RENDER] StreamingStoryCreation rendering with:', {
    stage,
    progress,
    message,
    streamingTextLength: streamingText.length,
    scenesCount: scenes.length,
    currentSceneIdx
  });

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* DEBUG INFO */}
        <div className="bg-yellow-100 border border-yellow-400 p-4 mb-4 text-black">
          <strong>🔍 DEBUG INFO:</strong><br/>
          Stage: {stage || 'none'}<br/>
          Progress: {progress}%<br/>
          Message: {message || 'none'}<br/>
          Streaming Text Length: {streamingText.length}<br/>
          Scenes Count: {scenes.length}<br/>
          Current Scene: {currentSceneIdx}
        </div>

        {/* Progress Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {storyTitle || 'Creating Your Romance...'}
            </h2>
            <span className="text-lg font-semibold text-purple-600">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Stage Message */}
          <p className="text-gray-600 text-center animate-pulse">
            {message || 'Initializing story generation...'}
          </p>
        </div>

        {/* Streaming Text Display (for outline generation) */}
        {streamingText && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="animate-pulse">✍️</span>
              Story Streaming... (Stage: {stage})
            </h3>
            <div className="prose prose-lg max-w-none text-gray-900">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="text-gray-900 mb-4" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />
                }}
              >
                {streamingText}
              </ReactMarkdown>
              <span className="inline-block w-1 h-5 bg-purple-500 ml-1 animate-pulse" />
            </div>
          </div>
        )}

        {/* Scenes Display */}
        {scenes.length > 0 && (
          <div className="space-y-6">
            {scenes.map((scene, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
                  idx === currentSceneIdx ? 'ring-4 ring-purple-400' : ''
                } ${
                  scene.content ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {/* Scene Header */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Scene {scene.sceneNumber}
                    </h3>
                    {idx === currentSceneIdx && (
                      <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full animate-pulse">
                        Generating...
                      </span>
                    )}
                  </div>
                </div>

                {/* Scene Image Placeholder or Actual Image */}
                {!generateImages ? (
                  <div className="h-[400px] bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center border-2 border-dashed border-orange-300">
                    <div className="text-center text-orange-600">
                      <div className="text-6xl mb-4">🧪</div>
                      <p className="font-semibold text-lg">Testing Mode</p>
                      <p className="text-sm mt-2">Image generation disabled to save costs</p>
                    </div>
                  </div>
                ) : scene.sceneImageUrl ? (
                  <div className="relative animate-fadeIn">
                    <img
                      src={scene.sceneImageUrl}
                      alt={`Scene ${scene.sceneNumber}`}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-2">
                      ✓ Image Ready
                    </div>
                  </div>
                ) : scene.isGenerating ? (
                  <div className="h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Generating image...</p>
                    </div>
                  </div>
                ) : scene.content ? (
                  <div className="h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-2">🎨</div>
                      <p>Waiting for image...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-gray-300 text-center">
                      <div className="text-6xl mb-2">⏳</div>
                      <p>Pending...</p>
                    </div>
                  </div>
                )}

                {/* Scene Content */}
                {scene.content && (
                  <div className="p-8 animate-fadeIn">
                    <div className="prose prose-lg max-w-none text-gray-900">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="text-gray-900 mb-4" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                          em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />
                        }}
                      >
                        {scene.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Completion Message */}
        {progress === 100 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-xl p-8 mt-6 text-center animate-fadeIn">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Story is Ready!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecting to your interactive canvas...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

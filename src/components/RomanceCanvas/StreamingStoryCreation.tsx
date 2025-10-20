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
  narrativeStyle: 'third-person' | 'first-person';
  storyLength: number;
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

interface StageInfo {
  icon: string;
  label: string;
  description: string;
  color: string;
}

export default function StreamingStoryCreation({
  prompt,
  title,
  tropes,
  narrativeStyle,
  storyLength,
  spiceLevel,
  userId,
  socket,
  generateImages,
  onComplete,
  onError
}: StreamingStoryCreationProps) {
  const router = useRouter();
  const [stage, setStage] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(-1);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(60);
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  const streamingTextRef = useRef('');
  const hasStartedRef = useRef(false);
  const listenersRegisteredRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetProgressRef = useRef(0); // Target progress from backend
  const totalScenesRef = useRef(0); // Total number of scenes
  const storyIdRef = useRef<string | null>(null); // Store story ID for redirect after 100%

  // Stage information mapping for better UX
  const stageInfo: Record<string, StageInfo> = {
    initializing: {
      icon: '🚀',
      label: 'Initializing',
      description: 'Preparing AI models and connecting to server...',
      color: 'blue'
    },
    outline: {
      icon: '📝',
      label: 'Crafting Outline',
      description: 'Analyzing your prompt and generating story structure...',
      color: 'purple'
    },
    outline_complete: {
      icon: '✅',
      label: 'Outline Ready',
      description: 'Story structure created successfully!',
      color: 'green'
    },
    parsing: {
      icon: '🔍',
      label: 'Parsing Scenes',
      description: 'Breaking down story into individual scenes...',
      color: 'indigo'
    },
    scenes_parsed: {
      icon: '📚',
      label: 'Scenes Identified',
      description: 'Story organized into scenes, ready for generation',
      color: 'green'
    },
    scene_streaming: {
      icon: '✍️',
      label: 'Writing Scene',
      description: 'Creating scene content with beautiful prose...',
      color: 'pink'
    },
    image_generating: {
      icon: '🎨',
      label: 'Generating Image',
      description: 'Creating stunning visuals for this scene...',
      color: 'orange'
    },
    image_complete: {
      icon: '🖼️',
      label: 'Image Ready',
      description: 'Scene image generated successfully!',
      color: 'green'
    },
    image_skipped: {
      icon: '🧪',
      label: 'Testing Mode',
      description: 'Skipping image generation to save costs',
      color: 'yellow'
    },
    extracting_metadata: {
      icon: '🧬',
      label: 'Extracting Metadata',
      description: 'Analyzing characters, themes, and story DNA...',
      color: 'teal'
    },
    metadata_complete: {
      icon: '✨',
      label: 'Metadata Ready',
      description: 'Story analysis complete!',
      color: 'green'
    },
    finalizing: {
      icon: '🎁',
      label: 'Finalizing',
      description: 'Putting the finishing touches on your romance...',
      color: 'purple'
    },
    complete: {
      icon: '🎉',
      label: 'Complete',
      description: 'Your story is ready to read!',
      color: 'green'
    }
  };

  // Smooth progress animation - interpolates between backend updates
  useEffect(() => {
    // Always try to smoothly reach the target progress
    const targetProgress = targetProgressRef.current;

    if (progress < targetProgress && progress < 100) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const diff = targetProgress - prev;
          if (diff > 0) {
            // Faster increment for more responsive progress
            const increment = Math.max(1, Math.min(5, diff / 5));
            const newProgress = Math.min(targetProgress, prev + increment);
            console.log(`📊 Progress: ${prev.toFixed(1)}% → ${newProgress.toFixed(1)}% (target: ${targetProgress}%)`);
            return newProgress;
          }
          return prev;
        });
      }, 150); // Update every 150ms for faster animation
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [progress, targetProgressRef.current]);

  // Estimate time remaining based on progress
  useEffect(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    if (progress > 0 && progress < 100) {
      const totalEstimated = (elapsed / progress) * 100;
      const remaining = Math.max(0, Math.ceil(totalEstimated - elapsed));
      setEstimatedTimeRemaining(remaining);
    }
  }, [progress]);

  // Redirect when progress reaches 100% AND we have a story ID
  useEffect(() => {
    if (progress >= 99.5 && storyIdRef.current) {
      console.log('✅ [CLIENT] Progress at 100%, redirecting to story:', storyIdRef.current);
      setTimeout(() => {
        onComplete(storyIdRef.current!);
      }, 800); // Small delay to show completion state
    }
  }, [progress, onComplete]);

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
      streamingTextRef.current += data.chunk;
      setStreamingText(prevText => prevText + data.chunk);
    };

    // Listen for generation updates
    const handleGenerationUpdate = (data: any) => {
      try {
        console.log('📡 [CLIENT] Generation update received:', JSON.stringify(data));

        setStage(data.stage);
        setMessage(data.message);

        // Set target progress instead of directly setting it - this enables smooth animation
        if (data.progress !== undefined) {
          targetProgressRef.current = data.progress;
          console.log(`📊 [CLIENT] Target progress updated: ${data.progress}%`);
        }

        switch (data.stage) {
          case 'scenes_parsed':
            console.log('📡 [CLIENT] Initializing scenes array with', data.sceneCount, 'scenes');
            setStoryTitle(data.title || title);
            totalScenesRef.current = data.sceneCount;
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

            // Calculate smooth progress for scene generation (35% to 90%)
            // Each scene contributes to the progress range
            if (totalScenesRef.current > 0) {
              const baseProgress = 35;
              const sceneProgress = 55; // 90 - 35 = 55%
              const progressPerScene = sceneProgress / totalScenesRef.current;
              const currentSceneProgress = baseProgress + (data.sceneIdx * progressPerScene);
              targetProgressRef.current = Math.min(90, currentSceneProgress);
              console.log(`📊 [CLIENT] Scene ${data.sceneIdx + 1}/${totalScenesRef.current} - Target progress: ${targetProgressRef.current}%`);
            }

            setScenes(prev => {
              const updated = [...prev];
              if (updated[data.sceneIdx]) {
                updated[data.sceneIdx].content = data.sceneContent;
                updated[data.sceneIdx].isGenerating = false;
              }
              return updated;
            });
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
            targetProgressRef.current = 100;
            break;
        }
      } catch (error) {
        console.error('❌ [CLIENT] Error in handleGenerationUpdate:', error);
      }
    };

    // Listen for success
    const handleSuccess = (data: { storyId: string; story: any }) => {
      console.log('✅ [CLIENT] Story created successfully:', data);

      // Store story ID - the useEffect will handle redirect when progress reaches 100%
      storyIdRef.current = data.storyId;

      // Fallback timeout in case progress never reaches 100%
      setTimeout(() => {
        if (storyIdRef.current && progress < 99.5) {
          console.log('⚠️ [CLIENT] Timeout reached, forcing redirect at', progress.toFixed(1) + '%');
          onComplete(data.storyId);
        }
      }, 6000);
    };

    // Listen for errors
    const handleError = (data: { error: string }) => {
      console.error('❌ [CLIENT] Story generation error:', data);
      onError(data.error);
    };

    // Register event listeners
    if (!listenersRegisteredRef.current) {
      console.log('🎧 [CLIENT] Registering socket event listeners...');
      socket.on('story-text-chunk', handleTextChunk);
      socket.on('story-generation-update', handleGenerationUpdate);
      socket.on('story-generation-success', handleSuccess);
      socket.on('story-generation-error', handleError);
      listenersRegisteredRef.current = true;
      console.log('✅ [CLIENT] Event listeners registered');
    }

    // Emit the request (only once)
    if (!hasStartedRef.current) {
      console.log('📤 [CLIENT] Emitting create-story-streaming event to server...');
      setStage('outline');
      targetProgressRef.current = 10; // Set target instead of direct progress
      socket.emit('create-story-streaming', {
        prompt,
        characterRef: null,
        title,
        tropes,
        narrativeStyle,
        storyLength,
        spiceLevel,
        userId,
        sessionId: sessionId.current,
        generateImages
      });
      hasStartedRef.current = true;
    }

    return () => {
      console.log('🧹 [CLIENT] Cleanup function called');
    };
  }, [socket, userId, prompt, title, tropes, spiceLevel, generateImages, onComplete, onError]);

  const currentStageInfo = stageInfo[stage] || stageInfo.initializing;

  // Get color classes based on stage
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; ring: string; gradient: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-400', gradient: 'from-blue-500 to-cyan-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-400', gradient: 'from-purple-500 to-pink-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-400', gradient: 'from-green-500 to-emerald-500' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-400', gradient: 'from-indigo-500 to-blue-500' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700', ring: 'ring-pink-400', gradient: 'from-pink-500 to-rose-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-400', gradient: 'from-orange-500 to-amber-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-400', gradient: 'from-yellow-500 to-orange-500' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-700', ring: 'ring-teal-400', gradient: 'from-teal-500 to-cyan-500' },
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(currentStageInfo.color);

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Progress Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100">
          {/* Title and Progress */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl animate-bounce">{currentStageInfo.icon}</span>
              {storyTitle || 'Creating Your Romance...'}
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {progress}%
              </div>
              {progress < 100 && estimatedTimeRemaining > 0 && (
                <div className="text-xs text-gray-500">
                  ~{estimatedTimeRemaining}s remaining
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar with Glow Effect */}
          <div className="mb-6 relative">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${colorClasses.gradient} transition-all duration-700 ease-out relative`}
                style={{ width: `${progress}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            {/* Glow effect under progress bar */}
            <div
              className={`absolute -bottom-1 left-0 h-2 bg-gradient-to-r ${colorClasses.gradient} opacity-50 blur-md transition-all duration-700`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Current Stage Info */}
          <div className={`${colorClasses.bg} rounded-xl p-4 border ${colorClasses.text} border-current/20`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                  <span className="text-xl">{currentStageInfo.icon}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{currentStageInfo.label}</div>
                <div className="text-sm opacity-90">{currentStageInfo.description}</div>
              </div>
              {/* Animated spinner for active stages */}
              {progress < 100 && !['complete', 'metadata_complete', 'outline_complete', 'scenes_parsed'].includes(stage) && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {message && message !== currentStageInfo.description && (
              <div className="text-sm pl-13 opacity-80 mt-1">
                {message}
              </div>
            )}
          </div>

          {/* Stage Timeline */}
          <div className="mt-6 flex items-center justify-between text-xs">
            {['Outline', 'Parse', 'Scenes', generateImages ? 'Images' : 'Text', 'Metadata', 'Done'].map((label, idx) => {
              const stageProgress = [10, 30, 35, 90, 95, 100];
              const isComplete = progress >= stageProgress[idx];
              const isCurrent = progress >= (stageProgress[idx - 1] || 0) && progress < stageProgress[idx];

              return (
                <div key={label} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${
                    isComplete ? 'bg-green-500 text-white scale-110' :
                    isCurrent ? `${colorClasses.bg} ${colorClasses.text} ring-2 ${colorClasses.ring} scale-110` :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {isComplete ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    isComplete || isCurrent ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streaming Text Display */}
        {streamingText && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-purple-100 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="animate-pulse">✍️</span>
              Story Streaming...
            </h3>
            <div className="prose prose-lg max-w-none text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-500 border ${
                  idx === currentSceneIdx ? 'ring-4 ring-purple-400 border-purple-200 scale-[1.02]' : 'border-gray-100'
                } ${scene.content ? 'opacity-100' : 'opacity-60'}`}
              >
                {/* Scene Header */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">📖</span>
                      Scene {scene.sceneNumber}
                    </h3>
                    {idx === currentSceneIdx && (
                      <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        Generating...
                      </span>
                    )}
                    {scene.content && idx !== currentSceneIdx && (
                      <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-1">
                        <span>✓</span>
                        Complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Scene Image */}
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
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-2 shadow-lg">
                      ✓ Image Ready
                    </div>
                  </div>
                ) : scene.isGenerating ? (
                  <div className="h-[400px] bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-orange-200/20 animate-gradient"></div>
                    <div className="text-center relative z-10">
                      <div className="relative inline-block">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto mb-4"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20"></div>
                      </div>
                      <p className="text-gray-700 font-medium text-lg mb-1">Generating image...</p>
                      <p className="text-gray-500 text-sm">Creating stunning visuals for this scene</p>
                    </div>
                  </div>
                ) : scene.content ? (
                  <div className="h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-2 animate-pulse">🎨</div>
                      <p className="font-medium">Waiting for image...</p>
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-xl p-8 mt-6 text-center animate-fadeIn border-2 border-green-200">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Story is Ready!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecting to your interactive canvas...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="text-purple-600 font-medium">Loading canvas...</span>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
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

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradient {
          0%, 100% {
            transform: translateX(-25%) rotate(0deg);
          }
          50% {
            transform: translateX(25%) rotate(5deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

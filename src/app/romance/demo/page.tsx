"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RomanceCanvasDemoPage() {
  const router = useRouter();
  const [loadingStage, setLoadingStage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showStory, setShowStory] = useState(false);

  // Demo loading stages
  const loadingStages = [
    { stage: 0, text: "Analyzing your prompt...", icon: "🤔", duration: 1500 },
    { stage: 1, text: "Generating story outline (5-8 scenes)...", icon: "📝", duration: 2000 },
    { stage: 2, text: "Detecting visual moments...", icon: "🎨", duration: 1500 },
    { stage: 3, text: "Creating scene 1 image with Venice AI...", icon: "🖼️", duration: 2500 },
    { stage: 4, text: "Creating scene 2 image...", icon: "🖼️", duration: 2000 },
    { stage: 5, text: "Creating scene 3 image...", icon: "🖼️", duration: 2000 },
    { stage: 6, text: "Finalizing your romantic story...", icon: "✨", duration: 1500 },
  ];

  useEffect(() => {
    if (isGenerating && loadingStage < loadingStages.length) {
      const timer = setTimeout(() => {
        setLoadingStage(prev => prev + 1);
      }, loadingStages[loadingStage].duration);

      return () => clearTimeout(timer);
    } else if (loadingStage >= loadingStages.length) {
      setIsGenerating(false);
      setTimeout(() => setShowStory(true), 500);
    }
  }, [loadingStage, isGenerating]);

  // Demo story data
  const demoStory = {
    title: "Moonlight Confessions",
    prompt: "A forbidden office romance between a CEO and her assistant",
    tropes: ["forbidden-love", "slow-burn", "workplace"],
    spiceLevel: "medium",
    scenes: [
      {
        sceneNumber: 1,
        content: `The elevator doors slid open with a soft ding, and Emma stepped into the sleek marble lobby of Sterling Industries. Her heart raced as she clutched her leather portfolio, the weight of her new position as executive assistant settling on her shoulders.

"Miss Parker?" A deep voice called from behind the reception desk. She turned to find a tall man in an impeccable charcoal suit regarding her with piercing blue eyes. "I'm Marcus Cole. Welcome to Sterling Industries."

The way he looked at her made her breath catch. This was supposed to be professional. This was supposed to be just a job.

But the electricity between them suggested otherwise.`,
        sceneImageUrl: "/generated-images/2025-09-24/e7c86541-6f89-4bf0-af33-f0c4566993f3_1758692448537_6d58cd51_0.png",
        visualMoments: [
          {
            lineNumber: 3,
            context: "Marcus Cole regarding her with piercing blue eyes",
            imageUrl: "/generated-images/2025-09-24/e7c86541-6f89-4bf0-af33-f0c4566993f3_1758692448533_aac4a424_1.png"
          }
        ],
        comments: [
          {
            userId: "demo1",
            displayName: "RomanceReader99",
            text: "OMG the tension already! 😍",
            lineNumber: 3,
            reactions: ["❤️", "🔥"],
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      },
      {
        sceneNumber: 2,
        content: `Three weeks had passed since that first meeting, and Emma had perfected the art of professional distance. She organized Marcus's schedule with military precision, fielded calls with practiced ease, and absolutely, positively did not think about the way his cologne lingered in the air after he passed by her desk.

"Emma, could you stay late tonight?" Marcus appeared at her desk, loosening his tie. The office had emptied hours ago. "I need help with the presentation for tomorrow's board meeting."

She should say no. She should maintain boundaries.

"Of course, Mr. Cole," she heard herself say instead.

The city lights twinkled outside the floor-to-ceiling windows as they worked side by side, their shoulders occasionally brushing. The accidental touches felt anything but accidental.`,
        sceneImageUrl: "/generated-images/2025-09-24/e7c86541-6f89-4bf0-af33-f0c4566993f3_1758692448530_b57688e0_2.png",
        visualMoments: [],
        comments: [
          {
            userId: "demo2",
            displayName: "BookwormSarah",
            text: "The slow burn is killing me! More tension please! 🔥",
            lineNumber: null,
            reactions: ["🔥", "💕"],
            createdAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      },
      {
        sceneNumber: 3,
        content: `"You're staring," Emma whispered, not looking up from the spreadsheet on her laptop.

Marcus didn't deny it. "I can't help it. You have this little crease between your eyebrows when you concentrate. It's... distracting."

She finally looked up, finding him mere inches away. When had he moved so close? The presentation lay forgotten on the conference table.

"Mr. Cole—"

"Marcus," he interrupted softly. "When it's just us, call me Marcus."

"This is inappropriate," she breathed, even as her body leaned toward his.

"I know." His hand came up to cup her cheek, thumb brushing across her lower lip. "Tell me to stop, Emma."

But she couldn't. Because she'd been waiting for this moment since the day they met.

Their lips met in a kiss that shattered every professional boundary they'd carefully constructed.`,
        sceneImageUrl: "/generated-images/2025-09-24/e7c86541-6f89-4bf0-af33-f0c4566993f3_1758692448538_c474fae1_3.png",
        visualMoments: [
          {
            lineNumber: 6,
            context: "Their lips met in a kiss",
            imageUrl: "/generated-images/2025-09-24/e655536e-b38d-4f55-ac72-07a64bcd8eb9_1758693059434_d5fbd1d6_0.png"
          }
        ],
        comments: [
          {
            userId: "demo3",
            displayName: "TropeLover",
            text: "FINALLY!! This is what I've been waiting for! 💋",
            lineNumber: 6,
            reactions: ["❤️", "😍", "🔥"],
            createdAt: new Date(Date.now() - 300000).toISOString()
          },
          {
            userId: "demo4",
            displayName: "StoryAddict",
            text: "The forbidden love trope done RIGHT! Continue this story please!",
            lineNumber: null,
            reactions: ["💕"],
            createdAt: new Date(Date.now() - 60000).toISOString()
          }
        ]
      }
    ]
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Generation Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            {/* Icon Animation */}
            <div className="text-8xl mb-8 animate-bounce">
              {loadingStages[loadingStage]?.icon || "✨"}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {loadingStage + 1} of {loadingStages.length} steps
              </p>
            </div>

            {/* Current Stage */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-pulse">
              {loadingStages[loadingStage]?.text || "Almost done..."}
            </h2>

            {/* Stage List */}
            <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
              {loadingStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    idx < loadingStage
                      ? 'bg-green-50 text-green-700'
                      : idx === loadingStage
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span className="text-2xl">
                    {idx < loadingStage ? '✓' : idx === loadingStage ? stage.icon : '○'}
                  </span>
                  <span className="text-sm">{stage.text}</span>
                </div>
              ))}
            </div>

            {/* Fun Fact */}
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 italic">
                💡 Did you know? Our AI analyzes your story for emotional peaks to generate the perfect images!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showStory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back to Home
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                DEMO MODE
              </span>
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {demoStory.title}
              </h2>
            </div>
            <button
              onClick={() => router.push('/romance/create')}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 shadow-lg"
            >
              ✨ Create Your Story
            </button>
          </div>
        </div>

        {/* Story Canvas Demo */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Story Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {demoStory.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {demoStory.tropes.map((trope) => (
                  <span
                    key={trope}
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {trope.replace('-', ' ')}
                  </span>
                ))}
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  🔥 {demoStory.spiceLevel}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {demoStory.scenes.length} scenes
                </span>
              </div>
              <p className="text-gray-600 italic">"{demoStory.prompt}"</p>
            </div>

            {/* Scenes */}
            <div className="space-y-8">
              {demoStory.scenes.map((scene, sceneIdx) => (
                <div
                  key={sceneIdx}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn"
                  style={{ animationDelay: `${sceneIdx * 0.2}s` }}
                >
                  {/* Scene Header */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        Scene {scene.sceneNumber}
                      </h3>
                      {scene.comments.length > 0 && (
                        <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-medium">
                          💬 {scene.comments.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scene Image */}
                  {scene.sceneImageUrl && (
                    <div className="relative">
                      <img
                        src={scene.sceneImageUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        className="w-full h-[500px] object-cover"
                      />
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                        🎨 AI Generated
                      </div>
                    </div>
                  )}

                  {/* Scene Content */}
                  <div className="p-8">
                    {scene.content.split('\n\n').map((paragraph, pIdx) => {
                      const paraLineNumber = scene.content
                        .split('\n\n')
                        .slice(0, pIdx)
                        .join('\n\n').split('\n').length;
                      const visualMoment = scene.visualMoments.find(
                        (vm) => vm.lineNumber >= paraLineNumber && vm.lineNumber < paraLineNumber + paragraph.split('\n').length
                      );

                      return (
                        <div key={pIdx} className="mb-6 group relative">
                          <p className="text-gray-800 leading-relaxed text-lg mb-4">
                            {paragraph}
                          </p>

                          {/* Inline Visual Moment */}
                          {visualMoment && (
                            <div className="my-6 rounded-xl overflow-hidden shadow-2xl max-w-2xl">
                              <img
                                src={visualMoment.imageUrl}
                                alt={visualMoment.context}
                                className="w-full h-auto"
                              />
                              <div className="bg-gray-900 text-white px-4 py-2 text-sm">
                                🎨 Generated for: "{visualMoment.context.substring(0, 60)}..."
                              </div>
                            </div>
                          )}

                          {/* Hover Actions (Demo) */}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-purple-600">
                              🎨 Generate Image
                            </button>
                            <button className="px-3 py-1 bg-pink-500 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-pink-600">
                              💬 Comment
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Comments */}
                    {scene.comments.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-4">💬 Comments</h4>
                        {scene.comments.map((comment, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-pink-600">
                                {comment.displayName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.text}</p>
                            {comment.reactions.length > 0 && (
                              <div className="flex gap-2">
                                {comment.reactions.map((reaction, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="px-2 py-1 bg-white rounded-full text-sm border border-gray-300"
                                  >
                                    {reaction}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Story Button (Demo) */}
            <div className="mt-12 flex justify-center">
              <div className="text-center">
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                  🔄 Continue Story with AI
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Venice AI will analyze reader comments and generate the next scene!
                </p>
              </div>
            </div>

            {/* Feature Showcase */}
            <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                ✨ <span>Interactive Romance Canvas Features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h4 className="font-semibold mb-1">Line-by-Line Image Generation</h4>
                    <p className="text-gray-600">Click any line to generate a custom image with Venice AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-semibold mb-1">Real-Time Comments</h4>
                    <p className="text-gray-600">Add comments to specific lines and see updates instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <h4 className="font-semibold mb-1">AI Story Continuation</h4>
                    <p className="text-gray-600">Venice uncensored AI generates next scenes based on reader feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
                  <span className="text-2xl">🖼️</span>
                  <div>
                    <h4 className="font-semibold mb-1">Inline Visual Moments</h4>
                    <p className="text-gray-600">Images embedded directly in the text at key emotional moments</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/romance/create')}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  🚀 Create Your Own Romance Story Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

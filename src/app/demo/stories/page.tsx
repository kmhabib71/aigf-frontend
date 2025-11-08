"use client";

import { useState } from "react";
import Link from "next/link";

interface Story {
  id: string;
  title: string;
  prompt: string;
  content: string;
  images: string[];
  timestamp: Date;
}

export default function StoriesPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentStory(null);

    try {
      // Get character from localStorage
      const character = JSON.parse(localStorage.getItem("demoCharacter") || '{"name":"Sophia"}');

      // Call backend API for story generation
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/demo/stories/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          character: character
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await res.json();
      const demoStory: Story = {
        ...data.story,
        timestamp: new Date(data.story.timestamp)
      };

      setCurrentStory(demoStory);
      setStories(prev => [demoStory, ...prev]);
      setPrompt("");
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    "A romantic sunset date on a private beach",
    "Cozy evening together in a mountain cabin",
    "Late night conversation at a rooftop bar",
    "Exploring a mysterious garden at midnight",
    "Rainy day indoor adventure"
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/demo" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-black text-2xl">AI</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Story Generation
            </span>
          </Link>

          <Link
            href="/demo/chat"
            className="px-6 py-2 border-2 border-purple-500 text-purple-300 font-bold rounded-lg hover:bg-purple-500/20 hover:border-pink-500 transition-all"
          >
            Back to Chat
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Story Generator */}
        <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 mb-12 shadow-2xl shadow-purple-500/20">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Create Your Story
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Describe the scene you want to create. The AI will generate an illustrated story for you.
          </p>

          <form onSubmit={generateStory} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-bold mb-3 text-sm">
                Story Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 resize-none transition-all"
                placeholder="Describe your story... (e.g., 'A romantic sunset date on a private beach')"
                disabled={isGenerating}
              />
            </div>

            {/* Quick Prompts */}
            <div>
              <label className="block text-gray-300 font-bold mb-3 text-sm">
                Quick Ideas:
              </label>
              <div className="flex flex-wrap gap-3">
                {quickPrompts.map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setPrompt(quick)}
                    className="px-5 py-2.5 bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 text-gray-300 rounded-lg hover:border-pink-500 hover:bg-purple-500/20 transition-all text-sm font-semibold"
                    disabled={isGenerating}
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-black text-lg rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Story...
                </span>
              ) : (
                "Generate Story"
              )}
            </button>
          </form>
        </div>

        {/* Current Story */}
        {currentStory && (
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 mb-12 shadow-2xl shadow-purple-500/20">
            <div className="mb-8">
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                {currentStory.title}
              </h2>
              <p className="text-gray-500 text-sm">
                Generated {currentStory.timestamp.toLocaleString()}
              </p>
            </div>

            {/* Story Content */}
            <div className="prose prose-invert max-w-none mb-10">
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {currentStory.content}
              </div>
            </div>

            {/* Generated Images */}
            <div>
              <h3 className="text-2xl font-black text-white mb-6">
                Illustrated Scenes
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {currentStory.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center overflow-hidden hover:border-pink-500 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 text-center p-6">
                      <div className="text-7xl mb-4">🎨</div>
                      <p className="text-gray-400 font-semibold">
                        AI Generated Image {idx + 1}
                      </p>
                      <p className="text-gray-600 text-xs mt-2">
                        (Demo placeholder)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-6 text-center">
                In production, these would be real AI-generated images using NSFW-friendly APIs
              </p>
            </div>
          </div>
        )}

        {/* Previous Stories */}
        {stories.length > 1 && (
          <div>
            <h2 className="text-3xl font-black text-white mb-6">
              Previous Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {stories.slice(1).map((story) => (
                <div
                  key={story.id}
                  className="group bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-2xl p-6 hover:border-pink-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer"
                  onClick={() => setCurrentStory(story)}
                >
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {story.timestamp.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {story.content}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {story.images.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg group-hover:border-pink-500 transition-all"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

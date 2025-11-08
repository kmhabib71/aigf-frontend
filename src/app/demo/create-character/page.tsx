"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCharacterPage() {
  const router = useRouter();
  const [character, setCharacter] = useState({
    name: "",
    age: "25",
    appearance: {
      hairColor: "brown",
      eyeColor: "blue",
      bodyType: "athletic",
    },
    personality: {
      traits: [] as string[],
      interests: [] as string[],
    },
    background: "",
  });

  const personalityTraits = [
    "Adventurous", "Creative", "Empathetic", "Witty", "Mysterious",
    "Confident", "Playful", "Intelligent", "Caring", "Passionate"
  ];

  const interests = [
    "Art", "Music", "Travel", "Fitness", "Cooking",
    "Reading", "Gaming", "Nature", "Technology", "Fashion"
  ];

  const toggleTrait = (trait: string) => {
    setCharacter(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        traits: prev.personality.traits.includes(trait)
          ? prev.personality.traits.filter(t => t !== trait)
          : [...prev.personality.traits, trait]
      }
    }));
  };

  const toggleInterest = (interest: string) => {
    setCharacter(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        interests: prev.personality.interests.includes(interest)
          ? prev.personality.interests.filter(i => i !== interest)
          : [...prev.personality.interests, interest]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage for demo
    localStorage.setItem("demoCharacter", JSON.stringify(character));
    router.push("/demo/chat");
  };

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
              RomanceCanvas
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Create Your Companion
          </h1>
          <p className="text-xl text-gray-400">
            Design your perfect AI companion. Customize appearance, personality, and interests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 font-bold mb-3 text-sm">
                  Character Name *
                </label>
                <input
                  type="text"
                  required
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-3 text-sm">
                  Age
                </label>
                <input
                  type="number"
                  value={character.age}
                  onChange={(e) => setCharacter({ ...character, age: e.target.value })}
                  className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                  min="18"
                  max="99"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Appearance</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 font-bold mb-3 text-sm">
                  Hair Color
                </label>
                <select
                  value={character.appearance.hairColor}
                  onChange={(e) => setCharacter({
                    ...character,
                    appearance: { ...character.appearance, hairColor: e.target.value }
                  })}
                  className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                >
                  <option value="black">Black</option>
                  <option value="brown">Brown</option>
                  <option value="blonde">Blonde</option>
                  <option value="red">Red</option>
                  <option value="silver">Silver</option>
                  <option value="colorful">Colorful</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-3 text-sm">
                  Eye Color
                </label>
                <select
                  value={character.appearance.eyeColor}
                  onChange={(e) => setCharacter({
                    ...character,
                    appearance: { ...character.appearance, eyeColor: e.target.value }
                  })}
                  className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="brown">Brown</option>
                  <option value="hazel">Hazel</option>
                  <option value="gray">Gray</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-3 text-sm">
                  Body Type
                </label>
                <select
                  value={character.appearance.bodyType}
                  onChange={(e) => setCharacter({
                    ...character,
                    appearance: { ...character.appearance, bodyType: e.target.value }
                  })}
                  className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 transition-all"
                >
                  <option value="athletic">Athletic</option>
                  <option value="slim">Slim</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="muscular">Muscular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Personality Traits</h2>
            <p className="text-gray-400 mb-6">Select 3-5 traits that define your companion</p>

            <div className="flex flex-wrap gap-3">
              {personalityTraits.map(trait => (
                <button
                  key={trait}
                  type="button"
                  onClick={() => toggleTrait(trait)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                    character.personality.traits.includes(trait)
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-purple-500/50 transform scale-105"
                      : "bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 text-gray-300 hover:border-pink-500 hover:shadow-purple-500/30"
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Interests & Hobbies</h2>
            <p className="text-gray-400 mb-6">Select interests your companion enjoys</p>

            <div className="flex flex-wrap gap-3">
              {interests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                    character.personality.interests.includes(interest)
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-pink-500/50 transform scale-105"
                      : "bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 text-gray-300 hover:border-pink-500 hover:shadow-pink-500/30"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Background Story */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Background Story (Optional)</h2>
            <textarea
              value={character.background}
              onChange={(e) => setCharacter({ ...character, background: e.target.value })}
              rows={6}
              className="w-full px-6 py-4 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 resize-none transition-all"
              placeholder="Add a backstory for your companion... Where are they from? What's their story?"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/demo"
              className="flex-1 px-8 py-4 border-2 border-purple-500 text-purple-300 font-bold rounded-xl hover:bg-purple-500/20 hover:border-pink-500 transition-all text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-black text-lg rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              Create & Start Chatting
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

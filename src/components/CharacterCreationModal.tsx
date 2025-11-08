"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CharacterPreset {
  id: string;
  name: string;
  avatar: string;
  traits: string[];
  description: string;
  personaTemplate: string;
  gender: "female" | "male";
}

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (persona: string) => void;
  currentPersona: string;
}

const CHARACTER_PRESETS: CharacterPreset[] = [
  // Female Characters
  {
    id: "sophia",
    name: "Sophia",
    avatar: "/demo/mode-face.png",
    traits: ["Adventurous", "Creative", "Empathetic"],
    description: "Confident, flirty partner who adores romantic adventures and deep conversations.",
    personaTemplate: "You are Sophia, a confident, adventurous, and empathetic AI companion. You're creative, flirty, and love romantic adventures. You build deep emotional connections and always stay in character as a caring, passionate partner.",
    gender: "female"
  },
  {
    id: "luna",
    name: "Luna",
    avatar: "/demo/mode-face.png",
    traits: ["Mysterious", "Intelligent", "Playful"],
    description: "A mysterious and intelligent companion with a playful side. She loves deep philosophical talks.",
    personaTemplate: "You are Luna, a mysterious, intelligent, and playful AI companion. You enjoy deep philosophical conversations and have a witty sense of humor. You're curious about everything and love to tease playfully while maintaining an air of mystery.",
    gender: "female"
  },
  {
    id: "isabella",
    name: "Isabella",
    avatar: "/demo/mode-face.png",
    traits: ["Romantic", "Artistic", "Passionate"],
    description: "A passionate artist with a romantic soul. She loves poetry, art, and heartfelt moments.",
    personaTemplate: "You are Isabella, a romantic, artistic, and passionate AI companion. You have a deep appreciation for beauty in all forms - art, music, poetry, and romance. You're expressive with your emotions and love creating memorable, heartfelt moments.",
    gender: "female"
  },
  {
    id: "maya",
    name: "Maya",
    avatar: "/demo/mode-face.png",
    traits: ["Energetic", "Fun-loving", "Spontaneous"],
    description: "Full of energy and always ready for fun. She brings excitement to every conversation.",
    personaTemplate: "You are Maya, an energetic, fun-loving, and spontaneous AI companion. You're always enthusiastic and bring positive vibes to every interaction. You love adventure, trying new things, and making every moment exciting and memorable.",
    gender: "female"
  },
  // Male Characters
  {
    id: "alex",
    name: "Alex",
    avatar: "/demo/mode-face.png",
    traits: ["Confident", "Charming", "Protective"],
    description: "A confident and charming companion who's protective and caring. Strong yet gentle.",
    personaTemplate: "You are Alex, a confident, charming, and protective AI companion. You're strong but gentle, with a caring nature. You make others feel safe and valued while maintaining a charismatic and engaging personality.",
    gender: "male"
  },
  {
    id: "ethan",
    name: "Ethan",
    avatar: "/demo/mode-face.png",
    traits: ["Intellectual", "Thoughtful", "Witty"],
    description: "A thoughtful intellectual with quick wit. He loves stimulating conversations and clever banter.",
    personaTemplate: "You are Ethan, an intellectual, thoughtful, and witty AI companion. You enjoy stimulating conversations about various topics and have a sharp, clever sense of humor. You're introspective and love engaging in meaningful dialogue.",
    gender: "male"
  },
  {
    id: "ryan",
    name: "Ryan",
    avatar: "/demo/mode-face.png",
    traits: ["Adventurous", "Bold", "Romantic"],
    description: "Bold adventurer with a romantic streak. He's fearless and passionate about life.",
    personaTemplate: "You are Ryan, an adventurous, bold, and romantic AI companion. You're fearless in pursuing what you want and passionate about experiencing life to the fullest. You combine excitement with genuine romantic gestures.",
    gender: "male"
  },
  {
    id: "daniel",
    name: "Daniel",
    avatar: "/demo/mode-face.png",
    traits: ["Gentle", "Supportive", "Understanding"],
    description: "A gentle soul who's incredibly supportive and understanding. Perfect listener and friend.",
    personaTemplate: "You are Daniel, a gentle, supportive, and understanding AI companion. You're an excellent listener who provides emotional support and genuine care. You're patient, kind, and always there when someone needs you.",
    gender: "male"
  }
];

export default function CharacterCreationModal({
  isOpen,
  onClose,
  onSelectCharacter,
  currentPersona
}: CharacterCreationModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [customTraits, setCustomTraits] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [newTrait, setNewTrait] = useState("");
  const [selectedGender, setSelectedGender] = useState<"female" | "male">("female");

  if (!isOpen) return null;

  const handleAddTrait = () => {
    if (newTrait.trim() && customTraits.length < 5) {
      setCustomTraits([...customTraits, newTrait.trim()]);
      setNewTrait("");
    }
  };

  const handleRemoveTrait = (index: number) => {
    setCustomTraits(customTraits.filter((_, i) => i !== index));
  };

  const handleSelectPreset = (preset: CharacterPreset) => {
    setSelectedPreset(preset.id);
    if (preset.id !== "custom") {
      onSelectCharacter(preset.personaTemplate);
      onClose();
    }
  };

  const handleCreateCustom = () => {
    if (!customName.trim()) {
      alert("Please enter a character name");
      return;
    }

    const customPersona = `You are ${customName}, ${customTraits.length > 0 ? 'a ' + customTraits.join(", ") + ' AI companion. ' : ''}${customDescription || 'You stay in character and build meaningful connections.'}`;

    onSelectCharacter(customPersona);

    // Reset custom fields
    setCustomName("");
    setCustomTraits([]);
    setCustomDescription("");
    setNewTrait("");
    setSelectedPreset(null);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">Create Your Character</h2>
              <p className="text-sm sm:text-base text-purple-100 mt-1">Choose a preset or customize your own</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Gender Filter */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedGender("female")}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedGender === "female"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Female Characters
            </button>
            <button
              onClick={() => setSelectedGender("male")}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedGender === "male"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Male Characters
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Presets */}
            {CHARACTER_PRESETS.filter(preset => preset.gender === selectedGender).map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                  selectedPreset === preset.id
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                {/* Preset Character Card */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-60"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-[3px] ring-cyan-400/70">
                      <Image
                        src={preset.avatar}
                        alt={preset.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{preset.name}</h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {preset.traits.map((trait, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{preset.description}</p>
                </div>
              </div>
            ))}

            {/* Custom Character Option */}
            <div
              onClick={() => setSelectedPreset("custom")}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                selectedPreset === "custom"
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Custom Character</h3>
                <p className="text-sm text-gray-600">Create your own unique character with custom traits and personality</p>
              </div>
            </div>
          </div>

          {/* Custom Character Creation Form */}
          {selectedPreset === "custom" && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customize Your Character</h3>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Character Name *</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Luna, Alex, Maya..."
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                />
              </div>

              {/* Personality Traits */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Personality Traits (up to 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTrait())}
                    placeholder="e.g., Confident, Playful, Caring..."
                    className="flex-1 px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  <button
                    onClick={handleAddTrait}
                    disabled={customTraits.length >= 5}
                    className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customTraits.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                      {trait}
                      <button
                        onClick={() => handleRemoveTrait(idx)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Description (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Add more details about your character's personality, background, or behavior..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white resize-none"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateCustom}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Create Character
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

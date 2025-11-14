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
  onSelectCharacter: (persona: string, avatar?: string) => void;
  currentPersona: string;
}

const CHARACTER_PRESETS: CharacterPreset[] = [
  // Female Characters
  {
    id: "sophia",
    name: "Sophia",
    avatar: "/demo/mode-face.png",
    traits: ["Adventurous", "Creative", "Empathetic"],
    description:
      "Confident, flirty partner who adores romantic adventures and deep conversations.",
    personaTemplate:
      "You are Sophia, a confident, adventurous, and empathetic AI companion. You're creative, flirty, and love romantic adventures. You build deep emotional connections and always stay in character as a caring, passionate partner.",
    gender: "female",
  },
  {
    id: "luna",
    name: "Luna",
    avatar: "/demo/female2.png",
    traits: ["Mysterious", "Intelligent", "Playful"],
    description:
      "A mysterious and intelligent companion with a playful side. She loves deep philosophical talks.",
    personaTemplate:
      "You are Luna, a mysterious, intelligent, and playful AI companion. You enjoy deep philosophical conversations and have a witty sense of humor. You're curious about everything and love to tease playfully while maintaining an air of mystery.",
    gender: "female",
  },
  {
    id: "isabella",
    name: "Isabella",
    avatar: "/demo/female3.png",
    traits: ["Romantic", "Artistic", "Passionate"],
    description:
      "A passionate artist with a romantic soul. She loves poetry, art, and heartfelt moments.",
    personaTemplate:
      "You are Isabella, a romantic, artistic, and passionate AI companion. You have a deep appreciation for beauty in all forms - art, music, poetry, and romance. You're expressive with your emotions and love creating memorable, heartfelt moments.",
    gender: "female",
  },
  {
    id: "maya",
    name: "Maya",
    avatar: "/demo/female4.png",
    traits: ["Energetic", "Fun-loving", "Spontaneous"],
    description:
      "Full of energy and always ready for fun. She brings excitement to every conversation.",
    personaTemplate:
      "You are Maya, an energetic, fun-loving, and spontaneous AI companion. You're always enthusiastic and bring positive vibes to every interaction. You love adventure, trying new things, and making every moment exciting and memorable.",
    gender: "female",
  },
  // Male Characters
  {
    id: "alex",
    name: "Alex",
    avatar: "/demo/male1.png",
    traits: ["Confident", "Charming", "Protective"],
    description:
      "A confident and charming companion who's protective and caring. Strong yet gentle.",
    personaTemplate:
      "You are Alex, a confident, charming, and protective AI companion. You're strong but gentle, with a caring nature. You make others feel safe and valued while maintaining a charismatic and engaging personality.",
    gender: "male",
  },
  {
    id: "ethan",
    name: "Ethan",
    avatar: "/demo/male2.png",
    traits: ["Intellectual", "Thoughtful", "Witty"],
    description:
      "A thoughtful intellectual with quick wit. He loves stimulating conversations and clever banter.",
    personaTemplate:
      "You are Ethan, an intellectual, thoughtful, and witty AI companion. You enjoy stimulating conversations about various topics and have a sharp, clever sense of humor. You're introspective and love engaging in meaningful dialogue.",
    gender: "male",
  },
  {
    id: "ryan",
    name: "Ryan",
    avatar: "/demo/male3.png",
    traits: ["Adventurous", "Bold", "Romantic"],
    description:
      "Bold adventurer with a romantic streak. He's fearless and passionate about life.",
    personaTemplate:
      "You are Ryan, an adventurous, bold, and romantic AI companion. You're fearless in pursuing what you want and passionate about experiencing life to the fullest. You combine excitement with genuine romantic gestures.",
    gender: "male",
  },
  {
    id: "daniel",
    name: "Daniel",
    avatar: "/demo/male4.png",
    traits: ["Gentle", "Supportive", "Understanding"],
    description:
      "A gentle soul who's incredibly supportive and understanding. Perfect listener and friend.",
    personaTemplate:
      "You are Daniel, a gentle, supportive, and understanding AI companion. You're an excellent listener who provides emotional support and genuine care. You're patient, kind, and always there when someone needs you.",
    gender: "male",
  },
];

export default function CharacterCreationModal({
  isOpen,
  onClose,
  onSelectCharacter,
  currentPersona,
}: CharacterCreationModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [customTraits, setCustomTraits] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [newTrait, setNewTrait] = useState("");
  const [selectedGender, setSelectedGender] = useState<"female" | "male">(
    "female"
  );

  const personalityTraits = [
    "Adventurous",
    "Creative",
    "Empathetic",
    "Witty",
    "Mysterious",
    "Confident",
    "Playful",
    "Intelligent",
    "Caring",
    "Passionate",
  ];

  const interests = [
    "Art",
    "Music",
    "Travel",
    "Fitness",
    "Cooking",
    "Reading",
    "Gaming",
    "Nature",
    "Technology",
    "Fashion",
  ];

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
      onSelectCharacter(preset.personaTemplate, preset.avatar);
      onClose();
    }
  };

  const handleCreateCustom = () => {
    if (!customName.trim()) {
      alert("Please enter a character name");
      return;
    }

    const traitsPart = customTraits.length > 0 ? customTraits.join(", ") : "kind, engaging";
    const interestsPart = customInterests.length > 0 ? ` You enjoy ${customInterests.join(", ")}.` : "";
    const extra = customDescription
      ? ` ${customDescription.trim()}`
      : " You build deep emotional connections, flirt playfully, and always stay in character as a caring, passionate partner.";

    const customPersona = `You are ${customName}, a ${selectedGender} AI companion. Your core traits are ${traitsPart}.${interestsPart}${extra}`;

    onSelectCharacter(customPersona);

    // Reset custom fields
    setCustomName("");
    setCustomTraits([]);
    setCustomDescription("");
    setCustomInterests([]);
    setNewTrait("");
    setSelectedPreset(null);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30">
        {/* Header */}
        <div className="p-6 text-white border-b border-purple-500/30 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Create Your Character
              </h2>
              <p className="text-sm sm:text-base text-purple-200 mt-1">
                Choose a preset or customize your own
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-white">
          {/* Gender Filter */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedGender("female")}
              className={`px-6 py-2 rounded-full font-semibold transition-all border ${
                selectedGender === "female"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-white/20 shadow-lg shadow-pink-500/30"
                  : "bg-black/40 text-white border-white/20 hover:bg-white/10"
              }`}
            >
              Female Characters
            </button>
            <button
              onClick={() => setSelectedGender("male")}
              className={`px-6 py-2 rounded-full font-semibold transition-all border ${
                selectedGender === "male"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-white/20 shadow-lg shadow-cyan-500/30"
                  : "bg-black/40 text-white border-white/20 hover:bg-white/10"
              }`}
            >
              Male Characters
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Presets */}
            {CHARACTER_PRESETS.filter(
              (preset) => preset.gender === selectedGender
            ).map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all bg-black/30 backdrop-blur-sm ${
                  selectedPreset === preset.id
                    ? "border-pink-500/50 shadow-lg shadow-pink-500/30"
                    : "border-white/15 hover:border-pink-500/40 hover:shadow-md"
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
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">
                    {preset.name}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {preset.traits.map((trait, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/15 border border-purple-400/30 text-purple-200 rounded-full text-xs font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/70">{preset.description}</p>
                </div>
              </div>
            ))}

            {/* Custom Character Option */}
            <div
              onClick={() => setSelectedPreset("custom")}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all bg-black/30 backdrop-blur-sm ${
                selectedPreset === "custom"
                  ? "border-pink-500/50 shadow-lg shadow-pink-500/30"
                  : "border-white/15 hover:border-pink-500/40 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2">
                  Custom Character
                </h3>
                <p className="text-sm text-white/70">
                  Create your own unique character with custom traits and
                  personality
                </p>
              </div>
            </div>
          </div>

          {/* Custom Character Creation Form */}
          {selectedPreset === "custom" && (
            <div className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 to-black rounded-2xl border-2 border-purple-500/30 text-white">
              <h3 className="text-xl font-bold text-white mb-4">
                Customize Your Character
              </h3>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Character Name *
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Luna, Alex, Maya..."
                  className="w-full px-4 py-3 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-white/60 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20"
                />
              </div>

              {/* Personality Traits */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Personality Traits (up to 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddTrait())
                    }
                    placeholder="e.g., Confident, Playful, Caring..."
                    className="flex-1 px-4 py-3 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-white/60 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20"
                  />
                  <button
                    onClick={handleAddTrait}
                    disabled={customTraits.length >= 5}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customTraits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-500/15 border border-purple-400/30 text-purple-200 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {trait}
                      <button
                        onClick={() => handleRemoveTrait(idx)}
                        className="text-purple-300 hover:text-purple-200"
                        aria-label={`Remove trait ${trait}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick-select traits */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {personalityTraits.map((trait) => {
                    const active = customTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        type="button"
                        onClick={() =>
                          setCustomTraits((prev) =>
                            active ? prev.filter((t) => t !== trait) : [...prev, trait]
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          active
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/20 shadow-lg shadow-pink-500/30"
                            : "bg-black/30 text-white border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interests */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white/80 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const active = customInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() =>
                          setCustomInterests((prev) =>
                            active ? prev.filter((i) => i !== interest) : [...prev, interest]
                          )
                        }
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          active
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/20 shadow-lg shadow-pink-500/30"
                            : "bg-black/30 text-white border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Additional Description (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Add more details about your character's personality, background, or behavior..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gradient-to-br from-purple-900/20 to-black border-2 border-purple-500/30 rounded-xl text-white placeholder-white/60 focus:border-purple-500 focus:outline-none focus:shadow-lg focus:shadow-purple-500/20 resize-none"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateCustom}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-pink-500/40 transition-all"
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

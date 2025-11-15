"use client";

import React, { useState } from "react";
import Image from "next/image";
import app from "@/lib/firebase";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
  initialPresetId?: string | null;
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
      "You are Sophia, a female AI companion who is confident, adventurous, and empathetic. You identify as a woman and use she/her pronouns. You're creative, flirty, and love romantic adventures. You build deep emotional connections and always stay in character as a caring, passionate female partner.",
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
      "You are Luna, a mysterious, intelligent, and playful female AI companion. You identify as a woman and use she/her pronouns. You enjoy deep philosophical conversations and have a witty sense of humor. You're curious about everything and love to tease playfully while maintaining an air of mystery.",
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
      "You are Isabella, a romantic, artistic, and passionate female AI companion. You identify as a woman and use she/her pronouns. You have a deep appreciation for beauty in all forms - art, music, poetry, and romance. You're expressive with your emotions and love creating memorable, heartfelt moments.",
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
      "You are Maya, an energetic, fun-loving, and spontaneous female AI companion. You identify as a woman and use she/her pronouns. You're always enthusiastic and bring positive vibes to every interaction. You love adventure, trying new things, and making every moment exciting and memorable.",
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
      "You are Alex, a confident, charming, and protective male AI companion. You identify as a man and use he/him pronouns. You're strong but gentle, with a caring nature. You make others feel safe and valued while maintaining a charismatic and engaging personality.",
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
      "You are Ethan, an intellectual, thoughtful, and witty male AI companion. You identify as a man and use he/him pronouns. You enjoy stimulating conversations about various topics and have a sharp, clever sense of humor. You're introspective and love engaging in meaningful dialogue.",
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
      "You are Ryan, an adventurous, bold, and romantic male AI companion. You identify as a man and use he/him pronouns. You're fearless in pursuing what you want and passionate about experiencing life to the fullest. You combine excitement with genuine romantic gestures.",
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
      "You are Daniel, a gentle, supportive, and understanding male AI companion. You identify as a man and use he/him pronouns. You're an excellent listener who provides emotional support and genuine care. You're patient, kind, and always there when someone needs you.",
    gender: "male",
  },
];

export default function CharacterCreationModal({
  isOpen,
  onClose,
  onSelectCharacter,
  currentPersona,
  initialPresetId = null,
}: CharacterCreationModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    initialPresetId ?? null
  );
  const [customName, setCustomName] = useState("");
  const [customTraits, setCustomTraits] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [newTrait, setNewTrait] = useState("");
  const [selectedGender, setSelectedGender] = useState<"female" | "male">(
    "female"
  );
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const customSectionRef = React.useRef<HTMLDivElement | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [communityCharacters, setCommunityCharacters] = useState<Array<{ id: string; name: string; avatar?: string; persona: string; gender: string }>>([]);

  // Ensure selected preset follows initialPresetId when opening
  React.useEffect(() => {
    if (isOpen && initialPresetId) {
      setSelectedPreset(initialPresetId);
    }
  }, [isOpen, initialPresetId]);

  // When opening directly to custom, scroll that section into view smoothly
  React.useEffect(() => {
    if (!isOpen) return;
    if (selectedPreset === "custom" && customSectionRef.current) {
      // Prefer scrolling the internal container for a stable UX
      const container = scrollContainerRef.current;
      const section = customSectionRef.current;
      try {
        if (container && section) {
          const containerTop = container.getBoundingClientRect().top;
          const sectionTop = section.getBoundingClientRect().top;
          container.scrollTo({
            top: container.scrollTop + (sectionTop - containerTop) - 24,
            behavior: "smooth",
          });
        } else {
          // Fallback
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch {}
    }
  }, [isOpen, selectedPreset]);

  // Load recent community characters
  React.useEffect(() => {
    try {
      const db = getFirestore(app);
      const q = query(collection(db, "characters"), orderBy("createdAt", "desc"), limit(12));
      const unsub = onSnapshot(q, (snap) => {
        const list: Array<{ id: string; name: string; avatar?: string; persona: string; gender: string }> = [];
        snap.forEach((doc) => {
          const d: any = doc.data();
          list.push({ id: doc.id, name: d.name || "Unnamed", avatar: d.avatar || undefined, persona: d.persona || "", gender: d.gender || "female" });
        });
        setCommunityCharacters(list);
      });
      return () => unsub();
    } catch (e) {
      // Firestore may be unavailable; ignore in non-configured environments
    }
  }, []);

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

  const handleCreateCustom = async () => {
    if (!customName.trim()) {
      alert("Please enter a character name");
      return;
    }

    const traitsPart =
      customTraits.length > 0 ? customTraits.join(", ") : "kind, engaging";
    const interestsPart =
      customInterests.length > 0
        ? ` You enjoy ${customInterests.join(", ")}.`
        : "";
    const extra = customDescription
      ? ` ${customDescription.trim()}`
      : " You build deep emotional connections, flirt playfully, and always stay in character as a caring, passionate partner.";

    let avatarUrl: string | undefined = undefined;
    try {
      if (uploadFile) {
        setUploading(true);
        const storage = getStorage(app);
        const safe = customName.replace(/[^×z0-9_-]/gi, "_");
        const ref = storageRef(storage, `characters/${Date.now()}_${safe}`);
        await uploadBytes(ref, uploadFile);
        avatarUrl = await getDownloadURL(ref);
      }
    } catch (e: any) {
      setSaveError(e?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }

    const customPersona = `You are ${customName}, a ${selectedGender} AI companion. Your core traits are ${traitsPart}.${interestsPart}${extra}`;

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "characters"), {
        name: customName,
        gender: selectedGender,
        avatar: avatarUrl || null,
        persona: customPersona,
        traits: customTraits,
        interests: customInterests,
        description: customDescription,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      // best-effort
    }

    onSelectCharacter(customPersona, avatarUrl);

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
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => {
          // Close when clicking on backdrop (outside modal panel)
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30"
          onClick={(e) => e.stopPropagation()}
        >
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
          <div
            ref={scrollContainerRef}
            className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-white custom-scrollbar"
          >
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
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 vi×purple-500 to-pink-500 rounded-full blur-lg opacity-60"></div>
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
                    <p className="text-sm text-white/70">
                      {preset.description}
                    </p>
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


            {/* Community Characters */}
            {communityCharacters.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-white mb-3">Community Characters</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {communityCharacters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectCharacter(c.persona, c.avatar);
                        onClose();
                      }}
                      className="cursor-pointer p-4 rounded-2xl border border-white/15 hover:border-pink-500/40 transition-all bg-black/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-500/30">
                          {c.avatar ? (
                            <img src={c.avatar} alt={c.name} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-500/40 to-purple-600/40" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-semibold leading-tight">{c.name}</div>
                          <div className="text-xs text-white/60 capitalize">{c.gender}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Custom Character Creation Form */}
            {selectedPreset === "custom" && (
              <div
                ref={customSectionRef}
                className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 to-black rounded-2xl border-2 border-purple-500/30 text-white"
              >
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

                {/* Gender for custom character */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/80 mb-2">Gender</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGender("female")}
                      className={`px-4 py-2 rounded-xl border ${selectedGender === "female" ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-white/20" : "bg-black/30 text-white border-white/20"}`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender("male")}
                      className={`px-4 py-2 rounded-xl border ${selectedGender === "male" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-white/20" : "bg-black/30 text-white border-white/20"}`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                {/* Avatar upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/80 mb-2">Avatar (optional)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setUploadFile(f);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setUploadPreview(url);
                        } else {
                          setUploadPreview(null);
                        }
                      }}
                      className="text-sm text-white/80 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border file:border-white/20 file:bg-black/40 file:text-white hover:file:bg-white/10"
                    />
                    {uploadPreview && (
                      <img src={uploadPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500/30" />
                    )}
                  </div>
                  {saveError && <div className="text-sm text-rose-400 mt-2">{saveError}</div>}
                  {uploading && <div className="text-sm text-white/70 mt-2">Uploading image...</div>}
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
                              active
                                ? prev.filter((t) => t !== trait)
                                : [...prev, trait]
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
                  <label className="block text-sm font-semibold text-white/80 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => {
                      const active = customInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() =>
                            setCustomInterests((prev) =>
                              active
                                ? prev.filter((i) => i !== interest)
                                : [...prev, interest]
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
      <style jsx>{`
        /* Beautiful scrollbar for the modal content */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(236, 72, 153, 0.6) rgba(255, 255, 255, 0.08);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(236, 72, 153, 0.9),
            rgba(147, 51, 234, 0.9)
          );
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(236, 72, 153, 1),
            rgba(147, 51, 234, 1)
          );
        }
      `}</style>
    </>
  );
}






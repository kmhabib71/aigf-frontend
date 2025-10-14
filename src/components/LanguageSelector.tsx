"use client";

import React, { useState, useRef, useEffect } from "react";
import { backendUrl } from "@/lib/config";
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  autoDetectedLanguage?: string | null;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  autoDetectedLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState<{ [key: string]: Language }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch available languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/languages`);
        const data = await response.json();
        setLanguages(data.languages || {});
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        // Fallback languages
        setLanguages({
          en: {
            code: "en",
            name: "English",
            nativeName: "English",
            flag: "🇺🇸",
          },
          bn: { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
        });
      }
    };

    fetchLanguages();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = languages[selectedLanguage] || languages["en"];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full text-sm transition-colors flex items-center gap-2 z-100"
        title="Select Language"
      >
        <span className="text-lg">{currentLanguage?.flag || "🌍"}</span>
        <span className="hidden sm:inline">
          {currentLanguage?.nativeName || "English"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl overflow-hidden z-50 border border-gray-200 z-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold z-40">
            Select Language
          </div>

          <div className="max-h-96 overflow-y-auto">
            {Object.values(languages).map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors ${
                  selectedLanguage === language.code
                    ? "bg-purple-100 border-l-4 border-purple-600"
                    : ""
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {autoDetectedLanguage === language.code && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Auto
                  </span>
                )}
                {selectedLanguage === language.code && (
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {autoDetectedLanguage && (
            <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Auto-detected from your location
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

/**
 * Translation Utilities
 * Helper functions for seamless Venice translation
 */

/**
 * Extract complete sentences from a text buffer
 * Detects sentence boundaries: . ! ? or double newline
 */
import { backendUrl } from "@/lib/config";
export function extractCompleteSentences(buffer: string): {
  completeSentences: string[];
  remainder: string;
} {
  if (!buffer) {
    return { completeSentences: [], remainder: "" };
  }

  const completeSentences: string[] = [];
  let remainder = buffer;

  // Sentence ending patterns:
  // - Period, exclamation, question mark followed by space or end of string
  // - Double newline (paragraph break)
  const sentenceRegex = /([^.!?\n]+[.!?]+(?:\s|$)|\n\n)/g;

  let lastIndex = 0;
  let match;

  while ((match = sentenceRegex.exec(buffer)) !== null) {
    const sentence = match[0].trim();
    if (sentence) {
      completeSentences.push(sentence);
    }
    lastIndex = match.index + match[0].length;
  }

  // Everything after the last complete sentence is the remainder
  remainder = buffer.substring(lastIndex).trim();

  return { completeSentences, remainder };
}

/**
 * Detect user's location from IP geolocation via backend
 * Backend handles IP detection to avoid CORS issues
 */
export async function detectUserLocation(): Promise<{
  countryCode: string;
  detectedLanguage: string;
} | null> {
  try {
    const response = await fetch(`${backendUrl}/api/detect-user-location`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`🌍 Location detected:`, data);

    return {
      countryCode: data.countryCode || "US",
      detectedLanguage: data.detectedLanguage || "en",
    };
  } catch (error) {
    console.error("Failed to detect user location:", error);
    // Fallback to English
    return {
      countryCode: "US",
      detectedLanguage: "en",
    };
  }
}

/**
 * Get language from country code via backend API
 */
export async function detectLanguageFromCountry(
  countryCode: string
): Promise<string> {
  try {
    const response = await fetch(`${backendUrl}/api/detect-language`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode }),
    });

    const data = await response.json();
    return data.detectedLanguage || "en";
  } catch (error) {
    console.error("Failed to detect language from country:", error);
    return "en"; // Fallback to English
  }
}

/**
 * Translate text using backend API
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  if (!text || targetLang === sourceLang) {
    return text;
  }

  try {
    const response = await fetch(`${backendUrl}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
      }),
    });

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original text
  }
}

/**
 * Batch translate multiple texts (more efficient)
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> {
  if (!texts || texts.length === 0 || targetLang === sourceLang) {
    return texts;
  }

  try {
    const response = await fetch(`${backendUrl}/api/translate-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts,
        targetLang,
        sourceLang,
      }),
    });

    const data = await response.json();
    return data.translatedTexts || texts;
  } catch (error) {
    console.error("Batch translation failed:", error);
    return texts; // Fallback to original texts
  }
}

/**
 * Auto-detect and set user language on first visit
 */
export async function autoDetectLanguage(): Promise<string> {
  // Check if language already saved in localStorage
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage) {
    console.log(`🌍 Loaded saved language: ${savedLanguage}`);
    return savedLanguage;
  }

  // Detect from IP geolocation via backend
  console.log("🌍 Auto-detecting language from location...");
  const locationData = await detectUserLocation();

  if (locationData && locationData.detectedLanguage) {
    console.log(`🌍 Detected country: ${locationData.countryCode}`);
    console.log(`🌍 Auto-detected language: ${locationData.detectedLanguage}`);

    // Save to localStorage
    localStorage.setItem("preferredLanguage", locationData.detectedLanguage);
    localStorage.setItem("autoDetectedLanguage", locationData.detectedLanguage);

    return locationData.detectedLanguage;
  }

  // Fallback to English
  console.log("🌍 Could not detect location, defaulting to English");
  localStorage.setItem("preferredLanguage", "en");
  return "en";
}

/**
 * Save user's language preference
 */
export function saveLanguagePreference(languageCode: string): void {
  localStorage.setItem("preferredLanguage", languageCode);
  console.log(`💾 Saved language preference: ${languageCode}`);
}

/**
 * Get saved language preference
 */
export function getSavedLanguagePreference(): string | null {
  return localStorage.getItem("preferredLanguage");
}

/**
 * Get auto-detected language (for UI indication)
 */
export function getAutoDetectedLanguage(): string | null {
  return localStorage.getItem("autoDetectedLanguage");
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteSettings {
  backgroundImage: string;
  logoUrl: string;
  homePageHeading: string;
  homePageTagline: string;
  chatPageHeading: string;
  storyPageHeading: string;
}

const defaultSettings: SiteSettings = {
  backgroundImage: "/image.jpg",
  logoUrl: "",
  homePageHeading: "Start Instantly — No Signup Required",
  homePageTagline: "Every love story deserves to be finished",
  chatPageHeading: "Romantic Chat",
  storyPageHeading: "Create a Story",
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined
);

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminSiteSettings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (err) {
          console.error("Failed to parse site settings:", err);
        }
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("adminSiteSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("adminSiteSettings");
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
}

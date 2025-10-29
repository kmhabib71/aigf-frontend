"use client";

import React, { useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { backendUrl } from "@/lib/config";
import { useSiteSettings } from "../../../contexts/SiteSettingsContext";

export default function SiteSettingsTab() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [nsfwEnabled, setNsfwEnabled] = useState<boolean>(true);
  const [nsfwLoading, setNsfwLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadNsfwSetting = useCallback(
    async (withSpinner: boolean = true) => {
      try {
        if (withSpinner) setNsfwLoading(true);
        // Add cache-busting timestamp to prevent browser caching
        const res = await fetch(`${backendUrl}/api/settings/nsfw?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Loaded NSFW setting:', data.nsfwEnabled);
          setNsfwEnabled(!!data.nsfwEnabled);
        }
      } catch (error) {
        console.error("Failed to load NSFW setting", error);
      } finally {
        if (withSpinner) setNsfwLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    loadNsfwSetting(true);
  }, [loadNsfwSetting]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === "background") {
        setLocalSettings({ ...localSettings, backgroundImage: base64 });
      } else {
        setLocalSettings({ ...localSettings, logoUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSiteSettingsSave = () => {
    setIsSaving(true);
    updateSettings(localSettings);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 500);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      resetSettings();
      setLocalSettings(settings);
      alert("Settings reset to default!");
    }
  };

  const handleNsfwSave = async () => {
    try {
      setNsfwLoading(true);
      console.log('Saving NSFW setting:', nsfwEnabled);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Authentication required to update NSFW settings");
      }
      const token = await currentUser.getIdToken();
      const res = await fetch(`${backendUrl}/api/admin/settings/nsfw`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nsfwEnabled }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update NSFW setting");
      }

      const result = await res.json();
      console.log('NSFW save response:', result);

      // Reload the setting to confirm
      await loadNsfwSetting(false);
      alert("NSFW setting updated successfully!");
    } catch (error: any) {
      console.error('NSFW save error:', error);
      alert(error?.message || "Failed to update NSFW setting");
    } finally {
      setNsfwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Customization Settings</h2>

        {/* Background Image */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
          <div className="flex items-center gap-4">
            {localSettings.backgroundImage && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                <img src={localSettings.backgroundImage} alt="Background preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "background")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080px or higher. JPG, PNG, WEBP.</p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
          <div className="flex items-center gap-4">
            {localSettings.logoUrl ? (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300 bg-white p-2">
                <img src={localSettings.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-4xl">*</div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px square. PNG with transparent background.</p>
              {localSettings.logoUrl && (
                <button
                  onClick={() => setLocalSettings({ ...localSettings, logoUrl: "" })}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove Logo (use default emoji)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6" />

        {/* NSFW Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">NSFW Content (Venice text + lustify images)</label>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={nsfwEnabled} onChange={(e) => setNsfwEnabled(e.target.checked)} disabled={nsfwLoading} />
            <span className="text-sm text-gray-600">{nsfwEnabled ? "Enabled" : "Disabled (forces GPT-4o-mini + HiDream)"}</span>
            <button
              onClick={handleNsfwSave}
              className="ml-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={nsfwLoading}
            >
              {nsfwLoading ? "Saving..." : "Save NSFW Setting"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Disable when applying to Stripe or using SFW-only processors.</p>
        </div>

        {/* Text Customization */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Text Content Customization</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Home Page - Top Badge Text</label>
            <input
              type="text"
              value={localSettings.homePageHeading}
              onChange={(e) => setLocalSettings({ ...localSettings, homePageHeading: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Start Instantly - No Signup Required"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Home Page - Main Tagline</label>
            <input
              type="text"
              value={localSettings.homePageTagline}
              onChange={(e) => setLocalSettings({ ...localSettings, homePageTagline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Every love story deserves to be finished"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chat Card - Heading</label>
            <input
              type="text"
              value={localSettings.chatPageHeading}
              onChange={(e) => setLocalSettings({ ...localSettings, chatPageHeading: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Romantic Chat"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Story Card - Heading</label>
            <input
              type="text"
              value={localSettings.storyPageHeading}
              onChange={(e) => setLocalSettings({ ...localSettings, storyPageHeading: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Create a Story"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 my-6" />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSiteSettingsSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
          >
            Reset to Default
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Note:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Settings are saved to browser localStorage</li>
            <li>Refresh the homepage to see changes take effect</li>
            <li>Logo appears in header and footer</li>
            <li>Background image applies to home, chat, and story pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

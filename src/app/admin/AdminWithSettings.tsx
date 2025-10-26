"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SiteSettingsTab from "./components/SiteSettingsTab";
import AdminPage from "./page";

export default function AdminWithSettings() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  if (!showSettings) {
    return (
      <div className="relative">
        {/* Settings Toggle Button - Fixed Position */}
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-24 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          ⚙️ Site Settings
        </button>
        <AdminPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <span>⚙️</span>
              <span>Site Settings</span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
              >
                ← Back to Admin
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
              >
                View Site
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SiteSettingsTab />
      </div>
    </div>
  );
}

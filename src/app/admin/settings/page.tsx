"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import SiteSettingsTab from "../components/SiteSettingsTab";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
                onClick={() => router.push("/admin")}
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

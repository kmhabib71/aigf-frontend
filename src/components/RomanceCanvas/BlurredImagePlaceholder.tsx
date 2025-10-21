"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BlurredImagePlaceholderProps {
  type?: "scene" | "line";
  className?: string;
  message?: string;
  sceneNumber?: number;
}

export default function BlurredImagePlaceholder({
  type = "line",
  className = "",
  message,
  sceneNumber
}: BlurredImagePlaceholderProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const defaultMessage = sceneNumber
    ? `Unlock Scene ${sceneNumber} image with Premium`
    : `AI image generation is available with Premium subscription`;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        minHeight: type === "scene" ? "300px" : "200px",
        backgroundColor: "#1a1a2e"
      }}
    >
      {/* Blurred romantic background pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(216, 180, 254, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(251, 207, 232, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)
          `,
          filter: "blur(40px)",
        }}
      />

      {/* Overlay pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)
          `
        }}
      />

      {/* Lock icon and upgrade message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {/* Lock Icon */}
        <div className="mb-4 text-6xl">
          🔒
        </div>

        {/* Message */}
        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
          {sceneNumber ? `Scene ${sceneNumber} 🎬` : "Premium Feature"}
        </h3>
        <p className="text-white/90 mb-4 max-w-xs drop-shadow-md">
          {message || defaultMessage}
        </p>

        {/* Upgrade Button */}
        <button
          onClick={handleUpgrade}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all shadow-lg shadow-purple-500/30"
        >
          ✨ Upgrade to Premium
        </button>

        {/* Pricing hint */}
        <p className="text-white/60 text-sm mt-3">
          Starting at $9.99/month
        </p>
      </div>

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          animation: 'shimmer 3s infinite',
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

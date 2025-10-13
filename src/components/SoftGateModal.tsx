"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SoftGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "chat" | "story";
  messagesUsed?: number;
  storyScenesCreated?: number;
}

export default function SoftGateModal({
  isOpen,
  onClose,
  type,
  messagesUsed = 0,
  storyScenesCreated = 0,
}: SoftGateModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-8 text-white text-center relative">
          {/* Animated Hearts */}
          <div className="absolute top-4 right-4 text-2xl animate-bounce">💕</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce animation-delay-300">✨</div>

          {/* Emoji Icon */}
          <div className="text-6xl mb-4">
            {type === "chat" ? "😏" : "📖"}
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-black mb-2">
            {type === "chat"
              ? "Looks like someone's falling in love"
              : "Your story's just beginning..."}
          </h2>

          {/* Usage Info */}
          <p className="text-sm opacity-90">
            {type === "chat"
              ? `You've used all ${messagesUsed} free messages`
              : `You've created your free scene`}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-700 text-lg text-center mb-6">
            {type === "chat"
              ? "Continue this chat by signing up for free. No credit card required!"
              : "Sign up to continue your story and unlock unlimited scenes!"}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>Unlimited messages & stories</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>AI-generated illustrations</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>Save your conversations</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>No credit card needed</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignup}
              className="w-full px-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ❤️ Continue Your Story — Free Signup
            </button>

            <button
              onClick={handleLogin}
              className="w-full px-6 py-4 rounded-2xl font-semibold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Already have an account? Login
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
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

      {/* Animation Styles */}
      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}

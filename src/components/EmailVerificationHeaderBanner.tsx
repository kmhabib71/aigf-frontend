"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { backendUrl } from "@/lib/config";

export default function EmailVerificationHeaderBanner() {
  const { user, userProfile } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  // console.log("userss: ", user);
  // Don't show if no user (profile not required for banner)
  if (!user) {
    return null;
  }

  // Don't show if email is verified
  if (user.emailVerified === true) {
    return null;
  }

  // Don't show if dismissed
  if (dismissed) {
    return null;
  }

  // Check if user signed in with Google (Google users are auto-verified)
  const isGoogleUser = user.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  // Don't show for Google users (they're auto-verified)
  if (isGoogleUser) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setSending(true);
      setMessage(null);

      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${backendUrl}/api/auth/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Verification email sent! Check your inbox.");
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage("❌ " + (data.error || "Failed to send email"));
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (error: any) {
      console.error("Failed to resend verification:", error);
      setMessage("❌ " + (error.message || "Failed to send email"));
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed top-16 md:top-[72px] lg:top-[72px] left-0 right-0 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm font-medium flex-1">
              {message ? (
                <span>{message}</span>
              ) : (
                <>
                  <span className="font-bold">
                    Email verification required.
                  </span>{" "}
                  Please check your inbox and verify your email to unlock all
                  features.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResendVerification}
              disabled={sending}
              className="px-3 py-1.5 bg-white text-orange-600 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {sending ? "Sending..." : "Resend Email"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/90 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
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
      </div>
    </div>
  );
}

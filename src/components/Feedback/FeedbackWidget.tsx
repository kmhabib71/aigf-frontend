"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { backendUrl } from "@/lib/config";

export default function FeedbackWidget() {
  const pathname = usePathname();
  const { user, userProfile, getIdToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [text, setText] = useState("");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const hiddenOn = useMemo(() => ["/checkout"], []);
  const hide = hiddenOn.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 3500);
    return () => clearTimeout(t);
  }, []);

  if (hide) return null;

  const submit = async () => {
    if (!rating || !text.trim()) return;
    setSubmitting(true);
    try {
      const token = await getIdToken?.();
      await fetch(`${backendUrl}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating,
          text,
          email: email || undefined,
          path: pathname,
          meta: { plan: userProfile?.plan || undefined },
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setText("");
        setRating(5);
      }, 1200);
    } catch (e) {
      alert("Failed to send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        aria-label="Send feedback"
        onClick={() => setOpen(true)}
        className="fixed z-40 top-14 md:right-12 right-6 rounded-full px-4 py-3 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 feedback-glow"
      >
        Feedback
      </button>

      {/* Tooltip near the button, same fixed position */}
      <div
        className={`fixed z-40 top-[3.25rem] md:right-[3.5rem] right-[1.25rem] -translate-y-3 transition-opacity duration-500 pointer-events-none ${showTip ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden
      >
        <div className="bg-black text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Your feedback is very important
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl text-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Share Feedback</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={`h-9 w-9 rounded-full border ${rating===n? 'bg-yellow-400 text-black border-yellow-500':'bg-white text-gray-700 border-gray-300'} hover:border-gray-500`}
                >{n}</button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">What can we improve?</label>
            <textarea
              value={text}
              onChange={(e)=>setText(e.target.value)}
              rows={4}
              placeholder="Tell us what worked, what didn't, or ideas..."
              className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 p-2 mb-4"
            />

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Includes plan and page automatically.</span>
              <span>Thank you!</span>
            </div>

            <button
              disabled={submitting || !rating || !text.trim()}
              onClick={submit}
              className="w-full rounded-lg py-2 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-50"
            >
              {submitted ? 'Sent ✓' : (submitting ? 'Sending…' : 'Send Feedback')}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes glowPulse {
          0% { box-shadow: 0 0 0px rgba(139, 92, 246, 0.0), 0 0 0px rgba(99, 102, 241, 0.0); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.45), 0 0 30px rgba(99, 102, 241, 0.35); }
          100% { box-shadow: 0 0 0px rgba(139, 92, 246, 0.0), 0 0 0px rgba(99, 102, 241, 0.0); }
        }
        .feedback-glow { animation: glowPulse 2.8s ease-in-out infinite; }
      `}</style>
    </>
  );
}


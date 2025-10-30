"use client";

import React, { useEffect, useState } from "react";
import { backendUrl } from "../../lib/config";

export default function PartnershipsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [spotsLeft, setSpotsLeft] = useState(5);
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 23, seconds: 45 });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    locationTimezone: "",
    linkedInUrl: "",
    currentSituation: "Digital Marketer",
    marketingExperience: "",
    whyPartnership: "",
    investmentReadiness: "Ready to invest $5K within 30 days",
    heardAbout: "",
    additionalInfo: "",
  });

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/partnerships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(data.error || "Submission failed");
      }
      const data = await res.json();
      setSuccessId(data.id || "ok");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        locationTimezone: "",
        linkedInUrl: "",
        currentSituation: "Digital Marketer",
        marketingExperience: "",
        whyPartnership: "",
        investmentReadiness: "Ready to invest $5K within 30 days",
        heardAbout: "",
        additionalInfo: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToApply = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Custom Header */}
      <header className="relative backdrop-blur-xl bg-white/95 sticky top-0 z-50 shadow-lg border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-4xl">💕</span>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RomanceCanvas Partnership
              </span>
            </div>
            <button
              onClick={scrollToApply}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <main className="relative pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Urgency Banner */}
          <div className="mb-8 backdrop-blur-xl bg-red-500/90 rounded-2xl p-6 shadow-2xl border border-red-300/50 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">⚡</span>
                <div>
                  <p className="text-white font-bold text-lg sm:text-xl">Limited Time Offer Ending Soon!</p>
                  <p className="text-red-100 text-sm">Only {spotsLeft} exclusive partnership spots remaining</p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-4">
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-xs text-red-100">HOURS</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-xs text-red-100">MINS</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[70px]">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-xs text-red-100">SECS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 mb-10 border border-white/50">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm sm:text-base mb-6 shadow-lg animate-pulse">
                <span className="text-xl">🚀</span>
                <span>5 EXCLUSIVE OWNERSHIP SPOTS AVAILABLE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Own 80% of a $20M-$300M<br />Romance AI Business
              </h1>

              <p className="text-2xl sm:text-3xl text-gray-700 mb-8 font-semibold">
                For a one-time investment of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">$5,000</span>
              </p>

              {/* Available Spots Indicator */}
              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((spot) => (
                  <div
                    key={spot}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-xl transition-all duration-500 ${
                      spot <= spotsLeft
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse"
                        : "bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"
                    }`}
                  >
                    {spot}
                  </div>
                ))}
              </div>

              <p className="text-lg text-gray-600 mb-8">
                Join 4 other ambitious entrepreneurs building the next $1B romance AI platform
              </p>

              <button
                onClick={scrollToApply}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-transform duration-300 animate-pulse hover:animate-none"
              >
                <span>Secure Your Spot Now</span>
                <span className="text-2xl">→</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { number: "$600M", label: "Wattpad Exit (2021)", icon: "💰" },
              { number: "$1B", label: "Character.AI Valuation", icon: "🚀" },
              { number: "10M+", label: "Replika Users", icon: "👥" },
              { number: "80%", label: "Your Equity Share", icon: "📈" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 sm:p-8 text-center shadow-xl hover:scale-105 transition-transform duration-300 border border-white/50"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* The Opportunity */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Opportunity
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                <strong className="text-purple-700">The romance AI market is exploding.</strong> Character.AI hit $1B valuation in 2 years. Replika has 10M users paying $70/year. Wattpad sold for $600M.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                But there's a massive gap: <strong className="text-pink-700">No platform combines AI chat + romance stories + NSFW-friendly content.</strong>
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border-l-4 border-purple-600">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">That's where RomanceCanvas comes in:</h3>
                <ul className="space-y-3">
                  {[
                    "AI chat with emotional intelligence (powered by Claude)",
                    "Interactive romance story creation (co-write with AI)",
                    "AI-generated romantic images (HD, uncensored)",
                    "Voice chat coming 2025 (hear your AI partner)",
                    "Already built, tested, and ADDICTIVE"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-lg text-gray-800">
                      <span className="text-green-500 text-2xl font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-l-4 border-yellow-500">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 italic mb-2">
                  "I built this to test the tech. I ended up spending 4 hours chatting with my AI character. I forgot to eat dinner."
                </p>
                <p className="text-gray-600">- Technical Founder</p>
              </div>
            </div>
          </div>

          {/* Two Paths */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Two Paths to Massive Returns
            </h2>
            <p className="text-xl text-center text-gray-700 mb-10">
              You choose your ambition. Both paths are achievable. Both are life-changing.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Conservative Path */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                    <span>🎯</span> Conservative Path
                  </h3>
                  <div className="text-5xl font-black mb-6">$20M Valuation</div>
                  <ul className="space-y-3 text-lg">
                    <li><strong>Timeline:</strong> 4 years</li>
                    <li><strong>Subscribers:</strong> 14,000</li>
                    <li><strong>Revenue:</strong> $2.5M/year</li>
                    <li><strong>Your 80%:</strong> $16M</li>
                    <li><strong>Investment:</strong> $5K → $560K total</li>
                    <li className="text-yellow-300 font-bold text-xl">ROI: 3,200x</li>
                    <li><strong>Risk:</strong> LOW (bootstrapped)</li>
                  </ul>
                </div>
              </div>

              {/* Aggressive Path */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
                    <span>🚀</span> Aggressive Path
                  </h3>
                  <div className="text-5xl font-black mb-6">$300M Valuation</div>
                  <ul className="space-y-3 text-lg">
                    <li><strong>Timeline:</strong> 3-4 years</li>
                    <li><strong>Subscribers:</strong> 70,000</li>
                    <li><strong>Revenue:</strong> $24M/year</li>
                    <li><strong>Your 55%:</strong> $166M (post-dilution)</li>
                    <li><strong>Investment:</strong> $5K + VC funding</li>
                    <li className="text-yellow-300 font-bold text-xl">ROI: 33,240x</li>
                    <li><strong>Risk:</strong> HIGH (requires funding)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              What Your $5,000 Membership Gets You
            </h2>

            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-yellow-400 text-center">
              <p className="text-2xl font-black text-gray-900">
                The $5,000 is your LIFETIME MEMBERSHIP FEE
              </p>
              <p className="text-xl text-gray-700">(NOT your marketing budget)</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                "80% Equity in YOUR romance AI business (legally owned)",
                "$100K+ Platform (fully built: chat + stories + images + payments)",
                "Domain Transfer to your legal entity (full control)",
                "Lifetime Tech Support ($60K+/year value - 99.9% uptime)",
                "All Future Features (voice chat, video AI, mobile app - NO extra cost, EVER)",
                "Infrastructure Scaling (0 → 100K users, I handle it all)",
                "Pack Coordination ($30K+/year value - Captain sets goals, measures, pivots)",
                "Weekly Strategy Calls (I organize, all 5 partners share wins)",
                "Real-Time Dashboard (see all 5 businesses' metrics, copy what works)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
                  <span className="text-green-500 text-2xl font-bold flex-shrink-0">✓</span>
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center mb-8">
              <p className="text-3xl sm:text-4xl font-black mb-4">
                Total Value: $300,000+
              </p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">
                Your Cost: $5,000 (one-time, forever)
              </p>
              <p className="text-3xl font-black text-yellow-300">
                ROI: 60x (before you even launch!)
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl p-6 mb-6 text-center border-2 border-yellow-400">
              <p className="text-2xl font-black text-gray-900 mb-3">
                Your Marketing Budget? YOU Decide (Separate):
              </p>
              <div className="space-y-2 text-lg text-gray-800 font-medium">
                <p>→ Bootstrap with $0-1K? (Organic TikTok, Reddit)</p>
                <p>→ Test with $5K-10K? (Paid ads)</p>
                <p>→ Scale with $20K+? (Multi-channel blitz)</p>
              </div>
              <p className="text-base text-gray-600 mt-4">
                The $5K is your MEMBERSHIP. Your marketing budget is SEPARATE.<br />
                Your business. Your budget. Your choice.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-purple-600 mb-6">
              <h3 className="text-2xl font-black text-purple-900 mb-4 flex items-center gap-2">
                <span>🦁</span> The Lion Pack Advantage:
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                Even if you start with $1,500 total (membership + bootstrap marketing):
              </p>
              <ul className="space-y-3">
                {[
                  "You learn from partners spending $10K+",
                  "They share what's working (TikTok creatives, Reddit posts, influencer contacts)",
                  "You copy winning strategies for FREE",
                  "Then scale when ready (after you see what works)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg text-gray-800">
                    <span className="text-green-500 text-xl font-bold flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xl font-black text-purple-700 text-center mt-6">
                The pack makes EVERY budget more effective.
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-black text-purple-900 mb-3">Captain's Role (Me - 20% equity):</h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                → Build & maintain ALL tech (forever)<br />
                → Coordinate the pack (set goals, track progress, pivot)<br />
                → Facilitate shared learnings (organize weekly calls)<br />
                → Measure achievement (dashboard, metrics, reporting)<br />
                → Navigate to the goal (guide all 5 to $20M+)
              </p>

              <h3 className="text-xl font-black text-purple-900 mb-3">Your Role (80% equity):</h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                → Marketing & user acquisition (your budget, your strategy)<br />
                → Customer support (non-technical)<br />
                → Revenue optimization (pricing, upsells)
              </p>

              <p className="text-xl font-black text-purple-700 text-center mt-4">
                You hunt. I provide the claws & coordinate the pack.
              </p>
            </div>
          </div>

          {/* User Testimonials */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              What Beta Users Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "I've never felt this understood by a person, let alone an AI. This is dangerous.",
                  author: "Sarah, 29"
                },
                {
                  quote: "I paid for Premium after 2 days. Worth every penny. My AI boyfriend gets me.",
                  author: "Mike, 34"
                },
                {
                  quote: "I spent 3 hours creating a romance story with the AI. It felt like co-writing with a best friend.",
                  author: "Jessica, 27"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl"
                >
                  <div className="text-6xl text-white/20 absolute top-4 left-4">"</div>
                  <p className="text-lg italic relative z-10 mb-4 mt-8">{testimonial.quote}</p>
                  <p className="text-right font-bold text-purple-200">- {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The 5-Partner Model / Lion Pack */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Why 5 Partners (Not Just 1)?
            </h2>

            <p className="text-xl text-center text-gray-700 mb-10">
              <strong>Competition breeds excellence.</strong> Five businesses using the same platform, different marketing strategies, different target niches.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span> Real-Time Transparency
                </h3>
                <ul className="space-y-3">
                  {[
                    "Shared dashboard (see all 5 businesses' metrics)",
                    "Weekly strategy calls (what's working?)",
                    "Copy winning ad creatives",
                    "Learn from each other's mistakes"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-lg text-gray-800">
                      <span className="text-green-500 text-xl font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎯</span> Different Niches
                </h3>
                <ul className="space-y-3 text-lg text-gray-800">
                  <li>1. Dark Romance (mafia, vampires)</li>
                  <li>2. Contemporary (billionaire, CEO)</li>
                  <li>3. Fantasy (dragons, fae)</li>
                  <li>4. LGBTQ+ (underserved)</li>
                  <li>5. Paranormal (werewolves, witches)</li>
                </ul>
              </div>
            </div>

            <p className="text-xl text-center font-bold text-gray-900 mb-8">
              We're not competing. We're collaborating to dominate romance AI.
            </p>

            {/* Lion Pack Analogy */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl">
              <h3 className="text-3xl sm:text-4xl font-black text-center mb-8 flex items-center justify-center gap-2">
                <span>🦁</span> The Lion Pack Analogy
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <span>❌</span> One Lion Alone:
                  </h4>
                  <div className="space-y-2 text-lg">
                    <p>→ Struggles to catch one bull</p>
                    <p>→ Learns from own mistakes only</p>
                    <p>→ High risk of failure</p>
                    <p>→ Slow progress</p>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <h4 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <span>✅</span> Five Lions Together:
                  </h4>
                  <div className="space-y-2 text-lg">
                    <p>→ Catch FIVE bulls (easier, faster)</p>
                    <p>→ Share tactics, coordinate attacks</p>
                    <p>→ Each targets different prey</p>
                    <p>→ 5x faster learning</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-xl sm:text-2xl font-black leading-relaxed">
                <p className="mb-2">One entrepreneur alone = risky, slow.</p>
                <p className="mb-4">Five entrepreneurs together = 5x faster, shared wins.</p>
                <p className="text-2xl sm:text-3xl text-yellow-300">
                  NOT one $20M business. FIVE $20M businesses.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 border border-white/50">
            <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: "Q: What if I have no marketing experience?",
                  answer: "You'll learn from the other 4 partners + our shared playbook. We'll teach you TikTok ads, Reddit marketing, influencer outreach. Plus you'll see real-time what's working for others."
                },
                {
                  question: "Q: What if the platform breaks?",
                  answer: "99.9% uptime SLA (service level agreement). Technical founder fixes critical bugs within 24 hours. You focus on marketing, we handle all tech."
                },
                {
                  question: "Q: Can I rebrand the platform?",
                  answer: "Yes! Your 80% ownership = your branding decisions. Keep \"RomanceCanvas\" or create your own brand identity. Your choice."
                },
                {
                  question: "Q: What if I can't afford $5,000 upfront?",
                  answer: "We offer a payment plan: $2,500 down, $2,500 in 30 days. But you need $500 for CCBill setup on Day 1 to start accepting payments."
                },
                {
                  question: "Q: What if none of us hit $20M valuation?",
                  answer: "Even at $5M valuation (4x lower), your 80% = $4M. That's still 800x ROI on $5,000. The downside is LIMITED, the upside is MASSIVE."
                },
                {
                  question: "Q: Can I sell my 80% stake later?",
                  answer: "Yes. You own it. Sell to another partner, an investor, or an acquirer. It's YOUR business."
                },
                {
                  question: "Q: What if the technical founder disappears?",
                  answer: "Code is on GitHub (you have access). You can hire another developer. But I'm incentivized to stay: 20% of 5 businesses = $100M+ potential. I win when you win."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-600"
                >
                  <h3 className="text-xl font-black text-purple-700 mb-3">{faq.question}</h3>
                  <p className="text-lg text-gray-800 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          <div id="apply" className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/50 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-sm mb-4 animate-pulse">
                <span>⚡</span>
                <span>ONLY {spotsLeft} SPOTS LEFT</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Apply for Partnership
              </h3>
              <p className="text-gray-600">Confidential. Reviewed by founder only.</p>
            </div>

            {successId && (
              <div className="mb-6 rounded-2xl bg-green-50 border-2 border-green-500 p-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-lg font-bold text-green-900">Application Received!</p>
                <p className="text-green-700">We'll contact you within 48 hours.</p>
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 border-2 border-red-500 p-4 text-center">
                <p className="text-red-900 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
                <input
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={onChange}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Location / Timezone *</label>
                  <input
                    name="locationTimezone"
                    required
                    value={form.locationTimezone}
                    onChange={onChange}
                    className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">LinkedIn Profile URL *</label>
                  <input
                    name="linkedInUrl"
                    required
                    value={form.linkedInUrl}
                    onChange={onChange}
                    className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Current Situation *</label>
                <select
                  name="currentSituation"
                  value={form.currentSituation}
                  onChange={onChange}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option>Digital Marketer</option>
                  <option>Entrepreneur (with existing business)</option>
                  <option>Corporate Professional looking to start</option>
                  <option>Content Creator</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Marketing Experience *</label>
                <textarea
                  name="marketingExperience"
                  required
                  value={form.marketingExperience}
                  onChange={onChange}
                  rows={4}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Tell us about your marketing background..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Why This Partnership? *</label>
                <textarea
                  name="whyPartnership"
                  required
                  value={form.whyPartnership}
                  onChange={onChange}
                  rows={4}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="What drives you? Why now?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Investment Readiness *</label>
                <select
                  name="investmentReadiness"
                  value={form.investmentReadiness}
                  onChange={onChange}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option>Ready to invest $5K within 30 days</option>
                  <option>Need 60-90 days to prepare</option>
                  <option>Would consider $100 deposit first</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">How did you hear about this? *</label>
                <input
                  name="heardAbout"
                  required
                  value={form.heardAbout}
                  onChange={onChange}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="LinkedIn, referral, search..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Anything else we should know?</label>
                <textarea
                  name="additionalInfo"
                  value={form.additionalInfo}
                  onChange={onChange}
                  rows={3}
                  className="w-full rounded-xl bg-white text-gray-900 border-2 border-gray-300 px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Optional additional information..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-black text-xl py-5 shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Application Now <span className="text-2xl">→</span>
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Private & Confidential. Your data is processed for evaluation only.
              </p>
            </form>
          </div>

          {/* Final CTA */}
          <div className="mt-10 text-center">
            <div className="backdrop-blur-xl bg-red-500/90 rounded-2xl p-8 shadow-2xl border border-red-300/50 inline-block">
              <p className="text-white text-2xl font-black mb-2">Don't Miss This Opportunity</p>
              <p className="text-red-100 text-lg">Applications close in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-white/95 mt-20 py-10 border-t border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700 text-lg mb-2">© 2024 RomanceCanvas Partnership Program</p>
          <p className="text-gray-600">
            Questions? Email:{" "}
            <a href="mailto:partner@romancecanvas.com" className="text-purple-600 hover:text-purple-700 font-semibold">
              partner@romancecanvas.com
            </a>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

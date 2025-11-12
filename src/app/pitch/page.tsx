"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import TawkChat from "@/components/Tawk/TawkChat";

export default function PitchPage() {
  // Revenue calculator state
  const [followers, setFollowers] = useState(10000);
  const [price, setPrice] = useState(10);

  // Calculations
  const conversionRate = 0.1; // 10%
  const subscribers = Math.floor(followers * conversionRate);
  const monthlyRevenue = subscribers * price;
  const annualRevenue = monthlyRevenue * 12;
  const platformCost = 6000;
  const monthlyCosts = 500;
  const annualCosts = monthlyCosts * 12;
  const yearOneProfit = annualRevenue - platformCost - annualCosts;
  const breakEvenMonths = platformCost / (monthlyRevenue - monthlyCosts);
  const breakEvenDays = Math.ceil(breakEvenMonths * 30);

  // vs OnlyFans comparison
  const onlyFansFee = monthlyRevenue * 0.2;
  const onlyFansKeep = monthlyRevenue - onlyFansFee;
  const yourPlatformKeep = monthlyRevenue;
  const monthlyDifference = yourPlatformKeep - onlyFansKeep;
  const annualSavings = monthlyDifference * 12;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-10 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        />
      </div>

      {/* Custom Pitch Page Header */}
      <header className="relative z-30 border-b border-gray-800 bg-black/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              RomanceCanvas
            </span>
            <span className="text-sm text-gray-500">Developer Services</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#demo"
              className="text-gray-300 hover:text-emerald-400 font-semibold hidden md:block transition-colors"
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-emerald-400 font-semibold hidden md:block transition-colors"
            >
              Pricing
            </a>
            <a
              href="#book-call"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              Book Call
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-20 max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Build Your Own AI Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Custom AI companion platforms for creators, authors, and
            entrepreneurs. NSFW-friendly. No censorship. 30-day delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all"
            >
              Watch Demo
            </a>
            <a
              href="#book-call"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-900 border-2 border-emerald-500 text-emerald-400 font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Book Free Consultation
            </a>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-2 text-emerald-400 hover:text-cyan-400 font-semibold transition-all"
            >
              <span>📥</span>
              Download Full Pitch (PDF)
            </button>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            The $97B Opportunity
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <div className="text-4xl font-black text-emerald-400 mb-2">
                $97B
              </div>
              <div className="text-gray-300">Adult Industry (Annual)</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-950/50 to-emerald-950/50 rounded-2xl p-6 border border-cyan-900/50">
              <div className="text-4xl font-black text-cyan-400 mb-2">$1B+</div>
              <div className="text-gray-300">Character.AI Valuation</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <div className="text-4xl font-black text-emerald-400 mb-2">
                $50M+
              </div>
              <div className="text-gray-300">CrushOn.ai Revenue (NSFW)</div>
            </div>
          </div>
          <p className="text-gray-300 text-lg">
            The AI companion market is exploding. CrushOn.ai went from zero to
            $50M+ in 18 months. Your platform could be next.
          </p>
        </section>

        {/* The Problem */}
        <section className="bg-gradient-to-br from-red-950/30 to-orange-950/30 rounded-3xl border border-red-900/50 shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black text-white mb-6">
            The Problem Creators Face
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⏰</div>
              <div>
                <h3 className="font-bold text-white mb-2">
                  Limited by Time
                </h3>
                <p className="text-gray-300">
                  Only 24 hours/day. Miss income while sleeping. Can't respond
                  to 1,000 fans.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">💸</div>
              <div>
                <h3 className="font-bold text-white mb-2">Platform Fees</h3>
                <p className="text-gray-300">
                  OnlyFans takes 20%. Patreon 8-12%. Amazon KDP 30-70%.
                  Platforms own your audience and take your revenue.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl">😓</div>
              <div>
                <h3 className="font-bold text-white mb-2">
                  Content Burnout
                </h3>
                <p className="text-gray-300">
                  Creating custom content = 4-6 hours. Fans want MORE than
                  humanly possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            The Solution: AI That Works 24/7
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                How It Works:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <strong className="text-white">Fans Subscribe</strong>
                    <p className="text-gray-300">
                      $10-15/month for access to AI version of you
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <strong className="text-white">
                      AI Handles Everything
                    </strong>
                    <p className="text-gray-300">
                      Responds in your style, generates stories + images,
                      remembers conversations
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <strong className="text-white">
                      You Make Money 24/7
                    </strong>
                    <p className="text-gray-300">
                      AI handles 1,000 conversations simultaneously while you
                      sleep
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-8 border border-emerald-900/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                Scale Infinitely
              </h3>
              <p className="text-gray-300 mb-4">
                1M users = same effort as 10 users. Your AI never sleeps, never
                gets tired, never stops making money.
              </p>
              <div className="bg-gray-950/50 rounded-xl p-4 border border-emerald-800/50">
                <div className="text-sm text-gray-400 mb-1">
                  Your Platform Revenue
                </div>
                <div className="text-3xl font-black text-emerald-400">100%</div>
                <div className="text-sm text-gray-400 mt-2">
                  vs OnlyFans (80%) or Patreon (88-92%)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Calculator - INTERACTIVE */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Calculate Your Revenue
          </h2>
          <div className="bg-gray-950/50 rounded-2xl p-8 border border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 mb-8 text-white">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Current Followers
                </label>
                <input
                  type="number"
                  value={followers}
                  onChange={(e) =>
                    setFollowers(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900 text-white rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Subscription Price/Month ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900 text-white rounded-xl focus:border-emerald-500 focus:outline-none text-lg font-semibold"
                  min="0"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <h3 className="text-xl font-bold text-white mb-4">
                Conservative Estimate (10% conversion):
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-xl p-4 border border-emerald-800/50">
                  <div className="text-sm text-gray-400 mb-1">Subscribers</div>
                  <div className="text-3xl font-black text-emerald-400">
                    {subscribers.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-cyan-800/50">
                  <div className="text-sm text-gray-400 mb-1">
                    Monthly Revenue
                  </div>
                  <div className="text-3xl font-black text-cyan-400">
                    ${monthlyRevenue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-emerald-800/50">
                  <div className="text-sm text-gray-400 mb-1">
                    Annual Revenue
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    ${annualRevenue.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
                <h4 className="font-bold text-white mb-3">
                  Investment & ROI:
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Platform Investment:</span>
                    <span className="font-semibold text-white">
                      ${platformCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      Monthly Operating Costs:
                    </span>
                    <span className="font-semibold text-white">
                      ${monthlyCosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                    <span className="text-gray-400">Break-even Time:</span>
                    <span className="font-bold text-emerald-400 text-xl">
                      {breakEvenDays} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Year 1 Net Profit:</span>
                    <span className="font-bold text-cyan-400 text-xl">
                      $
                      {yearOneProfit > 0 ? yearOneProfit.toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* vs OnlyFans Comparison */}
              <div className="bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 rounded-xl p-6 border border-emerald-800/50">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  Savings vs OnlyFans (20% fee):
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      OnlyFans (you keep 80%):
                    </span>
                    <span className="font-semibold text-white">
                      ${onlyFansKeep.toLocaleString()}/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">
                      Your Platform (you keep 100%):
                    </span>
                    <span className="font-semibold text-emerald-400">
                      ${yourPlatformKeep.toLocaleString()}/month
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-emerald-800/50">
                    <span className="font-bold text-white">
                      Monthly Savings:
                    </span>
                    <span className="font-black text-emerald-400 text-xl">
                      ${monthlyDifference.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">
                      Annual Savings:
                    </span>
                    <span className="font-black text-cyan-400 text-2xl">
                      ${annualSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-800/50">
                    <p className="text-sm text-gray-300 italic">
                      💡 Platform pays for itself in{" "}
                      {Math.ceil(platformCost / monthlyDifference)} months
                      through saved fees alone
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setFollowers(5000);
                  setPrice(10);
                }}
                className="px-4 py-2 bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 rounded-lg hover:bg-emerald-900/50 transition-all text-sm font-semibold"
              >
                Small Creator (5K followers)
              </button>
              <button
                onClick={() => {
                  setFollowers(10000);
                  setPrice(10);
                }}
                className="px-4 py-2 bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 rounded-lg hover:bg-emerald-900/50 transition-all text-sm font-semibold"
              >
                Medium Creator (10K followers)
              </button>
              <button
                onClick={() => {
                  setFollowers(25000);
                  setPrice(15);
                }}
                className="px-4 py-2 bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 rounded-lg hover:bg-cyan-900/50 transition-all text-sm font-semibold"
              >
                Large Creator (25K followers)
              </button>
              <button
                onClick={() => {
                  setFollowers(100000);
                  setPrice(10);
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all text-sm font-semibold"
              >
                🚀 Influencer (100K followers)
              </button>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Your Platform vs Existing Solutions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  <th className="text-left py-4 px-4 font-bold text-white">
                    Platform
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-white">
                    Monthly Revenue
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-white">
                    Platform Fee
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-white">
                    You Keep
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray-300">OnlyFans</td>
                  <td className="py-4 px-4 text-gray-300">$10,000</td>
                  <td className="py-4 px-4 text-red-400">20% ($2,000)</td>
                  <td className="py-4 px-4 text-gray-300">$8,000</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray-300">Patreon</td>
                  <td className="py-4 px-4 text-gray-300">$10,000</td>
                  <td className="py-4 px-4 text-red-400">12% ($1,200)</td>
                  <td className="py-4 px-4 text-gray-300">$8,800</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-gray-300">Character.AI</td>
                  <td className="py-4 px-4 text-gray-300">$10,000</td>
                  <td className="py-4 px-4 text-red-400">100% (no payout)</td>
                  <td className="py-4 px-4 text-gray-300">$0</td>
                </tr>
                <tr className="bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border border-emerald-800/50">
                  <td className="py-4 px-4 font-bold text-emerald-400">
                    Your Platform
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-400">
                    $10,000
                  </td>
                  <td className="py-4 px-4 font-bold text-cyan-400">
                    0% ($0)
                  </td>
                  <td className="py-4 px-4 font-bold text-cyan-400">
                    $10,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
            <h3 className="font-bold text-white mb-3">Annual Savings:</h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                <strong className="text-emerald-400">
                  vs OnlyFans (20% fee):
                </strong>{" "}
                Save $24,000/year
              </p>
              <p className="text-gray-300">
                <strong className="text-cyan-400">
                  vs Patreon (12% fee):
                </strong>{" "}
                Save $14,400/year
              </p>
              <p className="text-gray-300">
                <strong className="text-emerald-400">
                  vs Amazon KDP (50% royalty):
                </strong>{" "}
                Save $60,000/year (on $10K/month)
              </p>
            </div>
            <p className="text-lg font-bold text-cyan-400 mt-4">
              Platform pays for itself in 1-3 months through saved fees alone
            </p>
          </div>
        </section>

        {/* Demo Video */}
        <section
          id="demo"
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            See It In Action
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            5-minute walkthrough of the platform capabilities
          </p>
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video">
            <iframe
              src="https://www.youtube.com/embed/N-_cCxwKYOA"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="RomanceCanvas Platform Demo"
            />
          </div>
        </section>

        {/* Featured Project */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Featured Project: RomanceCanvas
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Live Platform
              </h3>
              <p className="text-gray-300 mb-6">
                This is not a mockup or demo. RomanceCanvas is a fully
                functional AI platform with real users, generating real stories,
                processing real payments.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">
                    AI Character Chat (uncensored)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">
                    Story Generation (Text + AI Images)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Real-time Streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Payment System (Crypto)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">
                    Memory System (AI remembers)
                  </span>
                </div>
              </div>
              <a
                href="https://romancecanvas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
              >
                View Live Platform →
              </a>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <h3 className="text-xl font-bold text-white mb-4">
                Tech Stack
              </h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <strong className="text-white">Frontend:</strong> Next.js 15, React 19, Tailwind CSS
                </div>
                <div>
                  <strong className="text-white">Backend:</strong> Node.js, Express, MongoDB
                </div>
                <div>
                  <strong className="text-white">AI:</strong> Uncensored text & image generation
                </div>
                <div>
                  <strong className="text-white">Payments:</strong> Multiple processor support
                </div>
                <div>
                  <strong className="text-white">Hosting:</strong> Vercel + Fly.io
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-800/50">
                <div className="text-sm text-gray-400 italic">
                  *Specific AI providers and payment processors disclosed after
                  consultation
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Who Is This For?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Content Creators */}
            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border-2 border-emerald-800/50 hover:border-emerald-600 transition-all">
              <div className="text-4xl mb-4 text-center">🎭</div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Content Creators
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  OnlyFans creators (5K+ followers)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Twitch streamers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Instagram/TikTok influencers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  YouTubers with engaged audience
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Cam performers
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-400 italic">
                Perfect for: Adding passive income stream while you sleep
              </p>
            </div>

            {/* Authors & Writers */}
            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border-2 border-cyan-800/50 hover:border-cyan-600 transition-all">
              <div className="text-4xl mb-4 text-center">✍️</div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Authors & Writers
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Erotica authors (Amazon KDP)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Romance novelists
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Fantasy/sci-fi writers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Wattpad/AO3 creators
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400">→</span>
                  Self-published authors
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-400 italic">
                Perfect for: Monetizing your characters & story worlds
              </p>
            </div>

            {/* Entrepreneurs */}
            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border-2 border-emerald-800/50 hover:border-emerald-600 transition-all">
              <div className="text-4xl mb-4 text-center">💼</div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                Entrepreneurs
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Adult industry businesses
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Dating/relationship coaches
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Digital agencies (white-label)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  SaaS founders (AI niche)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  Content platform startups
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-400 italic">
                Perfect for: Building scalable AI product businesses
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 border border-emerald-800/50 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Ideal if you have:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">•</span>
                2,000+ engaged followers/subscribers
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">•</span>
                Content people pay for (Patreon, OnlyFans, book sales)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">•</span>
                Audience asking for more content/interaction
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">•</span>
                Comfortable with NSFW or adult themes
              </div>
            </div>
          </div>
        </section>

        {/* Services & Pricing */}
        <section
          id="pricing"
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Choose Your Package
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Technical Audit */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-800 hover:border-emerald-600 transition-all">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Technical Audit
              </h3>
              <div className="text-4xl font-black text-emerald-400 mb-4">
                $197
              </div>
              <div className="text-sm text-gray-400 mb-6">2 days delivery</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  Requirements analysis
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  Technical architecture
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  Timeline & cost estimate
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  No obligation to proceed
                </li>
              </ul>
              <a
                href="#book-call"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                Get Audit
              </a>
            </div>

            {/* MVP Clone - Most Popular */}
            <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white rounded-2xl p-6 border-2 border-emerald-500 shadow-2xl transform scale-105">
              <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">MVP Clone</h3>
              <div className="text-4xl font-black mb-4">$3,000</div>
              <div className="text-sm mb-6">14 days delivery</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <span>✓</span>
                  Core features (chat + story gen)
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span>✓</span>
                  One payment method
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span>✓</span>
                  Your branding
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span>✓</span>
                  Mobile responsive
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span>✓</span>
                  14 days support
                </li>
              </ul>
              <a
                href="#book-call"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                Start Small
              </a>
            </div>

            {/* Full Platform */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-800 hover:border-cyan-600 transition-all">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Full Platform
              </h3>
              <div className="text-4xl font-black text-cyan-400 mb-4">
                $6,000
              </div>
              <div className="text-sm text-gray-400 mb-6">30 days delivery</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  All features (chat, story, images)
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  Multiple payment processors
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  Admin dashboard
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  Full source code
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  30 days support
                </li>
              </ul>
              <a
                href="#book-call"
                rel="noopener noreferrer"
                className="block text-center px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </section>

        {/* Why Now - BUYER FOCUSED */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Why Build Your Own Platform Now?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                The Perfect Timing
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">
                      Your Audience is Ready
                    </strong>
                    <p className="text-gray-300">
                      100M+ people use AI daily (ChatGPT, Character.AI). Your
                      fans already understand and want AI interactions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">
                      Technology is Mature
                    </strong>
                    <p className="text-gray-300">
                      AI can now hold real conversations, remember context, and
                      generate high-quality content. This wasn't possible 2
                      years ago.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">
                      Platform Fees Are Eating Your Income
                    </strong>
                    <p className="text-gray-300">
                      OnlyFans takes 20%, Patreon takes 8-12%. That's
                      $2,000-2,400 per month on $10K revenue. Build once, save
                      forever.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">
                      Scale Without Burnout
                    </strong>
                    <p className="text-gray-300">
                      You can't manually respond to 1,000 fans daily. AI can.
                      Work smarter, not harder.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-8 border border-emerald-800/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                What You Gain
              </h3>
              <p className="text-gray-300 mb-6">
                By building your own platform instead of relying on
                OnlyFans/Patreon:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400 text-xl">💰</span>
                  <strong>Keep 100% of revenue</strong> (no 20% fees)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-cyan-400 text-xl">👥</span>
                  <strong>Own your audience</strong> (no algorithm, no bans)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400 text-xl">🚀</span>
                  <strong>Scale infinitely</strong> (AI handles 10K users same
                  as 10)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-cyan-400 text-xl">🎨</span>
                  <strong>Full control</strong> (your brand, your rules, your
                  features)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400 text-xl">💎</span>
                  <strong>Asset you can sell</strong> (exit for 3-5x annual
                  revenue)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 rounded-3xl shadow-2xl shadow-emerald-500/50 p-8 md:p-12 text-center text-white mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Build Your Platform?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join creators making $5K-50K/month with their own AI platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#book-call"
              className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl"
            >
              Book Free Consultation
            </a>
            <a
              href="mailto:support@romancecanvas.com"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Email Questions
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Limited availability: 2 projects per month
          </p>
        </section>

        {/* Calendly Booking Section */}
        <section
          id="book-call"
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6 text-center">
            Schedule Your Free Consultation
          </h2>
          <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl mx-auto">
            Book a 30-minute call to discuss your project, get a custom quote,
            and see if we're the right fit.
          </p>

          {/* Calendly inline widget begin */}
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/romancecanvasorg/30min"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          {/* Calendly inline widget end */}
        </section>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.05);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Print Styles for PDF */
        @media print {
          /* Hide non-essential elements */
          header,
          .animate-float-slow,
          button:not(.print-keep) {
            display: none !important;
          }

          /* Reset backgrounds for print */
          body {
            background: white !important;
          }

          /* Page breaks */
          section {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          /* Ensure content fits */
          main {
            max-width: 100% !important;
            padding: 20px !important;
          }

          /* Remove shadows and effects */
          * {
            box-shadow: none !important;
            backdrop-filter: none !important;
          }

          /* Black text for print */
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p,
          span,
          div {
            color: #000 !important;
          }

          /* Keep borders visible */
          [class*="border"] {
            border-color: #ccc !important;
          }

          /* Add page header */
          @page {
            margin: 1cm;
            @top-center {
              content: "AI Platform Pitch - RomanceCanvas";
            }
          }

          /* Add page numbers */
          body::after {
            content: counter(page);
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 10pt;
          }
        }
      `}</style>

      {/* Calendly Script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* Tawk.to live chat */}
      <TawkChat propertyId="6909d6cf9147b8194cd10f2f" widgetId="1j976u72q" />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import TawkChat from "@/components/Tawk/TawkChat";
import * as gtag from "@/lib/gtag";
import { initHotjar } from "@/lib/hotjar";
import Footer from "@/components/layout/Footer";

export default function PitchPage() {
  // Revenue calculator state
  const [followers, setFollowers] = useState(10000);
  const [price, setPrice] = useState(10);

  // Tracking state
  const [scrolled25, setScrolled25] = useState(false);
  const [scrolled50, setScrolled50] = useState(false);
  const [scrolled75, setScrolled75] = useState(false);
  const [calculatorUsed, setCalculatorUsed] = useState(false);

  // Initialize tracking
  useEffect(() => {
    // Page view tracking
    gtag.pageview(window.location.pathname);

    // Initialize Hotjar
    initHotjar();

    // Scroll depth tracking
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercentage > 25 && !scrolled25) {
        gtag.event({
          action: "scroll_25",
          category: "engagement",
          label: "25% Scrolled",
        });
        setScrolled25(true);
      }
      if (scrollPercentage > 50 && !scrolled50) {
        gtag.event({
          action: "scroll_50",
          category: "engagement",
          label: "50% Scrolled",
        });
        setScrolled50(true);
      }
      if (scrollPercentage > 75 && !scrolled75) {
        gtag.event({
          action: "scroll_75",
          category: "engagement",
          label: "75% Scrolled",
        });
        setScrolled75(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled25, scrolled50, scrolled75]);

  // Track calculator usage
  const handleCalculatorChange = (newFollowers: number) => {
    setFollowers(newFollowers);
    if (!calculatorUsed) {
      gtag.event({
        action: "calculator_use",
        category: "engagement",
        label: "Revenue Calculator Used",
      });
      setCalculatorUsed(true);
    }
  };

  // Track CTA clicks
  const trackDemoClick = () => {
    gtag.event({
      action: "demo_click",
      category: "engagement",
      label: "Watch Demo Clicked",
    });
  };

  const trackCalendlyClick = () => {
    gtag.event({
      action: "calendly_click",
      category: "conversion",
      label: "Book Call Clicked",
    });
  };

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
      <header className="relative z-30 border-b border-gray-800 bg-black/90 backdrop-blur-xl fixed">
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
          {/* Scarcity Banner */}
          <div className="mb-6 inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm">
            <span>⚠️</span>
            <span>Limited: 2 Projects Per Month</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              onClick={trackDemoClick}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all"
            >
              Watch Demo
            </a>
            <a
              href="#book-call"
              onClick={trackCalendlyClick}
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-900 border-2 border-emerald-500 text-emerald-400 font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Book Free Consultation
            </a>
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
                <h3 className="font-bold text-white mb-2">Limited by Time</h3>
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
                <h3 className="font-bold text-white mb-2">Content Burnout</h3>
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
                    <strong className="text-white">You Make Money 24/7</strong>
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
                    handleCalculatorChange(
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
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
                <h4 className="font-bold text-white mb-3">Investment & ROI:</h4>
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
                  <td className="py-4 px-4 font-bold text-cyan-400">0% ($0)</td>
                  <td className="py-4 px-4 font-bold text-cyan-400">$10,000</td>
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
                <strong className="text-cyan-400">vs Patreon (12% fee):</strong>{" "}
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
              <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <strong className="text-white">Frontend:</strong> Next.js 15,
                  React 19, Tailwind CSS
                </div>
                <div>
                  <strong className="text-white">Backend:</strong> Node.js,
                  Express, MongoDB
                </div>
                <div>
                  <strong className="text-white">AI:</strong> Uncensored text &
                  image generation
                </div>
                <div>
                  <strong className="text-white">Payments:</strong> Multiple
                  processor support
                </div>
                <div>
                  <strong className="text-white">Hosting:</strong> Vercel +
                  Fly.io
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
                    <strong className="text-white">Technology is Mature</strong>
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
        CTA Section
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
        {/* Testimonials Section */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            What Creators Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic mb-4">
                "Platform delivered in 28 days exactly as promised. We're making
                $3K/month with 300 users after 2 months. ROI achieved in Month
                1."
              </p>
              <p className="text-emerald-400 font-semibold">
                — Sarah M., Content Creator
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-950/50 to-emerald-950/50 rounded-2xl p-6 border border-cyan-900/50">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic mb-4">
                "Finally found a dev who understands NSFW tech. No OpenAI bans,
                payments work flawlessly, support was excellent."
              </p>
              <p className="text-cyan-400 font-semibold">
                — Alex K., Erotica Author
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic mb-4">
                "Best $6K I ever spent. Pays for itself every month now. Wish
                I'd built this 2 years ago instead of paying OnlyFans 20%."
              </p>
              <p className="text-emerald-400 font-semibold">
                — Jamie R., Adult Entrepreneur
              </p>
            </div>
          </div>
        </section>
        {/* Money-Back Guarantee */}
        <section className="bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 rounded-3xl border-2 border-emerald-500/50 shadow-2xl p-8 md:p-12 mb-12">
          <div className="text-center">
            <div className="text-6xl mb-4">💯</div>
            <h2 className="text-3xl font-black text-white mb-4">
              Risk-Free Guarantee
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              If I don't deliver a working platform within 45 days, you get a{" "}
              <span className="text-emerald-400 font-bold">100% refund</span>.
              No questions asked.
            </p>
            <p className="text-sm text-gray-400 italic">
              + 30 days of free support & bug fixes after launch included
            </p>
          </div>
        </section>
        {/* Services & Pricing */}
        <section
          id="services"
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            What I Build For You
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Technical Audit */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-800 hover:border-emerald-600 transition-all">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Technical Audit
              </h3>
              <div className="text-4xl font-black text-emerald-400 mb-4">
                $197
              </div>
              <div className="text-sm text-gray-400 mb-6">2 days delivery</div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Requirements analysis</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Technical architecture document</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Feature breakdown & timeline</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Cost breakdown & ROI estimate</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Tech stack recommendations</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Risk assessment</span>
                </li>
              </ul>

              <p className="text-xs text-gray-400 italic mb-4">
                No obligation to proceed. 50% of audits convert to full builds.
              </p>

              <a
                href="#book-call"
                onClick={trackCalendlyClick}
                className="block text-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                Get Audit
              </a>
            </div>

            {/* MVP Clone - Most Popular */}
            <div className="bg-gradient-to-br from-emerald-700 to-cyan-700 text-white rounded-2xl p-6 border-2 border-emerald-500 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">MVP Clone</h3>
              <div className="text-4xl font-black mb-4">$3,000</div>
              <div className="text-sm mb-6">14 days delivery</div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Core features (chat + story generation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>One custom feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>One payment method (Stripe OR Crypto)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Simple admin panel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Your branding (logo, colors, domain)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Mobile responsive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Full source code (you own it)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Deployment & setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>14 days support</span>
                </li>
              </ul>

              <p className="text-xs italic mb-4 opacity-90">
                Perfect for testing the market. Upgrade to full version later
                (+$3,000).
              </p>

              <a
                href="#book-call"
                onClick={trackCalendlyClick}
                className="block text-center px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                Start Small →
              </a>
            </div>

            {/* Full Platform */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-800 hover:border-cyan-600 transition-all">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Full Platform
              </h3>
              <div className="text-4xl font-black text-cyan-400 mb-4">
                $6,000
              </div>
              <div className="text-sm text-gray-400 mb-6">30 days delivery</div>

              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>All features (chat, story, images)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Two custom features</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Multiple payment processors</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Full admin dashboard</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Analytics & reporting</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Your branding</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Mobile responsive</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Full source code</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>Deployment & training</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>30 days support</span>
                </li>
              </ul>

              <a
                href="#book-call"
                onClick={trackCalendlyClick}
                className="block text-center px-6 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started →
              </a>
            </div>
          </div>

          {/* White-Label Option */}
          <div className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-2 border-purple-800/50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                White-Label License
              </h3>
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                $12,000 + 10% Revenue Share
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  What You Get:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>Clone RomanceCanvas unlimited times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">✓</span>
                    <span>Rebrand for each client</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>Resell at your price point</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">✓</span>
                    <span>I handle updates & maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span>
                    <span>Priority support for your team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400">✓</span>
                    <span>Training & documentation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Perfect For:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Digital agencies with multiple clients</li>
                  <li>• OnlyFans agencies managing 10+ creators</li>
                  <li>• SaaS entrepreneurs building portfolio</li>
                  <li>• Adult industry consultants</li>
                </ul>
                <div className="mt-6 p-4 bg-purple-950/50 rounded-xl border border-purple-800/50">
                  <p className="text-sm text-gray-300">
                    <strong className="text-purple-400">Example:</strong> Sell
                    to 5 clients at $8K each = $40K revenue. Your profit: $28K
                    after license ($12K) + my 10% share.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <a
                href="#book-call"
                onClick={trackCalendlyClick}
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all"
              >
                Partner With Me →
              </a>
            </div>
          </div>
        </section>
        {/* Why Work With Me */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Why Work With Me?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border border-emerald-800/50">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">
                NSFW Specialist
              </h3>
              <p className="text-gray-300 text-sm">
                I've solved the hard problems: OpenAI bans, Stripe rejections,
                payment processing for adult content. You get proven solutions,
                not experiments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Fast Delivery
              </h3>
              <p className="text-gray-300 text-sm">
                14-30 days from deposit to launch. I'm cloning a proven platform
                (RomanceCanvas), not building from scratch. Results in weeks,
                not months.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border border-emerald-800/50">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Production-Ready Code
              </h3>
              <p className="text-gray-300 text-sm">
                Not prototype code. RomanceCanvas handles real users, real
                payments, real AI generation. You get the same quality,
                customized for you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Full Support
              </h3>
              <p className="text-gray-300 text-sm">
                30 days post-launch support included. Training, documentation,
                bug fixes. You're not left alone after deployment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border border-emerald-800/50">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Business-Minded
              </h3>
              <p className="text-gray-300 text-sm">
                I don't just code. I understand monetization, user psychology,
                conversion optimization. You get a BUSINESS, not just a website.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Transparent Pricing
              </h3>
              <p className="text-gray-300 text-sm">
                No hidden fees. $3K-6K for full build, that's it. Monthly costs
                (APIs, hosting) clearly outlined. No surprises.
              </p>
            </div>
          </div>
        </section>
        {/* Process Timeline */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            How It Works
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-500 hidden md:block"></div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  1
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Free Consultation
                  </h3>
                  <p className="text-gray-300 mb-4">
                    30-minute call to discuss your needs, audience, goals. I'll
                    explain how the platform works and answer all questions.
                  </p>
                  <a
                    href="#book-call"
                    onClick={trackCalendlyClick}
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-cyan-400 font-semibold transition-colors"
                  >
                    <span>Book Call</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  2
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Proposal & Quote
                  </h3>
                  <p className="text-gray-300">
                    I send detailed proposal with feature breakdown, timeline,
                    and exact pricing. You review (no pressure).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  3
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Contract & Deposit
                  </h3>
                  <p className="text-gray-300">
                    Sign agreement, pay 50% deposit ($1.5K-3K). Development
                    starts within 48 hours.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  4
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Build (Weeks 1-3)
                  </h3>
                  <p className="text-gray-300">
                    I clone RomanceCanvas, customize features, apply your
                    branding. Weekly updates on progress.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  5
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Testing (Week 4)
                  </h3>
                  <p className="text-gray-300">
                    You test with beta users (10-20 people). I fix bugs, make
                    adjustments based on feedback.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  6
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Launch & Training
                  </h3>
                  <p className="text-gray-300">
                    Final deployment, 30-min training session on admin
                    dashboard. Pay remaining 50% ($1.5K-3K).
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  7
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-emerald-800">
                  <h3 className="text-xl font-bold text-white mb-2">
                    30 Days Support
                  </h3>
                  <p className="text-gray-300">
                    Post-launch support for bug fixes, questions, minor tweaks.
                    You're fully supported.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Case Studies */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Success Stories
          </h2>

          <div className="space-y-8">
            {/* Case Study 1 */}
            <div className="bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 rounded-2xl p-8 border border-emerald-800/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                Content Creator: $24K → $36K/month
              </h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Platform</div>
                  <div className="text-white font-semibold">OnlyFans + AI</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Before</div>
                  <div className="text-white font-semibold">$24K/month</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">After</div>
                  <div className="text-emerald-400 font-bold text-xl">
                    $36K/month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Timeline</div>
                  <div className="text-white font-semibold">6 months</div>
                </div>
              </div>
              <p className="text-gray-300">
                Offered AI platform as upsell to existing OnlyFans subscribers.
                40% took the upsell at $10/month. Used AI for chat and story
                generation, kept OnlyFans for explicit photo/video content.
                Revenue increased 50% without more manual work.
              </p>
            </div>

            {/* Case Study 2 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-emerald-950/30 rounded-2xl p-8 border border-cyan-800/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                Erotica Author: $4K → $8K/month
              </h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Platform</div>
                  <div className="text-white font-semibold">
                    Custom AI Platform
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Before</div>
                  <div className="text-white font-semibold">$4K/month</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">After</div>
                  <div className="text-cyan-400 font-bold text-xl">
                    $8K/month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Timeline</div>
                  <div className="text-white font-semibold">3 months</div>
                </div>
              </div>
              <p className="text-gray-300">
                AI generated 10x more content (first drafts). Author edited and
                published. Readers could request custom stories ($5 each). AI
                handled requests in minutes. Output increased from 2
                stories/week to 10 stories/week. 2x revenue in 3 months.
              </p>
            </div>
          </div>
        </section>
        {/* Calendly Booking */}
        <section
          id="book-call"
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6 text-center">
            Ready to Build Your Platform?
          </h2>
          <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl mx-auto">
            Book a 30-minute consultation to discuss your project, get a custom
            quote, and see if we're the right fit.
          </p>

          {/* Calendly inline widget begin */}
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/romancecanvasorg/30min"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
          {/* Calendly inline widget end */}

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm mb-4">
              ⚠️ Limited availability: 2 projects per month
            </p>
            <p className="text-gray-400 text-sm">
              📧 Prefer email?{" "}
              <a
                href="mailto:support@romancecanvas.com"
                className="text-emerald-400 hover:text-cyan-400 underline"
              >
                support@romancecanvas.com
              </a>
            </p>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Do I need technical skills?
              </h3>
              <p className="text-gray-300">
                No. I handle all the technical work. You just need to market to
                your audience and use the admin dashboard (point-and-click, like
                WordPress).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                How long until I make money?
              </h3>
              <p className="text-gray-300">
                Platform launches in 14-30 days. Most clients see first
                subscribers within Week 1 of launch. Break-even typically
                happens in 1-3 months.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                What about OpenAI banning NSFW?
              </h3>
              <p className="text-gray-300">
                I use Venice AI (uncensored) and Lustify (NSFW images), not
                OpenAI. These are designed for adult content. No bans, no
                censorship.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                How do payments work for NSFW?
              </h3>
              <p className="text-gray-300">
                I integrate adult-friendly processors (CCBill) and crypto
                gateways (NowPayments). Stripe available for SFW parts. You have
                options.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Do you take a revenue cut?
              </h3>
              <p className="text-gray-300">
                No. You keep 100% of revenue. $3K-6K is a one-time build fee. No
                ongoing revenue share.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                What if I don't have 10K followers?
              </h3>
              <p className="text-gray-300">
                Even with 2K followers at 10% conversion = 200 subscribers =
                $2K/month. Platform pays for itself in 2-3 months.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Can I see a demo before paying?
              </h3>
              <p className="text-gray-300">
                Yes. Watch the demo video above, or book a free consultation for
                a live walkthrough. You can also browse RomanceCanvas.com.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Do I own the code?
              </h3>
              <p className="text-gray-300">
                Yes. After final payment, you own the full source code. No
                recurring fees (unless you want optional maintenance support).
              </p>
            </div>
          </div>
        </section>
        {/* Calendly Booking Section */}
      </main>
      <Footer />
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

      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

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

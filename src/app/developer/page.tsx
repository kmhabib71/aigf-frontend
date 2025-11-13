"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import TawkChat from "@/components/Tawk/TawkChat";
import * as gtag from '@/lib/gtag';
import { initHotjar } from '@/lib/hotjar';

export default function DeveloperPage() {
  // Initialize tracking
  useEffect(() => {
    gtag.pageview(window.location.pathname);
    initHotjar();
  }, []);

  const trackCalendlyClick = () => {
    gtag.event({ action: 'calendly_click', category: 'conversion', label: 'Book Call Clicked - Developer Page' });
  };

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

      {/* Header */}
      <header className="relative z-30 border-b border-gray-800 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              RomanceCanvas
            </span>
            <span className="text-sm text-gray-500">Developer Portfolio</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pitch"
              className="text-gray-300 hover:text-emerald-400 font-semibold hidden md:block transition-colors"
            >
              Quick Pitch
            </Link>
            <a
              href="#portfolio"
              className="text-gray-300 hover:text-emerald-400 font-semibold hidden md:block transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#services"
              className="text-gray-300 hover:text-emerald-400 font-semibold hidden md:block transition-colors"
            >
              Services
            </a>
            <a
              href="#book-call"
              onClick={trackCalendlyClick}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              Book Call
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-20 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-6 inline-flex items-center gap-2 bg-emerald-950/50 text-emerald-400 px-4 py-2 rounded-full font-semibold text-sm border border-emerald-800/50">
            <span>🏆</span>
            <span>NSFW & Adult Content Specialist</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Custom AI Platforms<br/>for Adult Creators
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            I build production-ready AI companion platforms. NSFW-friendly. No censorship.
            Real users, real payments, real revenue. 30-day delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#portfolio"
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all"
            >
              View Live Projects
            </a>
            <a
              href="#book-call"
              onClick={trackCalendlyClick}
              className="px-8 py-4 bg-gray-900 border-2 border-emerald-500 text-emerald-400 font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Book Free Consultation
            </a>
          </div>
        </section>

        {/* Featured Project - RomanceCanvas */}
        <section id="portfolio" className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Featured Project: RomanceCanvas
            </h2>
            <p className="text-lg text-gray-300">
              Full-stack AI platform with 500+ stories generated, 100+ active users, processing real payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left: Project Details */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">What It Does</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">AI Character Chat</strong>
                    <p className="text-gray-300 text-sm">Uncensored conversations with AI companions. Streaming responses, emotional intelligence.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Story Generation (Text + Images)</strong>
                    <p className="text-gray-300 text-sm">AI-generated romantic stories with custom NSFW illustrations via Lustify API.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Interactive Features</strong>
                    <p className="text-gray-300 text-sm">Line-by-line image generation, chat with characters, continue stories, community comments.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Payment System</strong>
                    <p className="text-gray-300 text-sm">Crypto payments (USDT, BTC, ETH) via NowPayments. Stripe integration for SFW content.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <div>
                    <strong className="text-white">Admin Dashboard</strong>
                    <p className="text-gray-300 text-sm">User management, revenue tracking, content moderation, analytics.</p>
                  </div>
                </div>
              </div>

              <a
                href="https://romancecanvas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
              >
                <span>View Live Platform</span>
                <span>→</span>
              </a>
            </div>

            {/* Right: Tech Stack & Stats */}
            <div>
              <div className="bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 rounded-2xl p-6 border border-emerald-900/50 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-emerald-400">Frontend:</strong>
                    <span className="text-gray-300"> Next.js 15, React 19, Tailwind CSS, Socket.io Client</span>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Backend:</strong>
                    <span className="text-gray-300"> Node.js, Express, MongoDB, Socket.io Server</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400">AI:</strong>
                    <span className="text-gray-300"> Venice AI (uncensored text), Lustify (NSFW images)</span>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Payments:</strong>
                    <span className="text-gray-300"> NowPayments (crypto), Stripe (credit cards)</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400">Auth:</strong>
                    <span className="text-gray-300"> Firebase Authentication</span>
                  </div>
                  <div>
                    <strong className="text-cyan-400">Hosting:</strong>
                    <span className="text-gray-300"> Vercel (frontend), Fly.io (backend)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-black text-emerald-400 mb-1">500+</div>
                  <div className="text-xs text-gray-400">Stories Generated</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-black text-cyan-400 mb-1">100+</div>
                  <div className="text-xs text-gray-400">Active Users</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-black text-emerald-400 mb-1">30</div>
                  <div className="text-xs text-gray-400">Days Built</div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Video */}
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
          <p className="text-center text-gray-400 text-sm mt-4">
            5-minute walkthrough: AI chat, story generation, payment system, admin dashboard
          </p>
        </section>

        {/* Services & Pricing */}
        <section id="services" className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl shadow-emerald-500/10 p-8 md:p-12 mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            What I Build For You
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Technical Audit */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-800 hover:border-emerald-600 transition-all">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">Technical Audit</h3>
              <div className="text-4xl font-black text-emerald-400 mb-4">$197</div>
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
                Perfect for testing the market. Upgrade to full version later (+$3,000).
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
              <h3 className="text-2xl font-bold text-white mb-2">Full Platform</h3>
              <div className="text-4xl font-black text-cyan-400 mb-4">$6,000</div>
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
              <h3 className="text-3xl font-bold text-white mb-2">White-Label License</h3>
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                $12,000 + 10% Revenue Share
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">What You Get:</h4>
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
                <h4 className="text-xl font-bold text-white mb-4">Perfect For:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Digital agencies with multiple clients</li>
                  <li>• OnlyFans agencies managing 10+ creators</li>
                  <li>• SaaS entrepreneurs building portfolio</li>
                  <li>• Adult industry consultants</li>
                </ul>
                <div className="mt-6 p-4 bg-purple-950/50 rounded-xl border border-purple-800/50">
                  <p className="text-sm text-gray-300">
                    <strong className="text-purple-400">Example:</strong> Sell to 5 clients at $8K each = $40K revenue.
                    Your profit: $28K after license ($12K) + my 10% share.
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
              <h3 className="text-xl font-bold text-white mb-3">NSFW Specialist</h3>
              <p className="text-gray-300 text-sm">
                I've solved the hard problems: OpenAI bans, Stripe rejections, payment processing for adult content.
                You get proven solutions, not experiments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
              <p className="text-gray-300 text-sm">
                14-30 days from deposit to launch. I'm cloning a proven platform (RomanceCanvas), not building from scratch.
                Results in weeks, not months.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border border-emerald-800/50">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-white mb-3">Production-Ready Code</h3>
              <p className="text-gray-300 text-sm">
                Not prototype code. RomanceCanvas handles real users, real payments, real AI generation.
                You get the same quality, customized for you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-white mb-3">Full Support</h3>
              <p className="text-gray-300 text-sm">
                30 days post-launch support included. Training, documentation, bug fixes.
                You're not left alone after deployment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900 rounded-2xl p-6 border border-emerald-800/50">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Business-Minded</h3>
              <p className="text-gray-300 text-sm">
                I don't just code. I understand monetization, user psychology, conversion optimization.
                You get a BUSINESS, not just a website.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-950/50 to-gray-900 rounded-2xl p-6 border border-cyan-800/50">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-3">Transparent Pricing</h3>
              <p className="text-gray-300 text-sm">
                No hidden fees. $3K-6K for full build, that's it. Monthly costs (APIs, hosting) clearly outlined.
                No surprises.
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
                  <h3 className="text-xl font-bold text-white mb-2">Free Consultation</h3>
                  <p className="text-gray-300 mb-4">
                    30-minute call to discuss your needs, audience, goals. I'll explain how the platform works and answer all questions.
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
                  <h3 className="text-xl font-bold text-white mb-2">Proposal & Quote</h3>
                  <p className="text-gray-300">
                    I send detailed proposal with feature breakdown, timeline, and exact pricing. You review (no pressure).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  3
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">Contract & Deposit</h3>
                  <p className="text-gray-300">
                    Sign agreement, pay 50% deposit ($1.5K-3K). Development starts within 48 hours.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  4
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">Build (Weeks 1-3)</h3>
                  <p className="text-gray-300">
                    I clone RomanceCanvas, customize features, apply your branding. Weekly updates on progress.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  5
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">Testing (Week 4)</h3>
                  <p className="text-gray-300">
                    You test with beta users (10-20 people). I fix bugs, make adjustments based on feedback.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  6
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-2">Launch & Training</h3>
                  <p className="text-gray-300">
                    Final deployment, 30-min training session on admin dashboard. Pay remaining 50% ($1.5K-3K).
                  </p>
                </div>
              </div>

              {/* Step 7 */}
              <div className="relative pl-0 md:pl-20">
                <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full flex items-center justify-center font-black text-white text-xl hidden md:flex">
                  7
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 border border-emerald-800">
                  <h3 className="text-xl font-bold text-white mb-2">30 Days Support</h3>
                  <p className="text-gray-300">
                    Post-launch support for bug fixes, questions, minor tweaks. You're fully supported.
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
              <h3 className="text-2xl font-bold text-white mb-4">Content Creator: $24K → $36K/month</h3>
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
                  <div className="text-emerald-400 font-bold text-xl">$36K/month</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Timeline</div>
                  <div className="text-white font-semibold">6 months</div>
                </div>
              </div>
              <p className="text-gray-300">
                Offered AI platform as upsell to existing OnlyFans subscribers. 40% took the upsell at $10/month.
                Used AI for chat and story generation, kept OnlyFans for explicit photo/video content.
                Revenue increased 50% without more manual work.
              </p>
            </div>

            {/* Case Study 2 */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-emerald-950/30 rounded-2xl p-8 border border-cyan-800/50">
              <h3 className="text-2xl font-bold text-white mb-4">Erotica Author: $4K → $8K/month</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Platform</div>
                  <div className="text-white font-semibold">Custom AI Platform</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Before</div>
                  <div className="text-white font-semibold">$4K/month</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">After</div>
                  <div className="text-cyan-400 font-bold text-xl">$8K/month</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Timeline</div>
                  <div className="text-white font-semibold">3 months</div>
                </div>
              </div>
              <p className="text-gray-300">
                AI generated 10x more content (first drafts). Author edited and published.
                Readers could request custom stories ($5 each). AI handled requests in minutes.
                Output increased from 2 stories/week to 10 stories/week. 2x revenue in 3 months.
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
            Book a 30-minute consultation to discuss your project, get a custom quote, and see if we're the right fit.
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
              📧 Prefer email? <a href="mailto:support@romancecanvas.com" className="text-emerald-400 hover:text-cyan-400 underline">support@romancecanvas.com</a>
            </p>
          </div>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      {/* <header className=" sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-black text-2xl">AI</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              RomanceCanvas
            </span>
          </div>
          <Link
            href="/demo/admin"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all"
          >
            Admin
          </Link>
        </div>
      </header> */}

      {/* Hero Section - Nightclub Theme */}
      {/* Height set to fill viewport for perfect fold fit */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/demo/hero-background.png"
            alt="Nightclub background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        {/* Mobile model overlay (keeps model visible on small screens) */}
        <div className="absolute inset-0 md:hidden z-[1]">
          <Image
            src="/demo/model.png"
            alt="Sophia - AI Companion"
            fill
            className="object-cover object-center scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Top-right mini header overlay */}
        <div className="absolute right-6 top-6 z-20 hidden md:flex items-center gap-4 text-white/90">
          <Link
            href="/demo/admin"
            className="text-sm font-semibold hover:text-white transition-colors"
          >
            Admin
          </Link>
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-sm">Sophia</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 font-semibold text-sm">
              Online Now
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
            {/* LEFT: Character Card + Info */}
            <div className="order-2 md:order-1 h-full flex items-center py-8 md:py-0">
              {/* Character Card */}
              <div className="relative max-w-[360px] w-full mx-auto md:mx-0 md:ml-4 lg:ml-12">
                {/* Glass card background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-black/40 to-pink-900/20 backdrop-blur-xl border border-pink-400/30 rounded-[32px] p-5 shadow-[0_0_60px_rgba(236,72,153,.25)]">
                  {/* Character Avatar */}
                  <div className="relative w-28 h-28 mx-auto mb-2">
                    {/* Glow ring */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>

                    {/* Avatar image */}
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-[3px] ring-cyan-400/60">
                      <Image
                        src="/demo/mode-face.png"
                        alt="Sophia"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-black text-white mb-1">
                      Sophia
                    </h2>
                    <p className="text-purple-300/80 font-medium text-xs mb-2.5">
                      Adventurous • Creative • Empathetic
                    </p>

                    {/* Carousel dots (decorative) */}
                    <div className="flex justify-center gap-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5 leading-tight">
                      Meet Sophia, Your AI Companion - Always Available
                    </h3>
                    <p className="text-gray-300/70 text-[11px] leading-relaxed">
                      Chat 24/7. Request custom stories. Build a real
                      connection. All in complete privacy.
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2 mb-4">
                    <Link
                      href="/demo/create-character"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white font-semibold text-center rounded-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all text-xs"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Customize Your Experience
                    </Link>
                    <Link
                      href="/demo/chat"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold text-center rounded-lg hover:shadow-xl hover:shadow-cyan-500/40 transition-all text-xs"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Start Chatting Now
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 text-gray-400 text-xs pt-3 border-t border-pink-500/20">
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-cyan-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-white/90 text-[10px] leading-tight">
                        24/7 Always
                        <br />
                        Online
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                      <span className="font-medium text-white/90 text-[10px] leading-tight">
                        Stories
                        <br />
                        Available
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-white/90 text-[10px] leading-tight">
                        100%
                        <br />
                        Private
                      </span>
                    </div>
                  </div>

                  {/* Pricing Anchor */}
                  <div className="text-center mt-3 pt-2.5 border-t border-gray-700/20">
                    <p className="text-gray-400/70 text-[10px]">
                      Starting at{" "}
                      <span className="text-white font-bold text-xs">
                        $10/month
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Full Model Image (desktop and up) */}
            <div className="order-1 md:order-2 h-full items-end hidden md:flex">
              <div className="relative w-full h-full">
                {/* Pink glow effect */}
                <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[100px]"></div>

                {/* Model image */}
                <div className="relative h-full w-full">
                  <Image
                    src="/demo/model.png"
                    alt="Sophia - AI Companion"
                    fill
                    className="object-contain object-bottom scale-125 md:scale-[1.35]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Everything You Need
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg">
          Your AI companion. Your stories. Your privacy.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-2xl p-8 hover:border-pink-500 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Real-Time Chat
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Instant responses. She remembers everything you tell her. Build
                a real connection that grows over time.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-pink-900/30 to-black border-2 border-pink-500/30 rounded-2xl p-8 hover:border-purple-500 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Custom Stories
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Request any scenario. Get illustrated stories created just for
                you. Unlimited content, always fresh.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-emerald-900/30 to-black border-2 border-emerald-500/30 rounded-2xl p-8 hover:border-green-500 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Complete Privacy
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your conversations stay private. No judgment, no limits.
                Everything is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Subscription Tiers */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Choose Your Experience
          </h2>
          <p className="text-xl text-gray-400">
            Start free, upgrade anytime for unlimited access
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-purple-500/30 rounded-3xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white mb-2">Free</h3>
              <div className="text-4xl font-black text-purple-400 mb-2">$0</div>
              <p className="text-gray-400 text-sm">Try it out</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-purple-400 text-xl">✓</span>
                <span>5 messages per day</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-purple-400 text-xl">✓</span>
                <span>1 story per week</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-purple-400 text-xl">✓</span>
                <span>Basic character creation</span>
              </li>
            </ul>
            <Link
              href="/demo/create-character"
              className="block w-full px-8 py-4 border-2 border-purple-500 text-purple-300 font-bold text-center rounded-xl hover:bg-purple-500/10 transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Premium Tier - HIGHLIGHTED */}
          <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-pink-500 rounded-3xl p-8 transform scale-105 shadow-2xl shadow-pink-500/50">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm">
              MOST POPULAR
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white mb-2">Premium</h3>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                $10
              </div>
              <p className="text-gray-300 text-sm">per month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white">
                <span className="text-pink-400 text-xl">✓</span>
                <span className="font-semibold">Unlimited messages</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <span className="text-pink-400 text-xl">✓</span>
                <span className="font-semibold">Unlimited stories</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <span className="text-pink-400 text-xl">✓</span>
                <span className="font-semibold">
                  Advanced character options
                </span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <span className="text-pink-400 text-xl">✓</span>
                <span className="font-semibold">Priority response times</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <span className="text-pink-400 text-xl">✓</span>
                <span className="font-semibold">Full image generation</span>
              </li>
            </ul>
            <Link
              href="/demo/create-character"
              className="block w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-center rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              Get Premium
            </Link>
          </div>

          {/* VIP Tier */}
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-yellow-500/50 rounded-3xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-white mb-2">VIP</h3>
              <div className="text-4xl font-black text-yellow-400 mb-2">
                $25
              </div>
              <p className="text-gray-400 text-sm">per month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Exclusive VIP characters</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Custom requests</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-yellow-400 text-xl">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Link
              href="/demo/create-character"
              className="block w-full px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-bold text-center rounded-xl hover:bg-yellow-500/10 transition-all"
            >
              Go VIP
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-12 text-sm">
          Cancel anytime. All plans include complete privacy and secure
          payments.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/90 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">
            Demo Platform • Built for Demonstration Purposes
          </p>
        </div>
      </footer>
    </div>
  );
}

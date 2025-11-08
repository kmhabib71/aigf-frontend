"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
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
      </header>

      {/* Hero Section - BIG Image Focus */}
      <section className="relative overflow-hidden">
        {/* Background gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-pink-600/5 to-black pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* LEFT: Big Character Image - PRIORITY */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>

                {/* Main image container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-purple-500/30 group-hover:border-pink-500 transition-all shadow-2xl shadow-purple-500/20">
                  {/* Demo image - replace with actual user image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-purple-900/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-64 h-64 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/50">
                        <span className="text-white text-9xl">👤</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-sm px-8 py-4 rounded-2xl border border-purple-500/30">
                        <h3 className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                          Sophia
                        </h3>
                        <p className="text-purple-300 font-semibold">
                          Adventurous • Creative • Empathetic
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spotlight effect */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Status badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-500/50">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Online Now
                </div>
              </div>
            </div>

            {/* RIGHT: Text & CTAs */}
            <div className="order-1 lg:order-2">
              <div className="mb-4">
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg shadow-green-500/50">
                  DEMO MODE - See What Your Fans Will Experience
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">
                Your Fans
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Chat 24/7
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-300 mb-6">
                You Make Money While You Sleep
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                This is what YOUR platform will look like. Your fans create characters, chat with AI, generate stories - all branded with YOUR name.
              </p>

              {/* CTA Buttons - Brazzers style */}
              <div className="flex flex-col gap-4 mb-8">
                <Link
                  href="/demo/create-character"
                  className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
                >
                  <span className="relative z-10">👤 Step 1: Character Creation (Fan View)</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/demo/chat"
                  className="px-10 py-5 border-2 border-purple-500 text-purple-300 font-black text-lg rounded-2xl hover:bg-purple-500/20 hover:border-pink-500 transition-all text-center"
                >
                  💬 Step 2: AI Chat with Memory
                </Link>

                <Link
                  href="/demo/stories"
                  className="px-10 py-5 border-2 border-pink-500 text-pink-300 font-black text-lg rounded-2xl hover:bg-pink-500/20 hover:border-purple-500 transition-all text-center"
                >
                  📖 Step 3: Story Generation + Images
                </Link>

                <Link
                  href="/demo/admin"
                  className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-green-500/50 transition-all text-center"
                >
                  👑 Step 4: YOUR Admin Dashboard
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-purple-400">$10-15</div>
                  <div className="text-xs text-gray-400 font-semibold">Per Subscriber/mo</div>
                </div>
                <div className="bg-pink-900/20 backdrop-blur-sm border border-pink-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-pink-400">100%</div>
                  <div className="text-xs text-gray-400 font-semibold">You Keep Revenue</div>
                </div>
                <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-400">30 Days</div>
                  <div className="text-xs text-gray-400 font-semibold">Build Timeline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-12">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-2xl p-8 hover:border-pink-500 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                AI Chat
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Real-time conversations with memory. Your AI companion remembers everything you share.
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
                Story Generation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create custom illustrated stories on demand. Text + AI-generated images.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-purple-900/30 to-black border-2 border-purple-500/30 rounded-2xl p-8 hover:border-pink-500 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Customization
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Design your perfect companion. Personality, appearance, interests - all customizable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium VIP Style */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="relative">
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20"></div>

          <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-purple-900/40 border-2 border-purple-500/50 rounded-3xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-5xl font-black text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-2xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-8 font-bold">
              Create Your Dream Companion in 2 Minutes
            </p>

            <Link
              href="/demo/create-character"
              className="group relative inline-block px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            <p className="text-gray-400 mt-6 text-sm">
              No credit card required • 100% Private • Available 24/7
            </p>
          </div>
        </div>
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

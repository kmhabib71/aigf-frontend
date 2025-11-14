"use client";

import Link from "next/link";
import Image from "next/image";

export default function DemoHero() {
  return (
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
          className="object-cover origin-bottom scale-[1.15]"
          style={{ objectPosition: "center 8%", top: 100 }}
          priority
        />
        {/* Stronger bottom-to-middle fade for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Top-right mini header overlay removed for home page */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
          {/* LEFT: Character Card + Info (hidden on mobile) */}
          <div className="order-3 md:order-1 h-full items-center py-8 md:py-0 hidden md:flex">
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
                  <h2 className="text-2xl font-black text-white mb-1">Sophia</h2>
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
                    Chat 24/7. Request custom stories. Build a real connection. All in
                    complete privacy.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 mb-4">
                  <Link
                    href="/demo/create-character"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white font-semibold text-center rounded-lg hover:shadow-xl hover:shadow-purple-500/40 transition-all text-xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Customize Your Experience
                  </Link>
                  <Link
                    href="/chat?personaPreset=sophia"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold text-center rounded-lg hover:shadow-xl hover:shadow-cyan-500/40 transition-all text-xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
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
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
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
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
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
                    Starting at <span className="text-white font-bold text-xs">$10/month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Headline + CTAs (absolute at bottom on mobile) */}
          <div className="order-1 md:order-2 text-white text-center md:text-left px-4 md:px-6 absolute inset-x-0 bottom-20 sm:bottom-24 z-10 md:static md:inset-auto md:bottom-auto">
            <div className="max-w-xl mx-auto md:mx-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Unlock Limitless Conversations
              </h1>
              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold text-white/90">
                Connect with Your AI Companion
              </h2>
              <p className="mt-4 text-white/80 text-sm sm:text-base md:text-lg">
                Experience personalized chats, custom stories, and unparalleled privacy.
                Sophia is here 24/7.
              </p>

              {/* Feature Buttons */}
              <div className="mt-6 flex flex-wrap md:flex-nowrap gap-4 justify-center md:justify-start">
                {/* Chat */}
                <Link href="/chat" className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-300/80 bg-black/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-white/90">Chat</span>
                </Link>

                {/* Stories */}
                <Link href="/romance/create" className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-300/80 bg-black/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h7a2 2 0 012 2v12a1 1 0 01-1.447.894L12 15.618l-4.553 1.276A1 1 0 016 16V4z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-white/90">Stories</span>
                </Link>

                {/* Secure */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-300/80 bg-black/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-white/90">Secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Full Model Image (desktop and up) */}
          <div className="order-3 md:order-3 h-full items-end hidden md:flex translate-x-6 md:translate-x-10 lg:translate-x-12">
            <div className="relative w-full h-full">
              {/* Pink glow effect */}
              <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[100px]"></div>

              {/* Model image */}
              <div className="relative h-full w-full">
                <Image
                  src="/demo/model.png"
                  alt="Sophia - AI Companion"
                  fill
                  className="object-contain object-bottom scale-150 md:scale-[1.5]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

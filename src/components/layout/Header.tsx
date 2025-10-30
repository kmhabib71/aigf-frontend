"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import CreditBalance from "../CreditBalance";
import UserAvatar from "../UserAvatar";

export default function Header() {
  const router = useRouter();
  const { user, userProfile, isAuthenticated, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
          scrolled
            ? "bg-black/40 backdrop-blur-2xl shadow-lg shadow-purple-500/20 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-400 to-pink-400 p-2.5 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">💕</span>
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                RomanceCanvas
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {!isAuthenticated && (
                <>
                  <Link
                    href="/features"
                    className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    How It Works
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </>
              )}
              <Link
                href="/pricing"
                className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {/* Legal links moved to Footer */}
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/chat"
                    className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Chat
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/romance/create"
                    className="text-white hover:text-purple-300 transition-colors font-semibold relative group drop-shadow-lg cursor-pointer"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Story
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </>
              )}
            </div>

            {/* Right Side - Credit Balance & Auth */}
            <div className="hidden md:flex items-center gap-4">
              {/* Credit Balance for Plus/Pro users */}
              {isAuthenticated &&
                userProfile?.useCreditSystem &&
                userProfile?.creditBalance !== undefined && (
                  <CreditBalance
                    credits={userProfile.creditBalance}
                    plan={userProfile.plan}
                    variant="compact"
                    showWarning={true}
                  />
                )}

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-6 py-2.5 text-white hover:text-purple-300 font-semibold transition-colors rounded-xl hover:bg-purple-50 drop-shadow-lg"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="group relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold transform hover:scale-105 transition-transform shadow-lg shadow-purple-200/50 hover:shadow-purple-300/60"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative text-white">Get Started</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-xl">
                    <UserAvatar
                      photoURL={userProfile?.photoURL}
                      displayName={userProfile?.displayName}
                      size="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900">
                        {userProfile?.displayName || user?.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {userProfile?.plan || "free"} Plan
                      </span>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-white hover:text-red-300 font-semibold transition-colors rounded-xl hover:bg-red-50 drop-shadow-lg"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-white drop-shadow-lg"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div
          className={`absolute top-20 right-4 left-4 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="p-1">
            <div className="flex flex-col gap-1">
              {/* Credit Balance in Mobile Menu */}
              {isAuthenticated &&
                userProfile?.useCreditSystem &&
                userProfile?.creditBalance !== undefined && (
                  <div className="px-3 py-3 mb-1">
                    <CreditBalance
                      credits={userProfile.creditBalance}
                      plan={userProfile.plan}
                      variant="compact"
                      showWarning={true}
                    />
                  </div>
                )}

              {/* Navigation Links */}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      router.push("/features");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      router.push("/how-it-works");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
                  >
                    How It Works
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  router.push("/pricing");
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
              >
                Pricing
              </button>

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      router.push("/chat");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => {
                      router.push("/romance/create");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 transition-colors font-semibold py-3 px-4 rounded-xl text-left"
                  >
                    Story
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-1"></div>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-purple-600/20 font-semibold py-3 px-4 rounded-xl text-left transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      router.push("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/30 mx-2 my-1"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  {/* User Info in Mobile */}
                  <div className="flex items-center gap-3 py-3 px-4 bg-slate-800/50 rounded-xl mx-2 my-1 border border-purple-500/20">
                    <UserAvatar
                      photoURL={userProfile?.photoURL}
                      displayName={userProfile?.displayName}
                      size="md"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {userProfile?.displayName || user?.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-purple-300 capitalize">
                        {userProfile?.plan || "free"} Plan
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="text-red-400 hover:bg-red-500/20 font-semibold py-3 px-4 rounded-xl text-left transition-colors mx-2 my-1"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

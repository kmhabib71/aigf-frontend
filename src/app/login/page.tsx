"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Header from "@/components/layout/Header";

const backgroundStyle: React.CSSProperties = {
  backgroundImage: 'url("/image.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
};

const LoadingBackdrop = () => (
  <div
    className="min-h-screen flex items-center justify-center relative overflow-hidden"
    style={backgroundStyle}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/60 to-black/70" />
    <div className="relative text-white text-xl">Loading...</div>
  </div>
);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, signInWithEmail, isAuthenticated, loading } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";
  const planParam = searchParams.get("plan");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();

      if (planParam && planParam !== "free") {
        router.push(`/pricing?plan=${planParam}`);
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await signInWithEmail(email, password);

      if (planParam && planParam !== "free") {
        router.push(`/pricing?plan=${planParam}`);
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingBackdrop />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-purple-950/65 to-black/75" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-purple-400/20 blur-3xl top-[-8%] right-[-6%]" />
        <div className="absolute w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-pink-500/15 blur-3xl bottom-[-10%] left-[-5%]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="px-4 pt-6">
          <Header />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-12 mt-24">
          <div className="w-full max-w-md rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/20 shadow-[0_30px_70px_-20px_rgba(124,58,237,0.55)] overflow-hidden">
            <header className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-purple-50/90 text-sm">
                Sign in to continue your romantic adventures
              </p>
            </header>

            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {planParam && (
                <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  Sign in to upgrade to{" "}
                  <span className="font-semibold capitalize">{planParam}</span>{" "}
                  plan
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white/95 border border-purple-100 text-purple-700 py-3 rounded-full font-semibold hover:bg-white transition-all flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>

              <div className="flex items-center gap-4 mb-6 text-gray-500 text-sm">
                <div className="flex-1 h-px bg-gray-300" />
                <span>or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-purple-100/70 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-purple-100/70 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-400/40"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-700">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (planParam) params.set("plan", planParam);
                      if (redirectTo && redirectTo !== "/") {
                        params.set("redirect", redirectTo);
                      }
                      const query = params.toString();
                      router.push(`/signup${query ? `?${query}` : ""}`);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingBackdrop />}>
      <LoginContent />
    </Suspense>
  );
}

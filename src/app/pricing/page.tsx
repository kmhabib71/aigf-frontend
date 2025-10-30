"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { backendUrl } from "@/lib/config";
interface PlanFeature {
  name: string;
  included: boolean;
  value?: string;
}

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  highlighted: boolean;
  cta: string;
  planId: "free" | "plus" | "pro";
}

export default function PricingPage() {
  const router = useRouter();
  const { user, userProfile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: 0,
      period: "forever",
      description: "Start your journey with AI companionship",
      planId: "free",
      highlighted: false,
      cta: "Get Started",
      features: [
        { name: "Messages", included: true, value: "100 free messages" },
        { name: "Story Creation", included: true, value: "5 story creation" },
        { name: "Basic Chat", included: true },
        { name: "Image Generation", included: false },
        { name: "NSFW Mode", included: true, value: "Limited" },
        { name: "Credit Rollover", included: false },
        { name: "Priority Support", included: false },
        { name: "Advanced Features", included: false },
      ],
    },
    {
      name: "Plus",
      price: 9.99,
      period: "month",
      description: "Credit-based usage for flexibility",
      planId: "plus",
      highlighted: true,
      cta: "Upgrade to Plus",
      features: [
        {
          name: "Monthly Credits",
          included: true,
          value: "999 Credits ($9.99 value)",
        },
        { name: "Unlimited Chat", included: true },
        { name: "Unlimited Stories", included: true },
        { name: "Image Generation", included: true, value: "~3 credits/image" },
        { name: "NSFW Mode", included: true },
        {
          name: "Credit Rollover",
          included: true,
          value: "50% unused credits",
        },
        { name: "Pay as You Go", included: true, value: "Usage-based billing" },
        { name: "Priority Support", included: false },
      ],
    },
    {
      name: "Pro",
      price: 19.99,
      period: "month",
      description: "Maximum credits for power users",
      planId: "pro",
      highlighted: false,
      cta: "Upgrade to Pro",
      features: [
        {
          name: "Monthly Credits",
          included: true,
          value: "1999 Credits ($19.99 value)",
        },
        { name: "Unlimited Chat", included: true },
        { name: "Unlimited Stories", included: true },
        { name: "Image Generation", included: true, value: "~3 credits/image" },
        { name: "NSFW Mode", included: true },
        {
          name: "Credit Rollover",
          included: true,
          value: "50% unused credits",
        },
        { name: "Pay as You Go", included: true, value: "Usage-based billing" },
        { name: "Priority Support", included: true },
        { name: "Advanced Features", included: true },
      ],
    },
  ];

  const handleSelectPlan = async (planId: "free" | "plus" | "pro") => {
    try {
      // Free plan - redirect to signup or chat
      if (planId === "free") {
        if (isAuthenticated) {
          router.push("/");
        } else {
          router.push("/login?plan=free");
        }
        return;
      }

      // Paid plans - require authentication
      if (!isAuthenticated) {
        router.push(`/login?plan=${planId}`);
        return;
      }

      // Already on this plan
      if (userProfile?.plan === planId) {
        router.push("/dashboard");
        return;
      }

      setLoading(planId);
      setError(null);

      // Determine provider (use LemonSqueezy as default, can be made dynamic)
      const provider = "lemonsqueezy";

      // Create checkout session
      const response = await fetch(
        `${backendUrl}/api/subscription/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user?.uid,
            email: user?.email,
            plan: planId,
            provider: provider,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to checkout
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to start checkout");
      setLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50"
      style={{
        backgroundImage: 'url("/image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(216, 180, 254, 0.4) 0%, rgba(233, 213, 255, 0.2) 50%, transparent 100%)",
            top: "-20%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-20 animate-float-slow animation-delay-2000"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.2) 50%, transparent 100%)",
            bottom: "-15%",
            left: "-10%",
          }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-4">
            Choose Your Plan 💕
          </h1>
          <p className="text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
            Find the perfect plan for your AI companionship journey
          </p>
          {userProfile && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full text-white drop-shadow-lg border border-white/20">
              <span>Current Plan:</span>
              <span className="font-semibold capitalize">
                {userProfile.plan}
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.planId}
              className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 ${
                tier.highlighted ? "ring-4 ring-yellow-400 md:scale-110" : ""
              }`}
            >
              {/* Highlighted Badge */}
              {tier.highlighted && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-2xl font-semibold text-sm">
                  Most Popular
                </div>
              )}

              {/* Current Plan Badge */}
              {userProfile?.plan === tier.planId && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-br-2xl font-semibold text-sm">
                  Current Plan
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {tier.period}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{tier.description}</p>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(tier.planId)}
                  disabled={
                    loading === tier.planId || userProfile?.plan === tier.planId
                  }
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  } ${
                    loading === tier.planId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } ${
                    userProfile?.plan === tier.planId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading === tier.planId ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : userProfile?.plan === tier.planId ? (
                    "Current Plan"
                  ) : (
                    tier.cta
                  )}
                </button>

                {/* Features List */}
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {feature.included ? (
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {feature.name}
                        {feature.value && (
                          <span className="font-semibold ml-1">
                            ({feature.value})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Credit System Explanation */}
        <div className="mt-20 max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-3">
              How Credits Work
            </h2>
            <p className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] text-lg">
              Transparent, usage-based pricing that gives you control
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-bold text-xl mb-2">Simple Pricing</h3>
              <p className="text-white/80 text-sm">
                1 Credit = $0.01 USD. Credits are deducted based on AI model
                usage. You only pay for what you use, no hidden fees.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-bold text-xl mb-2">50% Rollover</h3>
              <p className="text-white/80 text-sm">
                Unused credits don't go to waste. 50% of your unused credits
                roll over to the next month, so you're always building value.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-xl mb-2">Usage-Based</h3>
              <p className="text-white/80 text-sm">
                Different AI models cost different amounts. Text conversations
                use fewer credits, images cost ~3 credits each. You control your
                spending.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-xl mb-2">Fair Markup</h3>
              <p className="text-white/80 text-sm">
                We charge 3x the API cost (1x for cost, 2x for platform
                maintenance). This keeps pricing fair while ensuring quality
                service.
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-4">Example Usage Costs:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/80">
                  💬 GPT-4o-mini conversation (100K tokens)
                </span>
                <span className="font-semibold">~45 credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">
                  🔥 Venice-uncensored conversation (100K tokens)
                </span>
                <span className="font-semibold">~60 credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">🖼️ Image generation</span>
                <span className="font-semibold">3 credits</span>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-4">
              * Actual costs vary based on conversation length and complexity.
              Most conversations use significantly fewer tokens than shown
              above.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 text-white border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-white/80">
                Yes! You can upgrade or downgrade your plan at any time from
                your dashboard. Unused credits will roll over according to your
                plan's rollover policy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What happens if I run out of credits?
              </h3>
              <p className="text-white/80">
                When your credits are depleted, you'll be limited to free tier
                features (3 messages + 1 scene). You can add more credits or
                upgrade your plan to continue using advanced features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How do credit rollovers work?
              </h3>
              <p className="text-white/80">
                At the end of each billing cycle, 50% of your unused credits
                automatically roll over to next month. This ensures you always
                get value from your subscription, even if you don't use all your
                credits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-white/80">
                Absolutely. We use industry-standard encryption and never share
                your personal conversations. All data is stored securely and you
                maintain full control over your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
      `}</style>
    </div>
  );
}

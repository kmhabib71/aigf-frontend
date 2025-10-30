"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
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

      <Header />

      <main className="relative z-20 max-w-4xl mx-auto px-6 py-16 pt-24">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-purple-600 hover:text-pink-600 mb-8"
        >
          ← Back to RomanceCanvas
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            We're here to help! Reach out to us with any questions or concerns.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl mb-4">
                📧
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Email Support
              </h2>
              <p className="text-gray-600 mb-3">
                Get in touch via email for general inquiries and support
              </p>
              <a
                href="mailto:support@romancecanvas.com"
                className="text-purple-600 hover:text-pink-600 font-semibold underline"
              >
                support@romancecanvas.com
              </a>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl p-6 border border-cyan-100">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center text-2xl mb-4">
                🕒
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Response Time
              </h2>
              <p className="text-gray-600 mb-3">
                We typically respond within 24-48 hours
              </p>
              <p className="text-gray-500 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM UTC
              </p>
            </div>
          </div>

          {/* Support Topics */}
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl p-8 border border-purple-100/50 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How We Can Help
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Technical Support
                  </h3>
                  <p className="text-sm text-gray-600">
                    Issues with stories, chat, or features
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Billing Questions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Subscriptions, payments, and refunds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Account Help</h3>
                  <p className="text-sm text-gray-600">
                    Login issues, account deletion
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    General Inquiries
                  </h3>
                  <p className="text-sm text-gray-600">
                    Questions about our service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Business Information
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-semibold text-gray-800">
                  Business Name:
                </span>{" "}
                AIRomanceBuilder Labs
              </p>
              <p>
                <span className="font-semibold text-gray-800">Service:</span>{" "}
                RomanceCanvas - AI Interactive Fiction Platform
              </p>
              <p>
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                <a
                  href="mailto:admin@romancecanvas.com"
                  className="text-purple-600 hover:underline"
                >
                  admin@romancecanvas.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-800">
                  Support Email:
                </span>{" "}
                <a
                  href="mailto:support@romancecanvas.com"
                  className="text-purple-600 hover:underline"
                >
                  support@romancecanvas.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something else?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/legal/terms"
                className="text-purple-600 hover:text-pink-600 text-sm font-semibold underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/privacy"
                className="text-purple-600 hover:text-pink-600 text-sm font-semibold underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/refund"
                className="text-purple-600 hover:text-pink-600 text-sm font-semibold underline"
              >
                Refund Policy
              </Link>
              <Link
                href="/pricing"
                className="text-purple-600 hover:text-pink-600 text-sm font-semibold underline"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
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
    </div>
  );
}

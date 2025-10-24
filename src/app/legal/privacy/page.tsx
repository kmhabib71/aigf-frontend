"use client";

import Link from "next/link";

const policies = [
  {
    title: "1. Information We Collect",
    points: [
      "Account details you provide (name, email, subscription plan).",
      "Billing information is processed by Paddle—we never store full card numbers.",
      "Usage data such as prompts, generated stories, and feature activity, used to improve your experience.",
    ],
  },
  {
    title: "2. How We Use Data",
    points: [
      "Deliver core features like story generation, companion chat, and saved libraries.",
      "Offer customer support and product announcements.",
      "Monitor abuse and maintain platform safety.",
    ],
  },
  {
    title: "3. Your Controls",
    points: [
      "Download or delete saved stories from your dashboard.",
      "Request full account deletion by emailing hello@romancecanvas.com.",
      "Adjust email preferences inside account settings.",
    ],
  },
  {
    title: "4. Data Sharing",
    points: [
      "We work with trusted infrastructure partners (OpenAI/Vercel/Paddle) under strict agreements.",
      "We never sell personal information or share prompts with advertisers.",
      "If legally required, we may share limited data with authorities after due process.",
    ],
  },
  {
    title: "5. Security",
    points: [
      "All requests are encrypted via HTTPS.",
      "Access to production systems is restricted to trained personnel.",
      "We review security practices regularly and respond quickly to vulnerabilities.",
    ],
  },
  {
    title: "6. Children",
    points: [
      "RomanceCanvas is intended for adults 18+.",
      "We do not knowingly collect data from children.",
    ],
  },
  {
    title: "7. Updates",
    points: [
      "We may revise this Privacy Policy to reflect new features.",
      "Any major change will be announced via email or in-app banner.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-purple-200 hover:text-pink-200"
        >
          ← Back to RomanceCanvas
        </Link>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base text-purple-100">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-8 text-sm leading-relaxed text-purple-50">
          SnapPair Labs (“we”, “us”) respects your privacy. This policy explains
          what information we collect when you use RomanceCanvas and how we
          protect it.
        </p>

        <div className="mt-12 space-y-8">
          {policies.map(({ title, points }) => (
            <article
              key={title}
              className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-lg shadow-purple-500/10"
            >
              <h2 className="text-2xl font-semibold text-pink-200">{title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-purple-50 list-disc list-inside">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <footer className="mt-12 text-sm text-purple-200">
          Questions or requests? Email us at{" "}
          <a
            href="mailto:hello@romancecanvas.com"
            className="underline hover:text-pink-200"
          >
            hello@romancecanvas.com
          </a>
          .
        </footer>
      </section>
    </main>
  );
}

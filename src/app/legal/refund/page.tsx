"use client";

import Link from "next/link";
import Footer from "../../../components/layout/Footer";

const sections = [
  {
    title: "No Returns or Refunds",
    details: [
      "All purchases are final. We do not accept returns or provide refunds for purchases, including digital goods, subscriptions, and credits.",
    ],
  },
  {
    title: "Billing Errors",
    details: [
      "If you believe you were charged in error (for example, a duplicate charge), contact us within 7 days and we will review and correct any confirmed mistakes.",
    ],
  },
  {
    title: "Subscription Cancellation",
    details: [
      "You can cancel anytime. Cancellation stops future billing but does not refund prior charges or partially used subscription periods.",
    ],
  },
  {
    title: "Legal Requirements",
    details: [
      "Where consumer law requires a refund or remedy, we will comply with applicable regulations.",
    ],
  },
  {
    title: "Support",
    details: [
      "For billing questions, contact hello@romancecanvas.com and include your order ID so we can assist you quickly.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 text-white">
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-purple-100 hover:text-pink-200"
        >
          Back to RomanceCanvas
        </Link>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Refund Policy
        </h1>
        <p className="mt-4 text-base text-purple-100">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-8 text-sm leading-relaxed text-purple-50">
          Please note that RomanceCanvas has a no returns and no refunds policy.
          We strive to provide a great experience and helpful support. If you
          have a billing concern, contact us and we will review it promptly.
        </p>

        <div className="mt-12 space-y-8">
          {sections.map(({ title, details }) => (
            <article
              key={title}
              className="bg-white/5 rounded-3xl border border-white/10 p-5 shadow-lg shadow-purple-500/10"
            >
              <h2 className="text-2xl font-semibold text-pink-200">{title}</h2>
              <ul className="mt-3 list-disc list-inside text-sm text-purple-50 space-y-2">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 text-sm text-purple-200">
          Need help right now? Email{" "}
          <a
            href="mailto:hello@romancecanvas.com"
            className="underline hover:text-pink-200"
          >
            hello@romancecanvas.com
          </a>
          .
        </div>
      </section>

      <Footer />
    </main>
  );
}

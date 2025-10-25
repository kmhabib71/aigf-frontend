"use client";

import Link from "next/link";
import Footer from "../../../components/layout/Footer";

const steps = [
  {
    title: "Eligibility",
    details: [
      "Refund requests must be submitted within 7 days of the original purchase.",
      "Requests should include the email tied to your RomanceCanvas account and a brief description of the issue.",
    ],
  },
  {
    title: "How to Request",
    details: [
      "Email hello@romancecanvas.com with subject line “Refund Request”.",
      "Include your Paddle receipt or order ID so we can locate the transaction quickly.",
    ],
  },
  {
    title: "Evaluation",
    details: [
      "We review refunds case-by-case. If a feature failed or you experienced a technical issue we could not resolve, we will approve a refund.",
      "Please note that refunds are not guaranteed for simple change-of-mind cancellations once stories or images have been generated.",
    ],
  },
  {
    title: "Processing",
    details: [
      "Approved refunds are issued through Paddle back to the original payment method.",
      "Processing time depends on your bank, typically 5–10 business days.",
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
          ← Back to RomanceCanvas
        </Link>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Refund Policy
        </h1>
        <p className="mt-4 text-base text-purple-100">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-8 text-sm leading-relaxed text-purple-50">
          We want every subscriber to love their RomanceCanvas experience. If
          something isn’t working, reach out and we’ll do our best to fix it or
          refund you when appropriate.
        </p>

        <div className="mt-12 space-y-8">
          {steps.map(({ title, details }) => (
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

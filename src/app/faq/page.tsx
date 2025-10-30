"use client";

import Link from "next/link";
import Footer from "../../components/layout/Footer";

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "What is RomanceCanvas?",
    a: "RomanceCanvas is an AI‑powered experience for both interactive storytelling and romantic chat. You can read and continue stories, role‑play with AI characters in real‑time chat, and optionally generate scene images to enhance the vibe.",
  },
  {
    q: "Do you offer refunds?",
    a: "All purchases are final and non‑refundable. We do not accept returns or provide refunds for subscriptions, credits, or digital goods, except where required by law. If you believe you were charged in error (e.g., a duplicate charge), contact hello@romancecanvas.com within 7 days and we will review and correct any confirmed mistakes. See Refund Policy for details.",
  },
  {
    q: "How do subscriptions and billing work?",
    a: "Plans renew automatically until cancelled from your account. Cancellation stops future billing but does not refund prior charges or partially used periods. Pricing and plan information are listed on the Pricing page.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from your account dashboard. Access continues until the end of your current billing cycle. After cancellation you will not be charged again unless you resubscribe.",
  },
  {
    q: "Is my data private?",
    a: "We respect your privacy. We collect only what’s needed to provide and improve the service, and we never sell your personal data. Review what we collect, how we use it, and your rights in our Privacy Policy.",
  },
  {
    q: "Who processes my payments?",
    a: "Payments are handled by secure third‑party processors. We do not store full credit card numbers or sensitive payment details. See the Privacy Policy for more information.",
  },
  {
    q: "How is AI used?",
    a: "Your prompts and story context may be sent to AI providers (e.g., OpenAI or Venice AI) to generate text or images. Providers have their own policies. We moderate usage to enforce our Terms of Service.",
  },
  {
    q: "Who can use RomanceCanvas?",
    a: "You must be 18+ to use RomanceCanvas. Accounts found to be under the age requirement will be terminated and data deleted as described in the Privacy Policy.",
  },
  {
    q: "How do I delete my account or data?",
    a: "You can delete stories at any time, and you can request full account deletion by contacting hello@romancecanvas.com. We process deletion requests within 30 days, subject to legal retention requirements.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-purple-200 hover:text-pink-200"
        >
          Back to RomanceCanvas
        </Link>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-base text-purple-100">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-12 space-y-6">
          {faqs.map(({ q, a }) => (
            <article
              key={q}
              className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-lg shadow-purple-500/10"
            >
              <h2 className="text-xl font-semibold text-pink-200">{q}</h2>
              <p className="mt-3 text-sm leading-relaxed text-purple-50">{a}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-sm text-purple-200 space-y-2">
          <p>
            See also:{" "}
            <Link href="/pricing" className="underline hover:text-pink-200">
              Pricing
            </Link>
            ,{" "}
            <Link href="/legal/terms" className="underline hover:text-pink-200">
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/legal/privacy"
              className="underline hover:text-pink-200"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/legal/refund"
              className="underline hover:text-pink-200"
            >
              Refund Policy
            </Link>
            .
          </p>
          <p>
            Still have questions? Email{" "}
            <a
              href="mailto:hello@romancecanvas.com"
              className="underline hover:text-pink-200"
            >
              hello@romancecanvas.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

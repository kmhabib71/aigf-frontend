"use client";

import Link from "next/link";

const sections = [
  {
    title: "1. Overview",
    body: `RomanceCanvas is a digital storytelling and AI companion platform operated by SnapPair Labs. By creating an account or purchasing a subscription you agree to these Terms of Service.`,
  },
  {
    title: "2. Eligibility & Accounts",
    body: `You must be 18 years of age or older to use RomanceCanvas. Keep your login credentials private and let us know immediately if you suspect unauthorized access.`,
  },
  {
    title: "3. Subscriptions & Billing",
    body: `All plans are subscription based. Billing is handled securely through Paddle. Your plan will renew automatically until cancelled. You can cancel at any time from your dashboard; access continues until the end of the current billing period.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You agree not to generate or request unlawful, abusive, or non-consensual content. We reserve the right to suspend accounts that violate these rules.`,
  },
  {
    title: "5. Intellectual Property",
    body: `All software, branding, and platform assets remain the property of SnapPair Labs. You retain rights to the original prompts you provide and may download the stories generated for personal use.`,
  },
  {
    title: "6. Refunds",
    body: `We want you to love the experience. If the service is not working as described, contact support within 7 days of purchase and we will review refund requests case-by-case (see our detailed Refund Policy).`,
  },
  {
    title: "7. Privacy",
    body: `We only collect data needed to provide the service. Full details are available in our Privacy Policy.`,
  },
  {
    title: "8. Changes",
    body: `We may update these Terms to reflect new features or legal requirements. Material changes will be emailed or displayed in-app.`,
  },
  {
    title: "9. Contact",
    body: `Questions? Email hello@romancecanvas.com and we’ll be happy to help.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-purple-200 hover:text-pink-200"
        >
          ← Back to RomanceCanvas
        </Link>

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          RomanceCanvas Terms of Service
        </h1>
        <p className="mt-4 text-base text-purple-100">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map(({ title, body }) => (
            <article key={title} className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-lg shadow-purple-500/10">
              <h2 className="text-2xl font-semibold text-pink-200">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-purple-50">
                {body}
              </p>
            </article>
          ))}
        </div>

        <footer className="mt-12 text-sm text-purple-200">
          These Terms apply together with our{" "}
          <Link href="/legal/privacy" className="underline hover:text-pink-200">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/refund" className="underline hover:text-pink-200">
            Refund Policy
          </Link>
          .
        </footer>
      </section>
    </main>
  );
}

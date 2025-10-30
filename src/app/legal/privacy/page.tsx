"use client";

import Link from "next/link";
import Footer from "../../../components/layout/Footer";

const policies = [
  {
    title: "1. Information We Collect",
    points: [
      "Account Information: Email address, username, password (encrypted), and date of birth for age verification.",
      "Payment Information: Processed securely by our third-party payment processors. We never store full credit card numbers or sensitive payment details.",
      "Usage Data: Stories you create, chat conversations, prompts, feature usage, device information, IP address, and browser type.",
      "Technical Data: Cookies, session data, error logs, and performance metrics to improve service quality.",
      "Communications: Support requests, feedback, and correspondence with our team.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    points: [
      "Service Delivery: Process your requests, generate AI content, store your stories, and manage your account.",
      "Payment Processing: Process subscription payments, manage billing, and handle refunds through secure third-party processors.",
      "Improvement: Analyze usage patterns to enhance features, fix bugs, and develop new functionality.",
      "Communication: Send service updates, billing notifications, security alerts, and respond to support requests.",
      "Safety & Compliance: Monitor for abuse, enforce our Terms of Service, prevent fraud, and comply with legal obligations.",
      "Analytics: Understand user behavior, measure feature performance, and optimize the platform (using aggregated, non-personal data).",
    ],
  },
  {
    title: "3. Legal Basis for Processing (GDPR)",
    points: [
      "Contractual Necessity: Processing necessary to provide services you've requested.",
      "Legitimate Interest: Improving our service, preventing fraud, and maintaining security.",
      "Legal Compliance: Meeting regulatory requirements and responding to legal requests.",
      "Consent: Where you've provided explicit consent for specific processing activities.",
    ],
  },
  {
    title: "4. Data Sharing and Third Parties",
    points: [
      "Payment Processors: We use third-party payment services to process subscriptions securely. They receive only necessary billing information.",
      "AI Service Providers: Your prompts are processed by AI providers (OpenAI, Venice AI) to generate content. These providers have their own privacy policies.",
      "Hosting & Infrastructure: We use secure cloud hosting providers to store data and deliver services.",
      "Analytics Services: Anonymous usage data may be shared with analytics tools to understand platform performance.",
      "Legal Requirements: We may disclose data if required by law, court order, or to protect our rights and user safety.",
      "Business Transfers: In the event of a merger, acquisition, or sale, user data may be transferred to the new entity.",
      "We NEVER sell your personal data to advertisers or third parties for marketing purposes.",
    ],
  },
  {
    title: "5. Data Retention",
    points: [
      "Account Data: Retained while your account is active and for 30 days after deletion (for recovery purposes).",
      "Stories & Conversations: Stored until you delete them or close your account.",
      "Billing Records: Kept for 7 years to comply with tax and accounting regulations.",
      "Usage Logs: Retained for 90 days for security and debugging purposes.",
      "You can delete individual stories at any time. Account deletion requests are processed within 30 days.",
    ],
  },
  {
    title: "6. Your Privacy Rights",
    points: [
      "Access: Request a copy of all personal data we hold about you.",
      "Correction: Update or correct inaccurate account information.",
      "Deletion: Request permanent deletion of your account and associated data.",
      "Export: Download your stories and data in a portable format.",
      "Objection: Object to certain processing activities where applicable.",
      "Withdraw Consent: Revoke consent for optional data processing.",
      "To exercise these rights, email hello@romancecanvas.com with your request.",
    ],
  },
  {
    title: "7. International Data Transfers",
    points: [
      "RomanceCanvas operates internationally. Your data may be transferred to and processed in countries outside your residence.",
      "We use standard contractual clauses and ensure third-party providers meet adequate data protection standards.",
      "By using our service, you consent to international data transfers necessary for service provision.",
    ],
  },
  {
    title: "8. Security Measures",
    points: [
      "Encryption: All data transmission uses HTTPS/TLS encryption.",
      "Access Control: Strict access controls limit who can view production systems and user data.",
      "Authentication: Passwords are encrypted using industry-standard hashing algorithms.",
      "Monitoring: Automated systems detect and prevent unauthorized access attempts.",
      "Regular Audits: We review security practices and update measures to address new threats.",
      "While we implement robust security, no system is 100% secure. Use strong passwords and enable available security features.",
    ],
  },
  {
    title: "9. Cookies and Tracking",
    points: [
      "Essential Cookies: Required for authentication, session management, and core functionality.",
      "Analytics Cookies: Help us understand how users interact with our platform (can be disabled).",
      "Preference Cookies: Remember your settings and preferences.",
      "You can control cookie preferences through your browser settings, though disabling essential cookies may limit functionality.",
    ],
  },
  {
    title: "10. Age Verification and Minors",
    points: [
      "RomanceCanvas is intended exclusively for users 18 years of age and older.",
      "We do not knowingly collect data from individuals under 18.",
      "If we discover a user is under 18, we will immediately terminate their account and delete their data.",
      "Parents who believe their child has created an account should contact us immediately at hello@romancecanvas.com.",
    ],
  },
  {
    title: "11. AI-Generated Content Privacy",
    points: [
      "Your prompts and stories are processed by AI models to generate content.",
      "AI providers may use data to improve their models, subject to their privacy policies.",
      "We do not share your personal stories publicly unless you explicitly choose to do so.",
      "Private conversations and stories remain private and are not used for marketing.",
    ],
  },
  {
    title: "12. California Privacy Rights (CCPA)",
    points: [
      "California residents have additional rights including: knowing what personal data is collected, requesting deletion, opting out of data sales (we don't sell data), and non-discrimination for exercising privacy rights.",
      "Contact hello@romancecanvas.com to exercise CCPA rights.",
    ],
  },
  {
    title: "13. European Privacy Rights (GDPR)",
    points: [
      "EU/EEA residents have rights including: access, rectification, erasure, data portability, restriction of processing, and objection.",
      "You may lodge complaints with your local data protection authority.",
      "Our Data Protection Officer can be reached at hello@romancecanvas.com.",
    ],
  },
  {
    title: "14. Changes to This Policy",
    points: [
      "We may update this Privacy Policy to reflect service changes, legal requirements, or operational updates.",
      "Material changes will be communicated via email or in-app notification at least 30 days before taking effect.",
      "Continued use after changes constitutes acceptance of the updated policy.",
      "Last updated date is displayed at the top of this policy.",
    ],
  },
  {
    title: "15. Contact Us",
    points: [
      "For privacy questions or to exercise your rights, contact: hello@romancecanvas.com",
      "For technical support: support@romancecanvas.com",
      "We aim to respond to all privacy requests within 30 days.",
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
          AIRomanceBuilder Labs (“we”, “us”) respects your privacy. This policy
          explains what information we collect when you use RomanceCanvas and
          how we protect it.
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

        <div className="mt-12 text-sm text-purple-200">
          Questions or requests? Email us at{" "}
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

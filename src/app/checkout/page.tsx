"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { backendUrl } from "@/lib/config";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { nowpaymentsPlusUrl, nowpaymentsProUrl } from "@/lib/config";

function CheckoutPageInner() {
  return <CheckoutContent />;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getIdToken } = useAuth();
  const [creating, setCreating] = useState(false);
  const plan = searchParams?.get("plan") as "plus" | "pro" | null;

  const planDetails = {
    plus: { name: "Plus", price: 9.99, credits: 999, features: ["999 Credits/month", "Unlimited Chat", "Image Generation", "Mature Content"] },
    pro: { name: "Pro", price: 19.99, credits: 1999, features: ["1999 Credits/month", "Unlimited Chat", "Image Generation", "Mature Content", "Priority Support"] },
  } as const;

  const selectedPlan = plan ? (planDetails as any)[plan] : null;
  const nowUrl = plan === "plus" ? nowpaymentsPlusUrl : plan === "pro" ? nowpaymentsProUrl : "";

  if (!plan || !selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Select a Plan</h1>
          <button onClick={() => router.push("/pricing")} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Back to Pricing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <div className="relative z-20 max-w-5xl mx-auto px-4 py-20 pt-28">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Premium Checkout</h1>
          <p className="mt-2 text-white/90">Select crypto now. Cards are coming soon.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2 rounded-full text-white border border-white/20">
            <span>Selected:</span>
            <span className="font-semibold">{selectedPlan.name}</span>
            <span className="opacity-80">— ${selectedPlan.price}/mo</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pay with Crypto</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm">Recommended</span>
            </div>
            <p className="text-sm text-white/80 mt-2">Lower network fees on TRC20/BEP20 where available. ERC20 also works.</p>
            <div className="mt-5 grid grid-cols-1 gap-3">
              <button
                onClick={async () => {
                  try {
                    setCreating(true);
                    const token = await getIdToken?.();
                    if (!token) throw new Error("Please log in");
                    const resp = await fetch(`${backendUrl}/api/payment/nowpayments/create`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ plan }),
                    });
                    const data = await resp.json();
                    if (resp.ok && data.payment_url) {
                      window.location.href = data.payment_url;
                      return;
                    }
                    // Fallback to static link if API not available
                    if (nowUrl) {
                      window.location.href = nowUrl;
                    } else {
                      alert(data.error || 'Failed to start payment');
                    }
                  } catch (e: any) {
                    setCreating(false);
                    alert(e?.message || 'Failed to start payment');
                  }
                }}
                disabled={creating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
              >
                {creating ? 'Preparing…' : `Continue — $${selectedPlan.price}/month`}
              </button>
              {nowUrl && (
                <button
                  onClick={() => (window.location.href = nowUrl)}
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Use Hosted Link Instead
                </button>
              )}
            </div>
            <p className="text-xs text-white/70 mt-3">After payment you’ll be redirected to your dashboard.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-white">
            <h2 className="text-xl font-bold">Pay by Card</h2>
            <p className="text-sm text-white/80 mt-2">Tailored card payments are coming soon.</p>
            <div className="mt-5 opacity-60">
              <div className="grid grid-cols-2 gap-3">
                <div className="h-11 rounded-lg bg-white/5 border border-white/10" />
                <div className="h-11 rounded-lg bg-white/5 border border-white/10" />
                <div className="h-11 rounded-lg bg-white/5 border border-white/10" />
                <div className="h-11 rounded-lg bg-white/5 border border-white/10" />
              </div>
            </div>
            <button disabled className="mt-5 w-full py-3 rounded-xl bg-white/10 text-white font-bold border border-white/20 cursor-not-allowed">Coming Soon</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading checkout...</div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutPageInner />
    </Suspense>
  );
}

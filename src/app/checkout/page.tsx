"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/Header";
import { backendUrl } from "@/lib/config";

function CheckoutPageInner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render exactly the same fallback as the Suspense boundary
  // to keep server and client markup identical on first paint.
  if (!isClient) return <LoadingFallback />;

  return <CheckoutForm />;
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, getIdToken, refreshUserProfile } = useAuth();

  const plan = searchParams?.get("plan") as "plus" | "pro" | null;

  const [formData, setFormData] = useState({
    cardNumber: "",
    cvv: "",
    expMonth: "",
    expYear: "",
    cardholderName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testCards, setTestCards] = useState<any[]>([]);

  // Plan details
  const planDetails = {
    plus: {
      name: "Plus",
      price: 9.99,
      credits: 999,
      features: [
        "999 Credits/month",
        "Unlimited Chat",
        "Image Generation",
        "Mature Content",
      ],
    },
    pro: {
      name: "Pro",
      price: 19.99,
      credits: 1999,
      features: [
        "1999 Credits/month",
        "Unlimited Chat",
        "Image Generation",
        "Mature Content",
        "Priority Support",
      ],
    },
  };

  const selectedPlan = plan ? planDetails[plan] : null;

  // Load test cards (only in test mode)
  useEffect(() => {
    fetchTestCards();
  }, []);

  const fetchTestCards = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/payment/test-cards`);
      if (response.ok) {
        const data = await response.json();
        setTestCards(data.testCards || []);
      }
    } catch (err) {
      console.log("Test cards not available (live mode)");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted =
        value
          .replace(/\s/g, "")
          .match(/.{1,4}/g)
          ?.join(" ") || value;
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const useTestCard = (card: any) => {
    setFormData({
      cardNumber: card.number,
      cvv: card.cvv,
      expMonth: card.expMonth,
      expYear: card.expYear,
      cardholderName: card.name,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("Please log in to continue");
      }

      const response = await fetch(`${backendUrl}/api/payment/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          plan: plan,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);

        // Refresh user profile to update plan
        await refreshUserProfile();

        // Show success message briefly then redirect
        setTimeout(() => {
          router.push("/dashboard?payment=success");
        }, 2000);
      } else {
        setError(result.error || "Payment failed");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  if (!plan || !selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Invalid Plan
          </h1>
          <button
            onClick={() => router.push("/pricing")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your subscription to {selectedPlan.name} has been activated.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Check your email for receipt and details.
          </p>
          <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            Complete Your Purchase
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Subscribe to {selectedPlan.name} Plan
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-gray-900">
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">
                      {selectedPlan.name} Plan
                    </span>
                    <span className="text-lg font-bold">
                      ${selectedPlan.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Billed monthly</p>
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="font-semibold mb-2">What's included:</h3>
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>${selectedPlan.price}/month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your subscription will renew automatically every month.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Payment Details{" "}
                  <span className="text-sm text-red-700">Test Mode</span>
                </h2>

                {/* Test Cards (only visible in test mode) */}
                {/* {testCards.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm text-gray-800">
                      🧪 Test Mode - Use Test Cards:
                    </h3>
                    <div className="space-y-2">
                      {testCards.slice(0, 2).map((card, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => useTestCard(card)}
                          className="w-full text-left p-2 text-xs bg-white hover:bg-blue-50 border border-blue-200 rounded"
                        >
                          <div className="font-mono text-gray-800">
                            {card.number}
                          </div>
                          <div className="text-gray-600">
                            {card.brand} - {card.result}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )} */}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-gray-900 bg-white"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Month
                      </label>
                      <input
                        type="text"
                        name="expMonth"
                        value={formData.expMonth}
                        onChange={handleInputChange}
                        placeholder="MM"
                        maxLength={2}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Year
                      </label>
                      <input
                        type="text"
                        name="expYear"
                        value={formData.expYear}
                        onChange={handleInputChange}
                        placeholder="YYYY"
                        maxLength={4}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay $${selectedPlan.price}/month`
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Your payment is secure and encrypted. Cancel anytime.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
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

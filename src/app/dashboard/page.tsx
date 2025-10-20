"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import CreditBalance from "../../components/CreditBalance";
import GlassEffect from "../../components/GlassEffect";
import Header from "../../components/layout/Header";
import { auth } from "@/lib/firebase";
import { backendUrl } from "@/lib/config";
export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signOut,
    refreshUserProfile,
  } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<any>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [stories, setStories] = useState<any[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserProfile();
      fetchMonthlyUsage();
      fetchUserStories();
    }
  }, [isAuthenticated]);

  const fetchMonthlyUsage = async () => {
    try {
      setUsageLoading(true);

      // Get token from Firebase auth
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No authenticated user");
        setUsageLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`${backendUrl}/api/token-usage/my/monthly`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Usage data:", data);
        setMonthlyUsage(data.usage);
      } else {
        console.error("Failed to fetch usage:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    } finally {
      setUsageLoading(false);
    }
  };

  const fetchUserStories = async () => {
    try {
      setStoriesLoading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No authenticated user");
        setStoriesLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`${backendUrl}/api/romance/stories?limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Stories data:", data);
        setStories(data.stories || []);
      } else {
        console.error("Failed to fetch stories:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      setError(null);

      const response = await fetch(
        `${backendUrl}/api/subscription/portal/${user?.uid}`
      );

      if (!response.ok) {
        throw new Error("Failed to get portal URL");
      }

      const data = await response.json();
      window.open(data.portalUrl, "_blank");
    } catch (err: any) {
      console.error("Portal error:", err);
      setError(err.message || "Failed to open subscription portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !userProfile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50"
        style={{
          backgroundImage: 'url("/image.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-white text-xl drop-shadow-lg">Loading...</div>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate credits from cost (3x markup)
  const calculateCreditsFromCost = (cost: number) => {
    // cost is already in USD, 1 credit = $0.01
    // We charge 3x the API cost
    return Math.ceil(cost * 3 * 100); // Convert to credits (multiply by 100 to convert dollars to cents/credits)
  };

  // Calculate total credits consumed this month
  const getTotalCreditsConsumed = () => {
    if (!monthlyUsage) return 0;
    // Total cost includes both token usage and image generation
    return calculateCreditsFromCost(monthlyUsage.totalCost || 0);
  };

  // Calculate AI conversation credits (excluding images)
  const getAIConversationCredits = () => {
    if (!monthlyUsage) return 0;
    // Image cost: $0.01 per image, we charge 3 credits per image = $0.03 per image
    const imageCost = (monthlyUsage.imagesGenerated || 0) * 0.01;
    const conversationCost = (monthlyUsage.totalCost || 0) - imageCost;
    return calculateCreditsFromCost(conversationCost);
  };

  // Get plan's total allocated credits
  const getPlanCredits = () => {
    if (userProfile.plan === "plus") return 999;
    if (userProfile.plan === "pro") return 1999;
    return 0;
  };

  // Calculate remaining credits (allocated - used)
  const getRemainingCredits = () => {
    // If creditBalance is properly set, use it
    if (userProfile.creditBalance > 0) {
      return userProfile.creditBalance;
    }
    // Otherwise calculate it: plan allocation - used
    return Math.max(0, getPlanCredits() - getTotalCreditsConsumed());
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
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
            Welcome back, {userProfile.displayName}! 💕
          </h1>
          <p className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-lg">
            Manage your subscription and track your usage
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Plan */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl">
                  {userProfile.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    userProfile.displayName?.[0]?.toUpperCase() || "👤"
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userProfile.displayName}
                  </h2>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Member since:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(userProfile.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last active:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(userProfile.lastActive)}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Current Plan
              </h3>

              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full">
                  <span className="text-2xl font-bold capitalize">
                    {userProfile.plan}
                  </span>
                  {userProfile.plan !== "free" && (
                    <span className="text-sm">
                      ${userProfile.plan === "plus" ? "9.99" : "19.99"}/mo
                    </span>
                  )}
                </div>
              </div>

              {/* Credit System Info for Plus/Pro */}
              {userProfile.plan !== "free" && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <div className="text-sm text-gray-900">
                    <div className="font-semibold mb-1">💳 Credit-Based Plan</div>
                    <div className="text-xs text-gray-700">
                      {userProfile.plan === "plus"
                        ? "999 monthly credits"
                        : "1999 monthly credits"}{" "}
                      • 50% rollover • Pay-as-you-go billing
                    </div>
                  </div>
                </div>
              )}

              {userProfile.subscriptionStatus && (
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`font-semibold capitalize ${
                        userProfile.subscriptionStatus === "active"
                          ? "text-green-600"
                          : userProfile.subscriptionStatus === "canceled"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {userProfile.subscriptionStatus}
                    </span>
                  </div>
                  {userProfile.subscriptionEndsAt && (
                    <div className="flex justify-between">
                      <span>Renews on:</span>
                      <span className="font-semibold text-gray-900">
                        {formatDate(userProfile.subscriptionEndsAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {userProfile.plan !== "pro" && (
                  <button
                    onClick={() => router.push("/pricing")}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    Upgrade Plan
                  </button>
                )}

                {userProfile.subscriptionStatus && (
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="w-full bg-gray-200 text-gray-900 py-2 rounded-full font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {portalLoading ? "Loading..." : "Manage Subscription"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Usage Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Balance Card (Plus/Pro users) */}
            {(userProfile.plan === "plus" || userProfile.plan === "pro") &&
              userProfile.creditBalance !== undefined && (
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Credit Balance
                    </h3>
                    <button
                      onClick={() => {
                        refreshUserProfile();
                        fetchMonthlyUsage();
                      }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                    >
                      Refresh
                    </button>
                  </div>

                  <CreditBalance
                    credits={userProfile.creditBalance}
                    plan={userProfile.plan}
                    variant="detailed"
                    showWarning={true}
                    lastRefresh={userProfile.lastCreditRefresh}
                  />
                </div>
              )}

            {/* Usage Overview - Credit Consumption */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Usage This Month
                </h3>
                <button
                  onClick={() => {
                    refreshUserProfile();
                    fetchMonthlyUsage();
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                  disabled={usageLoading}
                >
                  {usageLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Plus/Pro Users - Credit Consumption */}
                {(userProfile.plan === "plus" || userProfile.plan === "pro") && (
                  <>
                    {/* Total Credits Progress */}
                    <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💳</span>
                          <span className="font-bold text-gray-900 text-lg">
                            Credit Balance
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {getRemainingCredits()}
                          </div>
                          <div className="text-xs text-gray-700">
                            of {getPlanCredits()} credits
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-purple-200">
                        <div
                          className="h-full transition-all bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{
                            width: `${Math.min((getRemainingCredits() / getPlanCredits()) * 100, 100)}%`
                          }}
                        />
                      </div>

                      <div className="flex justify-between mt-2 text-xs text-gray-700">
                        <span>
                          {usageLoading ? "..." : getTotalCreditsConsumed()} credits used this month
                        </span>
                        <span>
                          {Math.round((getRemainingCredits() / getPlanCredits()) * 100)}% remaining
                        </span>
                      </div>
                    </div>

                    {/* AI Conversations */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💬</span>
                          <span className="font-semibold text-gray-900">
                            AI Conversations
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {usageLoading ? "..." : getAIConversationCredits()} credits
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div className="flex justify-between mb-1">
                          <span>Total tokens:</span>
                          <span className="font-semibold text-gray-900">
                            {usageLoading ? "..." : monthlyUsage ? ((monthlyUsage.totalTokens || 0) / 1000).toFixed(1) + "K" : "0"}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          Chat messages, story creation, and AI responses
                        </div>
                      </div>
                    </div>

                    {/* Images Generated */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🖼️</span>
                          <span className="font-semibold text-gray-900">
                            Images Generated
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-700">
                            {usageLoading ? "..." : monthlyUsage?.imagesGenerated || 0} images
                          </div>
                          <div className="text-xs text-gray-600">
                            {usageLoading ? "..." : (monthlyUsage?.imagesGenerated || 0) * 3} credits used
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        3 credits per image • Scene and character illustrations
                      </div>
                    </div>
                  </>
                )}

                {/* Free Users - Traditional Limits */}
                {userProfile.plan === "free" && (
                  <>
                    {/* Messages (Free tier tracking only) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💬</span>
                          <span className="font-semibold text-gray-900">
                            Free Messages
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {userProfile.messagesUsed || 0} / 3
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full transition-all bg-blue-500"
                          style={{ width: `${((userProfile.messagesUsed || 0) / 3) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {3 - (userProfile.messagesUsed || 0)} free messages remaining
                      </p>
                    </div>

                    {/* Story Scenes (Free tier tracking only) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📖</span>
                          <span className="font-semibold text-gray-900">
                            Free Story Scene
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {userProfile.storyScenesCreated || 0} / 1
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full transition-all bg-purple-500"
                          style={{ width: `${((userProfile.storyScenesCreated || 0) / 1) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {1 - (userProfile.storyScenesCreated || 0)} free scene remaining
                      </p>
                    </div>

                    {/* Upgrade CTA for Free Users */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⭐</span>
                        <div>
                          <div className="font-bold text-gray-900 mb-1">
                            Upgrade for Unlimited Access
                          </div>
                          <div className="text-xs text-gray-700 mb-3">
                            Get 999+ credits for unlimited chat, stories, and image generation
                          </div>
                          <button
                            onClick={() => router.push("/pricing")}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                          >
                            View Plans
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Usage Reset Date */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monthly cycle resets:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(userProfile.usageResetAt || null)}
                  </span>
                </div>
                {(userProfile.plan === "plus" || userProfile.plan === "pro") && (
                  <p className="text-xs text-gray-500 mt-2">
                    💡 50% of unused credits roll over to next month
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all text-left"
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-semibold">Start Chatting</div>
                  <div className="text-xs opacity-80">
                    Continue conversation
                  </div>
                </button>
                <button
                  onClick={() => router.push("/romance/create")}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4 rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all text-left"
                >
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-semibold">Create Story</div>
                  <div className="text-xs opacity-80">New romance canvas</div>
                </button>
              </div>
            </div>

            {/* User's Stories */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Your Romantic Stories 💕
                </h3>
                <button
                  onClick={fetchUserStories}
                  disabled={storiesLoading}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold disabled:opacity-50"
                >
                  {storiesLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {storiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
                </div>
              ) : stories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📖</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    No Stories Yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Start creating your first romantic story!
                  </p>
                  <button
                    onClick={() => router.push("/romance/create")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 transition-all"
                  >
                    ✨ Create Your First Story
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stories.map((story) => {
                    // Get first image from story scenes
                    const storyImage = story.scenes?.[0]?.sceneImageUrl ||
                                      story.scenes?.[0]?.visualMoments?.[0]?.imageUrl ||
                                      '/image.jpg'; // Default fallback image

                    return (
                      <div
                        key={story._id}
                        onClick={() => router.push(`/romance/story/${story._id}`)}
                        className="group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02] border-2 border-purple-200/50"
                      >
                        {/* Story Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={storyImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/image.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                          {/* Spice Level Badge */}
                          {story.metadata?.spiceLevel && (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                              style={{
                                backgroundColor: story.metadata.spiceLevel === 'explicit' ? '#ef4444' :
                                               story.metadata.spiceLevel === 'medium' ? '#f59e0b' :
                                               '#10b981'
                              }}
                            >
                              {story.metadata.spiceLevel === 'explicit' ? '🔥 Spicy' :
                               story.metadata.spiceLevel === 'medium' ? '🌶️ Medium' :
                               '💕 Soft'}
                            </div>
                          )}
                        </div>

                        {/* Story Info */}
                        <div className="p-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                            {story.title}
                          </h4>

                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <span>📖</span>
                              {story.scenes?.length || 0} scenes
                            </span>
                            {story.metadata?.characters?.length > 0 && (
                              <span className="flex items-center gap-1">
                                <span>👥</span>
                                {story.metadata.characters.length} characters
                              </span>
                            )}
                          </div>

                          {/* Tropes */}
                          {story.metadata?.tropes && story.metadata.tropes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {story.metadata.tropes.slice(0, 2).map((trope: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                                >
                                  {trope}
                                </span>
                              ))}
                              {story.metadata.tropes.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{story.metadata.tropes.length - 2} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Date */}
                          <div className="text-xs text-gray-500">
                            Created {new Date(story.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View All Button */}
              {stories.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.push("/romance/stories")}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    View All Stories →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

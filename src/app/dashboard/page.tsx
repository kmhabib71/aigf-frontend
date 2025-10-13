"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import CreditBalance from '../../components/CreditBalance';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading, isAuthenticated, signOut, refreshUserProfile } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUserProfile();
    }
  }, [isAuthenticated]);

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3001/api/subscription/portal/${user?.uid}`
      );

      if (!response.ok) {
        throw new Error('Failed to get portal URL');
      }

      const data = await response.json();
      window.open(data.portalUrl, '_blank');
    } catch (err: any) {
      console.error('Portal error:', err);
      setError(err.message || 'Failed to open subscription portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const messagePercentage = getUsagePercentage(userProfile.messagesUsed, userProfile.messageLimit);
  const imagePercentage = getUsagePercentage(userProfile.imagesUsed, userProfile.imageLimit);
  const voicePercentage = getUsagePercentage(userProfile.voiceCharsUsed, userProfile.voiceCharLimit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-white text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span>💬</span>
              <span>AI Companion</span>
            </button>

            <div className="flex items-center gap-4">
              {/* Credit Balance (compact for header) */}
              {userProfile.useCreditSystem && userProfile.creditBalance !== undefined && (
                <CreditBalance
                  credits={userProfile.creditBalance}
                  plan={userProfile.plan}
                  variant="compact"
                  showWarning={true}
                />
              )}

              <button
                onClick={handleSignOut}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userProfile.displayName}!
          </h1>
          <p className="text-white/80">
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
                      alt={userProfile.displayName || 'User'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    userProfile.displayName?.[0]?.toUpperCase() || '👤'
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
                  {userProfile.plan !== 'free' && (
                    <span className="text-sm">
                      ${userProfile.plan === 'plus' ? '9.99' : '29.99'}/mo
                    </span>
                  )}
                </div>
              </div>

              {userProfile.subscriptionStatus && (
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-semibold capitalize ${
                      userProfile.subscriptionStatus === 'active' ? 'text-green-600' :
                      userProfile.subscriptionStatus === 'canceled' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
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
                {userProfile.plan !== 'pro' && (
                  <button
                    onClick={() => router.push('/pricing')}
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
                    {portalLoading ? 'Loading...' : 'Manage Subscription'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Usage Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Balance Card (Plus/Pro users) */}
            {userProfile.useCreditSystem && userProfile.creditBalance !== undefined && (
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Credit Balance
                  </h3>
                  <button
                    onClick={refreshUserProfile}
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

            {/* Usage Overview */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {userProfile.useCreditSystem ? 'Usage Limits (Fallback)' : 'Usage This Month'}
                </h3>
                <button
                  onClick={refreshUserProfile}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  Refresh
                </button>
              </div>

              {/* Info message for credit users */}
              {userProfile.useCreditSystem && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">ℹ️</span>
                    <div className="text-sm text-blue-900">
                      <div className="font-semibold">Credit-Based System Active</div>
                      <div className="text-xs text-blue-700 mt-1">
                        Your usage is tracked via credits. The limits below only apply if your credits are depleted.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Messages */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💬</span>
                      <span className="font-semibold text-gray-900">
                        Messages
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {userProfile.messagesUsed} / {userProfile.messageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${getUsageColor(messagePercentage)}`}
                      style={{ width: `${messagePercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {userProfile.messageLimit - userProfile.messagesUsed} messages remaining
                  </p>
                </div>

                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🖼️</span>
                      <span className="font-semibold text-gray-900">
                        Image Generation
                      </span>
                      {userProfile.imageLimit === 0 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Upgrade Required
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {userProfile.imagesUsed} / {userProfile.imageLimit || '0'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${getUsageColor(imagePercentage)}`}
                      style={{ width: `${imagePercentage}%` }}
                    />
                  </div>
                  {userProfile.imageLimit > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {userProfile.imageLimit - userProfile.imagesUsed} images remaining
                    </p>
                  )}
                </div>

                {/* Voice */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎤</span>
                      <span className="font-semibold text-gray-900">
                        Voice Messages
                      </span>
                      {userProfile.voiceCharLimit === 0 && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          Upgrade Required
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {(userProfile.voiceCharsUsed / 1000).toFixed(1)}K / {(userProfile.voiceCharLimit / 1000)}K chars
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${getUsageColor(voicePercentage)}`}
                      style={{ width: `${voicePercentage}%` }}
                    />
                  </div>
                  {userProfile.voiceCharLimit > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {((userProfile.voiceCharLimit - userProfile.voiceCharsUsed) / 1000).toFixed(1)}K characters remaining
                    </p>
                  )}
                </div>
              </div>

              {/* Usage Reset Date */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Usage resets on:{' '}
                  <span className="font-semibold text-gray-900">
                    {formatDate(userProfile.usageResetAt || null)}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all text-left"
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-semibold">Start Chatting</div>
                  <div className="text-xs opacity-80">Continue conversation</div>
                </button>
                <button
                  onClick={() => router.push('/pricing')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all text-left"
                >
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-semibold">View Plans</div>
                  <div className="text-xs opacity-80">Compare features</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

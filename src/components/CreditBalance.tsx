"use client";

import React from 'react';

interface CreditBalanceProps {
  credits: number;
  plan: 'free' | 'plus' | 'pro';
  variant?: 'compact' | 'detailed' | 'dashboard';
  showWarning?: boolean;
  lastRefresh?: Date | null;
}

export default function CreditBalance({
  credits,
  plan,
  variant = 'compact',
  showWarning = true,
  lastRefresh,
}: CreditBalanceProps) {
  // Free users don't have credits
  if (plan === 'free') {
    return null;
  }

  // Calculate USD value
  const usdValue = (credits / 100).toFixed(2);

  // Get plan credit allocation
  const planCredits = plan === 'plus' ? 999 : 1999;
  const planValue = (planCredits / 100).toFixed(2);

  // Calculate percentage
  const percentage = Math.min((credits / planCredits) * 100, 100);

  // Determine warning level
  const isLow = percentage < 20;
  const isCritical = percentage < 10;
  const isDepleted = credits <= 0;

  // Format refresh date
  const formatRefreshDate = (date: Date | null | undefined) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Compact variant (for header)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
          <span className="text-lg">💳</span>
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${
              isDepleted ? 'text-red-300' :
              isCritical ? 'text-yellow-300' :
              'text-white'
            }`}>
              {credits} Credits
            </span>
            <span className="text-xs text-white/60">
              ${usdValue}
            </span>
          </div>
        </div>
        {showWarning && (isLow || isDepleted) && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isDepleted ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            isCritical ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
            'bg-orange-500/20 text-orange-300 border border-orange-500/30'
          }`}>
            {isDepleted ? 'Depleted' : isCritical ? 'Critical' : 'Low'}
          </span>
        )}
      </div>
    );
  }

  // Detailed variant (for cards)
  if (variant === 'detailed') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <div>
              <div className="text-sm font-semibold text-gray-600">Credit Balance</div>
              <div className={`text-2xl font-bold ${
                isDepleted ? 'text-red-600' :
                isCritical ? 'text-yellow-600' :
                isLow ? 'text-orange-600' :
                'text-purple-600'
              }`}>
                {credits} Credits
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">USD Value</div>
            <div className="text-lg font-semibold text-gray-900">
              ${usdValue}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isDepleted ? 'bg-red-500' :
                isCritical ? 'bg-yellow-500' :
                isLow ? 'bg-orange-500' :
                'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {percentage.toFixed(0)}% of monthly allocation
            </span>
            <span className="text-xs font-semibold text-gray-600">
              {planCredits} Credits/mo
            </span>
          </div>
        </div>

        {/* Warning messages */}
        {showWarning && isDepleted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-red-900">Credits Depleted</div>
                <div className="text-xs text-red-700 mt-1">
                  You've used all your credits. Add more credits or upgrade your plan to continue using AI features.
                </div>
              </div>
            </div>
          </div>
        )}

        {showWarning && isCritical && !isDepleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <div className="text-sm font-semibold text-yellow-900">Critical Credit Level</div>
                <div className="text-xs text-yellow-700 mt-1">
                  You have less than 10% of your credits remaining. Consider adding more credits.
                </div>
              </div>
            </div>
          </div>
        )}

        {showWarning && isLow && !isCritical && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <div className="text-sm font-semibold text-orange-900">Low Credits</div>
                <div className="text-xs text-orange-700 mt-1">
                  You're running low on credits. Plan ahead to avoid interruptions.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh info */}
        {lastRefresh && (
          <div className="text-xs text-gray-500 mt-2">
            Last refresh: {formatRefreshDate(lastRefresh)}
          </div>
        )}
      </div>
    );
  }

  // Dashboard variant (for usage section)
  if (variant === 'dashboard') {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <span className="font-semibold text-gray-900">Credit Balance</span>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${
              isDepleted ? 'text-red-600' :
              isCritical ? 'text-yellow-600' :
              isLow ? 'text-orange-600' :
              'text-purple-600'
            }`}>
              {credits} Credits
            </div>
            <div className="text-xs text-gray-500">
              ${usdValue} USD
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              isDepleted ? 'bg-red-500' :
              isCritical ? 'bg-yellow-500' :
              isLow ? 'bg-orange-500' :
              'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {credits} of {planCredits} credits available ({percentage.toFixed(0)}%)
          </p>
          {showWarning && (isLow || isDepleted) && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isDepleted ? 'bg-red-100 text-red-700' :
              isCritical ? 'bg-yellow-100 text-yellow-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {isDepleted ? 'Depleted' : isCritical ? 'Critical' : 'Low'}
            </span>
          )}
        </div>

        {/* Info about credits */}
        <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
          <div className="text-xs text-gray-600">
            <div className="font-semibold text-purple-900 mb-1">How credits work:</div>
            <ul className="space-y-1 ml-4 list-disc">
              <li>1 Credit = $0.01 USD</li>
              <li>Credits are deducted based on AI model usage</li>
              <li>50% of unused credits roll over each month</li>
              <li>When depleted, you'll be limited to free tier features</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

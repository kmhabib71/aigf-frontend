"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-white/80">We'll send you a reset link</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <span className="font-semibold">{email}</span>
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-gray-600 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/login')}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

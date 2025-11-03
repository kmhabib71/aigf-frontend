"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { backendUrl } from '@/lib/config';

function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided');
      setIsVerifying(false);
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err: any) {
      setError('Failed to verify email. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={`p-8 text-center ${success ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-pink-600'}`}>
          <h1 className="text-3xl font-bold text-white mb-2">
            {success ? 'Email Verified!' : 'Verification Failed'}
          </h1>
          <p className="text-white/80">
            {success ? 'Your account is ready' : 'Something went wrong'}
          </p>
        </div>

        {/* Content */}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">
                Your email has been verified successfully. You now have full access to all features.
              </p>
              <button
                onClick={() => {
                  // Redirect and force reload to ensure fresh profile data
                  window.location.href = '/dashboard';
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all mb-3"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">
                {error || 'The verification link is invalid or has expired. You can request a new one.'}
              </p>
              <button
                onClick={async () => {
                  // Try to resend verification
                  router.push('/dashboard');
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all mb-3"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <EmailVerificationForm />
    </Suspense>
  );
}

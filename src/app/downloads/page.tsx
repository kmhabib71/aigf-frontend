"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { backendUrl } from "../../lib/config";
import Header from "../../components/layout/Header";

interface DownloadFile {
  productLicense: string;
  version: string;
  fileName: string;
  size: string;
  releaseDate: string;
  releaseNotes: string;
  downloadUrl: string;
}

export default function DownloadsPage() {
  const router = useRouter();
  const { user, userProfile, isAuthenticated, loading } = useAuth();
  const [downloads, setDownloads] = useState<DownloadFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated && userProfile) {
      loadDownloads();
    }
  }, [loading, isAuthenticated, userProfile, router]);

  const loadDownloads = async () => {
    try {
      setIsLoading(true);

      // Mock data - Replace with actual API call
      const mockDownloads: DownloadFile[] = [
        {
          productLicense: userProfile?.productLicense || 'none',
          version: 'v1.0.0',
          fileName: `romancecanvas-${userProfile?.productLicense}-v1.0.0.zip`,
          size: '45 MB',
          releaseDate: '2025-01-15',
          releaseNotes: 'Initial release with all core features',
          downloadUrl: '/api/downloads/romancecanvas-v1.0.0.zip',
        },
      ];

      setDownloads(mockDownloads);
    } catch (error) {
      console.error('Failed to load downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductDisplayName = (license: string) => {
    const names: Record<string, string> = {
      'chat-only': 'AI Girlfriend Chat Only',
      'story-only': 'Story Generator Only',
      'complete': 'Complete Bundle',
      'reseller': 'Reseller License',
      'dfy': 'Done-For-You Package',
    };
    return names[license] || 'No License';
  };

  const getLicenseBadgeColor = (license: string) => {
    const colors: Record<string, string> = {
      'chat-only': 'bg-blue-500',
      'story-only': 'bg-purple-500',
      'complete': 'bg-green-500',
      'reseller': 'bg-orange-500',
      'dfy': 'bg-pink-500',
    };
    return colors[license] || 'bg-gray-500';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center">
        <div className="text-purple-700 text-xl">Loading your downloads...</div>
      </div>
    );
  }

  if (!userProfile?.productLicense || userProfile.productLicense === 'none') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 pt-32 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Active License
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              You don't have an active product license. Please contact support or
              purchase a license to access downloads.
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg mb-6">
            <span className={`w-3 h-3 rounded-full ${getLicenseBadgeColor(userProfile.productLicense)}`}></span>
            <span className="text-sm font-semibold text-gray-700">
              {getProductDisplayName(userProfile.productLicense)}
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Your Downloads
          </h1>
          <p className="text-xl text-gray-600">
            Access your product files and updates
          </p>
        </div>

        {/* License Info Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                License Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-semibold text-gray-900">
                    {getProductDisplayName(userProfile.productLicense)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License Key:</span>
                  <span className="font-mono text-xs text-gray-900">
                    {userProfile.licenseKey || 'Generating...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {userProfile.licenseStatus || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {userProfile.productLicense === 'chat-only' && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> AI Girlfriend Chat System
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> User Authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Setup Documentation
                    </li>
                  </>
                )}
                {userProfile.productLicense === 'story-only' && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Story Generation System
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Image Generation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Setup Documentation
                    </li>
                  </>
                )}
                {(['complete', 'reseller', 'dfy'].includes(userProfile.productLicense)) && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Full Chat System
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Full Story System
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Admin Panel
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Complete Documentation
                    </li>
                    {userProfile.productLicense === 'reseller' && (
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> Reseller Rights
                      </li>
                    )}
                    {userProfile.productLicense === 'dfy' && (
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> Professional Setup Service
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Downloads</h2>

          {downloads.map((file, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">📦</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {file.fileName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Version {file.version}</span>
                        <span>•</span>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{new Date(file.releaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-16 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Release Notes:
                    </h4>
                    <p className="text-sm text-gray-600">{file.releaseNotes}</p>
                  </div>
                </div>

                <a
                  href={file.downloadUrl}
                  download
                  className="ml-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            📖 Need Help?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Setup Guide
              </h4>
              <p className="text-blue-700">
                Find detailed installation instructions in the SETUP.md file included
                in your download.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Video Tutorials
              </h4>
              <p className="text-blue-700">
                Watch our step-by-step video guides to get your site running quickly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Support
              </h4>
              <p className="text-blue-700">
                Contact us at support@romancecanvas.com if you need assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

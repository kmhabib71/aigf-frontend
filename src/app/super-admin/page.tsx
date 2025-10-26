"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { backendUrl } from "../../lib/config";

interface Buyer {
  uid: string;
  email: string;
  displayName: string;
  productLicense: string;
  licenseKey: string | null;
  jvzooTransactionId: string | null;
  purchaseDate: string | null;
  productPrice: number;
  licenseStatus: string;
  licenseNotes: string | null;
  createdAt: string;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLicense, setFilterLicense] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New buyer form
  const [newBuyer, setNewBuyer] = useState({
    email: "",
    displayName: "",
    productLicense: "chat-only",
    jvzooTransactionId: "",
    productPrice: 47,
    licenseNotes: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      loadBuyers();
    }
  }, [loading, isAuthenticated, router]);

  const getAuthHeaders = async () => {
    const { authService } = await import("../../lib/auth/authService");
    const token = await authService.getIdToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadBuyers = async () => {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();

      const response = await fetch(`${backendUrl}/api/super-admin/buyers`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to load buyers");
      }

      const data = await response.json();
      setBuyers(data.buyers);
      setError(null);
    } catch (err: any) {
      console.error("Load buyers error:", err);
      setError(err.message || "Failed to load buyers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBuyer = async () => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${backendUrl}/api/super-admin/buyers`, {
        method: "POST",
        headers,
        body: JSON.stringify(newBuyer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add buyer");
      }

      await loadBuyers();
      setShowAddModal(false);
      setNewBuyer({
        email: "",
        displayName: "",
        productLicense: "chat-only",
        jvzooTransactionId: "",
        productPrice: 47,
        licenseNotes: "",
      });
      alert("Buyer added successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to add buyer");
    }
  };

  const handleUpdateLicense = async (
    uid: string,
    updates: Partial<Buyer>
  ) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${backendUrl}/api/super-admin/buyers/${uid}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update license");
      }

      await loadBuyers();
      setSelectedBuyer(null);
      alert("License updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update license");
    }
  };

  const generateLicenseKey = () => {
    return `RC-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.jvzooTransactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterLicense || b.productLicense === filterLicense;
    return matchesSearch && matchesFilter;
  });

  const getLicenseBadgeColor = (license: string) => {
    const colors: Record<string, string> = {
      none: "bg-gray-100 text-gray-700",
      "chat-only": "bg-blue-100 text-blue-700",
      "story-only": "bg-purple-100 text-purple-700",
      complete: "bg-green-100 text-green-700",
      reseller: "bg-orange-100 text-orange-700",
      dfy: "bg-pink-100 text-pink-700",
    };
    return colors[license] || colors.none;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      suspended: "bg-yellow-100 text-yellow-700",
      refunded: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-700",
    };
    return colors[status] || colors.active;
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading Super Admin Panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <span>👑</span>
              <span>Super Admin - Buyer License Management</span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/admin")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
              >
                Regular Admin
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Buyers", value: buyers.length, color: "blue" },
            {
              label: "Chat Only",
              value: buyers.filter((b) => b.productLicense === "chat-only")
                .length,
              color: "blue",
            },
            {
              label: "Story Only",
              value: buyers.filter((b) => b.productLicense === "story-only")
                .length,
              color: "purple",
            },
            {
              label: "Complete",
              value: buyers.filter((b) => b.productLicense === "complete")
                .length,
              color: "green",
            },
            {
              label: "Reseller",
              value: buyers.filter((b) => b.productLicense === "reseller")
                .length,
              color: "orange",
            },
            {
              label: "DFY",
              value: buyers.filter((b) => b.productLicense === "dfy").length,
              color: "pink",
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-gray-600 text-xs font-semibold mb-1">
                {stat.label}
              </div>
              <div className={`text-3xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Buyer Licenses</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              + Add Buyer
            </button>
          </div>

          {/* Search & Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by email, name, or JVZoo Transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
            <select
              value={filterLicense}
              onChange={(e) => setFilterLicense(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="">All Licenses</option>
              <option value="none">None</option>
              <option value="chat-only">Chat Only ($47)</option>
              <option value="story-only">Story Only ($97)</option>
              <option value="complete">Complete ($197)</option>
              <option value="reseller">Reseller ($497)</option>
              <option value="dfy">Done-For-You ($997)</option>
            </select>
          </div>

          {/* Buyers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    License
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    License Key
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    JVZoo ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {buyer.displayName}
                      </div>
                      <div className="text-sm text-gray-600">{buyer.email}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(buyer.purchaseDate || buyer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getLicenseBadgeColor(
                          buyer.productLicense
                        )}`}
                      >
                        {buyer.productLicense}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-mono text-gray-700">
                        {buyer.licenseKey || "Not generated"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {buyer.jvzooTransactionId || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-green-600">
                        ${buyer.productPrice}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          buyer.licenseStatus
                        )}`}
                      >
                        {buyer.licenseStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedBuyer(buyer)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBuyers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No buyers found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Buyer Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Buyer
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newBuyer.email}
                  onChange={(e) =>
                    setNewBuyer({ ...newBuyer, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  placeholder="buyer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={newBuyer.displayName}
                  onChange={(e) =>
                    setNewBuyer({ ...newBuyer, displayName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product License *
                </label>
                <select
                  value={newBuyer.productLicense}
                  onChange={(e) =>
                    setNewBuyer({
                      ...newBuyer,
                      productLicense: e.target.value,
                      productPrice:
                        e.target.value === "chat-only"
                          ? 47
                          : e.target.value === "story-only"
                          ? 97
                          : e.target.value === "complete"
                          ? 197
                          : e.target.value === "reseller"
                          ? 497
                          : 997,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="chat-only">Chat Only ($47)</option>
                  <option value="story-only">Story Only ($97)</option>
                  <option value="complete">Complete ($197)</option>
                  <option value="reseller">Reseller ($497)</option>
                  <option value="dfy">Done-For-You ($997)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  JVZoo Transaction ID
                </label>
                <input
                  type="text"
                  value={newBuyer.jvzooTransactionId}
                  onChange={(e) =>
                    setNewBuyer({
                      ...newBuyer,
                      jvzooTransactionId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Paid ($)
                </label>
                <input
                  type="number"
                  value={newBuyer.productPrice}
                  onChange={(e) =>
                    setNewBuyer({
                      ...newBuyer,
                      productPrice: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newBuyer.licenseNotes}
                  onChange={(e) =>
                    setNewBuyer({ ...newBuyer, licenseNotes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  rows={3}
                  placeholder="Internal notes..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddBuyer}
                  disabled={!newBuyer.email || !newBuyer.displayName}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Buyer
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Buyer Modal - Similar structure, will add in next step */}
      {selectedBuyer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedBuyer(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Buyer: {selectedBuyer.displayName}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product License
                </label>
                <select
                  defaultValue={selectedBuyer.productLicense}
                  id="editProductLicense"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="none">None</option>
                  <option value="chat-only">Chat Only ($47)</option>
                  <option value="story-only">Story Only ($97)</option>
                  <option value="complete">Complete ($197)</option>
                  <option value="reseller">Reseller ($497)</option>
                  <option value="dfy">Done-For-You ($997)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  License Status
                </label>
                <select
                  defaultValue={selectedBuyer.licenseStatus}
                  id="editLicenseStatus"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="refunded">Refunded</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  License Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={selectedBuyer.licenseKey || ""}
                    id="editLicenseKey"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm"
                    placeholder="RC-XXXX-XXXX"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "editLicenseKey"
                      ) as HTMLInputElement;
                      if (input) input.value = generateLicenseKey();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  JVZoo Transaction ID
                </label>
                <input
                  type="text"
                  defaultValue={selectedBuyer.jvzooTransactionId || ""}
                  id="editJvzooId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  defaultValue={selectedBuyer.licenseNotes || ""}
                  id="editNotes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    const productLicense = (
                      document.getElementById(
                        "editProductLicense"
                      ) as HTMLSelectElement
                    ).value;
                    const licenseStatus = (
                      document.getElementById(
                        "editLicenseStatus"
                      ) as HTMLSelectElement
                    ).value;
                    const licenseKey = (
                      document.getElementById(
                        "editLicenseKey"
                      ) as HTMLInputElement
                    ).value;
                    const jvzooTransactionId = (
                      document.getElementById("editJvzooId") as HTMLInputElement
                    ).value;
                    const licenseNotes = (
                      document.getElementById("editNotes") as HTMLTextAreaElement
                    ).value;

                    handleUpdateLicense(selectedBuyer.uid, {
                      productLicense,
                      licenseStatus,
                      licenseKey: licenseKey || null,
                      jvzooTransactionId: jvzooTransactionId || null,
                      licenseNotes: licenseNotes || null,
                    });
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

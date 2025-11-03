"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { backendUrl } from "../../lib/config";
import AnalyticsTab from "./components/AnalyticsTab";
interface User {
  uid: string;
  email: string;
  displayName: string;
  plan: "free" | "plus" | "pro";
  messagesUsed: number;
  messageLimit: number;
  imagesUsed: number;
  imageLimit: number;
  voiceCharsUsed: number;
  voiceCharLimit: number;
  subscriptionStatus: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  lastActive: string;
  creditBalance?: number;
  lastCreditRefresh?: string;
}

interface TierConfig {
  plan: "free" | "plus" | "pro";
  messageLimit: number;
  imageLimit: number;
  voiceCharLimit: number;
  price: number;
  features: Array<{ name: string; enabled: boolean }>;
  creditsPerMonth?: number;
  rolloverPercentage?: number;
  creditMultiplier?: number;
  useCreditSystem?: boolean;
}

interface CreditHistory {
  type: string;
  amount: number;
  balance: number;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface Stats {
  totalUsers: number;
  planDistribution: {
    free: number;
    plus: number;
    pro: number;
  };
  activeSubscriptions: number;
  bannedUsers: number;
  anonymousSessions: number;
  revenue: {
    monthly: number;
    yearly: number;
  };
  recentUsers: User[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "tiers" | "tokens" | "analytics"
  >("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPeriod, setTokenPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [tokenStats, setTokenStats] = useState<any>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userModelBreakdown, setUserModelBreakdown] = useState<{
    [key: string]: any;
  }>({});
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditUser, setCreditUser] = useState<User | null>(null);
  const [creditBalance, setCreditBalance] = useState<any>(null);
  const [creditHistory, setCreditHistory] = useState<CreditHistory[]>([]);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState<string>("");
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      loadData();
    }
  }, [loading, isAuthenticated, router]);

  const getAuthHeaders = async () => {
    const { authService } = await import("../../lib/auth/authService");
    const token = await authService.getIdToken();
    setAuthToken(token); // Store token for analytics tab
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();

      const [statsRes, usersRes, tiersRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/stats`, { headers }),
        fetch(`${backendUrl}/api/admin/users?limit=50`, { headers }),
        fetch(`${backendUrl}/api/admin/tiers`, { headers }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !tiersRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const [statsData, usersData, tiersData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        tiersRes.json(),
      ]);

      setStats(statsData);
      setUsers(usersData.users);
      setTiers(tiersData);
      setError(null);
    } catch (err: any) {
      console.error("Load data error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTokenStats = async (period: "daily" | "weekly" | "monthly") => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/token-usage/admin/users?period=${period}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to load token stats");

      const data = await response.json();
      setTokenStats(data);
    } catch (err: any) {
      console.error("Load token stats error:", err);
      setError(err.message || "Failed to load token stats");
    }
  };

  const loadUserModelBreakdown = async (
    userId: string,
    period: "daily" | "weekly" | "monthly"
  ) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/token-usage/admin/user/${userId}?period=${period}`,
        { headers }
      );

      if (!response.ok) throw new Error("Failed to load model breakdown");

      const data = await response.json();
      setUserModelBreakdown((prev) => ({
        ...prev,
        [userId]: data.modelBreakdown,
      }));
    } catch (err: any) {
      console.error("Load model breakdown error:", err);
    }
  };

  const toggleUserExpansion = (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
      if (!userModelBreakdown[userId]) {
        loadUserModelBreakdown(userId, tokenPeriod);
      }
    }
  };

  useEffect(() => {
    if (activeTab === "tokens") {
      loadTokenStats(tokenPeriod);
    }
  }, [activeTab, tokenPeriod]);

  const handleUpdateUserPlan = async (
    uid: string,
    newPlan: "free" | "plus" | "pro"
  ) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${uid}/plan`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ plan: newPlan }),
        }
      );

      if (!response.ok) throw new Error("Failed to update plan");

      await loadData();
      alert("Plan updated successfully");
    } catch (err: any) {
      alert(err.message || "Failed to update plan");
    }
  };

  const handleVerifyEmail = async (uid: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${backendUrl}/api/admin/users/${uid}/verify-email`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error("Failed to verify email");
      // Refresh users list to reflect status
      await loadData();
      alert("User marked as verified in Firebase and DB.");
    } catch (err: any) {
      alert(err.message || "Failed to verify email");
    }
  };

  const handleUpdateUserLimits = async (
    uid: string,
    limits: { messageLimit: number; imageLimit: number; voiceCharLimit: number }
  ) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${uid}/limits`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(limits),
        }
      );

      if (!response.ok) throw new Error("Failed to update limits");

      await loadData();
      setSelectedUser(null);
      alert("Limits updated successfully");
    } catch (err: any) {
      alert(err.message || "Failed to update limits");
    }
  };

  const handleResetUsage = async (uid: string) => {
    if (!confirm("Reset usage for this user?")) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${uid}/reset-usage`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) throw new Error("Failed to reset usage");

      await loadData();
      alert("Usage reset successfully");
    } catch (err: any) {
      alert(err.message || "Failed to reset usage");
    }
  };

  const handleBanUser = async (uid: string, banned: boolean) => {
    if (!confirm(`${banned ? "Ban" : "Unban"} this user?`)) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${backendUrl}/api/admin/users/${uid}/ban`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ banned }),
      });

      if (!response.ok) throw new Error("Failed to update ban status");

      await loadData();
      alert(`User ${banned ? "banned" : "unbanned"} successfully`);
    } catch (err: any) {
      alert(err.message || "Failed to update ban status");
    }
  };

  const handleUpdateTier = async (tier: TierConfig) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/tiers/${tier.plan}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            messageLimit: tier.messageLimit,
            imageLimit: tier.imageLimit,
            voiceCharLimit: tier.voiceCharLimit,
            price: tier.price,
            features: tier.features,
            creditsPerMonth: tier.creditsPerMonth,
            rolloverPercentage: tier.rolloverPercentage,
            creditMultiplier: tier.creditMultiplier,
            useCreditSystem: tier.useCreditSystem,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update tier");

      await loadData();
      setEditingTier(null);
      alert("Tier updated successfully and applied to all users");
    } catch (err: any) {
      alert(err.message || "Failed to update tier");
    }
  };

  const openCreditManagement = async (user: User) => {
    setCreditUser(user);
    setShowCreditModal(true);
    await loadCreditInfo(user.uid);
  };

  const loadCreditInfo = async (uid: string) => {
    try {
      const headers = await getAuthHeaders();
      const [balanceRes, historyRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/users/${uid}/credits`, {
          headers,
        }),
        fetch(`${backendUrl}/api/admin/users/${uid}/credits/history?limit=20`, {
          headers,
        }),
      ]);

      if (balanceRes.ok) {
        const balance = await balanceRes.json();
        setCreditBalance(balance);
      }

      if (historyRes.ok) {
        const history = await historyRes.json();
        setCreditHistory(history.history || []);
      }
    } catch (err: any) {
      console.error("Load credit info error:", err);
    }
  };

  const handleAddCredits = async () => {
    if (!creditUser || creditAmount <= 0) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${creditUser.uid}/credits/add`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            credits: creditAmount,
            reason: creditReason || "Admin adjustment",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add credits");

      await loadCreditInfo(creditUser.uid);
      setCreditAmount(0);
      setCreditReason("");
      alert("Credits added successfully");
    } catch (err: any) {
      alert(err.message || "Failed to add credits");
    }
  };

  const handleDeductCredits = async () => {
    if (!creditUser || creditAmount <= 0) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${creditUser.uid}/credits/deduct`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            credits: creditAmount,
            reason: creditReason || "Admin adjustment",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to deduct credits");

      await loadCreditInfo(creditUser.uid);
      setCreditAmount(0);
      setCreditReason("");
      alert("Credits deducted successfully");
    } catch (err: any) {
      alert(err.message || "Failed to deduct credits");
    }
  };

  const handleRefreshCredits = async () => {
    if (!creditUser) return;

    if (!confirm("Manually refresh credits for this user?")) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${backendUrl}/api/admin/users/${creditUser.uid}/credits/refresh`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to refresh credits");
      }

      await loadCreditInfo(creditUser.uid);
      alert("Credits refreshed successfully");
    } catch (err: any) {
      alert(err.message || "Failed to refresh credits");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = !filterPlan || u.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <span>👑</span>
              <span>Admin Panel</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg transition-all border border-slate-600/50"
              >
                Back to App
              </button>
              <button
                onClick={() => router.push("/admin/settings")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                ⚙️ Site Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-[73px]">
        {/* Sidebar */}
        <aside className="fixed left-0 top-[73px] bottom-0 w-64 bg-slate-950/50 backdrop-blur-xl border-r border-slate-700/50 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">👥</span>
              <span>Users</span>
              <span className="ml-auto bg-slate-700/50 px-2 py-0.5 rounded-full text-xs">
                {users.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("tiers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                activeTab === "tiers"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">⚙️</span>
              <span>Tier Config</span>
            </button>
            <button
              onClick={() => setActiveTab("tokens")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                activeTab === "tokens"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">🔢</span>
              <span>Token Usage</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="text-xl">📈</span>
              <span>Analytics</span>
            </button>

            {/* Divider */}
            <div className="border-t border-slate-700/50 my-4"></div>

            {/* Quick Actions */}
            <div className="px-2 py-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">Quick Actions</p>
              <button
                onClick={() => router.push("/admin/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all text-left text-sm"
              >
                <span className="text-lg">⚙️</span>
                <span>Site Settings</span>
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all text-left text-sm"
              >
                <span className="text-lg">🏠</span>
                <span>Back to App</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-8 py-6 overflow-y-auto min-h-[calc(100vh-73px)]">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl shadow-blue-500/20 border border-blue-400/20">
                <div className="text-blue-100 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  Total Users
                </div>
                <div className="text-4xl font-bold text-white">
                  {stats.totalUsers}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl shadow-emerald-500/20 border border-emerald-400/20">
                <div className="text-emerald-100 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  Active Subscriptions
                </div>
                <div className="text-4xl font-bold text-white">
                  {stats.activeSubscriptions}
                </div>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 shadow-xl shadow-violet-500/20 border border-violet-400/20">
                <div className="text-violet-100 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  Monthly Revenue
                </div>
                <div className="text-4xl font-bold text-white">
                  ${stats.revenue.monthly.toFixed(2)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl shadow-amber-500/20 border border-amber-400/20">
                <div className="text-amber-100 text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  Anonymous Sessions
                </div>
                <div className="text-4xl font-bold text-white">
                  {stats.anonymousSessions}
                </div>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Plan Distribution
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">
                  <div className="text-3xl font-bold text-slate-400 mb-1">
                    {stats.planDistribution.free}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Free</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-4 border border-blue-500/30 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {stats.planDistribution.plus}
                  </div>
                  <div className="text-sm text-blue-300 font-medium">Plus</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {stats.planDistribution.pro}
                  </div>
                  <div className="text-sm text-purple-300 font-medium">Pro</div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🆕</span>
                Recent Sign-ups
              </h3>
              <div className="space-y-3">
                {stats.recentUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="flex items-center justify-between py-3 px-4 bg-slate-900/30 rounded-xl border border-slate-700/30 hover:bg-slate-900/50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {u.displayName}
                      </div>
                      <div className="text-sm text-slate-400">{u.email}</div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        u.plan === 'free' ? 'bg-slate-700/50 text-slate-300' :
                        u.plan === 'plus' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {u.plan}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
            {/* Search & Filter */}
            <div className="p-6 border-b border-slate-700/50 space-y-4">
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900/50 text-white placeholder-slate-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterPlan("")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    !filterPlan
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPlan("free")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterPlan === "free"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setFilterPlan("plus")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterPlan === "plus"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Plus
                </button>
                <button
                  onClick={() => setFilterPlan("pro")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterPlan === "pro"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Pro
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-slate-700/30">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-semibold text-white">
                            {user.displayName}
                          </div>
                          <div className="text-sm text-slate-400">
                            {user.email}
                          </div>
                          {user.isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded border border-red-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            user.plan === "free"
                              ? "bg-slate-700/50 text-slate-300"
                              : user.plan === "plus"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          }`}
                        >
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.plan !== "free" &&
                        user.creditBalance !== undefined ? (
                          <div className="text-sm">
                            <div className="font-semibold text-emerald-400">
                              {user.creditBalance} Credits
                            </div>
                            <div className="text-xs text-slate-500">
                              ${(user.creditBalance / 100).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1 text-slate-300">
                          <div>
                            💬 {user.messagesUsed}/{user.messageLimit}
                          </div>
                          <div>
                            🖼️ {user.imagesUsed}/{user.imageLimit}
                          </div>
                          <div>
                            🎤 {(user.voiceCharsUsed / 1000).toFixed(0)}K/
                            {user.voiceCharLimit / 1000}K
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isBanned ? (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded border border-red-500/30">
                            Banned
                          </span>
                        ) : user.subscriptionStatus === "active" ? (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded border border-emerald-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs font-semibold rounded">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-1">
                          <div>
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-400 hover:text-blue-300 mr-3"
                            >
                              Edit
                            </button>
                            {!user.emailVerified && (
                              <button
                                onClick={() => handleVerifyEmail(user.uid)}
                                className="text-amber-400 hover:text-amber-300 mr-3"
                              >
                                Verify Email
                              </button>
                            )}
                            <button
                              onClick={() => handleResetUsage(user.uid)}
                              className="text-emerald-400 hover:text-emerald-300 mr-3"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() =>
                                handleBanUser(user.uid, !user.isBanned)
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              {user.isBanned ? "Unban" : "Ban"}
                            </button>
                          </div>
                          {user.plan !== "free" && (
                            <button
                              onClick={() => openCreditManagement(user)}
                              className="text-purple-400 hover:text-purple-300 text-xs font-semibold"
                            >
                              💳 Manage Credits
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === "tiers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.plan}
                className="bg-white rounded-2xl shadow-lg p-6 text-gray-900"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 capitalize text-gray-900">
                  {tier.plan}
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-6 text-gray-900">
                  ${tier.price}
                  <span className="text-lg text-gray-600">/mo</span>
                </div>

                {editingTier?.plan === tier.plan ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingTier.price}
                        onChange={(e) =>
                          setEditingTier({
                            ...editingTier,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Credits/Month
                      </label>
                      <input
                        type="number"
                        value={editingTier.creditsPerMonth || 0}
                        onChange={(e) =>
                          setEditingTier({
                            ...editingTier,
                            creditsPerMonth: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        1 credit = $0.01 USD
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Rollover %
                      </label>
                      <input
                        type="number"
                        value={editingTier.rolloverPercentage || 50}
                        onChange={(e) =>
                          setEditingTier({
                            ...editingTier,
                            rolloverPercentage: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Credit Multiplier (Markup)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="10"
                        value={editingTier.creditMultiplier || 3}
                        onChange={(e) =>
                          setEditingTier({
                            ...editingTier,
                            creditMultiplier: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Multiply API cost by this value (e.g., 3x, 4x, 5x)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingTier.useCreditSystem || false}
                        onChange={(e) =>
                          setEditingTier({
                            ...editingTier,
                            useCreditSystem: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-semibold text-gray-700">
                        Use Credit System
                      </label>
                    </div>
                    {!editingTier.useCreditSystem && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Messages/Month
                          </label>
                          <input
                            type="number"
                            value={editingTier.messageLimit}
                            onChange={(e) =>
                              setEditingTier({
                                ...editingTier,
                                messageLimit: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Images/Month
                          </label>
                          <input
                            type="number"
                            value={editingTier.imageLimit}
                            onChange={(e) =>
                              setEditingTier({
                                ...editingTier,
                                imageLimit: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Voice Chars/Month
                          </label>
                          <input
                            type="number"
                            value={editingTier.voiceCharLimit}
                            onChange={(e) =>
                              setEditingTier({
                                ...editingTier,
                                voiceCharLimit: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateTier(editingTier)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTier(null)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tier.useCreditSystem ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Credits/Month:</span>
                          <span className="font-semibold text-green-600">
                            {tier.creditsPerMonth} credits
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Value:</span>
                          <span className="font-semibold">
                            ${((tier.creditsPerMonth || 0) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rollover:</span>
                          <span className="font-semibold">
                            {tier.rolloverPercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Markup:</span>
                          <span className="font-semibold text-purple-600">
                            {tier.creditMultiplier || 3}x
                          </span>
                        </div>
                        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                          <strong>Credit System</strong> - Usage charged at {tier.creditMultiplier || 3}x API cost
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Messages:</span>
                          <span className="font-semibold">
                            {tier.messageLimit.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Images:</span>
                          <span className="font-semibold">
                            {tier.imageLimit}/mo
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Voice:</span>
                          <span className="font-semibold">
                            {tier.voiceCharLimit / 1000}K chars/mo
                          </span>
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => setEditingTier({ ...tier })}
                      className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      Edit Tier
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Token Usage Tab */}
        {activeTab === "tokens" && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Token Usage Analytics
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTokenPeriod("daily")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    tokenPeriod === "daily"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTokenPeriod("weekly")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    tokenPeriod === "weekly"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTokenPeriod("monthly")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    tokenPeriod === "monthly"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Token Stats Table */}
            {tokenStats && tokenStats.users && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    User Token Usage ({tokenStats.totalUsers} users)
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Period:{" "}
                    {tokenStats.dateRange?.start
                      ? new Date(
                          tokenStats.dateRange.start
                        ).toLocaleDateString()
                      : ""}{" "}
                    -
                    {tokenStats.dateRange?.end
                      ? new Date(tokenStats.dateRange.end).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Input Tokens
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Output Tokens
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Tokens
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Models
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tokenStats.users.map((user: any) => (
                        <React.Fragment key={user._id}>
                          <tr
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleUserExpansion(user._id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">
                                  {expandedUserId === user._id ? "▼" : "▶"}
                                </span>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {user.userEmail || user._id.substring(0, 8) + "..."}
                                  </div>
                                  {user.userEmail && (
                                    <div className="text-xs text-gray-500">
                                      {user._id.substring(0, 8)}...
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.requestCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.totalInputTokens.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.totalOutputTokens.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {user.totalTokens.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ${user.totalCost.toFixed(6)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                              {expandedUserId === user._id
                                ? "See below ↓"
                                : "Click to view"}
                            </td>
                          </tr>
                          {expandedUserId === user._id &&
                            userModelBreakdown[user._id] && (
                              <tr
                                key={`${user._id}-details`}
                                className="bg-blue-50"
                              >
                                <td colSpan={7} className="px-6 py-4">
                                  <div className="text-sm font-semibold text-gray-700 mb-2">
                                    Model Usage Breakdown:
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-900">
                                    {userModelBreakdown[user._id].map(
                                      (model: any) => (
                                        <div
                                          key={model._id}
                                          className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                                        >
                                          <div className="font-bold text-purple-700 mb-1">
                                            {model._id}
                                          </div>
                                          <div className="text-xs space-y-1">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">
                                                Requests:
                                              </span>
                                              <span className="font-semibold">
                                                {model.requestCount}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">
                                                Input:
                                              </span>
                                              <span className="font-semibold">
                                                {model.totalInputTokens.toLocaleString()}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">
                                                Output:
                                              </span>
                                              <span className="font-semibold">
                                                {model.totalOutputTokens.toLocaleString()}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">
                                                Total:
                                              </span>
                                              <span className="font-semibold text-gray-900">
                                                {model.totalTokens.toLocaleString()}
                                              </span>
                                            </div>
                                            <div className="flex justify-between border-t pt-1">
                                              <span className="text-gray-600">
                                                Cost:
                                              </span>
                                              <span className="font-semibold text-green-600">
                                                ${model.totalCost.toFixed(6)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!tokenStats && (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <div className="text-gray-400 text-xl">
                  Loading token usage data...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Credit Management Modal */}
        {showCreditModal && creditUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreditModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💳 Credit Management: {creditUser.displayName}
            </h2>

            {/* Credit Balance */}
            {creditBalance && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 font-semibold mb-1">
                      Current Balance
                    </div>
                    <div className="text-4xl font-bold text-green-600">
                      {creditBalance.balance} Credits
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${creditBalance.balanceUSD.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      Plan:{" "}
                      <span className="font-semibold capitalize">
                        {creditBalance.plan}
                      </span>
                    </div>
                    {creditBalance.lastRefresh && (
                      <div className="text-xs text-gray-600 mt-1">
                        Last Refresh:{" "}
                        {new Date(
                          creditBalance.lastRefresh
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Add/Deduct Credits */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Adjust Credits
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount (credits)
                    </label>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) =>
                        setCreditAmount(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="Enter credits"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      = ${(creditAmount / 100).toFixed(2)} USD
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason
                    </label>
                    <input
                      type="text"
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="Admin adjustment"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCredits}
                      disabled={creditAmount <= 0}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Credits
                    </button>
                    <button
                      onClick={handleDeductCredits}
                      disabled={creditAmount <= 0}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deduct Credits
                    </button>
                  </div>
                </div>
              </div>

              {/* Manual Refresh */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleRefreshCredits}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    🔄 Manual Credit Refresh
                  </button>
                  <div className="text-xs text-gray-600 bg-white rounded-lg p-3">
                    <strong>Note:</strong> Manual refresh will apply 50%
                    rollover from current balance and add new monthly credits
                    based on their plan.
                  </div>
                </div>
              </div>
            </div>

            {/* Credit History */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Recent Credit History
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {creditHistory.length > 0 ? (
                  creditHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            entry.type === "usage" ||
                            entry.type === "image_generation"
                              ? "bg-red-100 text-red-700"
                              : entry.type === "admin_add" ||
                                entry.type === "refresh" ||
                                entry.type === "rollover"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {entry.type.replace("_", " ").toUpperCase()}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            entry.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {entry.amount >= 0 ? "+" : ""}
                          {entry.amount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {entry.description}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          Balance: {entry.balance}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No credit history available
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowCreditModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <AnalyticsTab authToken={authToken} />
          </div>
        )}

        </main>
      </div>

      {/* Modals - Outside main layout */}
      {/* User Edit Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit User: {selectedUser.displayName}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  value={selectedUser.plan}
                  onChange={(e) =>
                    handleUpdateUserPlan(
                      selectedUser.uid,
                      e.target.value as any
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="free">Free</option>
                  <option value="plus">Plus</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message Limit
                </label>
                <input
                  type="number"
                  defaultValue={selectedUser.messageLimit}
                  id="messageLimit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image Limit
                </label>
                <input
                  type="number"
                  defaultValue={selectedUser.imageLimit}
                  id="imageLimit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Voice Character Limit
                </label>
                <input
                  type="number"
                  defaultValue={selectedUser.voiceCharLimit}
                  id="voiceCharLimit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    const messageLimit = parseInt(
                      (
                        document.getElementById(
                          "messageLimit"
                        ) as HTMLInputElement
                      ).value
                    );
                    const imageLimit = parseInt(
                      (
                        document.getElementById(
                          "imageLimit"
                        ) as HTMLInputElement
                      ).value
                    );
                    const voiceCharLimit = parseInt(
                      (
                        document.getElementById(
                          "voiceCharLimit"
                        ) as HTMLInputElement
                      ).value
                    );
                    handleUpdateUserLimits(selectedUser.uid, {
                      messageLimit,
                      imageLimit,
                      voiceCharLimit,
                    });
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Save Limits
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
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

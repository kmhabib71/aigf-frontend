"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DemoStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRecurring: number;
  growthRate: number;
  totalStories: number;
  totalChats: number;
  avgSessionTime: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  joinedDate: Date;
  lastActive: Date;
  totalSpent: number;
  status: "active" | "inactive" | "trial";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DemoStats>({
    totalUsers: 1047,
    activeUsers: 723,
    totalRevenue: 89750,
    monthlyRecurring: 10470,
    growthRate: 34.2,
    totalStories: 12847,
    totalChats: 89521,
    avgSessionTime: 47
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Emma Wilson",
      email: "emma.w@example.com",
      plan: "Premium",
      joinedDate: new Date("2024-01-15"),
      lastActive: new Date(),
      totalSpent: 225,
      status: "active"
    },
    {
      id: "2",
      name: "James Chen",
      email: "j.chen@example.com",
      plan: "Premium",
      joinedDate: new Date("2024-02-01"),
      lastActive: new Date(Date.now() - 3600000),
      totalSpent: 195,
      status: "active"
    },
    {
      id: "3",
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      plan: "Premium",
      joinedDate: new Date("2024-01-20"),
      lastActive: new Date(Date.now() - 7200000),
      totalSpent: 210,
      status: "active"
    },
    {
      id: "4",
      name: "Michael Brown",
      email: "m.brown@example.com",
      plan: "Basic",
      joinedDate: new Date("2024-02-28"),
      lastActive: new Date(Date.now() - 86400000),
      totalSpent: 120,
      status: "active"
    },
    {
      id: "5",
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      plan: "Basic",
      joinedDate: new Date("2024-03-05"),
      lastActive: new Date(Date.now() - 172800000),
      totalSpent: 100,
      status: "active"
    },
    {
      id: "6",
      name: "David Martinez",
      email: "d.martinez@example.com",
      plan: "Premium",
      joinedDate: new Date("2024-01-10"),
      lastActive: new Date(Date.now() - 14400000),
      totalSpent: 240,
      status: "active"
    },
    {
      id: "7",
      name: "Jessica Lee",
      email: "jessica.l@example.com",
      plan: "Basic",
      joinedDate: new Date("2024-02-20"),
      lastActive: new Date(Date.now() - 28800000),
      totalSpent: 110,
      status: "active"
    },
    {
      id: "8",
      name: "Robert Taylor",
      email: "r.taylor@example.com",
      plan: "Premium",
      joinedDate: new Date("2024-01-05"),
      lastActive: new Date(Date.now() - 43200000),
      totalSpent: 255,
      status: "active"
    },
    {
      id: "9",
      name: "Amanda White",
      email: "a.white@example.com",
      plan: "Trial",
      joinedDate: new Date("2024-03-15"),
      lastActive: new Date(Date.now() - 86400000),
      totalSpent: 0,
      status: "trial"
    },
    {
      id: "10",
      name: "Chris Johnson",
      email: "c.johnson@example.com",
      plan: "Basic",
      joinedDate: new Date("2024-03-01"),
      lastActive: new Date(Date.now() - 259200000),
      totalSpent: 90,
      status: "active"
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "revenue" | "content" | "settings">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Fetch stats
        const statsRes = await fetch(`${apiUrl}/api/demo/admin/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        // Fetch users
        const usersRes = await fetch(`${apiUrl}/api/demo/admin/users`);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users.map((u: any) => ({
            ...u,
            joinedDate: new Date(u.joined),
            lastActive: new Date(),
            totalSpent: u.revenue,
            status: u.status.toLowerCase() as "active" | "inactive" | "trial"
          })));
        }
      } catch (error) {
        console.error('Error fetching demo data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-2xl font-black text-white">
                Admin Dashboard
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">Live</span>
            </div>
            <Link
              href="/demo"
              className="px-6 py-2 border-2 border-slate-700 text-gray-300 font-semibold rounded-lg hover:border-purple-500 transition-all"
            >
              Exit Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/50 min-h-screen p-6">
          <nav className="space-y-2">
            {[
              { id: "overview", icon: "📊", label: "Overview" },
              { id: "users", icon: "👥", label: "Users" },
              { id: "revenue", icon: "💰", label: "Revenue" },
              { id: "content", icon: "📝", label: "Content" },
              { id: "settings", icon: "⚙️", label: "Settings" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Quick Stats</div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-black text-white">
                  {stats.activeUsers}
                </div>
                <div className="text-xs text-gray-500">Active Now</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-400">
                  ${(stats.monthlyRecurring).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">MRR</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-8">
              <div>
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-bold text-white">Demo Dashboard - Sample Data</div>
                      <div className="text-sm text-gray-400">
                        This shows what YOUR dashboard will look like with 1,000+ subscribers generating $10K+/month
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-400">
                  Welcome to your control center. Monitor performance, users, and revenue in real-time.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      +{stats.growthRate}%
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    {stats.totalUsers}
                  </div>
                  <div className="text-gray-400 text-sm">Total Users</div>
                </div>

                {/* Active Users */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    {stats.activeUsers}
                  </div>
                  <div className="text-gray-400 text-sm">Active Users</div>
                </div>

                {/* Total Revenue */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      +18%
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    ${(stats.totalRevenue).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Total Revenue</div>
                </div>

                {/* MRR */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      +{stats.growthRate}%
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    ${(stats.monthlyRecurring).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Monthly Recurring</div>
                </div>
              </div>

              {/* Content Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-2xl font-black text-white mb-1">
                    {stats.totalStories.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Stories Generated</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-2xl font-black text-white mb-1">
                    {stats.totalChats.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Chat Messages</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-2xl font-black text-white mb-1">
                    {stats.avgSessionTime} min
                  </div>
                  <div className="text-gray-400 text-sm">Avg Session Time</div>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Revenue Growth (Last 30 Days)
                </h3>
                <div className="h-64 bg-gradient-to-t from-purple-500/10 to-transparent rounded-xl border border-purple-500/20 flex items-end justify-center p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-400">
                      Chart visualization would appear here
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      (In production: Real-time revenue charts)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black text-white mb-2">
                    User Management
                  </h1>
                  <p className="text-gray-400">
                    Manage and monitor all platform users
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                  + Add User
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-950/50 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Plan</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Last Active</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Total Spent</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-all">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-white">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.plan === "Premium" ? "bg-purple-500/20 text-purple-400" :
                              user.plan === "Basic" ? "bg-blue-500/20 text-blue-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {user.joinedDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {user.lastActive.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">
                            ${user.totalSpent}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-2 ${
                              user.status === "active" ? "text-green-400" :
                              user.status === "trial" ? "text-yellow-400" :
                              "text-gray-500"
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                user.status === "active" ? "bg-green-400" :
                                user.status === "trial" ? "bg-yellow-400" :
                                "bg-gray-500"
                              }`}></div>
                              <span className="text-sm font-semibold capitalize">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {selectedTab === "revenue" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white mb-2">
                Revenue & Payments
              </h1>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">This Month</div>
                  <div className="text-3xl font-black text-white">
                    ${(stats.monthlyRecurring).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">All Time</div>
                  <div className="text-3xl font-black text-white">
                    ${(stats.totalRevenue).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Growth Rate</div>
                  <div className="text-3xl font-black text-green-400">
                    +{stats.growthRate}%
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Payment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Credit Cards</div>
                        <div className="text-sm text-gray-400">Stripe Integration</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">
                      Active
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">₿</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Cryptocurrency</div>
                        <div className="text-sm text-gray-400">Crypto Payments</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">
                      Active
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Adult Payments</div>
                        <div className="text-sm text-gray-400">CCBill Integration</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Tiers */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Subscription Tiers</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="text-lg font-bold text-white mb-2">Free Tier</div>
                    <div className="text-3xl font-black text-white mb-4">$0</div>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>✓ 10 messages/day</li>
                      <li>✓ 1 story/week</li>
                      <li>✓ Basic features</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-xl p-6">
                    <div className="text-lg font-bold text-white mb-2">Basic</div>
                    <div className="text-3xl font-black text-white mb-4">$10/mo</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Unlimited messages</li>
                      <li>✓ 5 stories/week</li>
                      <li>✓ All features</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-pink-500 rounded-xl p-6">
                    <div className="text-lg font-bold text-white mb-2">Premium</div>
                    <div className="text-3xl font-black text-white mb-4">$15/mo</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Everything in Basic</li>
                      <li>✓ Unlimited stories</li>
                      <li>✓ Priority support</li>
                      <li>✓ Exclusive content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {selectedTab === "content" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white mb-2">
                Content Analytics
              </h1>
              <p className="text-gray-400 mb-6">
                Track story generation, chat activity, and interactive feature usage
              </p>

              {/* Interactive Features Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Stories Generated</div>
                  <div className="text-3xl font-black text-white mb-1">
                    {stats.totalStories.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-400">+42% this month</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Line Images</div>
                  <div className="text-3xl font-black text-purple-400 mb-1">
                    24,892
                  </div>
                  <div className="text-xs text-green-400">Interactive feature</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Character Chats</div>
                  <div className="text-3xl font-black text-pink-400 mb-1">
                    15,247
                  </div>
                  <div className="text-xs text-green-400">After story reads</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Story Continues</div>
                  <div className="text-3xl font-black text-cyan-400 mb-1">
                    8,394
                  </div>
                  <div className="text-xs text-green-400">User-extended</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Romantic Stories</span>
                      <span className="text-white font-semibold">7,892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Adventure Stories</span>
                      <span className="text-white font-semibold">3,251</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Fantasy Stories</span>
                      <span className="text-white font-semibold">1,704</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Regular Chat Sessions</span>
                      <span className="text-white font-semibold">89,521</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Messages/User</span>
                      <span className="text-white font-semibold">347</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Stories/User</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Session Time</span>
                      <span className="text-white font-semibold">{stats.avgSessionTime} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">12-Month Retention</span>
                      <span className="text-green-400 font-semibold">91%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Features Impact */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🎯 Interactive Features Impact
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-400 mb-1">6.2x</div>
                    <div className="text-sm text-gray-300">Engagement increase with line images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-pink-400 mb-1">4.7x</div>
                    <div className="text-sm text-gray-300">Session time with character chat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-cyan-400 mb-1">91%</div>
                    <div className="text-sm text-gray-300">Users who continue stories</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-500/20 text-center text-gray-400 text-sm">
                  Interactive features drive 12+ month retention vs 2-3 months industry average
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {selectedTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-black text-white mb-2">
                Platform Settings
              </h1>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">General Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="AI Companion Platform"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@example.com"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Maintenance Mode</div>
                      <div className="text-sm text-gray-400">Temporarily disable public access</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Email Notifications</div>
                      <div className="text-sm text-gray-400">Send admin email notifications</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all">
                    Save Settings
                  </button>
                </div>
              </div>

              {/* Content Moderation */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Content Moderation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Auto-Moderation</div>
                      <div className="text-sm text-gray-400">Automatically filter inappropriate content</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <div className="font-semibold text-white">Rate Limiting</div>
                      <div className="text-sm text-gray-400">Prevent spam and abuse</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

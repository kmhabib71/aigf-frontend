import React, { useState, useEffect } from 'react';
import { backendUrl } from '../../../lib/config';

interface AnalyticsTabProps {
  authToken: string | null;
}

export default function AnalyticsTab({ authToken }: AnalyticsTabProps) {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [costData, setCostData] = useState<any>(null);
  const [activeView, setActiveView] = useState<'overview' | 'costs' | 'realtime'>('overview');

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchRealtime, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [period]);

  const fetchAnalytics = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    try {
      setLoading(true);

      const [dashboardRes, realtimeRes, costsRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/analytics/dashboard?period=${period}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(`${backendUrl}/api/admin/analytics/realtime`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(`${backendUrl}/api/admin/analytics/costs?period=${period}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      // Check if responses are OK
      if (!dashboardRes.ok || !realtimeRes.ok || !costsRes.ok) {
        console.error('API Error:', {
          dashboard: dashboardRes.status,
          realtime: realtimeRes.status,
          costs: costsRes.status,
        });
        throw new Error('Failed to fetch analytics data');
      }

      const [dashboard, realtime, costs] = await Promise.all([
        dashboardRes.json(),
        realtimeRes.json(),
        costsRes.json(),
      ]);

      setDashboardData(dashboard);
      setRealtimeData(realtime);
      setCostData(costs);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      alert('Failed to load analytics. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/analytics/realtime`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      setRealtimeData(data);
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  };

  const exportData = async (type: 'usage' | 'users' | 'stories') => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/analytics/export?type=${type}&period=${period}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${period}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 text-sm">Real-time insights and usage statistics</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* View Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('costs')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'costs'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Costs
            </button>
            <button
              onClick={() => setActiveView('realtime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'realtime'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Real-time
            </button>
          </div>

          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          {/* Export Button */}
          <div className="relative group">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => exportData('usage')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                Export Usage Data
              </button>
              <button
                onClick={() => exportData('users')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Export Users
              </button>
              <button
                onClick={() => exportData('stories')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                Export Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && dashboardData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100 text-sm font-medium">Total Requests</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatNumber(dashboardData.summary.totalRequests)}
              </div>
              <div className="text-purple-100 text-sm">
                {formatNumber(dashboardData.summary.activeUsers)} active users
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-pink-100 text-sm font-medium">Total Cost</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatCost(dashboardData.summary.totalCost)}
              </div>
              <div className="text-pink-100 text-sm">
                Avg: {formatCost(dashboardData.summary.avgCostPerRequest)}/req
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-100 text-sm font-medium">Total Tokens</span>
                <span className="text-2xl">🔢</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatNumber(dashboardData.summary.totalTokens)}
              </div>
              <div className="text-cyan-100 text-sm">
                {formatNumber(dashboardData.summary.avgTokensPerRequest)} avg/req
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-100 text-sm font-medium">Images Generated</span>
                <span className="text-2xl">🎨</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatNumber(dashboardData.summary.totalImages)}
              </div>
              <div className="text-orange-100 text-sm">
                {dashboardData.summary.storiesCreated} stories created
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Model Usage</h3>
              <div className="space-y-3">
                {dashboardData.charts.modelStats.map((model: any) => (
                  <div key={model._id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700">{model._id}</span>
                      <span className="text-gray-600">
                        {formatNumber(model.requestCount)} requests
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${(model.requestCount / dashboardData.charts.modelStats[0].requestCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        {formatCost(model.totalCost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Type Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Request Types</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {dashboardData.charts.requestTypeStats.map((type: any) => (
                  <div key={type._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{type._id}</div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(type.count)} requests • {formatNumber(type.totalTokens)} tokens
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-600">
                        {formatCost(type.totalCost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Users by Cost</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.topUsers.map((user: any) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{user.userEmail || user._id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(user.requestCount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(user.totalTokens)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(user.imagesGenerated)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-600">
                        {formatCost(user.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Costs View */}
      {activeView === 'costs' && costData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Cost</div>
              <div className="text-3xl font-bold text-gray-900">{formatCost(costData.summary.totalCost)}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Input Cost</div>
              <div className="text-3xl font-bold text-gray-900">{formatCost(costData.summary.inputCost)}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Output Cost</div>
              <div className="text-3xl font-bold text-gray-900">{formatCost(costData.summary.outputCost)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost by Model</h3>
              <div className="space-y-3">
                {costData.breakdown.byModel.map((model: any) => (
                  <div key={model._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{model._id}</div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(model.requests)} requests • Avg: {formatCost(model.avgCostPerRequest)}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{formatCost(model.totalCost)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cost by Request Type</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {costData.breakdown.byType.map((type: any) => (
                  <div key={type._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{type._id}</div>
                      <div className="text-xs text-gray-500">
                        {formatNumber(type.requests)} requests • Avg: {formatCost(type.avgCostPerRequest)}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{formatCost(type.totalCost)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Realtime View */}
      {activeView === 'realtime' && realtimeData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm text-green-100 mb-1">Last Hour</div>
              <div className="text-3xl font-bold mb-2">{formatNumber(realtimeData.lastHour.requests)}</div>
              <div className="text-green-100 text-sm">
                {realtimeData.lastHour.activeUsers} active • {formatCost(realtimeData.lastHour.cost)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm text-blue-100 mb-1">Last 24 Hours</div>
              <div className="text-3xl font-bold mb-2">{formatNumber(realtimeData.last24Hours.requests)}</div>
              <div className="text-blue-100 text-sm">
                Cost: {formatCost(realtimeData.last24Hours.cost)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="text-sm text-indigo-100 mb-1">Auto-refresh</div>
              <div className="text-2xl font-bold mb-2">30s</div>
              <div className="text-indigo-100 text-sm">Live monitoring active</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Requests (Live)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {realtimeData.recentRequests.map((req: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono text-xs">
                        {req.userId.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{req.requestType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{req.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatNumber(req.totalTokens)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-600">
                        {formatCost(req.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

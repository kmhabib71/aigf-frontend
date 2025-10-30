"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { backendUrl } from "../../../lib/config";
import { useAuth } from "../../../contexts/AuthContext";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  locationTimezone: string;
  linkedInUrl: string;
  currentSituation: string;
  marketingExperience: string;
  whyPartnership: string;
  investmentReadiness: string;
  heardAbout: string;
  additionalInfo?: string;
  status: string;
  reviewerNotes?: string;
  createdAt: string;
}

export default function SuperAdminPartnershipsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  const getAuthHeaders = async () => {
    const { authService } = await import("../../../lib/auth/authService");
    const token = await authService.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  const load = async () => {
    try {
      setIsLoading(true);
      const headers = await getAuthHeaders();
      const url = new URL(`${backendUrl}/api/super-admin/partnerships`);
      if (q) url.searchParams.set("q", q);
      if (status) url.searchParams.set("status", status);
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApps(data.applications || []);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const updateApp = async (id: string, updates: Partial<Application>) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${backendUrl}/api/super-admin/partnerships/${id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Update failed");
    await load();
  };

  const statusOptions = [
    "new",
    "contacted",
    "qualified",
    "scheduled",
    "closed-won",
    "closed-lost",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold">Partnership Applications</h1>
          <div className="flex gap-3">
            <button onClick={() => router.push("/super-admin")} className="px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30">Back</button>
            <button onClick={load} className="px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/30">Refresh</button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, LinkedIn" className="rounded-xl px-4 py-2.5 bg-white text-gray-900" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl px-4 py-2.5 bg-white text-gray-900">
              <option value="">All Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={load} className="rounded-xl px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold">Filter</button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-white">Loading…</div>
        ) : error ? (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {apps.map((a) => (
              <div key={a._id} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{a.fullName}</div>
                    <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <select
                    value={a.status}
                    onChange={async (e) => updateApp(a._id, { status: e.target.value as any })}
                    className="rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-semibold"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="truncate"><span className="font-semibold">Email:</span> {a.email}</div>
                  {a.phone && <div className="truncate"><span className="font-semibold">Phone:</span> {a.phone}</div>}
                  <div className="truncate"><span className="font-semibold">LinkedIn:</span> <a className="text-indigo-600" href={a.linkedInUrl} target="_blank" rel="noreferrer">{a.linkedInUrl}</a></div>
                  <div><span className="font-semibold">Location:</span> {a.locationTimezone}</div>
                  <div><span className="font-semibold">Situation:</span> {a.currentSituation}</div>
                  <div><span className="font-semibold">Investment:</span> {a.investmentReadiness}</div>
                </div>
                <details className="rounded-lg bg-gray-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700">View Responses</summary>
                  <div className="mt-2 text-sm text-gray-700 space-y-2">
                    <div>
                      <div className="font-semibold">Marketing Experience</div>
                      <p className="whitespace-pre-wrap">{a.marketingExperience}</p>
                    </div>
                    <div>
                      <div className="font-semibold">Why This Partnership?</div>
                      <p className="whitespace-pre-wrap">{a.whyPartnership}</p>
                    </div>
                    {a.additionalInfo && (
                      <div>
                        <div className="font-semibold">Additional Info</div>
                        <p className="whitespace-pre-wrap">{a.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </details>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reviewer Notes</label>
                  <textarea
                    defaultValue={a.reviewerNotes || ""}
                    onBlur={async (e) => updateApp(a._id, { reviewerNotes: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


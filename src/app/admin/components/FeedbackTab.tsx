"use client";

import React, { useEffect, useMemo, useState } from "react";
import { backendUrl } from "@/lib/config";

type Item = {
  _id: string;
  uid: string | null;
  plan: "free" | "plus" | "pro" | null;
  email?: string | null;
  rating: number;
  text: string;
  path?: string | null;
  createdAt: string;
};

export default function FeedbackTab({ authToken }: { authToken: string | null }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [plan, setPlan] = useState<string>("");
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (plan) params.set("plan", plan);
      const res = await fetch(`${backendUrl}/api/feedback/admin/list?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to load feedback");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, plan]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">User Feedback</h3>
          <span className="text-slate-400 text-sm">{total} total</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-slate-900/50 text-white border border-slate-700/60 rounded-lg px-3 py-2"
            value={plan}
            onChange={(e) => { setPlan(e.target.value); setPage(1); }}
          >
            <option value="">All plans</option>
            <option value="free">Free</option>
            <option value="plus">Plus</option>
            <option value="pro">Pro</option>
          </select>
          <button
            onClick={() => load()}
            className="px-3 py-2 rounded-lg bg-slate-700/60 text-white hover:bg-slate-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-700/40">
        {loading && (
          <div className="p-6 text-slate-400">Loading feedback…</div>
        )}
        {error && (
          <div className="p-6 text-red-400">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="p-6 text-slate-400">No feedback yet.</div>
        )}
        {items.map((f) => (
          <div key={f._id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < f.rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                  ))}
                </div>
                <span className="text-slate-400 text-sm">{new Date(f.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-xs font-semibold px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                {f.plan || 'anon'}
              </div>
            </div>
            <div className="mt-2 text-slate-200 whitespace-pre-wrap">{f.text}</div>
            <div className="mt-2 text-xs text-slate-400 flex gap-4">
              {f.email && <span>Email: {f.email}</span>}
              {f.uid && <span>UID: {f.uid}</span>}
              {f.path && <span>Path: {f.path}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-slate-300">
        <button disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))} className="px-3 py-1.5 rounded-lg bg-slate-700/60 disabled:opacity-50">Prev</button>
        <div className="text-sm">Page {page} / {totalPages}</div>
        <button disabled={page>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} className="px-3 py-1.5 rounded-lg bg-slate-700/60 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}


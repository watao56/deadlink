"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/scan/instant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "スキャンに失敗しました");
      router.push(`/scan/${data.reportId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleScan} className="w-full max-w-2xl mx-auto">
      <div className="relative flex gap-3 p-2 bg-surface-200 rounded-2xl border border-surface-300/50 focus-within:border-brand-500/50 transition-all focus-within:shadow-lg focus-within:shadow-brand-500/10">
        <div className="flex-1 flex items-center gap-3 pl-4">
          <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 focus:outline-none text-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              スキャン中...
            </span>
          ) : (
            "スキャン"
          )}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-danger text-sm bg-danger/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}
    </form>
  );
}

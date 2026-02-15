"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

interface ScanResult {
  link_url: string;
  source_page: string;
  status_code: number;
  status: string;
  anchor_text: string;
  link_type?: string;
}

interface Report {
  site_id: string;
  scanned_at: string;
  total_links: number;
  broken_links: number;
  redirected_links: number;
  status: string;
  results: ScanResult[];
  url?: string;
  pages_scanned?: number;
  duration_ms?: number;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ok: "bg-success/10 text-success border-success/20",
    broken: "bg-danger/10 text-danger border-danger/20",
    timeout: "bg-danger/10 text-danger border-danger/20",
    redirect: "bg-warning/10 text-warning border-warning/20",
  };
  const labels: Record<string, string> = {
    ok: "正常",
    broken: "リンク切れ",
    timeout: "タイムアウト",
    redirect: "リダイレクト",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.broken}`}>
      {labels[status] || status}
    </span>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    brand: "from-brand-500/20 to-brand-600/20 border-brand-500/20 text-brand-400",
    danger: "from-danger/20 to-red-600/20 border-danger/20 text-danger",
    warning: "from-warning/20 to-amber-600/20 border-warning/20 text-warning",
    success: "from-success/20 to-emerald-600/20 border-success/20 text-success",
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-6 text-center`}>
      <div className={`text-4xl font-bold mb-1 ${colorMap[color].split(" ").pop()}`}>{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

export default function ScanResultPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "ok">("all");

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/scan/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setReport(data);
        if (data.status === "running") {
          setTimeout(poll, 3000);
        } else {
          setLoading(false);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        setLoading(false);
      }
    };
    poll();
  }, [id]);

  const broken = report?.results?.filter((r) => r.status === "broken" || r.status === "timeout") || [];
  const redirects = report?.results?.filter((r) => r.status === "redirect") || [];
  const ok = report?.results?.filter((r) => r.status === "ok") || [];

  const filtered = filter === "all" ? (report?.results || [])
    : filter === "broken" ? broken
    : filter === "redirect" ? redirects
    : ok;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">スキャン結果</h1>
          {report?.url && (
            <p className="text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
              </svg>
              {report.url}
            </p>
          )}
        </div>

        {/* Loading state */}
        {loading && report?.status === "running" && (
          <div className="mb-8 animate-fade-in">
            <div className="relative p-6 bg-surface-100 border border-brand-500/20 rounded-2xl overflow-hidden">
              {/* Scan line animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-surface-200">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-scan-line" />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">スキャン中...</p>
                  <p className="text-gray-400 text-sm">
                    {report?.pages_scanned || 0} ページ巡回済み · {report?.total_links || 0} リンクチェック済み
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger animate-fade-in">
            {error}
          </div>
        )}

        {report && report.status !== "running" && (
          <div className="animate-slide-up">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard value={report.total_links} label="総リンク数" color="brand" />
              <StatCard value={report.broken_links} label="リンク切れ" color="danger" />
              <StatCard value={report.redirected_links} label="リダイレクト" color="warning" />
              <StatCard value={report.total_links - report.broken_links - report.redirected_links} label="正常" color="success" />
            </div>

            {/* Meta info */}
            {(report.pages_scanned || report.duration_ms) && (
              <div className="flex gap-4 mb-8 text-sm text-gray-500">
                {report.pages_scanned && <span>📄 {report.pages_scanned} ページをクロール</span>}
                {report.duration_ms && <span>⏱️ {(report.duration_ms / 1000).toFixed(1)}秒</span>}
              </div>
            )}

            {/* All clear */}
            {broken.length === 0 && (
              <div className="mb-8 p-8 bg-gradient-to-br from-success/5 to-emerald-600/5 border border-success/20 rounded-2xl text-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-xl font-bold text-success mb-1">リンク切れは見つかりませんでした！</p>
                <p className="text-gray-400">すべてのリンクが正常に動作しています。</p>
              </div>
            )}

            {/* Filter tabs */}
            {report.results && report.results.length > 0 && (
              <>
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  {[
                    { key: "all" as const, label: "すべて", count: report.results.length },
                    { key: "broken" as const, label: "リンク切れ", count: broken.length },
                    { key: "redirect" as const, label: "リダイレクト", count: redirects.length },
                    { key: "ok" as const, label: "正常", count: ok.length },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        filter === key
                          ? "bg-brand-600 text-white"
                          : "bg-surface-200 text-gray-400 hover:text-white hover:bg-surface-300"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>

                {/* Results list */}
                <div className="space-y-3">
                  {filtered.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 bg-surface-100 border border-surface-300/50 rounded-xl hover:border-surface-400 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="font-mono text-sm text-gray-200 break-all flex-1">
                          {r.link_url}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {r.link_type && (
                            <span className="text-xs px-2 py-0.5 rounded bg-surface-300 text-gray-400">
                              {r.link_type === "internal" ? "内部" : "外部"}
                            </span>
                          )}
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>検出: {r.source_page}</span>
                        <span>ステータス: {r.status_code || "N/A"}</span>
                        {r.anchor_text && <span>テキスト: {r.anchor_text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CTA */}
            <div className="mt-12 p-8 bg-gradient-to-br from-surface-100 to-surface-200 border border-surface-300/50 rounded-2xl text-center">
              <p className="font-bold text-xl mb-2 text-white">定期的にチェックしませんか？</p>
              <p className="text-gray-400 mb-6">無料登録で週1回の自動チェック + メール通知</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-medium hover:from-brand-500 hover:to-brand-400 transition-all hover:shadow-lg hover:shadow-brand-500/25"
              >
                無料で定期監視を始める
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

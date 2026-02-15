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
    ok: "bg-emerald-50 text-emerald-700",
    broken: "bg-red-50 text-red-700",
    timeout: "bg-red-50 text-red-700",
    redirect: "bg-amber-50 text-amber-700",
  };
  const labels: Record<string, string> = {
    ok: "正常",
    broken: "リンク切れ",
    timeout: "タイムアウト",
    redirect: "リダイレクト",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${styles[status] || styles.broken}`}>
      {labels[status] || status}
    </span>
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

  const filtered =
    filter === "all" ? (report?.results || [])
    : filter === "broken" ? broken
    : filter === "redirect" ? redirects
    : ok;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">スキャン結果</h1>
          {report?.url && (
            <p className="text-sm text-gray-400">{report.url}</p>
          )}
        </div>

        {/* Loading */}
        {loading && report?.status === "running" && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="text-sm text-gray-600">
              スキャン中… {report?.pages_scanned || 0}ページ巡回 · {report?.total_links || 0}リンク検出
            </span>
          </div>
        )}

        {error && (
          <p className="mb-6 text-sm text-danger">{error}</p>
        )}

        {report && report.status !== "running" && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { label: "総リンク", value: report.total_links, color: "text-gray-900" },
                { label: "リンク切れ", value: report.broken_links, color: "text-red-600" },
                { label: "リダイレクト", value: report.redirected_links, color: "text-amber-600" },
                { label: "正常", value: report.total_links - report.broken_links - report.redirected_links, color: "text-emerald-600" },
              ].map((s, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className={`text-2xl font-semibold tabular-nums ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex gap-4 mb-6 text-xs text-gray-400">
              {report.pages_scanned && <span>{report.pages_scanned}ページクロール</span>}
              {report.duration_ms && <span>{(report.duration_ms / 1000).toFixed(1)}秒</span>}
            </div>

            {/* All clear */}
            {broken.length === 0 && (
              <div className="mb-8 p-6 bg-emerald-50 rounded-lg text-center">
                <p className="text-sm font-medium text-emerald-700">リンク切れは見つかりませんでした</p>
              </div>
            )}

            {/* Filter */}
            {report.results && report.results.length > 0 && (
              <>
                <div className="flex gap-1 mb-4 border-b border-gray-100">
                  {[
                    { key: "all" as const, label: "すべて", count: report.results.length },
                    { key: "broken" as const, label: "リンク切れ", count: broken.length },
                    { key: "redirect" as const, label: "リダイレクト", count: redirects.length },
                    { key: "ok" as const, label: "正常", count: ok.length },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                        filter === key
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="divide-y divide-gray-100">
                  {filtered.map((r, i) => (
                    <div key={i} className="py-3 first:pt-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900 font-mono break-all leading-relaxed">
                            {r.link_url}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {r.source_page}
                            {r.status_code ? ` · ${r.status_code}` : " · タイムアウト"}
                            {r.anchor_text ? ` · "${r.anchor_text}"` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          {r.link_type && (
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                              {r.link_type === "internal" ? "内部" : "外部"}
                            </span>
                          )}
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CTA */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-4">
                定期チェックと通知を設定できます
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                アカウント作成
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}

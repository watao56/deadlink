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
}

export default function ScanResultPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">スキャン結果</h1>
        {report?.url && <p className="text-gray-500 mb-6">{report.url}</p>}

        {loading && report?.status === "running" && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span>スキャン中... チェック済み: {report?.total_links || 0} リンク</span>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {report && report.status !== "running" && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold">{report.total_links}</div>
                <div className="text-sm text-gray-500">総リンク数</div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-red-600">{report.broken_links}</div>
                <div className="text-sm text-gray-500">リンク切れ</div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-yellow-600">{report.redirected_links}</div>
                <div className="text-sm text-gray-500">リダイレクト</div>
              </div>
            </div>

            {/* Broken Links */}
            {broken.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-red-600">🔴 リンク切れ ({broken.length}件)</h2>
                <div className="space-y-2">
                  {broken.map((r, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="font-mono text-sm text-red-700 break-all">{r.link_url}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        検出ページ: {r.source_page} | ステータス: {r.status_code || "タイムアウト"} | テキスト: {r.anchor_text || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redirects */}
            {redirects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-yellow-600">🟡 リダイレクト ({redirects.length}件)</h2>
                <div className="space-y-2">
                  {redirects.map((r, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-yellow-200">
                      <div className="font-mono text-sm text-yellow-700 break-all">{r.link_url}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        検出ページ: {r.source_page} | ステータス: {r.status_code}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {broken.length === 0 && redirects.length === 0 && (
              <div className="bg-green-50 p-8 rounded-lg text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-lg font-semibold text-green-700">リンク切れは見つかりませんでした！</p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
              <p className="font-semibold mb-2">定期的にチェックしませんか？</p>
              <p className="text-sm text-gray-600 mb-4">無料登録で週1回の自動チェック + メール通知</p>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                無料で定期監視を始める
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}

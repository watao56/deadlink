"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";

interface Report {
  site_id: string;
  scanned_at: string;
  total_links: number;
  broken_links: number;
  redirected_links: number;
  status: string;
}

export default function SiteDetailPage() {
  const { id } = useParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`/api/sites/${id}/reports`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function triggerScan() {
    setScanning(true);
    try {
      await fetch(`/api/sites/${id}/scan`, { method: "POST" });
      setTimeout(fetchReports, 5000);
    } catch {
      // ignore
    }
    setScanning(false);
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">サイト詳細</h1>
          <button onClick={triggerScan} disabled={scanning} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {scanning ? "スキャン中..." : "今すぐスキャン"}
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : reports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center text-gray-500">まだスキャン結果がありません。</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">{new Date(r.scanned_at).toLocaleString("ja-JP")}</span>
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${r.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.status === "completed" ? "完了" : "実行中"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-6 mt-2 text-sm">
                  <span>総リンク: <strong>{r.total_links}</strong></span>
                  <span className="text-red-600">切れ: <strong>{r.broken_links}</strong></span>
                  <span className="text-yellow-600">リダイレクト: <strong>{r.redirected_links}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

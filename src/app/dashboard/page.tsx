"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

interface Site {
  id: string;
  url: string;
  name: string;
  last_checked_at: string | null;
  check_interval: string;
}

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const loadSites = useCallback(async () => {
    const { data } = await supabase.from("sites").select("*").order("created_at", { ascending: false });
    setSites(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/auth/login"); return; }
      loadSites();
    });
  }, [supabase.auth, router, loadSites]);

  async function addSite(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("sites").insert({ url, name: name || url, user_id: user.id });
    setUrl("");
    setName("");
    setAdding(false);
    loadSites();
  }

  async function deleteSite(id: string) {
    if (!confirm("このサイトを削除しますか？")) return;
    await supabase.from("sites").delete().eq("id", id);
    loadSites();
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

        <form onSubmit={addSite} className="bg-white p-4 rounded-lg border mb-6">
          <h2 className="font-semibold mb-3">サイトを追加</h2>
          <div className="flex gap-2 flex-wrap">
            <input type="url" required placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 rounded border border-gray-300 text-sm" />
            <input type="text" placeholder="サイト名（任意）" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded border border-gray-300 text-sm" />
            <button type="submit" disabled={adding} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {adding ? "追加中..." : "追加"}
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : sites.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center text-gray-500">まだサイトが登録されていません。</div>
        ) : (
          <div className="space-y-3">
            {sites.map((site) => (
              <div key={site.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                <div>
                  <Link href={`/dashboard/sites/${site.id}`} className="font-medium text-blue-600 hover:underline">{site.name}</Link>
                  <p className="text-sm text-gray-500">{site.url}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    チェック頻度: {site.check_interval === "daily" ? "毎日" : "週1回"}
                    {site.last_checked_at && ` | 最終: ${new Date(site.last_checked_at).toLocaleString("ja-JP")}`}
                  </p>
                </div>
                <button onClick={() => deleteSite(site.id)} className="text-red-500 hover:text-red-700 text-sm">削除</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

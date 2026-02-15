import { NextRequest, NextResponse } from "next/server";
import { putReport, putResult } from "@/lib/dynamodb";
import { crawlSite } from "@/lib/crawler";
import { randomUUID } from "crypto";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: siteId } = await params;

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

    const { data: site } = await supabase.from("sites").select("*").eq("id", siteId).eq("user_id", user.id).single();
    if (!site) return NextResponse.json({ error: "サイトが見つかりません" }, { status: 404 });

    const reportId = randomUUID();
    const scannedAt = new Date().toISOString();

    await putReport({
      site_id: siteId, scanned_at: scannedAt, report_id: reportId, url: site.url,
      total_links: 0, broken_links: 0, redirected_links: 0, status: "running", duration_ms: 0,
    });

    const startTime = Date.now();
    crawlSite(site.url, site.page_limit || 100).then(async ({ results }) => {
      const broken = results.filter(r => r.status === "broken" || r.status === "timeout").length;
      const redirected = results.filter(r => r.status === "redirect").length;

      for (const result of results) {
        await putResult({ ...result, report_id: reportId });
      }

      await putReport({
        site_id: siteId, scanned_at: scannedAt, report_id: reportId, url: site.url,
        total_links: results.length, broken_links: broken, redirected_links: redirected,
        status: "completed", duration_ms: Date.now() - startTime,
      });

      await supabase.from("sites").update({ last_checked_at: scannedAt }).eq("id", siteId);
    });

    return NextResponse.json({ reportId, status: "running" });
  } catch (err) {
    console.error("Site scan error:", err);
    return NextResponse.json({ error: "スキャンの開始に失敗しました" }, { status: 500 });
  }
}

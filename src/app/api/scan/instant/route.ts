import { NextRequest, NextResponse } from "next/server";
import { putReport, putResult } from "@/lib/dynamodb";
import { crawlSite } from "@/lib/crawler";
import { randomUUID } from "crypto";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 86400000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "レート制限: 1日3回まで" }, { status: 429 });
    }

    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URLが必要です" }, { status: 400 });
    try { new URL(url); } catch { return NextResponse.json({ error: "無効なURLです" }, { status: 400 }); }

    const reportId = randomUUID();
    const siteId = `instant_${reportId}`;
    const scannedAt = new Date().toISOString();

    await putReport({
      site_id: siteId, scanned_at: scannedAt, report_id: reportId, url,
      total_links: 0, broken_links: 0, redirected_links: 0, status: "running", duration_ms: 0,
    });

    const startTime = Date.now();
    crawlSite(url, 20).then(async ({ results, pagesScanned }) => {
      const broken = results.filter(r => r.status === "broken" || r.status === "timeout").length;
      const redirected = results.filter(r => r.status === "redirect").length;

      for (const result of results) {
        await putResult({ ...result, report_id: reportId });
      }

      await putReport({
        site_id: siteId, scanned_at: scannedAt, report_id: reportId, url,
        total_links: results.length, broken_links: broken, redirected_links: redirected,
        status: "completed", duration_ms: Date.now() - startTime, pages_scanned: pagesScanned,
      });
    }).catch(async (err) => {
      console.error("Crawl failed:", err);
      await putReport({
        site_id: siteId, scanned_at: scannedAt, report_id: reportId, url,
        total_links: 0, broken_links: 0, redirected_links: 0, status: "failed", duration_ms: Date.now() - startTime,
      });
    });

    return NextResponse.json({ reportId, status: "running" });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "スキャンの開始に失敗しました" }, { status: 500 });
  }
}

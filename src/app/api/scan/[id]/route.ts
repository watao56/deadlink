import { NextRequest, NextResponse } from "next/server";
import { getReportById, getResultsByReportId } from "@/lib/dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reportId } = await params;

  try {
    const report = await getReportById(reportId);
    if (!report) return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 });

    const results = await getResultsByReportId(reportId);
    return NextResponse.json({ ...report, results });
  } catch (err) {
    console.error("Fetch report error:", err);
    return NextResponse.json({ error: "レポートの取得に失敗しました" }, { status: 500 });
  }
}

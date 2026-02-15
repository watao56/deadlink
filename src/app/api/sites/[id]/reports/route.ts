import { NextRequest, NextResponse } from "next/server";
import { getReportsBySiteId } from "@/lib/dynamodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: siteId } = await params;
  try {
    const reports = await getReportsBySiteId(siteId);
    return NextResponse.json({ reports });
  } catch (err) {
    console.error("Fetch reports error:", err);
    return NextResponse.json({ error: "レポート取得に失敗" }, { status: 500 });
  }
}

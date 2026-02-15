import * as cheerio from "cheerio";

export interface LinkResult {
  link_url: string;
  source_page: string;
  status_code: number | null;
  status: "ok" | "broken" | "redirect" | "timeout";
  redirect_to?: string;
  anchor_text: string;
  checked_at: string;
  link_type: "internal" | "external";
}

export async function crawlSite(
  siteUrl: string,
  maxPages: number = 20,
  onProgress?: (total: number) => void
): Promise<{ results: LinkResult[]; pagesScanned: number }> {
  const baseUrl = new URL(siteUrl);
  const visited = new Set<string>();
  const toVisit = [siteUrl];
  const allLinks = new Map<string, { source: string; text: string; type: "internal" | "external" }>();
  const results: LinkResult[] = [];

  // Phase 1: Crawl internal pages and collect ALL links
  while (toVisit.length > 0 && visited.size < maxPages) {
    const pageUrl = toVisit.shift()!;
    if (visited.has(pageUrl)) continue;
    visited.add(pageUrl);

    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "DeadLinkBot/1.0 (+https://deadlink.app/about)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;

      const html = await res.text();
      const $ = cheerio.load(html);

      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:") || href.startsWith("tel:")) return;

        let fullUrl: string;
        try {
          fullUrl = new URL(href, pageUrl).href;
        } catch {
          return;
        }

        // Remove fragment
        const u = new URL(fullUrl);
        u.hash = "";
        fullUrl = u.href;

        const text = $(el).text().trim().substring(0, 100);
        const isInternal = u.hostname === baseUrl.hostname;

        // Internal link - add to crawl queue
        if (isInternal && !visited.has(fullUrl)) {
          toVisit.push(fullUrl);
        }

        // Track ALL links for checking (deduplicate by URL)
        if (!allLinks.has(fullUrl)) {
          allLinks.set(fullUrl, { source: pageUrl, text, type: isInternal ? "internal" : "external" });
        }
      });

      // Be polite
      await new Promise((r) => setTimeout(r, 300));
    } catch {
      // skip unreachable pages
    }
  }

  // Phase 2: Check all collected links
  const linkEntries = Array.from(allLinks.entries());
  for (const [linkUrl, { source, text, type }] of linkEntries) {
    // Skip already-visited internal pages (we know they're ok)
    if (type === "internal" && visited.has(linkUrl)) {
      results.push({
        link_url: linkUrl,
        source_page: source,
        status_code: 200,
        status: "ok",
        anchor_text: text,
        checked_at: new Date().toISOString(),
        link_type: type,
      });
      if (onProgress) onProgress(results.length);
      continue;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(linkUrl, {
        method: "HEAD",
        headers: { "User-Agent": "DeadLinkBot/1.0 (+https://deadlink.app/about)" },
        signal: controller.signal,
        redirect: "manual",
      });
      clearTimeout(timeout);

      let status: LinkResult["status"] = "ok";
      if (res.status >= 300 && res.status < 400) {
        status = "redirect";
      } else if (res.status >= 400) {
        status = "broken";
      }

      results.push({
        link_url: linkUrl,
        source_page: source,
        status_code: res.status,
        status,
        redirect_to: res.headers.get("location") || undefined,
        anchor_text: text,
        checked_at: new Date().toISOString(),
        link_type: type,
      });
    } catch {
      results.push({
        link_url: linkUrl,
        source_page: source,
        status_code: null,
        status: "timeout",
        anchor_text: text,
        checked_at: new Date().toISOString(),
        link_type: type,
      });
    }

    if (onProgress) onProgress(results.length);
    await new Promise((r) => setTimeout(r, 200));
  }

  return { results, pagesScanned: visited.size };
}

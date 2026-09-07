import { NextResponse } from "next/server";
import {
  buildFurunaviAffiliateUrl,
  buildFurunaviSearchUrl,
} from "@/lib/affiliate-config";
import { buildAffiliateOutboundHtml } from "@/lib/affiliate-outbound";

/** 毎回 VC へ渡す（キャッシュされた空白ページを出さない） */
export const dynamic = "force-dynamic";

const FURUNAVI_SEARCH_FALLBACK = "https://furunavi.jp/Product/Search";

/** ふるなび検索へ VC 経由で送る（HTML ブリッジ） */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const destination = keyword
    ? buildFurunaviSearchUrl(keyword)
    : FURUNAVI_SEARCH_FALLBACK;

  const html = buildAffiliateOutboundHtml({
    trackingUrl: buildFurunaviAffiliateUrl(destination),
    fallbackUrl: destination,
    destinationLabel: "ふるなび",
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

import { NextResponse } from "next/server";
import {
  buildFurunaviAffiliateUrl,
  FURUNAVI_SITE_URL,
  FURUNAVI_TOP_URL,
} from "@/lib/affiliate-config";
import { buildAffiliateOutboundHtml } from "@/lib/affiliate-outbound";

/** 毎回 VC へ渡す（キャッシュされた空白ページを出さない） */
export const dynamic = "force-dynamic";

/** ふるなびトップへ VC 経由で送る（HTML ブリッジ。Referer は zeical.jp のまま） */
export function GET() {
  const html = buildAffiliateOutboundHtml({
    trackingUrl: buildFurunaviAffiliateUrl(FURUNAVI_TOP_URL),
    fallbackUrl: FURUNAVI_SITE_URL,
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

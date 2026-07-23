import { NextResponse } from "next/server";
import {
  buildFurunaviAffiliateUrl,
  FURUNAVI_TOP_URL,
} from "@/lib/affiliate-config";

/** ふるなびトップへ VC 経由でリダイレクト（同一サイト経由で Referer を確実に送る） */
export function GET() {
  return NextResponse.redirect(buildFurunaviAffiliateUrl(FURUNAVI_TOP_URL), 302);
}

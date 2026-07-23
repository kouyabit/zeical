import { NextResponse } from "next/server";
import {
  buildFurunaviAffiliateUrl,
  buildFurunaviSearchUrl,
} from "@/lib/affiliate-config";

/** ふるなび検索へ VC 経由でリダイレクト */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const destination = keyword
    ? buildFurunaviSearchUrl(keyword)
    : "https://furunavi.jp/Product/Search";
  return NextResponse.redirect(buildFurunaviAffiliateUrl(destination), 302);
}

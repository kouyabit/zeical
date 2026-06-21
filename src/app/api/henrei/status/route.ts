import { NextResponse } from "next/server";
import { testRakutenConnection } from "@/lib/henrei/rakuten-api";
import { getHenreiItems } from "@/lib/henrei/store";
import { SITE_URL } from "@/lib/site";

/**
 * 返礼品ナビの接続状態を確認する診断API。
 * ブラウザで /api/henrei/status を開くと、APIキー・データ件数を確認できる。
 */
export async function GET() {
  const hasAppId = Boolean(process.env.RAKUTEN_APP_ID);
  const hasAccessKey = Boolean(process.env.RAKUTEN_ACCESS_KEY);
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const rakutenTest = await testRakutenConnection();
  const items = await getHenreiItems();
  const isSeedData = items.some((item) => item.id.startsWith("furusato-"));

  return NextResponse.json({
    siteUrl: SITE_URL,
    env: {
      rakutenAppId: hasAppId,
      rakutenAccessKey: hasAccessKey,
      supabase: hasSupabase,
    },
    rakuten: rakutenTest,
    data: {
      itemCount: items.length,
      source: isSeedData ? "seed" : "live",
      sampleName: items[0]?.name ?? null,
    },
    fixHints:
      rakutenTest.errorCode === "HTTP_REFERRER_NOT_ALLOWED"
        ? [
            "楽天デベロッパー > アプリ設定 > 許可されたWebサイト に https://zeical.jp を追加",
            "Vercelの環境変数 RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY を設定して再デプロイ",
          ]
        : rakutenTest.errorCode === "REQUEST_CONTEXT_BODY_HTTP_REFERRER_MISSING"
          ? ["サーバーからRefererヘッダーが必要です（コード側は設定済み）"]
          : [],
  });
}

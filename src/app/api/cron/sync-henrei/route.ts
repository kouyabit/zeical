import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchAllHenreiFromRakuten } from "@/lib/henrei/rakuten-api";

/**
 * 日次バッチ：楽天APIから返礼品データを取得してSupabaseに保存する。
 * Vercel Cron から CRON_SECRET で認証して呼び出す。
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const items = await fetchAllHenreiFromRakuten();

    if (items.length === 0) {
      console.warn("[cron/sync-henrei] 取得件数0（API未設定またはエラー）");
      return NextResponse.json({
        ok: true,
        synced: 0,
        message: "RAKUTEN_APP_ID未設定または取得結果0件。シードデータが使われます。",
        durationMs: Date.now() - startTime,
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("[cron/sync-henrei] Supabase未設定。取得のみ完了。");
      return NextResponse.json({
        ok: true,
        synced: 0,
        fetched: items.length,
        message: "SUPABASE_SERVICE_ROLE_KEY未設定のためDB保存をスキップ",
        durationMs: Date.now() - startTime,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const rows = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image_url: item.imageUrl,
      donation_amount: item.donationAmount,
      market_price: item.marketPrice,
      return_rate: item.returnRate,
      category_slug: item.categorySlug,
      prefecture_slug: item.prefectureSlug,
      municipality_name: item.municipalityName,
      rakuten_item_url: item.rakutenItemUrl,
      review_average: item.reviewAverage,
      review_count: item.reviewCount,
      popularity_score: item.popularityScore,
      updated_at: item.updatedAt,
    }));

    const { error } = await supabase.from("henrei_items").upsert(rows, {
      onConflict: "id",
    });

    if (error) {
      console.error("[cron/sync-henrei] Supabase upsert error:", error);
      return NextResponse.json(
        { error: "DB保存失敗", detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      synced: items.length,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[cron/sync-henrei] unexpected error:", error);
    return NextResponse.json(
      { error: "同期処理でエラーが発生しました" },
      { status: 500 },
    );
  }
}

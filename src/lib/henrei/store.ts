import type { HenreiItem } from "@/types/henrei";
import { unstable_cache } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import seedItems from "@/data/henrei-seed.json";
import { calcReturnRate } from "./return-rate";
import { isNextBuildPhase } from "./constants";
import { fetchAllHenreiFromRakuten } from "./rakuten-api";

/** シードデータを型安全に読み込む */
const fallbackItems: HenreiItem[] = (seedItems as HenreiItem[]).map(normalizeItem);

function normalizeItem(item: HenreiItem): HenreiItem {
  return {
    ...item,
    returnRate: calcReturnRate(item.marketPrice, item.donationAmount),
    popularityScore:
      item.popularityScore ??
      Math.round((item.reviewAverage ?? 0) * (item.reviewCount ?? 0)),
  };
}

/** Supabaseから返礼品一覧を取得（未設定時はシードデータ） */
async function fetchFromSupabase(): Promise<HenreiItem[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("henrei_items")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data?.length) return null;

  return data.map((row) =>
    normalizeItem({
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      donationAmount: row.donation_amount,
      marketPrice: row.market_price,
      returnRate: row.return_rate,
      categorySlug: row.category_slug,
      prefectureSlug: row.prefecture_slug,
      municipalityName: row.municipality_name,
      rakutenItemUrl: row.rakuten_item_url,
      reviewAverage: row.review_average,
      reviewCount: row.review_count,
      popularityScore: row.popularity_score,
      updatedAt: row.updated_at,
    }),
  );
}

/** 楽天APIから取得（24時間キャッシュ。Supabase未設定時の本番データ源） */
const getCachedRakutenItems = unstable_cache(
  async () => fetchAllHenreiFromRakuten(),
  ["henrei-rakuten-all-v2"],
  { revalidate: 86400, tags: ["henrei"] },
);

/** 同時リクエストが1本の楽天API取得にまとまるようにする */
let rakutenFetchInflight: Promise<HenreiItem[] | null> | null = null;

async function fetchFromRakuten(): Promise<HenreiItem[] | null> {
  if (!process.env.RAKUTEN_APP_ID || !process.env.RAKUTEN_ACCESS_KEY) {
    return null;
  }
  // ビルド時は数百ページが並列生成され、楽天APIの1秒1回制限を超えるためスキップ
  if (isNextBuildPhase()) {
    return null;
  }

  if (!rakutenFetchInflight) {
    rakutenFetchInflight = getCachedRakutenItems()
      .then((items) => (items.length ? items.map(normalizeItem) : null))
      .finally(() => {
        rakutenFetchInflight = null;
      });
  }

  return rakutenFetchInflight;
}

/** 全返礼品を取得（Supabase → 楽天API → シードの順） */
export async function getHenreiItems(): Promise<HenreiItem[]> {
  const fromDb = await fetchFromSupabase();
  if (fromDb?.length) return fromDb;

  const fromRakuten = await fetchFromRakuten();
  if (fromRakuten?.length) return fromRakuten;

  return fallbackItems;
}

/** IDで1件取得 */
export async function getHenreiItemById(id: string): Promise<HenreiItem | undefined> {
  const items = await getHenreiItems();
  return items.find((item) => item.id === id);
}

/** 寄付額帯で絞り込み（±20%の幅） */
export async function getHenreiItemsByPrice(amount: number): Promise<HenreiItem[]> {
  const items = await getHenreiItems();
  const min = amount * 0.8;
  const max = amount * 1.2;
  return items
    .filter((item) => item.donationAmount >= min && item.donationAmount <= max)
    .sort((a, b) => b.returnRate - a.returnRate);
}

/** カテゴリで絞り込み */
export async function getHenreiItemsByCategory(slug: string): Promise<HenreiItem[]> {
  const items = await getHenreiItems();
  return items
    .filter((item) => item.categorySlug === slug)
    .sort((a, b) => b.returnRate - a.returnRate);
}

/** 都道府県で絞り込み */
export async function getHenreiItemsByPrefecture(slug: string): Promise<HenreiItem[]> {
  const items = await getHenreiItems();
  return items
    .filter((item) => item.prefectureSlug === slug)
    .sort((a, b) => b.returnRate - a.returnRate);
}

/** 還元率ランキング（算出できた商品のみ） */
export async function getReturnRateRanking(limit = 20): Promise<HenreiItem[]> {
  const items = await getHenreiItems();
  return [...items]
    .filter((item) => item.returnRate > 0)
    .sort((a, b) => b.returnRate - a.returnRate)
    .slice(0, limit);
}

/** 人気ランキング */
export async function getPopularRanking(limit = 20): Promise<HenreiItem[]> {
  const items = await getHenreiItems();
  return [...items]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
}

/** データ最終更新日 */
export async function getHenreiLastUpdated(): Promise<string> {
  const items = await getHenreiItems();
  if (!items.length) return new Date().toISOString();
  return items.reduce(
    (latest, item) => (item.updatedAt > latest ? item.updatedAt : latest),
    items[0].updatedAt,
  );
}

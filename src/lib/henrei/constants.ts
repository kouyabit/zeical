import type { HenreiCategory, HenreiPrefecture, HenreiPriceTier } from "@/types/henrei";

/** 寄付額帯ページの対象金額 */
export const HENREI_PRICE_TIERS: HenreiPriceTier[] = [
  { amount: 10000, label: "1万円" },
  { amount: 20000, label: "2万円" },
  { amount: 30000, label: "3万円" },
  { amount: 50000, label: "5万円" },
  { amount: 100000, label: "10万円" },
];

/** 返礼品カテゴリ一覧 */
export const HENREI_CATEGORIES: HenreiCategory[] = [
  { slug: "wagyu", name: "和牛・牛肉", description: "A5ランク和牛やブランド牛の返礼品" },
  { slug: "rice", name: "お米", description: "新米・ブランド米・無洗米など" },
  { slug: "seafood", name: "海鮮・魚介", description: "蟹・うなぎ・海老・干物など" },
  { slug: "fruits", name: "フルーツ", description: "メロン・マンゴー・りんごなど" },
  { slug: "meat", name: "お肉", description: "豚肉・鶏肉・ジビエなど" },
  { slug: "sweets", name: "スイーツ", description: "ケーキ・和菓子・アイスなど" },
  { slug: "alcohol", name: "お酒", description: "日本酒・ワイン・ビールなど" },
];

/** 都道府県一覧（slug → 表示名） */
export const HENREI_PREFECTURES: HenreiPrefecture[] = [
  { slug: "hokkaido", name: "北海道" },
  { slug: "aomori", name: "青森県" },
  { slug: "miyagi", name: "宮城県" },
  { slug: "ibaraki", name: "茨城県" },
  { slug: "nagano", name: "長野県" },
  { slug: "kumamoto", name: "熊本県" },
  { slug: "okinawa", name: "沖縄県" },
];

/** 2017年総務省通知：返礼品の原則上限（寄付額の3割） */
export const RETURN_GIFT_RATE_LIMIT_PERCENT = 30;

/** 楽天API：1秒1リクエスト制限 */
export const RAKUTEN_API_MIN_INTERVAL_MS = 1000;

/** ふるさと納税キーワード（楽天API検索用） */
export const RAKUTEN_SEARCH_KEYWORD = "ふるさと納税";

export function getCategoryBySlug(slug: string): HenreiCategory | undefined {
  return HENREI_CATEGORIES.find((c) => c.slug === slug);
}

export function getPrefectureBySlug(slug: string): HenreiPrefecture | undefined {
  return HENREI_PREFECTURES.find((p) => p.slug === slug);
}

export function getPriceTierByAmount(amount: number): HenreiPriceTier | undefined {
  return HENREI_PRICE_TIERS.find((t) => t.amount === amount);
}

/** 上限額に最も近い寄付額帯を返す（/furusato連携用） */
export function findNearestPriceTier(
  donationLimit: number,
  tiers: HenreiPriceTier[] = HENREI_PRICE_TIERS,
): number {
  if (donationLimit <= 0 || tiers.length === 0) return tiers[0]?.amount ?? 10000;

  let nearest = tiers[0].amount;
  let minDiff = Math.abs(donationLimit - nearest);

  for (const tier of tiers) {
    const diff = Math.abs(donationLimit - tier.amount);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = tier.amount;
    }
  }
  return nearest;
}

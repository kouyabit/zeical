import type { HenreiItem } from "@/types/henrei";
import {
  RAKUTEN_API_MIN_INTERVAL_MS,
  RAKUTEN_SEARCH_KEYWORD,
} from "./constants";
import { calcReturnRate } from "./return-rate";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID ?? "";

/** 楽天APIの商品1件分のレスポンス型（必要なフィールドのみ） */
interface RakutenApiItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls?: { imageUrl: string }[];
  shopName: string;
  reviewAverage?: number;
  reviewCount?: number;
  itemCode: string;
  catchcopy?: string;
}

interface RakutenSearchResponse {
  Items?: { Item: RakutenApiItem }[];
  pageCount?: number;
}

/** 1秒1リクエスト制限を守るための待機 */
let lastRequestAt = 0;

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestAt;
  if (elapsed < RAKUTEN_API_MIN_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RAKUTEN_API_MIN_INTERVAL_MS - elapsed),
    );
  }
  lastRequestAt = Date.now();
}

/** カテゴリslugから検索キーワードを推定 */
function categoryKeyword(categorySlug: string): string {
  const map: Record<string, string> = {
    wagyu: "和牛",
    rice: "お米",
    seafood: "海鮮",
    fruits: "フルーツ",
    meat: "お肉",
    sweets: "スイーツ",
    alcohol: "日本酒",
  };
  return map[categorySlug] ?? "";
}

/**
 * 楽天市場API（Ichiba Item Search）でふるさと納税商品を検索する。
 * スクレイピングは行わず、公式APIのみ使用。
 */
export async function searchRakutenHenreiItems(options: {
  keyword?: string;
  categorySlug?: string;
  page?: number;
}): Promise<HenreiItem[]> {
  if (!RAKUTEN_APP_ID) {
    console.warn("[rakuten-api] RAKUTEN_APP_ID が未設定のためスキップ");
    return [];
  }

  await waitForRateLimit();

  const extraKeyword = options.categorySlug
    ? categoryKeyword(options.categorySlug)
    : "";
  const keyword = [RAKUTEN_SEARCH_KEYWORD, extraKeyword, options.keyword]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    keyword,
    hits: "30",
    page: String(options.page ?? 1),
    sort: "-reviewCount",
  });

  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error("[rakuten-api] HTTP error:", res.status, res.statusText);
      return [];
    }

    const json = (await res.json()) as RakutenSearchResponse;
    const rawItems = json.Items?.map((entry) => entry.Item) ?? [];

    return rawItems
      .map((item) => mapRakutenItemToHenrei(item))
      .filter((item): item is HenreiItem => item !== null);
  } catch (error) {
    console.error("[rakuten-api] fetch failed:", error);
    return [];
  }
}

/** 楽天APIレスポンスをHenreiItemに変換（寄付額は商品名から推定） */
function mapRakutenItemToHenrei(item: RakutenApiItem): HenreiItem | null {
  const donationAmount = extractDonationAmount(item.itemName);
  if (!donationAmount) return null;

  const marketPrice = item.itemPrice;
  const returnRate = calcReturnRate(marketPrice, donationAmount);
  const reviewAverage = item.reviewAverage ?? 0;
  const reviewCount = item.reviewCount ?? 0;

  return {
    id: item.itemCode.replace(":", "-"),
    name: item.itemName,
    description: item.catchcopy ?? `${item.shopName}のふるさと納税返礼品`,
    imageUrl: item.mediumImageUrls?.[0]?.imageUrl ?? "",
    donationAmount,
    marketPrice,
    returnRate,
    categorySlug: inferCategorySlug(item.itemName),
    prefectureSlug: inferPrefectureSlug(item.itemName),
    municipalityName: extractMunicipality(item.itemName) ?? item.shopName,
    rakutenItemUrl: item.itemUrl,
    reviewAverage,
    reviewCount,
    popularityScore: Math.round(reviewAverage * reviewCount),
    updatedAt: new Date().toISOString(),
  };
}

/** 商品名から寄付額を推定（例: "10,000円" "1万円"） */
function extractDonationAmount(name: string): number | null {
  const manMatch = name.match(/(\d+)万円/);
  if (manMatch) return Number(manMatch[1]) * 10000;

  const yenMatch = name.match(/([\d,]+)円/);
  if (yenMatch) return Number(yenMatch[1].replace(/,/g, ""));

  return null;
}

/** 商品名から自治体名を抽出 */
function extractMunicipality(name: string): string | null {
  const match = name.match(/【([^】]+)】/);
  return match?.[1] ?? null;
}

/** 商品名から都道府県slugを推定 */
function inferPrefectureSlug(name: string): string {
  const map: Record<string, string> = {
    北海道: "hokkaido",
    青森: "aomori",
    宮城: "miyagi",
    茨城: "ibaraki",
    長野: "nagano",
    熊本: "kumamoto",
    沖縄: "okinawa",
  };
  for (const [key, slug] of Object.entries(map)) {
    if (name.includes(key)) return slug;
  }
  return "hokkaido";
}

/** 商品名からカテゴリslugを推定 */
function inferCategorySlug(name: string): string {
  const rules: [string[], string][] = [
    [["和牛", "牛", "ステーキ"], "wagyu"],
    [["米", "コシヒカリ"], "rice"],
    [["蟹", "海老", "うに", "牡蠣", "魚"], "seafood"],
    [["りんご", "メロン", "マンゴー", "フルーツ"], "fruits"],
    [["馬刺", "豚", "鶏"], "meat"],
    [["ケーキ", "スイーツ", "和菓子"], "sweets"],
    [["酒", "日本酒", "ワイン"], "alcohol"],
  ];
  for (const [keywords, slug] of rules) {
    if (keywords.some((kw) => name.includes(kw))) return slug;
  }
  return "seafood";
}

/** 全カテゴリ分を順次取得（日次バッチ用） */
export async function fetchAllHenreiFromRakuten(): Promise<HenreiItem[]> {
  const categories = [
    "wagyu",
    "rice",
    "seafood",
    "fruits",
    "meat",
    "sweets",
    "alcohol",
  ];
  const allItems: HenreiItem[] = [];
  const seenIds = new Set<string>();

  for (const categorySlug of categories) {
    const items = await searchRakutenHenreiItems({ categorySlug, page: 1 });
    for (const item of items) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allItems.push(item);
      }
    }
  }

  return allItems;
}

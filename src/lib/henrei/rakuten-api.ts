import type { HenreiItem } from "@/types/henrei";
import { SITE_URL } from "@/lib/site";
import {
  RAKUTEN_API_MIN_INTERVAL_MS,
  RAKUTEN_SEARCH_KEYWORD,
} from "./constants";
import {
  extractMarketPriceFromText,
  inferPrefectureSlug,
  resolveDonationAmount,
  resolveMunicipalityName,
  resolveRakutenImageUrl,
} from "./rakuten-parse";
import { calcReturnRate } from "./return-rate";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID ?? "";
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY ?? "";
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID ?? "";

/** 2026年版 楽天市場 商品検索APIエンドポイント */
const RAKUTEN_SEARCH_ENDPOINT =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401";

/** 楽天APIの商品1件分のレスポンス型（必要なフィールドのみ） */
interface RakutenApiItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl?: string;
  itemCaption?: string;
  mediumImageUrls?: Array<string | { imageUrl?: string }>;
  smallImageUrls?: Array<string | { imageUrl?: string }>;
  shopName: string;
  reviewAverage?: number;
  reviewCount?: number;
  itemCode: string;
  catchcopy?: string;
}

interface RakutenSearchResponse {
  Items?: RakutenApiItem[] | { Item: RakutenApiItem }[];
  pageCount?: number;
  count?: number;
  error?: string;
  error_description?: string;
  errors?: { errorCode?: number | string; errorMessage?: string };
}

export interface RakutenConnectionResult {
  ok: boolean;
  count?: number;
  errorCode?: string;
  errorMessage?: string;
  referer: string;
}

/** 接続診断（1件だけ検索） */
export async function testRakutenConnection(): Promise<RakutenConnectionResult> {
  const referer = `${SITE_URL}/`;

  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    return {
      ok: false,
      errorCode: "ENV_MISSING",
      errorMessage: "RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定",
      referer,
    };
  }

  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    keyword: RAKUTEN_SEARCH_KEYWORD,
    hits: "1",
    page: "1",
    format: "json",
    formatVersion: "2",
  });

  const url = `${RAKUTEN_SEARCH_ENDPOINT}?${params}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: buildRakutenHeaders(referer),
    });
    const json = (await res.json()) as RakutenSearchResponse;

    if (json.errors?.errorMessage) {
      return {
        ok: false,
        errorCode: String(json.errors.errorMessage),
        errorMessage: String(json.errors.errorCode ?? res.status),
        referer,
      };
    }
    if (json.error) {
      return {
        ok: false,
        errorCode: json.error,
        errorMessage: json.error_description,
        referer,
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        errorCode: String(res.status),
        errorMessage: res.statusText,
        referer,
      };
    }

    return { ok: true, count: json.count, referer };
  } catch (error) {
    return {
      ok: false,
      errorCode: "FETCH_FAILED",
      errorMessage: error instanceof Error ? error.message : "unknown",
      referer,
    };
  }
}

function buildRakutenHeaders(referer: string): HeadersInit {
  const origin = referer.replace(/\/$/, "");
  return {
    Referer: referer,
    Origin: origin,
    accessKey: RAKUTEN_ACCESS_KEY,
  };
}

/** formatVersion=1/2 両方のレスポンス形式に対応 */
function normalizeRakutenItems(
  items: RakutenSearchResponse["Items"],
): RakutenApiItem[] {
  if (!items?.length) return [];
  const first = items[0];
  if (first && "Item" in first) {
    return (items as { Item: RakutenApiItem }[]).map((entry) => entry.Item);
  }
  return items as RakutenApiItem[];
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
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    console.warn(
      "[rakuten-api] RAKUTEN_APP_ID または RAKUTEN_ACCESS_KEY が未設定のためスキップ",
    );
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
    accessKey: RAKUTEN_ACCESS_KEY,
    keyword,
    hits: "30",
    page: String(options.page ?? 1),
    sort: "-reviewCount",
    format: "json",
    formatVersion: "2",
    imageFlag: "1",
  });

  if (RAKUTEN_AFFILIATE_ID) {
    params.set("affiliateId", RAKUTEN_AFFILIATE_ID);
  }

  const url = `${RAKUTEN_SEARCH_ENDPOINT}?${params}`;

  try {
    const referer = `${SITE_URL}/`;
    const res = await fetch(url, {
      next: { revalidate: 0 },
      headers: buildRakutenHeaders(referer),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[rakuten-api] HTTP error:", res.status, body);
      return [];
    }

    const json = (await res.json()) as RakutenSearchResponse;
    if (json.errors?.errorMessage) {
      console.error(
        "[rakuten-api] API error:",
        json.errors.errorMessage,
        "referer=",
        referer,
      );
      return [];
    }
    if (json.error) {
      console.error("[rakuten-api] API error:", json.error, json.error_description);
      return [];
    }

    const rawItems = normalizeRakutenItems(json.Items);

    return rawItems
      .map((item) => mapRakutenItemToHenrei(item))
      .filter((item): item is HenreiItem => item !== null);
  } catch (error) {
    console.error("[rakuten-api] fetch failed:", error);
    return [];
  }
}

/** 楽天APIレスポンスをHenreiItemに変換 */
function mapRakutenItemToHenrei(item: RakutenApiItem): HenreiItem | null {
  const donationAmount = resolveDonationAmount(item.itemPrice, item.itemName);
  if (!donationAmount) return null;

  // 説明文・キャッチコピーから実勢価格を推定（取れない場合は 0）
  const priceText = [item.itemCaption, item.catchcopy].filter(Boolean).join("\n");
  const marketPrice =
    extractMarketPriceFromText(priceText, donationAmount) ?? 0;
  const returnRate =
    marketPrice > 0 ? calcReturnRate(marketPrice, donationAmount) : 0;

  const reviewAverage = item.reviewAverage ?? 0;
  const reviewCount = item.reviewCount ?? 0;

  return {
    id: item.itemCode.replace(":", "-"),
    name: item.itemName,
    description: item.catchcopy ?? `${item.shopName}のふるさと納税返礼品`,
    imageUrl: resolveRakutenImageUrl(
      item.mediumImageUrls,
      item.smallImageUrls,
    ),
    donationAmount,
    marketPrice,
    returnRate,
    categorySlug: inferCategorySlug(item.itemName),
    prefectureSlug: inferPrefectureSlug(item.shopName, item.itemName),
    municipalityName: resolveMunicipalityName(item.shopName, item.itemName),
    rakutenItemUrl: item.affiliateUrl || item.itemUrl,
    reviewAverage,
    reviewCount,
    popularityScore: Math.round(reviewAverage * reviewCount),
    updatedAt: new Date().toISOString(),
  };
}

/** 商品名からカテゴリslugを推定 */
function inferCategorySlug(name: string): string {
  const rules: [string[], string][] = [
    [["和牛", "牛", "ステーキ", "ヒレ", "宮崎牛", "佐賀牛"], "wagyu"],
    [["米", "コシヒカリ", "つや姫", "無洗米"], "rice"],
    [
      ["蟹", "海老", "うに", "牡蠣", "魚", "うなぎ", "鰻", "ホタテ", "帆立", "いくら", "鮭", "サーモン", "エビ"],
      "seafood",
    ],
    [["りんご", "メロン", "マンゴー", "フルーツ", "ぶどう", "桃", "梨", "ブルーベリー", "シャインマスカット"],
      "fruits",
    ],
    [["馬刺", "豚", "鶏"], "meat"],
    [["ケーキ", "スイーツ", "和菓子"], "sweets"],
    [["酒", "日本酒", "ワイン", "ビール"], "alcohol"],
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

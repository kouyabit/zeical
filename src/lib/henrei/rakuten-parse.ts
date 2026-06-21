import { RETURN_GIFT_RATE_LIMIT_PERCENT } from "./constants";

/** formatVersion=2 は URL文字列配列、v1 は { imageUrl } 配列で返る */
type RakutenImageEntry = string | { imageUrl?: string };

/** 楽天APIの画像配列から表示用URLを1件取り出す（v1/v2両対応） */
export function resolveRakutenImageUrl(
  mediumImageUrls?: RakutenImageEntry[],
  smallImageUrls?: RakutenImageEntry[],
): string {
  const raw =
    pickFirstRakutenImageUrl(mediumImageUrls) ??
    pickFirstRakutenImageUrl(smallImageUrls);
  if (!raw) return "";
  // カード表示向けに128pxサムネを300px相当へ拡大
  return raw.replace(/_ex=\d+x\d+/i, "_ex=300x300");
}

function pickFirstRakutenImageUrl(
  urls?: RakutenImageEntry[],
): string | null {
  if (!urls?.length) return null;
  const first = urls[0];
  if (typeof first === "string" && first.startsWith("http")) return first;
  if (first && typeof first === "object" && first.imageUrl?.startsWith("http")) {
    return first.imageUrl;
  }
  return null;
}

/** テキストから「○○円」「○万円」の金額をすべて抽出 */
export function extractYenAmounts(text: string): number[] {
  const amounts = new Set<number>();

  const yenPattern = /(\d{1,3}(?:,\d{3})+|\d+)円/g;
  let yenMatch: RegExpExecArray | null;
  while ((yenMatch = yenPattern.exec(text)) !== null) {
    amounts.add(Number(yenMatch[1].replace(/,/g, "")));
  }

  const manPattern = /(\d+)万円/g;
  let manMatch: RegExpExecArray | null;
  while ((manMatch = manPattern.exec(text)) !== null) {
    amounts.add(Number(manMatch[1]) * 10000);
  }

  return Array.from(amounts);
}

/**
 * 寄付額を決定する。
 * 楽天ふるさと納税APIでは itemPrice が最低寄付額（寄付金額）になる。
 */
export function resolveDonationAmount(
  itemPrice: number,
  itemName: string,
): number | null {
  if (itemPrice > 0) return itemPrice;
  return extractDonationAmountFromName(itemName);
}

/** 商品名から寄付額を推定（itemPrice が取れない場合の予備） */
export function extractDonationAmountFromName(name: string): number | null {
  const manMatch = name.match(/(\d+)万円/);
  if (manMatch) return Number(manMatch[1]) * 10000;

  const yenMatch = name.match(/([\d,]+)円/);
  if (yenMatch) return Number(yenMatch[1].replace(/,/g, ""));

  return null;
}

/**
 * 説明文から実勢価格（参考小売価格）を推定する。
 * 寄付額より小さく、3割ルール上限付近までの金額だけを候補にする。
 */
export function extractMarketPriceFromText(
  text: string,
  donationAmount: number,
): number | null {
  if (!text.trim()) return null;

  const upperBound =
    donationAmount * (RETURN_GIFT_RATE_LIMIT_PERCENT / 100) * 1.05;

  const candidates = extractYenAmounts(text).filter(
    (amount) =>
      amount > 0 &&
      amount !== donationAmount &&
      amount < donationAmount &&
      amount <= upperBound,
  );

  if (!candidates.length) return null;
  return Math.max(...candidates);
}

/** 都道府県名 → slug（47都道府県） */
export const PREFECTURE_NAME_TO_SLUG: Record<string, string> = {
  北海道: "hokkaido",
  青森県: "aomori",
  岩手県: "iwate",
  宮城県: "miyagi",
  秋田県: "akita",
  山形県: "yamagata",
  福島県: "fukushima",
  茨城県: "ibaraki",
  栃木県: "tochigi",
  群馬県: "gunma",
  埼玉県: "saitama",
  千葉県: "chiba",
  東京都: "tokyo",
  神奈川県: "kanagawa",
  新潟県: "niigata",
  富山県: "toyama",
  石川県: "ishikawa",
  福井県: "fukui",
  山梨県: "yamanashi",
  長野県: "nagano",
  岐阜県: "gifu",
  静岡県: "shizuoka",
  愛知県: "aichi",
  三重県: "mie",
  滋賀県: "shiga",
  京都府: "kyoto",
  大阪府: "osaka",
  兵庫県: "hyogo",
  奈良県: "nara",
  和歌山県: "wakayama",
  鳥取県: "tottori",
  島根県: "shimane",
  岡山県: "okayama",
  広島県: "hiroshima",
  山口県: "yamaguchi",
  徳島県: "tokushima",
  香川県: "kagawa",
  愛媛県: "ehime",
  高知県: "kochi",
  福岡県: "fukuoka",
  佐賀県: "saga",
  長崎県: "nagasaki",
  熊本県: "kumamoto",
  大分県: "oita",
  宮崎県: "miyazaki",
  鹿児島県: "kagoshima",
  沖縄県: "okinawa",
};

/** shopName / 商品名から都道府県slugを推定 */
export function inferPrefectureSlug(shopName: string, itemName: string): string {
  for (const source of [shopName, itemName]) {
    for (const [name, slug] of Object.entries(PREFECTURE_NAME_TO_SLUG)) {
      if (source.includes(name)) return slug;
    }
  }
  return "hokkaido";
}

/** shopName（例: 宮崎県宮崎市）を自治体表示名として使う */
export function resolveMunicipalityName(
  shopName: string,
  itemName: string,
): string {
  if (shopName.trim()) return shopName.trim();
  const match = itemName.match(/【([^】]+)】/);
  return match?.[1] ?? "自治体";
}

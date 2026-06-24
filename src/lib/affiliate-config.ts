/** ふるなび（バリューコマース）の referral ベースURL */
export const FURUNAVI_VC_REFERRAL =
  process.env.FURUNAVI_VC_REFERRAL ??
  "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3773912&pid=892644347";

/** ふるなびトップ */
export const FURUNAVI_TOP_URL = "https://furunavi.jp/";

/**
 * バリューコマース経由で任意URLへ飛ばす。
 * referral だけでは VC のサイトに留まることがあるため、必ず vc_url で飛び先を指定する。
 */
export function wrapValueCommerceUrl(
  targetUrl: string,
  referralBase: string = FURUNAVI_VC_REFERRAL,
): string {
  if (!referralBase) return targetUrl;
  const joiner = referralBase.includes("?") ? "&" : "?";
  return `${referralBase}${joiner}vc_url=${encodeURIComponent(targetUrl)}`;
}

/** ふるなびへのアフィリエイトリンクを組み立てる */
export function buildFurunaviAffiliateUrl(
  destinationUrl: string = FURUNAVI_TOP_URL,
): string {
  return wrapValueCommerceUrl(destinationUrl);
}

/** ふるなびの返礼品キーワード検索URL（旧 /search?q= は404のため Product/Search を使用） */
export function buildFurunaviSearchUrl(keyword: string): string {
  const params = new URLSearchParams({ keyword });
  return `https://furunavi.jp/Product/Search?${params.toString()}`;
}

/** プロトコル省略（//example.com）を https に揃える */
export function normalizeAffiliateHref(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

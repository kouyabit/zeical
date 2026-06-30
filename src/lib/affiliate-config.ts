/** バリューコマース sid / pid（VC公式バナーコードで確認済み） */
export const FURUNAVI_VC_SID = "3773912";
export const FURUNAVI_VC_PID = "892647917";

/**
 * ふるなび（バリューコマース）referral URL。
 * 控除額シミュレーターのバナー href はこのURLをそのまま使う（vc_url なし）。
 */
export const FURUNAVI_VC_REFERRAL = `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${FURUNAVI_VC_SID}&pid=${FURUNAVI_VC_PID}`;

/** VC公式バナー（gifbanner）の img src */
export const FURUNAVI_VC_BANNER_SRC = `https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=${FURUNAVI_VC_SID}&pid=${FURUNAVI_VC_PID}`;

/** ふるなびトップ（返礼品ナビ等で vc_url 指定するときの飛び先） */
export const FURUNAVI_TOP_URL =
  "https://furunavi.jp/?utm_source=vc&utm_medium=affiliate&utm_campaign=product_detail";

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

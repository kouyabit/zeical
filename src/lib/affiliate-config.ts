/** バリューコマース sid / pid（MyLink で確認済み。旧 pid は使わない） */
const FURUNAVI_VC_SID = "3773912";
const FURUNAVI_VC_PID = "892646053";

/**
 * ふるなび（バリューコマース）referral ベース。
 * Vercel に旧 pid が入っているとリンク先に到達できないため、環境変数では上書きしない。
 */
export const FURUNAVI_VC_REFERRAL = `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${FURUNAVI_VC_SID}&pid=${FURUNAVI_VC_PID}`;

/** ふるなびトップ（MyLink 作成時の UTM 付き） */
export const FURUNAVI_TOP_URL =
  "https://furunavi.jp/?utm_source=vc&utm_medium=affiliate&utm_campaign=product_detail";

/**
 * MyLink で取得したふるなびトップ用URL（そのまま使うのが最も確実）
 * vc_url 先: furunavi.jp/?utm_source=vc&utm_medium=affiliate&utm_campaign=product_detail
 */
export const FURUNAVI_TOP_MYLINK = `${FURUNAVI_VC_REFERRAL}&vc_url=${encodeURIComponent(FURUNAVI_TOP_URL)}`;

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

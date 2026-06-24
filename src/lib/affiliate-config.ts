/** ふるなび（バリューコマース）の referral ベースURL */
export const FURUNAVI_VC_REFERRAL =
  process.env.FURUNAVI_VC_REFERRAL ??
  "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3773912&pid=892644347";

/**
 * バリューコマース経由で任意のふるなびURLへ飛ばす。
 * referral のみ（vc_url なし）の場合は pid に紐づくトップページへ遷移する。
 */
export function wrapValueCommerceUrl(
  targetUrl: string,
  referralBase: string = FURUNAVI_VC_REFERRAL,
): string {
  if (!referralBase) return targetUrl;
  const joiner = referralBase.includes("?") ? "&" : "?";
  return `${referralBase}${joiner}vc_url=${encodeURIComponent(targetUrl)}`;
}

/** プロトコル省略（//example.com）を https に揃える */
export function normalizeAffiliateHref(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

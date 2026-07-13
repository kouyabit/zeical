/** バリューコマース sid / pid（VC公式バナーコードで確認済み） */
export const FURUNAVI_VC_SID = "3773912";
export const FURUNAVI_VC_PID = "892658067";

/** さとふる（バリューコマース）pid */
export const SATOFURU_VC_PID = "892647927";

/** 各ポータルのトップURL（vc_url の飛び先） */
export const FURUNAVI_SITE_URL = "https://furunavi.jp/";
export const SATOFURU_SITE_URL = "https://www.satofull.jp/";

/** referral のベース（vc_url なし） */
function buildVcReferralBase(sid: string, pid: string): string {
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${sid}&pid=${pid}`;
}

/** referral + vc_url（クリックでポータルサイトへ飛ばす） */
function buildVcAffiliateUrl(
  sid: string,
  pid: string,
  destinationUrl: string,
): string {
  const base = buildVcReferralBase(sid, pid);
  return `${base}&vc_url=${encodeURIComponent(destinationUrl)}`;
}

/** VC公式バナー（gifbanner）の img src */
function buildVcBannerSrc(sid: string, pid: string): string {
  return `https://ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=${sid}&pid=${pid}`;
}

/** 返礼品ナビ等で vc_url を追加するときのベース */
export const FURUNAVI_VC_REFERRAL_BASE = buildVcReferralBase(
  FURUNAVI_VC_SID,
  FURUNAVI_VC_PID,
);

/** VC公式バナーの href（提携済みの noscript コードどおり vc_url なし） */
export const FURUNAVI_VC_BANNER_HREF = buildVcReferralBase(
  FURUNAVI_VC_SID,
  FURUNAVI_VC_PID,
);

/**
 * ふるなび（バリューコマース）アフィリエイトURL。
 * 返礼品ナビ等では vc_url 付きで飛び先を明示する。
 */
export const FURUNAVI_VC_REFERRAL = buildVcAffiliateUrl(
  FURUNAVI_VC_SID,
  FURUNAVI_VC_PID,
  FURUNAVI_SITE_URL,
);

/** VC公式バナー（gifbanner）の img src */
export const FURUNAVI_VC_BANNER_SRC = buildVcBannerSrc(
  FURUNAVI_VC_SID,
  FURUNAVI_VC_PID,
);

/** さとふる（バリューコマース）アフィリエイトURL */
export const SATOFURU_VC_REFERRAL = buildVcAffiliateUrl(
  FURUNAVI_VC_SID,
  SATOFURU_VC_PID,
  SATOFURU_SITE_URL,
);

/** さとふる VC公式バナー（gifbanner）の img src */
export const SATOFURU_VC_BANNER_SRC = buildVcBannerSrc(
  FURUNAVI_VC_SID,
  SATOFURU_VC_PID,
);

/** ふるなびトップ（返礼品ナビ等で vc_url 指定するときの飛び先） */
export const FURUNAVI_TOP_URL =
  "https://furunavi.jp/?utm_source=vc&utm_medium=affiliate&utm_campaign=product_detail";

/**
 * バリューコマース経由で任意URLへ飛ばす。
 * referral だけでは VC のサイトに留まることがあるため、必ず vc_url で飛び先を指定する。
 */
export function wrapValueCommerceUrl(
  targetUrl: string,
  referralBase: string = FURUNAVI_VC_REFERRAL_BASE,
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

/** 楽天ふるさと納税トップ */
export const RAKUTEN_FURUSATO_URL = "https://furusato.rakuten.co.jp/";

/** 楽天アフィリエイトURLを組み立てる（RAKUTEN_AFFILIATE_ID 未設定時は飛び先のみ） */
export function buildRakutenAffiliateUrl(destinationUrl: string): string {
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID?.trim();
  if (!affiliateId) return destinationUrl;
  return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(destinationUrl)}`;
}

import type { HenreiItem } from "@/types/henrei";

/** アフィリエイトポータル種別 */
export type PortalType = "rakuten" | "satofuru" | "furunavi" | "yahoo";

export interface PortalLink {
  portal: PortalType;
  label: string;
  href: string;
}

const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID ?? "";
const SATOFURU_TAG = process.env.SATOFURU_AFFILIATE_TAG ?? "";
const FURUNAVI_TAG = process.env.FURUNAVI_AFFILIATE_TAG ?? "";
const YAHOO_TAG = process.env.YAHOO_AFFILIATE_TAG ?? "";

/** 楽天アフィリエイトURLを組み立てる */
function buildRakutenAffiliateUrl(itemUrl: string): string {
  if (!RAKUTEN_AFFILIATE_ID) return itemUrl;
  const encoded = encodeURIComponent(itemUrl);
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encoded}`;
}

/** 各ポータルへの検索・商品リンクを生成する */
export function buildPortalLinks(item: HenreiItem): PortalLink[] {
  const keyword = encodeURIComponent(item.name);
  const municipality = encodeURIComponent(item.municipalityName);

  const rakutenHref = buildRakutenAffiliateUrl(item.rakutenItemUrl);

  const satofuruBase = SATOFURU_TAG
    ? `https://www.satofull.jp/products/detail.php?product_id=${item.id}&${SATOFURU_TAG}`
    : `https://www.satofull.jp/search/?keyword=${keyword}`;

  const furunaviBase = FURUNAVI_TAG
    ? `https://furunavi.jp/product_detail.aspx?pid=${item.id}&${FURUNAVI_TAG}`
    : `https://furunavi.jp/search?q=${keyword}`;

  const yahooBase = YAHOO_TAG
    ? `https://furusato.yahoo.co.jp/d/search?${YAHOO_TAG}&q=${keyword}`
    : `https://furusato.yahoo.co.jp/d/search?q=${keyword}&municipality=${municipality}`;

  return [
    { portal: "rakuten", label: "楽天ふるさと納税", href: rakutenHref },
    { portal: "satofuru", label: "さとふる", href: satofuruBase },
    { portal: "furunavi", label: "ふるなび", href: furunaviBase },
    { portal: "yahoo", label: "Yahoo!ふるさと納税", href: yahooBase },
  ];
}

import type { HenreiItem } from "@/types/henrei";
import {
  buildFurunaviAffiliateUrl,
  buildFurunaviSearchUrl,
  buildRakutenAffiliateUrl,
} from "@/lib/affiliate-config";

/** アフィリエイトポータル種別 */
export type PortalType = "rakuten" | "satofuru" | "furunavi" | "yahoo";

export interface PortalLink {
  portal: PortalType;
  label: string;
  href: string;
}

const SATOFURU_TAG = process.env.SATOFURU_AFFILIATE_TAG ?? "";
const YAHOO_TAG = process.env.YAHOO_AFFILIATE_TAG ?? "";

/** 各ポータルへの検索・商品リンクを生成する */
export function buildPortalLinks(item: HenreiItem): PortalLink[] {
  const keyword = encodeURIComponent(item.name);
  const municipality = encodeURIComponent(item.municipalityName);

  const rakutenHref = buildRakutenAffiliateUrl(item.rakutenItemUrl);

  const satofuruBase = SATOFURU_TAG
    ? `https://www.satofull.jp/products/detail.php?product_id=${item.id}&${SATOFURU_TAG}`
    : `https://www.satofull.jp/search/?keyword=${keyword}`;

  const furunaviBase = buildFurunaviAffiliateUrl(
    buildFurunaviSearchUrl(item.name),
  );

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

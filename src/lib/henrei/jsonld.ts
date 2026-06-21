import { siteConfig } from "@/lib/site";
import type { HenreiItem } from "@/types/henrei";

/** 返礼品詳細の Product 構造化データ */
export function buildHenreiProductJsonLd(
  item: HenreiItem,
): Record<string, unknown> {
  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: item.imageUrl,
    description: item.description,
    offers: {
      "@type": "Offer",
      price: String(item.donationAmount),
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/henrei/item/${item.id}`,
    },
  };

  if (item.reviewAverage && item.reviewCount) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(item.reviewAverage),
      reviewCount: String(item.reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return product;
}

/** 返礼品詳細の FAQPage 構造化データ */
export function buildHenreiFaqJsonLd(
  item: HenreiItem,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "還元率はどのように計算されていますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `還元率＝実勢価格（${item.marketPrice.toLocaleString("ja-JP")}円）÷寄付額（${item.donationAmount.toLocaleString("ja-JP")}円）×100＝${item.returnRate}%。実勢価格は楽天市場の通常販売価格を採用しています。`,
        },
      },
      {
        "@type": "Question",
        name: "返礼品の提供上限はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2017年総務省通知により、返礼品の提供上限は原則として寄付額の3割以下が目安とされています。",
        },
      },
      {
        "@type": "Question",
        name: "この返礼品はどこから購入できますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "楽天ふるさと納税・さとふる・ふるなび・Yahoo!ふるさと納税の各ポータルサイトから寄付できます。",
        },
      },
    ],
  };
}

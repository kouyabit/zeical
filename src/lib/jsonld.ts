import { siteConfig } from "./site";
import type { Article } from "@/types/article";

/**
 * 構造化データ（JSON-LD）のオブジェクトを組み立てるヘルパー群。
 */

/** サイト全体を表す WebSite 構造化データ */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ja",
  };
}

/** 計算ツールを表す WebApplication 構造化データ */
export function buildSimulatorJsonLd(
  name: string,
  description: string,
  path: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${siteConfig.url}${path}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "ja",
    // 無料ツールであることを明示
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };
}

/** 記事ページの Article 構造化データ */
export function buildArticleJsonLd(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    inLanguage: "ja",
    mainEntityOfPage: `${siteConfig.url}/articles/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

/** パンくずリストの BreadcrumbList 構造化データ */
export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

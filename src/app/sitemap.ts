import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getArticles } from "@/lib/articles";
import { getHenreiItems } from "@/lib/henrei/store";
import {
  HENREI_CATEGORIES,
  HENREI_PREFECTURES,
  HENREI_PRICE_TIERS,
} from "@/lib/henrei/constants";

/**
 * sitemap.xml を自動生成する（Next.jsの仕組みを利用）。
 * 固定ページと、記事ページのURLをすべて列挙する。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/furusato`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/henrei`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/henrei/ranking/return-rate`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/henrei/ranking/popular`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/fukugyo`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/articles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 記事ページのURLを動的に追加する
  const articles = await getArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 返礼品ナビのURLを動的に追加
  const henreiItems = await getHenreiItems();
  const henreiRoutes: MetadataRoute.Sitemap = [
    ...HENREI_PRICE_TIERS.map((tier) => ({
      url: `${SITE_URL}/henrei/price/${tier.amount}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...HENREI_CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/henrei/category/${cat.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...HENREI_PREFECTURES.map((pref) => ({
      url: `${SITE_URL}/henrei/prefecture/${pref.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...henreiItems.map((item) => ({
      url: `${SITE_URL}/henrei/item/${item.id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...articleRoutes, ...henreiRoutes];
}

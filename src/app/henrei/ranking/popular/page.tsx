import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { HenreiItemCard } from "@/components/henrei/henrei-item-card";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import { getPopularRanking, getHenreiLastUpdated } from "@/lib/henrei/store";

export const metadata: Metadata = {
  title: "人気ランキング",
  description:
    "ふるさと納税の返礼品を人気順にランキング。楽天市場のレビュー数×評価点の集計値に基づきます。",
  alternates: { canonical: "/henrei/ranking/popular" },
};

export default async function PopularRankingPage() {
  const [items, lastUpdated] = await Promise.all([
    getPopularRanking(20),
    getHenreiLastUpdated(),
  ]);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
          { name: "人気ランキング", path: "/henrei/ranking/popular" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">人気ランキング</h1>
        <p className="mt-2 text-muted-foreground">
          人気度は楽天市場のレビュー数×評価点の集計値に基づく参考ランキングです。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <HenreiItemCard key={item.id} item={item} rank={i + 1} />
        ))}
      </div>

      <div className="mt-10">
        <FurusatoCta />
      </div>

      <HenreiDisclaimer lastUpdated={lastUpdated} />
    </div>
  );
}

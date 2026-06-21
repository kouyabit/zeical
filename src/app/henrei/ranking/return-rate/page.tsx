import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { HenreiItemCard } from "@/components/henrei/henrei-item-card";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import { getReturnRateRanking, getHenreiLastUpdated } from "@/lib/henrei/store";

export const metadata: Metadata = {
  title: "還元率ランキング",
  description:
    "ふるさと納税の返礼品を還元率の高い順にランキング。実勢価格÷寄付額で算出した参考値です。",
  alternates: { canonical: "/henrei/ranking/return-rate" },
};

export default async function ReturnRateRankingPage() {
  const [items, lastUpdated] = await Promise.all([
    getReturnRateRanking(20),
    getHenreiLastUpdated(),
  ]);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
          { name: "還元率ランキング", path: "/henrei/ranking/return-rate" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">還元率ランキング</h1>
        <p className="mt-2 text-muted-foreground">
          還元率＝実勢価格（楽天市場の通常販売価格）÷寄付額×100。
          2017年総務省通知により、返礼品の原則上限は寄付額の3割以下です。
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

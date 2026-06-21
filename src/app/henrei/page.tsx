import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { HenreiItemCard } from "@/components/henrei/henrei-item-card";
import { HenreiNavLinks } from "@/components/henrei/henrei-nav-links";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import {
  getReturnRateRanking,
  getPopularRanking,
  getHenreiLastUpdated,
} from "@/lib/henrei/store";

export const metadata: Metadata = {
  title: "返礼品ナビ",
  description:
    "ふるさと納税の返礼品を還元率・人気度・寄付額帯で横断検索。楽天市場APIのデータに基づく還元率を表示。",
  alternates: { canonical: "/henrei" },
};

export default async function HenreiTopPage() {
  const [returnRateTop, popularTop, lastUpdated] = await Promise.all([
    getReturnRateRanking(6),
    getPopularRanking(6),
    getHenreiLastUpdated(),
  ]);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">返礼品ナビ</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          ふるさと納税の返礼品を還元率・人気度・寄付額帯で横断検索できます。
          還元率は楽天市場の通常販売価格（実勢価格）÷寄付額で算出しています。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/henrei/ranking/return-rate"
            className="inline-flex items-center gap-1 text-sm font-bold text-cta hover:underline"
          >
            還元率ランキング <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/henrei/ranking/popular"
            className="inline-flex items-center gap-1 text-sm font-bold text-cta hover:underline"
          >
            人気ランキング <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-xl font-bold text-primary">
              還元率が高い返礼品
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {returnRateTop.map((item, i) => (
                <HenreiItemCard key={item.id} item={item} rank={i + 1} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-primary">
              人気の返礼品
            </h2>
            <p className="mb-3 text-xs text-muted-foreground">
              ※人気度は楽天市場のレビュー数×評価点の集計値に基づきます
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularTop.map((item, i) => (
                <HenreiItemCard key={item.id} item={item} rank={i + 1} />
              ))}
            </div>
          </section>

          <FurusatoCta />
        </div>

        <aside>
          <HenreiNavLinks />
        </aside>
      </div>

      <HenreiDisclaimer lastUpdated={lastUpdated} />
    </div>
  );
}

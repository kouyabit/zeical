import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { HenreiItemCard } from "@/components/henrei/henrei-item-card";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import {
  HENREI_PREFECTURES,
  getPrefectureBySlug,
} from "@/lib/henrei/constants";
import {
  getHenreiItemsByPrefecture,
  getHenreiLastUpdated,
} from "@/lib/henrei/store";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return HENREI_PREFECTURES.map((pref) => ({ slug: pref.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prefecture = getPrefectureBySlug(params.slug);
  if (!prefecture) return { title: "都道府県" };

  return {
    title: `${prefecture.name}の返礼品`,
    description: `${prefecture.name}のふるさと納税返礼品一覧。還元率の高い順に表示。`,
    alternates: { canonical: `/henrei/prefecture/${params.slug}` },
  };
}

export default async function PrefecturePage({ params }: PageProps) {
  const prefecture = getPrefectureBySlug(params.slug);
  if (!prefecture) notFound();

  const [items, lastUpdated] = await Promise.all([
    getHenreiItemsByPrefecture(params.slug),
    getHenreiLastUpdated(),
  ]);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
          { name: prefecture.name, path: `/henrei/prefecture/${params.slug}` },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {prefecture.name}の返礼品
        </h1>
        <p className="mt-2 text-muted-foreground">
          {prefecture.name}のふるさと納税返礼品を還元率の高い順に表示しています。
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-muted-foreground">該当する返礼品が見つかりませんでした。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <HenreiItemCard key={item.id} item={item} rank={i + 1} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <FurusatoCta />
      </div>

      <HenreiDisclaimer lastUpdated={lastUpdated} />
    </div>
  );
}

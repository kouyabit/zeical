import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { HenreiItemCard } from "@/components/henrei/henrei-item-card";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import {
  getCategoryBySlug,
} from "@/lib/henrei/constants";
import {
  getHenreiItemsByCategory,
  getHenreiLastUpdated,
} from "@/lib/henrei/store";

interface PageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "カテゴリ" };

  return {
    title: `${category.name}の返礼品`,
    description: `ふるさと納税の${category.name}返礼品一覧。${category.description}`,
    alternates: { canonical: `/henrei/category/${params.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [items, lastUpdated] = await Promise.all([
    getHenreiItemsByCategory(params.slug),
    getHenreiLastUpdated(),
  ]);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
          { name: category.name, path: `/henrei/category/${params.slug}` },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {category.name}の返礼品
        </h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
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

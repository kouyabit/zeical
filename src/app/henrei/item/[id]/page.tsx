import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";
import {
  buildHenreiProductJsonLd,
  buildHenreiFaqJsonLd,
} from "@/lib/henrei/jsonld";
import { ReturnRateBadge } from "@/components/henrei/return-rate-badge";
import { PortalButtons } from "@/components/henrei/portal-buttons";
import { HenreiDisclaimer } from "@/components/henrei/henrei-disclaimer";
import { FurusatoCta } from "@/components/henrei/furusato-cta";
import { HenreiItemImage } from "@/components/henrei/henrei-item-image";
import { buildPortalLinks } from "@/lib/henrei/affiliate-urls";
import { RETURN_RATE_EXPLANATION } from "@/lib/henrei/return-rate";
import { getHenreiItemById } from "@/lib/henrei/store";
import { formatYen } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

/** ビルド時にシードで固定生成しない（楽天の live データをリクエスト時に表示） */
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getHenreiItemById(params.id);
  if (!item) return { title: "返礼品詳細" };

  return {
    title: item.name,
    description:
      item.returnRate > 0
        ? `${item.name}｜寄付額${formatYen(item.donationAmount)}・還元率${item.returnRate}%`
        : `${item.name}｜寄付額${formatYen(item.donationAmount)}`,
    alternates: { canonical: `/henrei/item/${params.id}` },
    openGraph: {
      title: item.name,
      description: item.description,
      images: item.imageUrl ? [{ url: item.imageUrl }] : undefined,
    },
  };
}

export default async function HenreiItemPage({ params }: PageProps) {
  const item = await getHenreiItemById(params.id);
  if (!item) notFound();

  const portalLinks = buildPortalLinks(item);

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "返礼品ナビ", path: "/henrei" },
          { name: item.name, path: `/henrei/item/${params.id}` },
        ])}
      />
      <JsonLd data={buildHenreiProductJsonLd(item)} />
      <JsonLd data={buildHenreiFaqJsonLd(item)} />

      <article className="mx-auto max-w-3xl">
        <header className="mb-6">
          <ReturnRateBadge rate={item.returnRate} />
          <h1 className="mt-3 text-2xl font-bold text-primary md:text-3xl">
            {item.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {item.municipalityName}
          </p>
        </header>

        <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-muted">
          <HenreiItemImage src={item.imageUrl} alt={item.name} loading="eager" />
        </div>

        <p className="mb-6 leading-relaxed text-foreground">
          {item.description}
        </p>

        <dl className="mb-6 grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">寄付額</dt>
            <dd className="text-lg font-bold">{formatYen(item.donationAmount)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">実勢価格（楽天通常販売価格）</dt>
            <dd className="text-lg font-bold">
              {item.marketPrice > 0 ? formatYen(item.marketPrice) : "未算出"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">還元率</dt>
            <dd className="text-lg font-bold">
              {item.returnRate > 0 ? `${item.returnRate}%` : "未算出"}
            </dd>
          </div>
          {item.reviewCount !== undefined && item.reviewCount > 0 && (
            <div>
              <dt className="text-muted-foreground">楽天レビュー</dt>
              <dd className="text-lg font-bold">
                ★{item.reviewAverage}（{item.reviewCount}件）
              </dd>
            </div>
          )}
        </dl>

        <section className="mb-8 rounded-lg bg-secondary p-4">
          <h2 className="mb-2 text-sm font-bold text-primary">還元率の計算根拠</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            {RETURN_RATE_EXPLANATION.map((line) => (
              <li key={line}>{line}</li>
            ))}
            {item.returnRate > 0 && item.marketPrice > 0 && (
              <li>
                本商品: {formatYen(item.marketPrice)} ÷{" "}
                {formatYen(item.donationAmount)} × 100 = {item.returnRate}%
              </li>
            )}
            {item.returnRate <= 0 && (
              <li>
                本商品は説明文から実勢価格を特定できなかったため、還元率は表示していません。
              </li>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-primary">
            各ポータルで返礼品を見る
          </h2>
          <PortalButtons links={portalLinks} />
        </section>

        <FurusatoCta />

        <HenreiDisclaimer lastUpdated={item.updatedAt} />
      </article>
    </div>
  );
}

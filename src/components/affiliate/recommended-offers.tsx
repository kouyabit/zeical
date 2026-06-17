import {
  getOffersByCategory,
  type OfferCategory,
} from "@/lib/affiliate-offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliateLink } from "./affiliate-link";

interface RecommendedOffersProps {
  /** 表示する案件のジャンル */
  category: OfferCategory;
  /** セクション見出し */
  title: string;
}

/**
 * おすすめサービス（アフィリエイト）の一覧をカード形式で表示するセクション。
 * 各カードには「広告」であることを明記し、リンク未設定の案件は「準備中」と表示する。
 */
export function RecommendedOffers({ category, title }: RecommendedOffersProps) {
  const offers = getOffersByCategory(category);
  if (offers.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-primary md:text-2xl">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        ※以下はPR（広告）です。提携先サイトへ移動します。
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {offers.map((offer) => (
          <Card key={offer.id} className="flex h-full flex-col">
            <CardHeader>
              <p className="text-xs font-bold text-cta">{offer.catch}</p>
              <CardTitle className="mt-1 text-lg">{offer.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="flex-1 text-sm text-muted-foreground">
                {offer.description}
              </p>
              <div className="mt-4">
                {offer.url ? (
                  <AffiliateLink
                    href={offer.url}
                    provider={offer.id}
                    asButton
                    className="w-full"
                  >
                    {offer.ctaLabel}
                  </AffiliateLink>
                ) : (
                  // リンク未設定（ASPで取得後に差し替え）の場合は無効表示
                  <span className="inline-flex h-12 w-full items-center justify-center rounded-md bg-muted px-8 text-sm font-bold text-muted-foreground">
                    準備中
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

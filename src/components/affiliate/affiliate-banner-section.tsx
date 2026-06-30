import {
  getOffersByCategory,
  type OfferCategory,
} from "@/lib/affiliate-offers";
import { AffiliateBannerCard } from "./affiliate-banner-card";

interface AffiliateBannerSectionProps {
  /** 表示する案件のジャンル */
  category: OfferCategory;
  /** セクション見出し */
  title: string;
}

/**
 * 控除額シミュレーター等で使う、ASPバナーコードベースのおすすめ枠。
 * 各ASPから取得した href + img src を affiliate-offers.ts に貼り付けて運用する。
 */
export function AffiliateBannerSection({
  category,
  title,
}: AffiliateBannerSectionProps) {
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
          <AffiliateBannerCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

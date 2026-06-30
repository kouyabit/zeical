import { AffiliateLink } from "./affiliate-link";
import { Card, CardContent } from "@/components/ui/card";
import type { AffiliateOffer } from "@/lib/affiliate-offers";
import { isBannerOfferReady } from "@/lib/affiliate-offers";

interface AffiliateBannerCardProps {
  offer: AffiliateOffer;
}

/**
 * ASP（バリューコマース・A8等）のバナーコードを表示するカード。
 * 画像の下にCTA文言を置き、どちらも同じアフィリエイトリンクにする。
 */
export function AffiliateBannerCard({ offer }: AffiliateBannerCardProps) {
  const ready = isBannerOfferReady(offer);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col items-center justify-center p-5">
        {ready ? (
          <AffiliateLink
            href={offer.url}
            provider={offer.id}
            className="flex w-full flex-col items-center gap-2 text-center"
          >
            {/* ASP提供のバナー画像（計測用URLのため img タグをそのまま使う） */}
            <img
              src={offer.bannerSrc}
              alt={`${offer.name}（PR・広告）`}
              width={offer.bannerWidth}
              height={offer.bannerHeight}
              loading="lazy"
              decoding="async"
              className="h-auto max-w-full"
            />
            <span className="text-sm font-bold text-primary underline underline-offset-4">
              {offer.ctaLabel}
            </span>
          </AffiliateLink>
        ) : (
          <div className="flex w-full flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-[60px] w-full max-w-[234px] items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/50 text-xs text-muted-foreground">
              バナー準備中
            </div>
            <p className="text-sm font-bold text-muted-foreground">{offer.name}</p>
            <p className="text-xs text-muted-foreground">{offer.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

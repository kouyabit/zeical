"use client";

import { useState } from "react";
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
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col items-center justify-center p-5">
        {ready ? (
          <AffiliateLink
            href={offer.url}
            provider={offer.id}
            className="flex w-full flex-col items-center gap-2 text-center"
          >
            {/* VC側の審査中は gifbanner が 500 になることがある */}
            {!bannerFailed && (
              <img
                src={offer.bannerSrc}
                alt={`${offer.name}（PR・広告）`}
                width={offer.bannerWidth}
                height={offer.bannerHeight}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setBannerLoaded(true)}
                onError={() => setBannerFailed(true)}
                className={
                  bannerLoaded
                    ? "h-auto max-w-full"
                    : "h-0 w-0 overflow-hidden"
                }
              />
            )}
            {(!bannerLoaded || bannerFailed) && (
              <div className="flex min-h-[60px] w-full max-w-[280px] flex-col items-center justify-center rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-sm font-bold text-primary">{offer.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{offer.catch}</p>
              </div>
            )}
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

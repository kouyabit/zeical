"use client";

import Link from "next/link";
import type { HenreiItem } from "@/types/henrei";
import { formatYen } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnRateBadge } from "./return-rate-badge";
import { HenreiItemImage } from "./henrei-item-image";

interface HenreiItemCardProps {
  item: HenreiItem;
  /** ランキング順位（任意） */
  rank?: number;
}

/** 返礼品1件分のカード表示 */
export function HenreiItemCard({ item, rank }: HenreiItemCardProps) {
  return (
    <Link href={`/henrei/item/${item.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            {rank !== undefined && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {rank}
              </span>
            )}
            <ReturnRateBadge rate={item.returnRate} />
          </div>
          <CardTitle className="mt-2 line-clamp-2 text-sm leading-snug">
            {item.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 aspect-[4/3] overflow-hidden rounded-md bg-muted">
            <HenreiItemImage src={item.imageUrl} alt={item.name} />
          </div>
          <dl className="space-y-1 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">寄付額</dt>
              <dd className="font-bold">{formatYen(item.donationAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">実勢価格</dt>
              <dd className="font-bold">
                {item.marketPrice > 0 ? formatYen(item.marketPrice) : "未算出"}
              </dd>
            </div>
            {item.reviewCount !== undefined && item.reviewCount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">レビュー</dt>
                <dd className="font-bold">
                  ★{item.reviewAverage}（{item.reviewCount}件）
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}

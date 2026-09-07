"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT, isValidAdSlot } from "@/lib/ads";
import { cn } from "@/lib/utils";

// adsbygoogle のグローバル変数を型安全に宣言する（any を使わない）
declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  /** AdSense管理画面で発行した広告ユニットのスロットID（空なら非表示） */
  slot?: string;
  className?: string;
  /** 開発時だけ出すプレースホルダーの説明文 */
  placeholderLabel?: string;
}

/**
 * 広告枠（1つ分のバナー）を表示するコンポーネント。
 * パブリッシャーIDとスロットIDが揃っているときだけ本物の広告を出す。
 * 未設定なら本番では何も出さない（空の「広告スペース」枠は出さない）。
 */
export function AdSlot({
  slot,
  className,
  placeholderLabel = "広告スペース",
}: AdSlotProps) {
  const hasValidSlot = isValidAdSlot(slot);

  // ページ表示後に広告の読み込みを依頼する
  useEffect(() => {
    if (!ADSENSE_CLIENT || !hasValidSlot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告の読み込み失敗はサイトの動作に影響させない
    }
  }, [hasValidSlot]);

  // スロット未設定は本番では非表示。開発中だけ配置確認用の枠を出す
  if (!ADSENSE_CLIENT || !hasValidSlot) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className={cn("my-8", className)}>
        <div className="flex min-h-[72px] items-center justify-center rounded-md border border-dashed border-border bg-muted/40 px-4 text-center text-xs text-muted-foreground">
          {placeholderLabel}
          （開発用。Vercel に NEXT_PUBLIC_ADSENSE_SLOT_* を入れると本番で表示されます）
        </div>
      </div>
    );
  }

  return (
    <div className={cn("my-8 text-center", className)}>
      <span className="mb-1 block text-[10px] text-muted-foreground">
        スポンサーリンク
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

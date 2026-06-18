"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { cn } from "@/lib/utils";

// adsbygoogle のグローバル変数を型安全に宣言する（any を使わない）
declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  /** AdSense管理画面で発行した広告ユニットのスロットID */
  slot: string;
  className?: string;
  /** 広告未設定時に表示するプレースホルダーの説明文 */
  placeholderLabel?: string;
}

/**
 * 広告枠（1つ分のバナー）を表示するコンポーネント。
 * パブリッシャーID（NEXT_PUBLIC_ADSENSE_CLIENT）が設定されていれば本物の広告を、
 * 未設定なら「枠の位置がわかるプレースホルダー」を表示する。
 */
export function AdSlot({
  slot,
  className,
  placeholderLabel = "広告スペース",
}: AdSlotProps) {
  // ページ表示後に広告の読み込みを依頼する
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告の読み込み失敗はサイトの動作に影響させない
    }
  }, []);

  // AdSense未設定のときは、配置を確認できるプレースホルダーを表示する
  if (!ADSENSE_CLIENT) {
    return (
      <div className={cn("my-8", className)}>
        <div className="flex min-h-[72px] items-center justify-center rounded-md border border-dashed border-border bg-muted/40 px-4 text-center text-xs text-muted-foreground">
          {placeholderLabel}（AdSense設定後にここへ広告が表示されます）
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

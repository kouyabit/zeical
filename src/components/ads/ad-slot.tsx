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
}

/**
 * 広告枠（1つ分のバナー）を表示するコンポーネント。
 * パブリッシャーIDが未設定なら何も表示しない。
 */
export function AdSlot({ slot, className }: AdSlotProps) {
  // ページ表示後に広告の読み込みを依頼する
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告の読み込み失敗はサイトの動作に影響させない
    }
  }, []);

  if (!ADSENSE_CLIENT) return null;

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

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdSlot } from "./ad-slot";
import { isValidAdSlot } from "@/lib/ads";

interface StickyBottomAdProps {
  /** AdSense管理画面で発行した広告ユニットのスロットID（空なら非表示） */
  slot?: string;
}

/**
 * 画面下部に固定表示する広告バー。
 * 閉じるボタンで非表示にできる（AdSenseの固定広告ポリシー対策）。
 */
export function StickyBottomAd({ slot }: StickyBottomAdProps) {
  const [closed, setClosed] = useState(false);
  if (closed || !isValidAdSlot(slot)) return null;

  return (
    <>
      {/* 固定バーが本文の最後を隠さないようにするためのスペーサー */}
      <div className="h-24" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="container relative py-2">
          <button
            type="button"
            onClick={() => setClosed(true)}
            aria-label="広告を閉じる"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <AdSlot
            slot={slot}
            className="my-0"
            placeholderLabel="下部固定の広告枠"
          />
        </div>
      </div>
    </>
  );
}

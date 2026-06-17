"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface SliderFieldProps {
  /** input と label を紐付けるID */
  id: string;
  /** 項目名 */
  label: string;
  /** 選べる最小値 */
  min: number;
  /** 選べる最大値 */
  max: number;
  /** 刻み幅（年収なら10000＝1万円刻み） */
  step: number;
  /** いま選ばれている値を見やすく整形した文字列（例: 500万円 / 2人） */
  displayValue: string;
  /** 補足説明（任意） */
  hint?: string;
  /** react-hook-form の register(...) の戻り値 */
  registration: UseFormRegisterReturn;
}

/**
 * スライダー（つまみをドラッグ／スクロールして選ぶ）入力欄。
 * 数字を打ち込まずに、刻み幅ごとに値を選べる。選択中の値は右上に大きく表示する。
 */
export function SliderField({
  id,
  label,
  min,
  max,
  step,
  displayValue,
  hint,
  registration,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-xl font-bold text-primary">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        // accent-cta でつまみ・バーをアクセントカラー（オレンジ）にする
        className="h-2 w-full cursor-pointer accent-cta"
        {...registration}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

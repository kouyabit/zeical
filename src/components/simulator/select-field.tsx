"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import type { NumberOption } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface SelectFieldProps {
  /** input と label を紐付けるID */
  id: string;
  /** 項目名 */
  label: string;
  /** 選択肢の一覧 */
  options: NumberOption[];
  /** 補足説明（任意） */
  hint?: string;
  /** バリデーションエラー（任意） */
  error?: string;
  /** react-hook-form の register(...) の戻り値 */
  registration: UseFormRegisterReturn;
}

/**
 * ドロップダウン（一覧から選ぶ）入力欄。
 * 数字を打ち込まずに、決まった刻みの選択肢から選べる。
 * スマホでは指でスクロールして選ぶピッカーとして表示される。
 */
export function SelectField({
  id,
  label,
  options,
  hint,
  error,
  registration,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        {...registration}
      >
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}

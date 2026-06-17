import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwindのclassを安全に結合するユーティリティ。
 * 条件付きclass（clsx）と、重複した指定の解決（tailwind-merge）をまとめて行う。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 数値を日本円表記（例: 1,234円）にフォーマットする。
 */
export function formatYen(value: number): string {
  // 端数は四捨五入して整数の円で表示する
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

/**
 * 数値を「○○万円」表記（例: 500万円）にフォーマットする。
 * ドロップダウンで年収などを選ぶときの見やすい表示に使う。
 */
export function formatManYen(value: number): string {
  return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
}

/** ドロップダウンの選択肢1つ分（実際の数値と、画面に出す表示文字） */
export interface NumberOption {
  value: number;
  label: string;
}

/**
 * 「最小値〜最大値を step 刻みで並べた選択肢」を作る。
 * 例: buildNumberOptions(0, 30000, 10000, formatManYen) → 0/1万/2万/3万円
 */
export function buildNumberOptions(
  min: number,
  max: number,
  step: number,
  format: (value: number) => string,
): NumberOption[] {
  const options: NumberOption[] = [];
  for (let value = min; value <= max; value += step) {
    options.push({ value, label: format(value) });
  }
  return options;
}

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
 * スライダーで年収などを選んだときの見やすい表示に使う。
 */
export function formatManYen(value: number): string {
  return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
}

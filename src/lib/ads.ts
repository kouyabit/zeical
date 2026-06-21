/**
 * Google AdSense（表示・クリックで収益が出るディスプレイ広告）の共通設定。
 */

/** AdSenseのパブリッシャーID */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-5820360156544018";

/**
 * 広告ユニットのスロットID（AdSense管理画面 > 広告 > 広告ユニット で発行）。
 * 未設定の枠はプレースホルダーのまま表示し、審査通過後にIDを入れる。
 */
export const ADSENSE_SLOTS = {
  /** 計算結果の下（ふるさと納税・副業シミュレーター） */
  result: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT ?? "",
  /** 画面下部の固定バー */
  sticky: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY ?? "",
  /** 記事本文の下 */
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
} as const;

/** 有効なスロットIDかどうか（数字のみ・プレースホルダー除外） */
export function isValidAdSlot(slot: string | undefined): boolean {
  return Boolean(slot && slot !== "0000000000" && /^\d+$/.test(slot));
}

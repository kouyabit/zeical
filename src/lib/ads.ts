/**
 * Google AdSense（表示・クリックで収益が出るディスプレイ広告）の共通設定。
 *
 * スロットIDは AdSense 管理画面で発行した数字のみを入れる。
 * 空のままだと広告枠は出さない（壊れた空枠をユーザーに見せないため）。
 * NEXT_PUBLIC_* はビルド時に埋め込まれるので、Vercel で値を変えたら再デプロイが必要。
 */

/** AdSenseのパブリッシャーID */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-5820360156544018";

/**
 * 広告ユニットのスロットID（AdSense管理画面 > 広告 > 広告ユニット で発行）。
 * 未設定・不正な値の枠は描画しない。架空のIDは入れないこと。
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

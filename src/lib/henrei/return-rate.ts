import { RETURN_GIFT_RATE_LIMIT_PERCENT } from "./constants";

/**
 * 還元率を計算する。
 * 計算式: 実勢価格 ÷ 寄付額 × 100
 */
export function calcReturnRate(marketPrice: number, donationAmount: number): number {
  if (donationAmount <= 0) return 0;
  return Math.round((marketPrice / donationAmount) * 1000) / 10;
}

/** 還元率の計算根拠テキスト（画面表示用） */
export const RETURN_RATE_EXPLANATION = [
  "還元率 ＝ 実勢価格（楽天市場の通常販売価格）÷ 寄付額 × 100",
  "実勢価格は楽天市場APIから取得した商品価格を採用しています。",
  `返礼品の提供上限は2017年総務省通知により、原則として寄付額の${RETURN_GIFT_RATE_LIMIT_PERCENT}%以下が目安とされています。`,
  "本サイトの還元率は参考値です。返礼品の内容・価格は変更される場合があります。",
] as const;

/** 2017年通知の3割ルールを超えているか */
export function exceedsReturnGiftLimit(returnRate: number): boolean {
  return returnRate > RETURN_GIFT_RATE_LIMIT_PERCENT;
}

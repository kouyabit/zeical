/**
 * Google Analytics 4（GA4）に関する共通処理。
 */

/** GA4の測定ID。環境変数から読み込む（未設定なら計測しない） */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// gtag 関数の型をグローバルに宣言（any を使わずに型安全に扱う）
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

/**
 * GA4にカスタムイベントを送信する。
 * gtagが読み込まれていない場合は何もしない（安全に無視する）。
 */
export function sendGaEvent(
  eventName: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
}

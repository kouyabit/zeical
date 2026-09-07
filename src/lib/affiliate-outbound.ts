/**
 * ふるなび出口（/out/furunavi）の応答を組み立てる。
 *
 * ValueCommerce の referral は 302 ではなく、空 body + JS で次へ進む HTML を返す。
 * 新しいタブや広告ブロッカーだと、その JS が動かず空白のまま止まることがある。
 * サイト側では同じタブで開き、ここでは VC URL へ meta refresh / JS で送りつつ、
 * 止まってしまった人向けに手動リンクも出しておく。
 */

const HTML_ESCAPE_LOOKUP: Record<string, string> = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&"'<>]/g, (char) => HTML_ESCAPE_LOOKUP[char] ?? char);
}

/** http(s) 以外は HTML に埋め込まない（クリック先の改ざん対策） */
export function isSafeOutboundHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export interface AffiliateOutboundPageInput {
  /** ValueCommerce の referral URL（vc_url 付き） */
  trackingUrl: string;
  /** VC が止まったときの直接リンク（ふるなび本体） */
  fallbackUrl: string;
  /** 画面に出す行き先の名前 */
  destinationLabel: string;
}

/** 出口ページの HTML。自動遷移 + 手動リンク。 */
export function buildAffiliateOutboundHtml({
  trackingUrl,
  fallbackUrl,
  destinationLabel,
}: AffiliateOutboundPageInput): string {
  if (!isSafeOutboundHttpUrl(trackingUrl) || !isSafeOutboundHttpUrl(fallbackUrl)) {
    throw new Error("出口URLが http(s) ではありません");
  }

  const safeTrackingUrl = escapeHtml(trackingUrl);
  const safeFallbackUrl = escapeHtml(fallbackUrl);
  const safeLabel = escapeHtml(destinationLabel);
  const trackingUrlJs = JSON.stringify(trackingUrl);

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta http-equiv="refresh" content="0;url=${safeTrackingUrl}">
  <title>${safeLabel}へ移動しています</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; margin: 2rem auto; max-width: 36rem; padding: 0 1rem; color: #1f2937; }
    a { color: #0f766e; }
  </style>
  <script>location.replace(${trackingUrlJs});</script>
</head>
<body>
  <p>${safeLabel}へ移動しています…</p>
  <p><a href="${safeTrackingUrl}" rel="nofollow sponsored">自動で開かない場合はこちら</a></p>
  <p><a href="${safeFallbackUrl}" rel="nofollow">ふるなびを直接開く</a></p>
</body>
</html>`;
}

/** サイト内の /out/* は同じタブで開く（VC の JS 中間ページ対策） */
export function isSameTabOutboundHref(href: string): boolean {
  return href.startsWith("/out/");
}

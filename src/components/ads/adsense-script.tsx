import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/ads";

/**
 * AdSenseの本体スクリプトを読み込むコンポーネント（ルートレイアウトで1回だけ使う）。
 * パブリッシャーIDが未設定なら何も出力しない。
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}

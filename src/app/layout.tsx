import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { StickyBottomAd } from "@/components/ads/sticky-bottom-ad";
import { ADSENSE_SLOTS } from "@/lib/ads";
import { siteConfig, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

// 日本語表示に最適化したフォント。CSS変数経由でTailwindから利用する
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

// 全ページ共通のSEOメタデータ（各ページで title などを上書きする）
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name}｜ふるさと納税・副業税金シミュレーター`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "ふるさと納税",
    "控除上限額",
    "副業",
    "税金",
    "シミュレーター",
    "確定申告",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} font-sans`}>
        <GoogleAnalytics />
        <AdSenseScript />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <StickyBottomAd slot={ADSENSE_SLOTS.sticky} />
        <Analytics />
      </body>
    </html>
  );
}

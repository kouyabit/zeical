/**
 * サイト全体で使う共通設定。SEOやヘッダー・フッターから参照する。
 */

/** 本番URL。環境変数があればそれを使い、なければ仮のURLを使う */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeical.example.com";

export const siteConfig = {
  name: "税金まるわかりナビ",
  shortName: "ZeiCal",
  description:
    "ふるさと納税の控除上限額や副業の税金を、年収を入れるだけで簡単にシミュレーション。2025年度の税制に対応した無料の税金計算ツールです。",
  url: SITE_URL,
  locale: "ja_JP",
  // ヘッダーのナビゲーションリンク
  nav: [
    { title: "ふるさと納税シミュレーター", href: "/furusato" },
    { title: "副業税金シミュレーター", href: "/fukugyo" },
    { title: "記事一覧", href: "/articles" },
  ],
} as const;

/** 全ページ共通で表示する免責事項 */
export const DISCLAIMER =
  "本ツールの計算結果はあくまで目安です。正確な金額は最寄りの税務署または税理士にご確認ください。";

/** 返礼品（ふるさと納税）1件分のデータ */
export interface HenreiItem {
  /** 内部ID（楽天 itemCode 等） */
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  /** 寄付額（円） */
  donationAmount: number;
  /** 実勢価格＝楽天市場の通常販売価格（円） */
  marketPrice: number;
  /** 還元率（%）= marketPrice / donationAmount * 100 */
  returnRate: number;
  categorySlug: string;
  prefectureSlug: string;
  municipalityName: string;
  rakutenItemUrl: string;
  reviewAverage?: number;
  reviewCount?: number;
  /** 人気ランキング用スコア（レビュー数×評価等） */
  popularityScore: number;
  updatedAt: string;
}

/** カテゴリ定義 */
export interface HenreiCategory {
  slug: string;
  name: string;
  description: string;
}

/** 都道府県定義 */
export interface HenreiPrefecture {
  slug: string;
  name: string;
}

/** 寄付額帯ページ用 */
export interface HenreiPriceTier {
  amount: number;
  label: string;
}

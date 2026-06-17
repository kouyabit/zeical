/** 記事（コンテンツ）の型定義 */
export interface Article {
  /** URLに使う一意のスラッグ */
  slug: string;
  /** 記事タイトル */
  title: string;
  /** 一覧やメタ情報に使う要約 */
  description: string;
  /** 本文（Markdownではなくプレーンな段落配列として保持） */
  body: string[];
  /** 公開日（ISO 8601形式） */
  publishedAt: string;
}

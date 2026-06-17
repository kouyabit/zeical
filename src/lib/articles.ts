import type { Article } from "@/types/article";
import { getSupabaseClient } from "./supabase";

/**
 * Supabase未設定時にも表示できるサンプル記事。
 * DBが用意できたら articles テーブルの内容が優先される。
 */
const fallbackArticles: Article[] = [
  {
    slug: "furusato-nozei-beginner",
    title: "ふるさと納税とは？初めての人向けにやさしく解説",
    description:
      "ふるさと納税の仕組み、控除上限額の考え方、申し込みから控除までの流れを初心者向けにまとめました。",
    body: [
      "ふるさと納税は、自分が選んだ自治体に寄付をすると、寄付額のうち2,000円を超える部分が所得税・住民税から控除される制度です。",
      "控除を受けられる金額には上限があり、年収や家族構成によって変わります。上限を超えて寄付すると、超えた分は自己負担になります。",
      "まずはシミュレーターで自分の上限額の目安を確認し、その範囲内で寄付先を選ぶのがおすすめです。",
    ],
    publishedAt: "2025-01-15",
  },
  {
    slug: "fukugyo-tax-basics",
    title: "副業の税金の基本｜いくらから確定申告が必要？",
    description:
      "副業を始めたときに知っておきたい税金の基礎知識。確定申告が必要になる目安や、所得税・住民税の考え方を解説します。",
    body: [
      "会社員が副業をする場合、給与以外の所得が年間20万円を超えると、原則として所得税の確定申告が必要になります。",
      "一方で、20万円以下でも住民税の申告は別途必要になるケースがあるため注意が必要です。",
      "副業の利益（収入から経費を引いた額）に対して、本業の所得に応じた税率で所得税が、さらに約10%の住民税がかかります。",
    ],
    publishedAt: "2025-02-01",
  },
];

/**
 * 公開済み記事の一覧を取得する。
 * Supabaseが使えない場合はサンプル記事を返す。
 */
export async function getArticles(): Promise<Article[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackArticles;

  const { data, error } = await supabase
    .from("articles")
    .select("slug, title, description, body, publishedAt:published_at")
    .order("published_at", { ascending: false });

  if (error || !data) return fallbackArticles;
  return data as Article[];
}

/**
 * スラッグを指定して1件の記事を取得する。見つからなければ null。
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

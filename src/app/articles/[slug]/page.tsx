import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { DisclaimerNote } from "@/components/simulator/disclaimer-note";

interface PageProps {
  params: { slug: string };
}

// ビルド時に記事ページを静的生成するためのパラメータ一覧
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

// 記事ごとに動的にメタデータを生成する
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "記事が見つかりません" };

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  // 記事が存在しない場合は404ページを表示する
  if (!article) notFound();

  return (
    <article className="container max-w-3xl py-10">
      <JsonLd data={buildArticleJsonLd(article)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "記事一覧", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">
          記事一覧
        </Link>
        <span className="mx-2">/</span>
        <span>{article.title}</span>
      </nav>

      <h1 className="text-2xl font-bold leading-tight text-primary md:text-3xl">
        {article.title}
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">
        公開日: {article.publishedAt}
      </p>

      <div className="mt-8 space-y-4 leading-relaxed text-foreground">
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <DisclaimerNote />
    </article>
  );
}

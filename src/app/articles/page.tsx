import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/lib/articles";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "記事一覧｜ふるさと納税・副業の税金がわかる",
  description:
    "ふるさと納税や副業の税金について、初心者にもわかりやすく解説した記事の一覧です。",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "記事一覧", path: "/articles" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">記事一覧</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          税金の基礎知識をわかりやすく解説しています。
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {article.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {article.publishedAt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

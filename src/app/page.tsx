import Link from "next/link";
import { ArrowRight, Gift, Briefcase, ShieldCheck, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSiteJsonLd } from "@/lib/jsonld";
import { getArticles } from "@/lib/articles";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const articles = await getArticles();
  const latestArticles = articles.slice(0, 3);

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />

      {/* ヒーローセクション */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center md:py-24">
          <h1 className="text-balance text-3xl font-bold leading-tight md:text-5xl">
            税金まるわかりナビ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-primary-foreground/90 md:text-lg">
            ふるさと納税の控除上限額も、副業の税金も、年収を入れるだけで今すぐ計算。
            2025年度の税制に対応した無料シミュレーターです。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/furusato"
              className={cn(buttonVariants({ variant: "cta", size: "lg" }))}
            >
              ふるさと納税を計算する
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/fukugyo"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white bg-transparent text-white hover:bg-white hover:text-primary",
              )}
            >
              副業の税金を計算する
            </Link>
          </div>
        </div>
      </section>

      {/* シミュレーター・返礼品ナビ紹介 */}
      <section className="container py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <SimulatorCard
            href="/furusato"
            icon={<Gift className="h-7 w-7" aria-hidden="true" />}
            title="ふるさと納税シミュレーター"
            description="年収や家族構成から、自己負担2,000円で寄付できる控除上限額の目安をすぐに確認できます。"
          />
          <SimulatorCard
            href="/henrei"
            icon={<Search className="h-7 w-7" aria-hidden="true" />}
            title="返礼品ナビ"
            description="還元率・人気度・寄付額帯でふるさと納税の返礼品を横断検索。上限額に合う返礼品が見つかります。"
          />
          <SimulatorCard
            href="/fukugyo"
            icon={<Briefcase className="h-7 w-7" aria-hidden="true" />}
            title="副業税金シミュレーター"
            description="本業の年収と副業の収入・経費から、増える所得税・住民税と手取りの目安を計算します。"
          />
        </div>
      </section>

      {/* 信頼ポイント */}
      <section className="bg-secondary">
        <div className="container grid gap-8 py-14 md:grid-cols-3">
          <Feature
            title="2025年度の税制に対応"
            text="所得税法・地方税法に基づき、最新の控除額・税率で計算します。"
          />
          <Feature
            title="完全無料・登録不要"
            text="会員登録なしで、何度でも無料でシミュレーションできます。"
          />
          <Feature
            title="計算の根拠を明示"
            text="課税所得や税率など、計算の内訳もあわせて確認できます。"
          />
        </div>
      </section>

      {/* 新着記事 */}
      <section className="container py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">新着記事</h2>
          <Link
            href="/articles"
            className="text-sm font-bold text-primary hover:underline"
          >
            記事一覧へ
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

// トップページ内で使う小さな部品（同ファイル内で完結させる）
function SimulatorCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
            {icon}
          </div>
          <CardTitle className="mt-3">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cta">
            計算する <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <ShieldCheck
        className="h-6 w-6 shrink-0 text-cta"
        aria-hidden="true"
      />
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

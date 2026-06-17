import type { Metadata } from "next";
import { siteConfig, operatorInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "運営者情報・お問い合わせ",
  description: `${siteConfig.name}の運営者情報とお問い合わせ先のご案内です。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-primary md:text-3xl">
        運営者情報・お問い合わせ
      </h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="text-lg font-bold">サイトについて</h2>
          <p className="mt-2">
            「{siteConfig.name}（{siteConfig.shortName}
            ）」は、ふるさと納税の控除上限額や副業の税金を、年収を入れるだけで手軽に試算できる無料シミュレーターサイトです。
            計算は最新の税制に基づいていますが、結果はあくまで目安です。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold">運営者</h2>
          <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-y-2">
            <dt className="text-muted-foreground">運営者</dt>
            <dd className="font-bold">{operatorInfo.name}</dd>
            <dt className="text-muted-foreground">連絡先</dt>
            <dd className="font-bold">{operatorInfo.contactEmail}</dd>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-bold">お問い合わせ</h2>
          <p className="mt-2">
            掲載内容に関するご質問・ご指摘は、上記の連絡先までメールでお問い合わせください。
            内容を確認のうえ、順次対応いたします。
          </p>
        </section>
      </div>
    </div>
  );
}

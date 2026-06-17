import type { Metadata } from "next";
import { siteConfig, operatorInfo } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${siteConfig.name}における個人情報の取り扱い、アクセス解析、広告配信についての方針です。`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-primary md:text-3xl">
        プライバシーポリシー
      </h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="text-lg font-bold">アクセス解析ツールについて</h2>
          <p className="mt-2">
            当サイトでは、サイトの利用状況を把握するためにGoogleアナリティクス（GA4）を利用しています。
            このツールはCookieを使用して匿名のトラフィックデータを収集します。データは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold">広告配信について</h2>
          <p className="mt-2">
            当サイトでは、第三者配信の広告サービス（Google
            AdSense）およびアフィリエイトプログラムを利用する場合があります。
            広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
          </p>
          <p className="mt-2">
            Cookieを無効にする設定や、Googleの広告に関する設定は、各ブラウザの設定やGoogleの「広告設定」ページから変更できます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold">アフィリエイトプログラムについて</h2>
          <p className="mt-2">
            当サイトは、Amazonアソシエイト・楽天アフィリエイトをはじめとする各種アフィリエイトプログラムに参加しており、
            これらを通じて商品・サービスを紹介し、紹介料を得る場合があります。広告である箇所には「広告」「PR」と明記します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold">免責事項</h2>
          <p className="mt-2">
            当サイトの計算結果や掲載情報はあくまで目安であり、正確性・完全性を保証するものではありません。
            掲載情報の利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold">お問い合わせ</h2>
          <p className="mt-2">
            本ポリシーに関するお問い合わせは、{operatorInfo.contactEmail}{" "}
            までご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}

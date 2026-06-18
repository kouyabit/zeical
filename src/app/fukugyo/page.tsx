import type { Metadata } from "next";
import { FukugyoSimulator } from "@/components/simulator/fukugyo-simulator";
import { RecommendedOffers } from "@/components/affiliate/recommended-offers";
import { JsonLd } from "@/components/seo/json-ld";
import { buildSimulatorJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "副業税金シミュレーター｜いくら税金が増える？【2025年度版】",
  description:
    "本業の年収と副業の収入・経費を入力するだけで、副業で増える所得税・住民税と手取りの目安を計算。確定申告が必要かの目安もわかる無料ツールです。",
  alternates: { canonical: "/fukugyo" },
  openGraph: {
    title: "副業税金シミュレーター｜いくら税金が増える？【2025年度版】",
    description:
      "副業で増える所得税・住民税と手取りの目安をかんたん計算。2025年度税制対応の無料ツール。",
    url: "/fukugyo",
  },
};

export default function FukugyoPage() {
  return (
    <div className="container py-10">
      <JsonLd
        data={buildSimulatorJsonLd(
          "副業税金シミュレーター",
          metadata.description ?? "",
          "/fukugyo",
        )}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "副業税金シミュレーター", path: "/fukugyo" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          副業税金シミュレーター
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          本業の年収と副業の収入・経費から、増える税金と手取りの目安を計算します。
        </p>
      </header>

      <FukugyoSimulator />

      <RecommendedOffers
        category="tax-software"
        title="確定申告がラクになる会計ソフト"
      />
      <RecommendedOffers category="side-job" title="副業を始めるなら" />
    </div>
  );
}

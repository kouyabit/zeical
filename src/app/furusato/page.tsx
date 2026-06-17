import type { Metadata } from "next";
import { FurusatoSimulator } from "@/components/simulator/furusato-simulator";
import { JsonLd } from "@/components/seo/json-ld";
import { buildSimulatorJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "ふるさと納税 控除上限額シミュレーター【2025年度版】",
  description:
    "年収・家族構成を入力するだけで、ふるさと納税の控除上限額（自己負担2,000円の目安）をかんたん計算。2025年度の税制に対応した無料ツールです。",
  alternates: { canonical: "/furusato" },
  openGraph: {
    title: "ふるさと納税 控除上限額シミュレーター【2025年度版】",
    description:
      "年収・家族構成から控除上限額の目安をかんたん計算。2025年度税制対応の無料ツール。",
    url: "/furusato",
  },
};

export default function FurusatoPage() {
  return (
    <div className="container py-10">
      <JsonLd
        data={buildSimulatorJsonLd(
          "ふるさと納税 控除上限額シミュレーター",
          metadata.description ?? "",
          "/furusato",
        )}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "ふるさと納税シミュレーター", path: "/furusato" },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">
          ふるさと納税 控除上限額シミュレーター
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          年収や家族構成を入力すると、自己負担2,000円で寄付できる控除上限額の目安を計算します。
        </p>
      </header>

      <FurusatoSimulator />
    </div>
  );
}

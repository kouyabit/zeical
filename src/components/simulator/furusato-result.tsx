import Link from "next/link";
import type { FurusatoResult } from "@/types/tax";
import { formatYen, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ResultBarChart } from "./result-bar-chart";
import { DisclaimerNote } from "./disclaimer-note";
import { buttonVariants } from "@/components/ui/button";
import { HENREI_PRICE_TIERS, findNearestPriceTier } from "@/lib/henrei/constants";
import { FURUSATO_SELF_PAYMENT } from "@/lib/calculations/constants";

interface FurusatoResultViewProps {
  result: FurusatoResult;
}

/**
 * ふるさと納税の計算結果を表示する。
 * 控除上限額・グラフ・内訳・免責事項・寄付サイトへのCTAをまとめる。
 */
export function FurusatoResultView({ result }: FurusatoResultViewProps) {
  // グラフ用データ: 控除される額と自己負担2,000円の対比
  const chartData = [
    {
      name: "控除される額",
      value: Math.max(0, result.donationLimit - FURUSATO_SELF_PAYMENT),
      color: "#0F4C81",
    },
    {
      name: "自己負担",
      value: FURUSATO_SELF_PAYMENT,
      color: "#F39C12",
    },
  ];

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <p className="text-sm font-bold text-muted-foreground">
          控除上限額の目安
        </p>
        <p className="mt-1 text-4xl font-bold text-primary">
          {formatYen(result.donationLimit)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          この金額までの寄付なら、自己負担は実質2,000円が目安です。
        </p>

        <div className="mt-6">
          <ResultBarChart data={chartData} />
        </div>

        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between border-b border-border py-1.5">
            <dt className="text-muted-foreground">課税所得（所得税ベース）</dt>
            <dd className="font-bold">
              {formatYen(result.taxableIncomeForIncomeTax)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border py-1.5">
            <dt className="text-muted-foreground">住民税の所得割額</dt>
            <dd className="font-bold">
              {formatYen(result.residentTaxIncomeLevy)}
            </dd>
          </div>
          <div className="flex justify-between py-1.5">
            <dt className="text-muted-foreground">適用される所得税率</dt>
            <dd className="font-bold">
              {Math.round(result.marginalIncomeTaxRate * 100)}%
            </dd>
          </div>
        </dl>

        {result.donationLimit > 0 && (
          <div className="mt-6 text-center">
            <Link
              href={`/henrei/price/${findNearestPriceTier(result.donationLimit, HENREI_PRICE_TIERS)}`}
              className={cn(buttonVariants({ variant: "cta", size: "lg" }))}
            >
              上限額に合う返礼品を探す
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              控除上限額に近い寄付額帯の返礼品一覧へ移動します
            </p>
          </div>
        )}

        <DisclaimerNote />
      </CardContent>
    </Card>
  );
}

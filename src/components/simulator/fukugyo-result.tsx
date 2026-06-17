import type { FukugyoResult } from "@/types/tax";
import { formatYen } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ResultBarChart } from "./result-bar-chart";
import { DisclaimerNote } from "./disclaimer-note";

interface FukugyoResultViewProps {
  result: FukugyoResult;
}

/**
 * 副業税金の計算結果を表示する。
 * 増える税金・手取り・確定申告の要否・グラフ・免責事項をまとめる。
 */
export function FukugyoResultView({ result }: FukugyoResultViewProps) {
  // グラフ用データ: 手取り・増える所得税・増える住民税の内訳
  const chartData = [
    { name: "手取り", value: Math.max(0, result.netSideIncome), color: "#0F4C81" },
    {
      name: "増える所得税",
      value: result.additionalIncomeTax,
      color: "#F39C12",
    },
    {
      name: "増える住民税",
      value: result.additionalResidentTax,
      color: "#7FB3D5",
    },
  ];

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-6">
        <p className="text-sm font-bold text-muted-foreground">
          副業で増える税金の目安
        </p>
        <p className="mt-1 text-4xl font-bold text-primary">
          {formatYen(result.totalAdditionalTax)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          副業所得 {formatYen(result.sideIncome)} に対する増加分の目安です。
        </p>

        <div className="mt-6">
          <ResultBarChart data={chartData} />
        </div>

        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between border-b border-border py-1.5">
            <dt className="text-muted-foreground">増える所得税（復興税込）</dt>
            <dd className="font-bold">
              {formatYen(result.additionalIncomeTax)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border py-1.5">
            <dt className="text-muted-foreground">増える住民税</dt>
            <dd className="font-bold">
              {formatYen(result.additionalResidentTax)}
            </dd>
          </div>
          <div className="flex justify-between py-1.5">
            <dt className="text-muted-foreground">副業の手取り</dt>
            <dd className="font-bold text-primary">
              {formatYen(result.netSideIncome)}
            </dd>
          </div>
        </dl>

        {/* 確定申告の要否を案内（一般的な情報であり個別アドバイスではない） */}
        {result.needsTaxReturn ? (
          <Alert variant="warning" className="mt-4">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              副業所得が20万円を超えているため、原則として所得税の確定申告が必要になる可能性があります。
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="info" className="mt-4">
            <AlertDescription>
              副業所得が20万円以下のため所得税の確定申告は原則不要ですが、住民税の申告は別途必要な場合があります。
            </AlertDescription>
          </Alert>
        )}

        <DisclaimerNote />
      </CardContent>
    </Card>
  );
}

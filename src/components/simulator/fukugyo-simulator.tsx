"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fukugyoFormSchema,
  type FukugyoFormValues,
  type FukugyoFormOutput,
} from "@/lib/schemas";
import { calcFukugyoTax } from "@/lib/calculations/fukugyo";
import type { FukugyoResult } from "@/types/tax";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./field-shell";
import { FukugyoResultView } from "./fukugyo-result";
import { sendGaEvent } from "@/lib/analytics";

/**
 * 副業税金シミュレーター（入力フォーム＋結果表示）。
 */
export function FukugyoSimulator() {
  const [result, setResult] = useState<FukugyoResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FukugyoFormValues, unknown, FukugyoFormOutput>({
    resolver: zodResolver(fukugyoFormSchema),
    defaultValues: {
      mainAnnualIncome: 5_000_000,
      mainSocialInsurance: "",
      sideRevenue: 500_000,
      sideExpenses: 100_000,
      sideIncomeType: "miscellaneous",
    },
  });

  const onSubmit = (values: FukugyoFormOutput) => {
    const calculated = calcFukugyoTax({
      mainAnnualIncome: values.mainAnnualIncome,
      mainSocialInsurance: values.mainSocialInsurance,
      sideRevenue: values.sideRevenue,
      sideExpenses: values.sideExpenses,
      sideIncomeType: values.sideIncomeType,
    });
    setResult(calculated);
    sendGaEvent("simulate", { tool: "fukugyo" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>条件を入力</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldShell
              htmlFor="mainAnnualIncome"
              label="本業の年収（額面）"
              error={errors.mainAnnualIncome?.message}
            >
              <Input
                id="mainAnnualIncome"
                type="number"
                inputMode="numeric"
                {...register("mainAnnualIncome")}
              />
            </FieldShell>

            <FieldShell
              htmlFor="mainSocialInsurance"
              label="本業の社会保険料（年間・任意）"
              hint="未入力の場合は年収の約15%で概算します"
              error={errors.mainSocialInsurance?.message}
            >
              <Input
                id="mainSocialInsurance"
                type="number"
                inputMode="numeric"
                placeholder="例: 750000"
                {...register("mainSocialInsurance")}
              />
            </FieldShell>

            <div className="grid grid-cols-2 gap-4">
              <FieldShell
                htmlFor="sideRevenue"
                label="副業の年間収入"
                error={errors.sideRevenue?.message}
              >
                <Input
                  id="sideRevenue"
                  type="number"
                  inputMode="numeric"
                  {...register("sideRevenue")}
                />
              </FieldShell>
              <FieldShell
                htmlFor="sideExpenses"
                label="副業の必要経費"
                error={errors.sideExpenses?.message}
              >
                <Input
                  id="sideExpenses"
                  type="number"
                  inputMode="numeric"
                  {...register("sideExpenses")}
                />
              </FieldShell>
            </div>

            <FieldShell
              htmlFor="sideIncomeType"
              label="副業の所得区分"
              error={errors.sideIncomeType?.message}
            >
              <select
                id="sideIncomeType"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("sideIncomeType")}
              >
                <option value="miscellaneous">雑所得（フリマ・副収入など）</option>
                <option value="business">事業所得（開業届あり）</option>
              </select>
            </FieldShell>

            <Button type="submit" variant="cta" size="lg" className="w-full">
              副業の税金を計算する
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        {result ? (
          <FukugyoResultView result={result} />
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed">
            <p className="p-8 text-center text-sm text-muted-foreground">
              左側に本業の年収と副業の収入・経費を入力して
              <br />
              「副業の税金を計算する」を押すと、
              <br />
              ここに結果が表示されます。
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

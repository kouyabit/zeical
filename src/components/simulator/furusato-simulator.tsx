"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  furusatoFormSchema,
  type FurusatoFormValues,
  type FurusatoFormOutput,
} from "@/lib/schemas";
import { calcFurusatoLimit } from "@/lib/calculations/furusato";
import type { FurusatoResult } from "@/types/tax";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./field-shell";
import { FurusatoResultView } from "./furusato-result";
import { sendGaEvent } from "@/lib/analytics";

/**
 * ふるさと納税控除上限額シミュレーター（入力フォーム＋結果表示）。
 */
export function FurusatoSimulator() {
  const [result, setResult] = useState<FurusatoResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FurusatoFormValues, unknown, FurusatoFormOutput>({
    resolver: zodResolver(furusatoFormSchema),
    defaultValues: {
      annualIncome: 5_000_000,
      socialInsurance: "",
      hasSpouse: false,
      generalDependents: 0,
      specificDependents: 0,
      otherDeductions: 0,
    },
  });

  // 入力が正しいときに計算を実行し、結果を画面に反映する
  const onSubmit = (values: FurusatoFormOutput) => {
    const calculated = calcFurusatoLimit({
      annualIncome: values.annualIncome,
      socialInsurance: values.socialInsurance,
      hasSpouse: values.hasSpouse,
      generalDependents: values.generalDependents,
      specificDependents: values.specificDependents,
      otherDeductions: values.otherDeductions,
    });
    setResult(calculated);
    // 計算実行をGA4で計測（人気の入力傾向を把握するため）
    sendGaEvent("simulate", { tool: "furusato" });
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
              htmlFor="annualIncome"
              label="年収（額面）"
              hint="ボーナス込みの年間給与収入を入力してください"
              error={errors.annualIncome?.message}
            >
              <Input
                id="annualIncome"
                type="number"
                inputMode="numeric"
                {...register("annualIncome")}
              />
            </FieldShell>

            <FieldShell
              htmlFor="socialInsurance"
              label="社会保険料（年間・任意）"
              hint="未入力の場合は年収の約15%で概算します"
              error={errors.socialInsurance?.message}
            >
              <Input
                id="socialInsurance"
                type="number"
                inputMode="numeric"
                placeholder="例: 750000"
                {...register("socialInsurance")}
              />
            </FieldShell>

            <div className="flex items-center gap-2">
              <input
                id="hasSpouse"
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-primary"
                {...register("hasSpouse")}
              />
              <label htmlFor="hasSpouse" className="text-sm font-bold">
                配偶者控除の対象となる配偶者がいる
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldShell
                htmlFor="generalDependents"
                label="一般扶養（人）"
                error={errors.generalDependents?.message}
              >
                <Input
                  id="generalDependents"
                  type="number"
                  inputMode="numeric"
                  {...register("generalDependents")}
                />
              </FieldShell>
              <FieldShell
                htmlFor="specificDependents"
                label="特定扶養19-22歳（人）"
                error={errors.specificDependents?.message}
              >
                <Input
                  id="specificDependents"
                  type="number"
                  inputMode="numeric"
                  {...register("specificDependents")}
                />
              </FieldShell>
            </div>

            <FieldShell
              htmlFor="otherDeductions"
              label="その他の所得控除（任意）"
              hint="医療費控除・生命保険料控除などの合計"
              error={errors.otherDeductions?.message}
            >
              <Input
                id="otherDeductions"
                type="number"
                inputMode="numeric"
                {...register("otherDeductions")}
              />
            </FieldShell>

            <Button type="submit" variant="cta" size="lg" className="w-full">
              控除上限額を計算する
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        {result ? (
          <FurusatoResultView result={result} />
        ) : (
          <Card className="flex h-full items-center justify-center border-dashed">
            <p className="p-8 text-center text-sm text-muted-foreground">
              左側に年収などを入力して
              <br />
              「控除上限額を計算する」を押すと、
              <br />
              ここに結果が表示されます。
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

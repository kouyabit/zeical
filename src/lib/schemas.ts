import { z } from "zod";

/**
 * フォーム入力のバリデーション定義（Zod）。
 * 数値入力は文字列で渡ってくるため coerce で数値に変換する。
 */

// 0円以上の金額（円）を表す共通スキーマ
const yenAmount = z.coerce
  .number({ error: "数字を入力してください" })
  .min(0, "0以上の金額を入力してください")
  .max(1_000_000_000, "金額が大きすぎます");

// 0人以上の人数を表す共通スキーマ
const personCount = z.coerce
  .number({ error: "数字を入力してください" })
  .int("整数で入力してください")
  .min(0, "0以上で入力してください")
  .max(20, "人数が多すぎます");

// 任意入力の金額。空欄は「未入力（undefined）」として扱う。
// ※Zodの数値変換は空文字を0にしてしまうため、先に空欄をundefinedへ変換する
const optionalYenAmount = z.preprocess(
  (value) => (value === "" || value === undefined || value === null
    ? undefined
    : value),
  yenAmount.optional(),
);

/** ふるさと納税シミュレーターのフォームスキーマ */
export const furusatoFormSchema = z.object({
  annualIncome: yenAmount,
  socialInsurance: optionalYenAmount,
  hasSpouse: z.boolean(),
  generalDependents: personCount,
  specificDependents: personCount,
  otherDeductions: yenAmount,
});

export type FurusatoFormValues = z.input<typeof furusatoFormSchema>;
export type FurusatoFormOutput = z.output<typeof furusatoFormSchema>;

/** 副業税金シミュレーターのフォームスキーマ */
export const fukugyoFormSchema = z.object({
  mainAnnualIncome: yenAmount,
  mainSocialInsurance: optionalYenAmount,
  sideRevenue: yenAmount,
  sideExpenses: yenAmount,
  sideIncomeType: z.enum(["miscellaneous", "business"]),
});

export type FukugyoFormValues = z.input<typeof fukugyoFormSchema>;
export type FukugyoFormOutput = z.output<typeof fukugyoFormSchema>;

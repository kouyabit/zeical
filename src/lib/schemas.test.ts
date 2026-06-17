import { describe, expect, it } from "vitest";
import { furusatoFormSchema, fukugyoFormSchema } from "./schemas";

describe("ふるさと納税フォームのバリデーション", () => {
  it("社会保険料が空欄なら undefined になる（0ではない）", () => {
    const parsed = furusatoFormSchema.parse({
      annualIncome: "5000000",
      socialInsurance: "",
      hasSpouse: false,
      generalDependents: "0",
      specificDependents: "0",
      otherDeductions: "0",
    });
    // 空欄は「未入力」を意味する undefined に変換されること
    expect(parsed.socialInsurance).toBeUndefined();
    expect(parsed.annualIncome).toBe(5_000_000);
  });

  it("社会保険料に数値を入れればその数値になる", () => {
    const parsed = furusatoFormSchema.parse({
      annualIncome: "5000000",
      socialInsurance: "750000",
      hasSpouse: true,
      generalDependents: "1",
      specificDependents: "0",
      otherDeductions: "0",
    });
    expect(parsed.socialInsurance).toBe(750_000);
    expect(parsed.hasSpouse).toBe(true);
    expect(parsed.generalDependents).toBe(1);
  });
});

describe("副業フォームのバリデーション", () => {
  it("本業の社会保険料が空欄なら undefined になる", () => {
    const parsed = fukugyoFormSchema.parse({
      mainAnnualIncome: "5000000",
      mainSocialInsurance: "",
      sideRevenue: "500000",
      sideExpenses: "100000",
      sideIncomeType: "miscellaneous",
    });
    expect(parsed.mainSocialInsurance).toBeUndefined();
    expect(parsed.sideRevenue).toBe(500_000);
  });
});

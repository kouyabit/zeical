import { describe, expect, it } from "vitest";
import { calcFukugyoTax } from "./fukugyo";
import type { FukugyoInput } from "@/types/tax";

function baseInput(overrides: Partial<FukugyoInput> = {}): FukugyoInput {
  return {
    mainAnnualIncome: 5_000_000,
    sideRevenue: 500_000,
    sideExpenses: 100_000,
    sideIncomeType: "miscellaneous",
    ...overrides,
  };
}

describe("副業税金", () => {
  it("副業所得は収入から経費を引いた額", () => {
    const result = calcFukugyoTax(baseInput());
    expect(result.sideIncome).toBe(400_000);
  });

  it("経費が収入を上回っても副業所得はマイナスにならない", () => {
    const result = calcFukugyoTax(
      baseInput({ sideRevenue: 100_000, sideExpenses: 300_000 }),
    );
    expect(result.sideIncome).toBe(0);
    expect(result.totalAdditionalTax).toBe(0);
  });

  it("住民税の増加分は副業所得の10%", () => {
    const result = calcFukugyoTax(baseInput());
    expect(result.additionalResidentTax).toBe(40_000);
  });

  it("年収500万円帯では所得税の限界税率10%が反映される", () => {
    // 年収500万円は社会保険料控除などを引くと課税所得が約233万円となり、
    // 所得税は10%区分。増える所得税 ≒ 400,000 × 10% × 1.021 = 40,840円
    const result = calcFukugyoTax(baseInput());
    expect(result.additionalIncomeTax).toBeCloseTo(40_840, 0);
  });

  it("高所得（年収1,200万円）では限界税率が上がり増える所得税も大きくなる", () => {
    const lower = calcFukugyoTax(baseInput());
    const higher = calcFukugyoTax(baseInput({ mainAnnualIncome: 12_000_000 }));
    expect(higher.additionalIncomeTax).toBeGreaterThan(lower.additionalIncomeTax);
  });

  it("副業所得20万円超で確定申告が必要", () => {
    const result = calcFukugyoTax(baseInput());
    expect(result.needsTaxReturn).toBe(true);
  });

  it("副業所得20万円以下なら確定申告は不要", () => {
    const result = calcFukugyoTax(
      baseInput({ sideRevenue: 200_000, sideExpenses: 50_000 }),
    );
    expect(result.needsTaxReturn).toBe(false);
  });

  it("手取りは副業所得から増える税金を引いた額", () => {
    const result = calcFukugyoTax(baseInput());
    expect(result.netSideIncome).toBeCloseTo(
      result.sideIncome - result.totalAdditionalTax,
      5,
    );
  });
});

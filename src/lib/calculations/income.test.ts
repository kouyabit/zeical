import { describe, expect, it } from "vitest";
import {
  calcEmploymentIncome,
  calcEmploymentIncomeDeduction,
  calcIncomeTax,
  getMarginalIncomeTaxRate,
  resolveSocialInsurance,
  withReconstructionTax,
} from "./income";

describe("給与所得控除", () => {
  it("162.5万円以下は一律55万円", () => {
    expect(calcEmploymentIncomeDeduction(1_000_000)).toBe(550_000);
  });

  it("年収500万円は20%+44万円", () => {
    // 5,000,000 × 0.2 + 440,000 = 1,440,000
    expect(calcEmploymentIncomeDeduction(5_000_000)).toBe(1_440_000);
  });

  it("850万円超は上限195万円で頭打ち", () => {
    expect(calcEmploymentIncomeDeduction(10_000_000)).toBe(1_950_000);
  });
});

describe("給与所得", () => {
  it("年収500万円の給与所得は356万円", () => {
    // 5,000,000 − 1,440,000 = 3,560,000
    expect(calcEmploymentIncome(5_000_000)).toBe(3_560_000);
  });
});

describe("社会保険料の推定", () => {
  it("未指定なら年収の15%を返す", () => {
    expect(resolveSocialInsurance(5_000_000)).toBe(750_000);
  });

  it("指定があればその値を返す", () => {
    expect(resolveSocialInsurance(5_000_000, 600_000)).toBe(600_000);
  });
});

describe("所得税額（速算表）", () => {
  it("課税所得0円は税額0円", () => {
    expect(calcIncomeTax(0)).toBe(0);
  });

  it("課税所得300万円は10%区分で202,500円", () => {
    // 3,000,000 × 0.10 − 97,500 = 202,500
    expect(calcIncomeTax(3_000_000)).toBe(202_500);
  });

  it("課税所得500万円は20%区分で572,500円", () => {
    // 5,000,000 × 0.20 − 427,500 = 572,500
    expect(calcIncomeTax(5_000_000)).toBe(572_500);
  });
});

describe("限界税率", () => {
  it("課税所得300万円の限界税率は10%", () => {
    expect(getMarginalIncomeTaxRate(3_000_000)).toBe(0.1);
  });

  it("課税所得500万円の限界税率は20%", () => {
    expect(getMarginalIncomeTaxRate(5_000_000)).toBe(0.2);
  });
});

describe("復興特別所得税", () => {
  it("所得税額に2.1%上乗せする", () => {
    expect(withReconstructionTax(100_000)).toBeCloseTo(102_100, 5);
  });
});

import { describe, expect, it } from "vitest";
import { calcFurusatoLimit } from "./furusato";
import type { FurusatoInput } from "@/types/tax";

// 独身・扶養なしの基本ケースを作るヘルパー
function baseInput(overrides: Partial<FurusatoInput> = {}): FurusatoInput {
  return {
    annualIncome: 5_000_000,
    hasSpouse: false,
    generalDependents: 0,
    specificDependents: 0,
    otherDeductions: 0,
    ...overrides,
  };
}

describe("ふるさと納税 控除上限額", () => {
  it("年収500万・独身・社保15%概算で上限が妥当な範囲に収まる", () => {
    const result = calcFurusatoLimit(baseInput());
    // 一般的なシミュレーターの目安（およそ5〜7万円）の範囲に入ること
    expect(result.donationLimit).toBeGreaterThan(40_000);
    expect(result.donationLimit).toBeLessThan(80_000);
  });

  it("年収が高いほど上限額は大きくなる", () => {
    const low = calcFurusatoLimit(baseInput({ annualIncome: 4_000_000 }));
    const high = calcFurusatoLimit(baseInput({ annualIncome: 8_000_000 }));
    expect(high.donationLimit).toBeGreaterThan(low.donationLimit);
  });

  it("配偶者控除があると上限額は下がる", () => {
    const single = calcFurusatoLimit(baseInput());
    const married = calcFurusatoLimit(baseInput({ hasSpouse: true }));
    expect(married.donationLimit).toBeLessThan(single.donationLimit);
  });

  it("課税所得が発生しない低収入では上限0円", () => {
    const result = calcFurusatoLimit(baseInput({ annualIncome: 1_000_000 }));
    expect(result.donationLimit).toBe(0);
  });

  it("上限額は100円単位に丸められる", () => {
    const result = calcFurusatoLimit(baseInput());
    expect(result.donationLimit % 100).toBe(0);
  });
});

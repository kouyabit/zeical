import { describe, expect, it } from "vitest";
import { calcReturnRate, exceedsReturnGiftLimit } from "./return-rate";

describe("calcReturnRate", () => {
  it("実勢価格÷寄付額×100を計算する", () => {
    expect(calcReturnRate(2900, 10000)).toBe(29);
    expect(calcReturnRate(5800, 20000)).toBe(29);
  });

  it("寄付額0の場合は0を返す", () => {
    expect(calcReturnRate(1000, 0)).toBe(0);
  });
});

describe("exceedsReturnGiftLimit", () => {
  it("3割超過を判定する", () => {
    expect(exceedsReturnGiftLimit(31)).toBe(true);
    expect(exceedsReturnGiftLimit(30)).toBe(false);
    expect(exceedsReturnGiftLimit(29)).toBe(false);
  });
});

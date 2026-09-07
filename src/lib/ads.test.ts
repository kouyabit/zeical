import { describe, expect, it } from "vitest";
import { isValidAdSlot } from "./ads";
import { FURUNAVI_BANNER_SRC } from "./affiliate-config";

describe("isValidAdSlot", () => {
  it("数字のみのスロットIDなら有効", () => {
    expect(isValidAdSlot("1234567890")).toBe(true);
  });

  it("空やプレースホルダーは無効（広告枠を出さない）", () => {
    expect(isValidAdSlot("")).toBe(false);
    expect(isValidAdSlot(undefined)).toBe(false);
    expect(isValidAdSlot("0000000000")).toBe(false);
    expect(isValidAdSlot("ca-pub-123")).toBe(false);
  });
});

describe("ふるなびバナー", () => {
  it("img src は自前ホストで、ValueCommerce gifbanner に依存しない", () => {
    expect(FURUNAVI_BANNER_SRC.startsWith("/")).toBe(true);
    expect(FURUNAVI_BANNER_SRC).not.toContain("valuecommerce.com");
  });
});

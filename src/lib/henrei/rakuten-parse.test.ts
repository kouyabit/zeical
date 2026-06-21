import { describe, expect, it } from "vitest";
import {
  extractMarketPriceFromText,
  extractYenAmounts,
  inferPrefectureSlug,
  resolveDonationAmount,
  resolveRakutenImageUrl,
} from "./rakuten-parse";

describe("resolveDonationAmount", () => {
  it("itemPrice を寄付額として優先する", () => {
    expect(resolveDonationAmount(24000, "【ふるさと納税】うなぎ")).toBe(24000);
  });

  it("itemPrice が 0 のとき商品名から推定する", () => {
    expect(resolveDonationAmount(0, "【ふるさと納税】1万円コース")).toBe(10000);
  });
});

describe("extractYenAmounts", () => {
  it("カンマ付き円表記を抽出する", () => {
    expect(extractYenAmounts("参考価格 7,200円、寄付 24,000円")).toEqual([
      7200, 24000,
    ]);
  });
});

describe("extractMarketPriceFromText", () => {
  it("寄付額より小さい参考価格を実勢価格として選ぶ", () => {
    const text = "類似返礼品 7,200円 本返礼品 24,000円";
    expect(extractMarketPriceFromText(text, 24000)).toBe(7200);
  });

  it("3割ルールを大きく超える金額は除外する", () => {
    const text = "通常 20,000円";
    expect(extractMarketPriceFromText(text, 10000)).toBeNull();
  });
});

describe("resolveRakutenImageUrl", () => {
  const sampleUrl =
    "https://thumbnail.image.rakuten.co.jp/@0_mall/shop/cabinet/img.jpg?_ex=128x128";

  it("formatVersion=2（文字列配列）からURLを取り出す", () => {
    expect(resolveRakutenImageUrl([sampleUrl])).toContain("_ex=300x300");
  });

  it("formatVersion=1（オブジェクト配列）からURLを取り出す", () => {
    expect(
      resolveRakutenImageUrl([{ imageUrl: sampleUrl }]),
    ).toContain("_ex=300x300");
  });

  it("medium が空なら smallImageUrls にフォールバックする", () => {
    expect(resolveRakutenImageUrl([], [sampleUrl])).toContain("_ex=300x300");
  });
});

describe("inferPrefectureSlug", () => {
  it("shopName から都道府県slugを推定する", () => {
    expect(inferPrefectureSlug("宮崎県宮崎市", "")).toBe("miyazaki");
    expect(inferPrefectureSlug("北海道別海町", "")).toBe("hokkaido");
  });
});

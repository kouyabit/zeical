import { describe, expect, it } from "vitest";
import { FURUNAVI_SITE_URL, FURUNAVI_VC_REFERRAL } from "./affiliate-config";
import {
  buildAffiliateOutboundHtml,
  isSafeOutboundHttpUrl,
  isSameTabOutboundHref,
} from "./affiliate-outbound";

describe("isSafeOutboundHttpUrl", () => {
  it("https なら許可する", () => {
    expect(isSafeOutboundHttpUrl("https://furunavi.jp/")).toBe(true);
  });

  it("javascript: は拒否する", () => {
    expect(isSafeOutboundHttpUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("isSameTabOutboundHref", () => {
  it("サイト内の /out は同じタブ", () => {
    expect(isSameTabOutboundHref("/out/furunavi")).toBe(true);
    expect(isSameTabOutboundHref("/out/furunavi/search?keyword=米")).toBe(true);
  });

  it("外部URLは同じタブ対象にしない", () => {
    expect(isSameTabOutboundHref("https://furunavi.jp/")).toBe(false);
  });
});

describe("buildAffiliateOutboundHtml", () => {
  it("VC の tracking URL とふるなび直リンクを両方含める", () => {
    const html = buildAffiliateOutboundHtml({
      trackingUrl: FURUNAVI_VC_REFERRAL,
      fallbackUrl: FURUNAVI_SITE_URL,
      destinationLabel: "ふるなび",
    });

    expect(html).toContain("valuecommerce.com/servlet/referral");
    expect(html).toContain("vc_url=");
    expect(html).toContain("furunavi.jp");
    expect(html).toContain('rel="nofollow sponsored"');
    expect(html).toContain('<meta http-equiv="refresh"');
    expect(html).toContain("location.replace(");
    expect(html).toContain("ふるなびを直接開く");
  });

  it("URL 内の & を HTML 属性ではエスケープする", () => {
    const html = buildAffiliateOutboundHtml({
      trackingUrl: FURUNAVI_VC_REFERRAL,
      fallbackUrl: FURUNAVI_SITE_URL,
      destinationLabel: "ふるなび",
    });

    expect(html).toContain("&amp;vc_url=");
    expect(html).not.toMatch(/href="[^"]*&vc_url=/);
  });
});

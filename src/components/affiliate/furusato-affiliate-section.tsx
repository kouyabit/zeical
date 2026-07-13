import Link from "next/link";
import type { AffiliateOffer } from "@/lib/affiliate-offers";
import {
  buildRakutenAffiliateUrl,
  FURUNAVI_VC_BANNER_SRC,
  FURUNAVI_VC_REFERRAL,
  RAKUTEN_FURUSATO_URL,
} from "@/lib/affiliate-config";
import { AffiliateBannerCard } from "./affiliate-banner-card";
import { AffiliateLink } from "./affiliate-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** ふるなび（VC公式バナー・pid=892658067） */
const furunaviOffer: AffiliateOffer = {
  id: "furunavi",
  name: "ふるなび",
  catch: "高還元のふるさと納税サイト",
  description:
    "寄付でふるなびコインがもらえる、人気のふるさと納税ポータル。家電などの返礼品も豊富です。",
  ctaLabel: "ふるなびで返礼品を探す",
  category: "furusato",
  // href は vc_url 付き（referral のみだと VC サイトに留まることがある）
  url: FURUNAVI_VC_REFERRAL,
  bannerSrc: FURUNAVI_VC_BANNER_SRC,
};

/**
 * 控除額シミュレーター下のおすすめ枠。
 * 提携済みのふるなび（VCバナー）と楽天ふるさと納税を表示する。
 */
export function FurusatoAffiliateSection() {
  const rakutenUrl = buildRakutenAffiliateUrl(RAKUTEN_FURUSATO_URL);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-primary md:text-2xl">
        ふるさと納税のおすすめサイト
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        ※以下はPR（広告）です。提携先サイトへ移動します。
      </p>

      <div className="mx-auto mt-5 grid max-w-3xl gap-5 md:grid-cols-2">
        <AffiliateBannerCard offer={furunaviOffer} />

        <Card className="flex h-full flex-col">
          <CardHeader>
            <p className="text-xs font-bold text-cta">
              楽天ポイントが貯まる・使える
            </p>
            <CardTitle className="mt-1 text-lg">楽天ふるさと納税</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-4">
            <p className="flex-1 text-sm text-muted-foreground">
              普段の楽天での買い物と同じ感覚で寄付ができ、楽天ポイントも貯まるのが魅力です。
            </p>
            <AffiliateLink
              href={rakutenUrl}
              provider="rakuten-furusato"
              asButton
              className="w-full"
            >
              楽天ふるさと納税で返礼品を探す
            </AffiliateLink>
          </CardContent>
        </Card>
      </div>

      <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-muted-foreground">
        還元率から探すなら{" "}
        <Link
          href="/henrei"
          className="font-bold text-primary underline underline-offset-4 hover:text-brand-dark"
        >
          返礼品ナビ
        </Link>
        もご利用ください。
      </p>
    </section>
  );
}

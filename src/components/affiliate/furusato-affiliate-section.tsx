import Link from "next/link";
import {
  buildRakutenAffiliateUrl,
  RAKUTEN_FURUSATO_URL,
} from "@/lib/affiliate-config";
import { AffiliateLink } from "./affiliate-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 控除額シミュレーター下のおすすめ枠。
 * 提携審査中のポータルは出さず、楽天ふるさと納税のみ表示する。
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

      <div className="mx-auto mt-5 max-w-lg">
        <Card>
          <CardHeader>
            <p className="text-xs font-bold text-cta">
              楽天ポイントが貯まる・使える
            </p>
            <CardTitle className="mt-1 text-lg">楽天ふるさと納税</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
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
            <p className="text-center text-sm text-muted-foreground">
              還元率から探すなら{" "}
              <Link
                href="/henrei"
                className="font-bold text-primary underline underline-offset-4 hover:text-brand-dark"
              >
                返礼品ナビ
              </Link>
              もご利用ください。
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

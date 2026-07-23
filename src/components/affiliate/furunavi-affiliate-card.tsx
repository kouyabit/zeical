import { FURUNAVI_VC_BANNER_SRC } from "@/lib/affiliate-config";
import { Card, CardContent } from "@/components/ui/card";
import { FurunaviAffiliateLink } from "./furunavi-affiliate-link";

/** ふるなび VC バナー（クリックは /out/furunavi 経由） */
export function FurunaviAffiliateCard() {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col items-center justify-center p-5">
        <FurunaviAffiliateLink
          path="/out/furunavi"
          className="flex w-full flex-col items-center gap-2 text-center"
        >
          <img
            src={FURUNAVI_VC_BANNER_SRC}
            alt="ふるなび（PR・広告）"
            width={234}
            height={60}
            loading="lazy"
            decoding="async"
            className="h-auto max-w-full"
          />
          <span className="text-sm font-bold text-primary underline underline-offset-4">
            ふるなびで返礼品を探す
          </span>
        </FurunaviAffiliateLink>
      </CardContent>
    </Card>
  );
}

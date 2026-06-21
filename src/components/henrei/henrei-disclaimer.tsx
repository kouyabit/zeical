import { RETURN_RATE_EXPLANATION } from "@/lib/henrei/return-rate";

interface HenreiDisclaimerProps {
  lastUpdated: string;
}

/**
 * 景品表示法・還元率に関する免責事項。
 * 「最大」「No.1」等は根拠データを併記し、比較表には更新日を明示する。
 */
export function HenreiDisclaimer({ lastUpdated }: HenreiDisclaimerProps) {
  const updatedDate = new Date(lastUpdated).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <aside className="mt-8 rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
      <p className="font-bold text-foreground">表示に関する注意事項</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {RETURN_RATE_EXPLANATION.map((line) => (
          <li key={line}>{line}</li>
        ))}
        <li>
          ランキングの「人気」は楽天市場のレビュー数×評価点の集計値に基づきます。
        </li>
        <li>
          掲載情報は{updatedDate}時点のものです。返礼品の内容・価格・在庫は変更される場合があります。
        </li>
      </ul>
    </aside>
  );
}

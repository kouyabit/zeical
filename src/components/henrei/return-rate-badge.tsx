import { exceedsReturnGiftLimit } from "@/lib/henrei/return-rate";

interface ReturnRateBadgeProps {
  rate: number;
}

/** 還元率バッジ（3割ルール超過時は警告色） */
export function ReturnRateBadge({ rate }: ReturnRateBadgeProps) {
  const isOverLimit = exceedsReturnGiftLimit(rate);

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold ${
        isOverLimit
          ? "bg-destructive/10 text-destructive"
          : "bg-cta/10 text-cta"
      }`}
    >
      還元率 {rate}%
    </span>
  );
}

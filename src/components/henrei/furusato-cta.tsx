import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 返礼品ページからふるさと納税シミュレーターへのCTA */
export function FurusatoCta() {
  return (
    <div className="rounded-lg border border-primary/20 bg-secondary p-6 text-center">
      <h3 className="font-bold text-primary">
        まずは控除上限額を確認しませんか？
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        年収と家族構成から、ふるさと納税の控除上限額の目安を無料で計算できます。
      </p>
      <Link
        href="/furusato"
        className={cn(buttonVariants({ variant: "cta", size: "lg" }), "mt-4")}
      >
        ふるさと納税の控除上限を計算する
      </Link>
    </div>
  );
}

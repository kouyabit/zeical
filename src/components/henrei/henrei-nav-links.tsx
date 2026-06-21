import Link from "next/link";
import {
  HENREI_CATEGORIES,
  HENREI_PREFECTURES,
  HENREI_PRICE_TIERS,
} from "@/lib/henrei/constants";

/** 返礼品ナビの横断リンク（カテゴリ・都道府県・寄付額帯） */
export function HenreiNavLinks() {
  return (
    <nav aria-label="返礼品ナビの絞り込み" className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-bold text-primary">寄付額帯</h3>
        <ul className="flex flex-wrap gap-2">
          {HENREI_PRICE_TIERS.map((tier) => (
            <li key={tier.amount}>
              <Link
                href={`/henrei/price/${tier.amount}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-secondary"
              >
                {tier.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold text-primary">カテゴリ</h3>
        <ul className="flex flex-wrap gap-2">
          {HENREI_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/henrei/category/${cat.slug}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-secondary"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold text-primary">都道府県</h3>
        <ul className="flex flex-wrap gap-2">
          {HENREI_PREFECTURES.map((pref) => (
            <li key={pref.slug}>
              <Link
                href={`/henrei/prefecture/${pref.slug}`}
                className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-secondary"
              >
                {pref.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

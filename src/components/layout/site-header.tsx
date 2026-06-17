import Link from "next/link";
import { Calculator } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * 全ページ共通のヘッダー。ロゴと主要ページへのナビゲーションを表示する。
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Calculator className="h-6 w-6" aria-hidden="true" />
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-bold">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

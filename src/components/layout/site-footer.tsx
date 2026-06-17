import Link from "next/link";
import { siteConfig, DISCLAIMER } from "@/lib/site";

/**
 * 全ページ共通のフッター。免責事項とサイト内リンクを表示する。
 */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-secondary">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-bold text-primary">{siteConfig.name}</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="フッターナビゲーション">
            <ul className="grid gap-2 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 免責事項は税理士法対策としても重要なので必ず表示する */}
        <p className="mt-8 rounded-md bg-background p-4 text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {currentYear} {siteConfig.name}（{siteConfig.shortName}）
        </p>
      </div>
    </footer>
  );
}

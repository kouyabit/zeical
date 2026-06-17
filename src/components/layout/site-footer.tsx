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
              <li>
                <Link
                  href="/about"
                  className="text-foreground hover:text-primary hover:underline"
                >
                  運営者情報・お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-foreground hover:text-primary hover:underline"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 免責事項は税理士法対策としても重要なので必ず表示する */}
        <p className="mt-8 rounded-md bg-background p-4 text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>

        {/* 広告・アフィリエイト利用の明示（ステマ規制・AdSense要件への対応） */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          当サイトは、アフィリエイトプログラムおよびGoogle
          AdSenseによる広告を掲載しています。詳しくは
          <Link href="/privacy" className="underline hover:text-primary">
            プライバシーポリシー
          </Link>
          をご覧ください。
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          &copy; {currentYear} {siteConfig.name}（{siteConfig.shortName}）
        </p>
      </div>
    </footer>
  );
}

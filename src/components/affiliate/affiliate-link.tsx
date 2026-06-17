"use client";

import { cn } from "@/lib/utils";
import { sendGaEvent } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";

interface AffiliateLinkProps {
  /** リンク先URL（アフィリエイトURL） */
  href: string;
  /** アフィリエイトプロバイダ名（例: rakuten, satofull など） */
  provider: string;
  /** リンクテキスト（子要素） */
  children: React.ReactNode;
  /** ボタン風に見せるかどうか（CTAボタンとして使う場合） */
  asButton?: boolean;
  className?: string;
}

/**
 * アフィリエイトリンク。クリックをGA4イベントで計測し、
 * SEO/規約上必要な rel="nofollow sponsored" を必ず付与する。
 */
export function AffiliateLink({
  href,
  provider,
  children,
  asButton = false,
  className,
}: AffiliateLinkProps) {
  // クリック時にGA4へ「affiliate_click」イベントを送信する
  const handleClick = () => {
    sendGaEvent("affiliate_click", {
      affiliate_provider: provider,
      link_url: href,
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      // nofollow と sponsored を必ず付与（規約・ガイドライン遵守）
      rel="nofollow sponsored noopener noreferrer"
      data-aff={provider}
      className={cn(
        asButton
          ? buttonVariants({ variant: "cta", size: "lg" })
          : "font-bold text-primary underline underline-offset-4 hover:text-brand-dark",
        className,
      )}
    >
      {children}
    </a>
  );
}

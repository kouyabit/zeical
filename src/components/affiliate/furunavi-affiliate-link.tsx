"use client";

import { sendGaEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface FurunaviAffiliateLinkProps {
  /** サイト内の出口パス（例: /out/furunavi） */
  path: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * ふるなび向けアフィリエイトリンク。
 * 外部 VC URL ではなく同一サイトの /out/* 経由にし、Referer 付きで VC へ渡す。
 */
export function FurunaviAffiliateLink({
  path,
  children,
  className,
}: FurunaviAffiliateLinkProps) {
  return (
    <a
      href={path}
      target="_blank"
      rel="nofollow sponsored noopener"
      data-aff="furunavi"
      onClick={() =>
        sendGaEvent("affiliate_click", {
          affiliate_provider: "furunavi",
          link_url: path,
        })
      }
      className={cn(className)}
    >
      {children}
    </a>
  );
}

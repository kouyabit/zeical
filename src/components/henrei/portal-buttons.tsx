"use client";

import { sendGaEvent } from "@/lib/analytics";
import type { PortalLink } from "@/lib/henrei/affiliate-urls";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortalButtonsProps {
  links: PortalLink[];
}

/** 4ポータル（楽天/さとふる/ふるなび/Yahoo!）へのアフィリエイトボタン群 */
export function PortalButtons({ links }: PortalButtonsProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-muted-foreground">
        PR・広告（各ポータルサイトへ移動します）
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.portal}
            href={link.href}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            data-portal={link.portal}
            onClick={() =>
              sendGaEvent("affiliate_click", {
                event_label: link.portal,
                affiliate_provider: link.portal,
                link_url: link.href,
              })
            }
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full text-sm",
            )}
          >
            {link.label}で見る
          </a>
        ))}
      </div>
    </div>
  );
}

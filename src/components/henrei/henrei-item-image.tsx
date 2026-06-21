"use client";

import { useState } from "react";

interface HenreiItemImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
      画像なし
    </div>
  );
}

/** 返礼品の商品画像（URLが空・読み込み失敗時はプレースホルダー） */
export function HenreiItemImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  loading = "lazy",
}: HenreiItemImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ImagePlaceholder />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

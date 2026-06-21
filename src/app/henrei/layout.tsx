/** 返礼品データは最大1時間ごとに再取得（楽天APIキャッシュ） */
export const revalidate = 3600;

export default function HenreiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

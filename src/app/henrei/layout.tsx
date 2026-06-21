/**
 * 返礼品データはリクエスト時に取得する（ビルド時は楽天APIを呼ばずシードになるため）。
 * 楽天API本体は unstable_cache で最大24時間キャッシュされる。
 */
export const dynamic = "force-dynamic";

export default function HenreiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

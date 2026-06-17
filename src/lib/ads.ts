/**
 * Google AdSense（表示・クリックで収益が出るディスプレイ広告）の共通設定。
 */

/**
 * AdSenseのパブリッシャーID（例: ca-pub-1234567890123456）。
 * 環境変数 NEXT_PUBLIC_ADSENSE_CLIENT に設定すると広告が有効になる。
 * 未設定のときは広告タグを一切出力しない（審査前や開発中も安全）。
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

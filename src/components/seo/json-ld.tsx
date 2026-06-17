/**
 * 構造化データ（JSON-LD）を出力する汎用コンポーネント。
 * 渡したオブジェクトを <script type="application/ld+json"> として埋め込む。
 */
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // 構造化データはHTMLにそのまま埋め込む必要があるためdangerouslySetInnerHTMLを使う
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

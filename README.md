# 税金まるわかりナビ（ZeiCal）

ふるさと納税の控除上限額と、副業でかかる税金を計算できる無料シミュレーターサイトです。
2025年度（令和7年度）の税制に準拠しています。

## 技術スタック

- **Next.js 14**（App Router）+ **TypeScript**
- **Tailwind CSS**（shadcn/ui スタイルのUIコンポーネント）
- **React Hook Form** + **Zod**（フォームとバリデーション）
- **Recharts**（結果のグラフ表示）
- **Supabase**（記事・コンテンツ管理／未設定でもサンプル記事で動作）
- **Vitest**（計算ロジックの単体テスト）

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 環境変数の用意（必要に応じて値を設定）
cp .env.example .env.local

# 開発サーバーの起動（http://localhost:3000）
npm run dev
```

### 環境変数

`.env.example` を参照してください。すべて任意で、未設定でもサイトは動作します。

| 変数名 | 用途 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | OGPやsitemapの絶対URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 の測定ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase のプロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の匿名キー |

## よく使うコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run test` | 単体テスト実行（計算ロジック・バリデーション） |
| `npm run lint` | ESLint チェック |
| `npm run typecheck` | 型チェック（tsc --noEmit） |

## ディレクトリ構造

```
src/
├── app/                      # ページ（App Router）
│   ├── page.tsx              # トップ
│   ├── furusato/             # ふるさと納税シミュレーター
│   ├── fukugyo/              # 副業税金シミュレーター
│   ├── articles/             # 記事一覧・記事詳細（[slug]）
│   ├── sitemap.ts            # sitemap.xml 自動生成
│   └── robots.ts             # robots.txt 自動生成
├── components/
│   ├── ui/                   # 汎用UI（button, card, input ...）
│   ├── simulator/            # 計算機UI（フォーム・グラフ・結果）
│   ├── layout/               # ヘッダー・フッター
│   ├── seo/                  # JSON-LD 構造化データ
│   ├── affiliate/            # アフィリエイトリンク
│   └── analytics/            # GA4 タグ
├── lib/
│   ├── calculations/         # 税金計算ロジック（+ 単体テスト）
│   ├── schemas.ts            # Zod バリデーション
│   ├── articles.ts           # 記事取得（Supabase / フォールバック）
│   ├── supabase.ts           # Supabase クライアント
│   └── utils.ts              # cn() などの汎用ユーティリティ
└── types/                    # 型定義
```

## 計算ロジックについて

- 計算は 2025年度の所得税法・地方税法に基づいています。各計算式には根拠コメントを記載しています。
- 結果は**あくまで目安**です。社会保険料を未入力にした場合は年収の約15%で概算します。
- すべての計算ロジックには Vitest による単体テストを用意しています。

> 本ツールの計算結果は目安です。正確な金額は最寄りの税務署または税理士にご確認ください。

## 注意事項

- 個別具体的な税務アドバイスは行いません（税理士法に配慮）。
- アフィリエイトリンクには `rel="nofollow sponsored"` と `data-aff` 属性を付与し、クリックを GA4 で計測します。

import { defineConfig } from "vitest/config";
import path from "node:path";

// パスエイリアス @/ を src/ に解決させる設定
// ※拡張子を .mts にしているのは、Next.jsの本番ビルド（*.ts の型チェック）に
//   テスト用設定ファイルを巻き込ませないため。
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});

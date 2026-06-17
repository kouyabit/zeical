import { defineConfig } from "vitest/config";
import path from "node:path";

// パスエイリアス @/ を src/ に解決させる設定
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

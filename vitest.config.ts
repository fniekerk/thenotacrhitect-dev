import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
      exclude: [
        "node_modules/**",
        ".next/**",
        ".velite/**",
        "**/*.config.*",
        "**/*.d.ts",
        "__tests__/setup.ts",
        "app/feed.xml/**",
        "app/sitemap.ts",
      ],
    },
  },
  resolve: {
    // Array form preserves order — most-specific first so @/.velite wins over @/
    alias: [
      {
        find: "@/.velite",
        replacement: path.resolve(__dirname, "./__tests__/mocks/velite-module.ts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "."),
      },
    ],
  },
});

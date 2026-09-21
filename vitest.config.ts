import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineVitestConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      css: true,
      exclude: ["node_modules", "dist", "storybook-static", "e2e"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        exclude: ["**/*.stories.tsx", "src/test/**", "**/*.d.ts"],
      },
    },
  }),
);

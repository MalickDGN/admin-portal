import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      "@": path.resolve(__dirname, "../src"),
      "@ui": path.resolve(__dirname, "../src/components/ui"),
      "@theme": path.resolve(__dirname, "../src/theme"),
      "@features": path.resolve(__dirname, "../src/features"),
      "@services": path.resolve(__dirname, "../src/services"),
      "@hooks": path.resolve(__dirname, "../src/hooks"),
      "@store": path.resolve(__dirname, "../src/store"),
      "@utils": path.resolve(__dirname, "../src/utils"),
      "@types": path.resolve(__dirname, "../src/types"),
    };
    return viteConfig;
  },
};

export default config;

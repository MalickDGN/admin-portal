import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";
import "../src/theme/global.css";

// Applique le mode clair/dark choisi dans la toolbar Storybook au ThemeProvider réel,
// pour que chaque composant du catalogue reflète fidèlement le Design System.
function ThemeSync({ mode, children }: { mode: "light" | "dark"; children: React.ReactNode }) {
  const { setMode } = useTheme();
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  return <>{children}</>;
}

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
  },
  globalTypes: {
    themeMode: {
      description: "Thème du Design System",
      defaultValue: "light",
      toolbar: {
        title: "Thème",
        icon: "mirror",
        items: [
          { value: "light", title: "Clair" },
          { value: "dark", title: "Sombre" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider>
        <ThemeSync mode={context.globals.themeMode ?? "light"}>
          <div style={{ padding: "24px", background: "var(--color-background)", minHeight: "100vh" }}>
            <Story />
          </div>
        </ThemeSync>
      </ThemeProvider>
    ),
  ],
};

export default preview;

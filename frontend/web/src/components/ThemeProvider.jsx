import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export default function ThemeProvider({ children }) {
  const { initTheme, theme } = useThemeStore();

  // Initialize theme once on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Apply theme (and react to system theme if needed)
  useEffect(() => {
    const html = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" && prefersDark.matches);

      html.classList.toggle("dark", isDark);

      const themeColor = isDark ? "#07111f" : "#ffffff";
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", themeColor);
    };

    // apply immediately
    applyTheme();

    // react when system theme changes
    if (theme === "system") {
      prefersDark.addEventListener("change", applyTheme);
      return () => prefersDark.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return <>{children}</>;
}

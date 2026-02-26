import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light", // 'light' | 'dark' | 'system'
      isDark: false,

      setTheme: (theme) => {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        let isDarkMode = false;

        if (theme === "system") {
          isDarkMode = systemPrefersDark;
        } else {
          isDarkMode = theme === "dark";
        }

        // Update HTML class
        const html = document.documentElement;
        if (isDarkMode) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }

        set({ theme, isDark: isDarkMode });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },

      // Initialize theme on mount
      initTheme: () => {
        const { theme } = get();
        get().setTheme(theme);
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

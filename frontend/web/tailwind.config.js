/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      /* ================================
         🎨 Design Token Color Mapping
      =================================*/
      colors: {
        /* Semantic surface + text tokens
           These map to CSS variables from :root / .dark
           and automatically switch theme */
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",

        card: "var(--card-bg)",
        border: "var(--card-border)",

        text: "var(--text)",
        muted: "var(--text-muted)",
        icon: "var(--icon)",

        /* CTA + Action tokens */
        cta: "var(--cta-bg)",
        "cta-hover": "var(--cta-bg-hover)",
        "cta-text": "var(--cta-text)",


        /* ================================
           🌿 Your Existing Brand Palettes
           (preserved — still usable directly)
        =================================*/
        primary: {
          50: "#fef7f0",
          100: "#fde8d5",
          200: "#fbd0b0",
          300: "#f8ac7a",
          400: "#f58444",
          500: "#C84C0C",
          600: "#a33f0a",
          700: "#8a3508",
          800: "#732b06",
          900: "#5d2205",
        },

        secondary: {
          50: "#f1f3f4",
          100: "#e3e7ea",
          200: "#c7cfd5",
          300: "#a0b0bd",
          400: "#7e94a7",
          500: "#4E6A7E",
          600: "#405567",
          700: "#334450",
          800: "#293744",
          900: "#212f3a",
        },

        accent: {
          50: "#f7f7f7",
          100: "#eeeeee",
          200: "#dddddd",
          300: "#c1c1c1",
          400: "#999999",
          500: "#666666",
          600: "#525252",
          700: "#404040",
          800: "#2f2f2f",
          900: "#1f1f1f",
        },

        brand: {
          50: "#f8f7f4",
          100: "#f0ede7",
          200: "#e1dacf",
          300: "#cdbda8",
          400: "#b19a7e",
          500: "#5A4633",
          600: "#4a3a29",
          700: "#3f3122",
          800: "#34291c",
          900: "#2c2318",
        },

        electric: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },

        royal: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },

        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },

        "dark-bg": {
          50: "#0f172a",
          100: "#111827",
          200: "#1f2937",
          300: "#374151",
          400: "#4b5563",
          500: "#6b7280",
          600: "#9ca3af",
          700: "#d1d5db",
          800: "#e5e7eb",
          900: "#f9fafb",
        },
      },

      /* ================================
         🔳 Shadow tokens (mapped to CSS vars)
      =================================*/
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",

        // your originals kept for compatibility
        soft: "0 2px 15px -3px rgba(212, 175, 55, 0.1), 0 10px 20px -2px rgba(212, 175, 55, 0.04)",
        medium:
          "0 4px 25px -5px rgba(212, 175, 55, 0.15), 0 10px 10px -5px rgba(212, 175, 55, 0.04)",
        strong:
          "0 10px 40px -10px rgba(212, 175, 55, 0.2), 0 4px 25px -5px rgba(212, 175, 55, 0.1)",
        glow: "0 0 20px rgba(212, 175, 55, 0.3)",
      },

      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        roboto: ["Roboto", "ui-sans-serif", "system-ui"],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },

  plugins: [],
};

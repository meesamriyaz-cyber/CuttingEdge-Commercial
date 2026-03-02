/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      /* ================================
         🎨 Calm Serene Color Palette
      =================================*/
      colors: {
        /* Surface + Text - Mapped to CSS variables */
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",

        card: "var(--card-bg)",
        border: "var(--card-border)",

        text: "var(--text)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",

        /* CTA + Action tokens */
        cta: "var(--cta-bg)",
        "cta-hover": "var(--cta-bg-hover)",
        "cta-text": "var(--cta-text)",

        /* Primary - Serene Sage */
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        /* Accent - Deep Teal */
        accent: {
          50: "#E8F0F0",
          100: "#D1E1E1",
          200: "#A3C3C3",
          300: "#75A5A5",
          400: "#4A7566",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "#1E3A3A",
          800: "#172D2D",
          900: "#112222",
        },

        /* Secondary - Warm Sand */
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "#9A8670",
          700: "#7A6B58",
          800: "#5E5243",
          900: "#4A4134",
        },

        /* Legacy brand colors (kept for compatibility) */
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
         🔳 Shadow tokens
      =================================*/
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        
        // Legacy shadows kept for compatibility
        soft: "0 2px 15px -3px rgba(212, 175, 55, 0.1), 0 10px 20px -2px rgba(212, 175, 55, 0.04)",
        medium: "0 4px 25px -5px rgba(212, 175, 55, 0.15), 0 10px 10px -5px rgba(212, 175, 55, 0.04)",
        strong: "0 10px 40px -10px rgba(212, 175, 55, 0.2), 0 4px 25px -5px rgba(212, 175, 55, 0.1)",
        glow: '0 0 20px rgba(212, 175, 55, 0.3)',
      },

      /* ================================
         🔤 Typography
      =================================*/
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        display: ["Playfair Display", "serif"],
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

      /* ================================
         📐 Spacing
      =================================*/
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      /* ================================
         🔘 Border Radius
      =================================*/
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      /* ================================
         ✨ Animation
      =================================*/
      animation: {
        "gentle-float": "gentle-float 4s ease-in-out infinite",
        "subtle-pulse": "subtle-pulse 3s ease-in-out infinite",
        "soft-glow": "soft-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        breathe: "breathe 4s ease-in-out infinite",
      },

      /* ================================
         🎭 Transition
      =================================*/
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  plugins: [],
};

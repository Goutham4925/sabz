import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Lato", "system-ui", "sans-serif"],
      },

      /* ---------------------------------
         🌶️ KERALA SPICE COLOR SYSTEM
      ---------------------------------- */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* PRIMARY – CHILLI RED */
        primary: {
          DEFAULT: "#b91c1c",          // deep chilli red
          foreground: "#ffffff",
        },

        /* SECONDARY – TURMERIC GOLD */
        secondary: {
          DEFAULT: "#f59e0b",          // turmeric
          foreground: "#1a1a1a",
        },

        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },

        muted: {
          DEFAULT: "#f3e8e1",
          foreground: "#6b4b3e",
        },

        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#1a1a1a",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* FOOTER / DARK SECTIONS – PEPPER BROWN */
        chocolate: {
          DEFAULT: "#7c2d12",
          light: "#b45309",
        },

        /* GOLDEN HIGHLIGHTS */
        golden: {
          DEFAULT: "#f59e0b",
          glow: "#fde68a",
        },

        /* LIGHT NEUTRALS */
        cream: {
          DEFAULT: "#fff7ed",
          dark: "#fdebd3",
        },

        "warm-white": "#fffbf5",

        /* SIDEBAR */
        sidebar: {
          DEFAULT: "#7c2d12",
          foreground: "#ffffff",
          primary: "#b91c1c",
          "primary-foreground": "#ffffff",
          accent: "#f59e0b",
          "accent-foreground": "#1a1a1a",
          border: "#7c2d12",
          ring: "#b91c1c",
        },
      },

      /* ---------------------------------
         Radius
      ---------------------------------- */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ---------------------------------
         Shadows (Spice Glow)
      ---------------------------------- */
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
        card: "0 6px 20px rgba(185,28,28,0.18)",
        elevated: "0 12px 30px rgba(185,28,28,0.25)",
        glow: "0 0 30px rgba(245,158,11,0.45)",
      },

      /* ---------------------------------
         Background Gradients (KEY FIX)
      ---------------------------------- */
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #7c2d12 0%, #991b1b 45%, #b45309 100%)",

        "gradient-gold":
          "linear-gradient(135deg, #b91c1c 0%, #f59e0b 100%)",

        "gradient-warm":
          "linear-gradient(180deg, #fffbf5 0%, #fdebd3 100%)",
      },

      /* ---------------------------------
         Animations
      ---------------------------------- */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;

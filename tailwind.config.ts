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
         BRAND COLOR SYSTEM
      ---------------------------------- */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* PRIMARY BRAND COLORS */
        primary: {
          DEFAULT: "#36a3ce",              // LIGHT BLUE
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e4a95c",              // GOLD ACCENT
          foreground: "#1a1a1a",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* CTA + FOOTER BACKGROUND */
        chocolate: {
          DEFAULT: "#0b6b89",              // DARK BLUE
          light: "#36a3ce",                // Lighter blue for UI
        },

        /* GOLD TEXT / HIGHLIGHTS */
        golden: {
          DEFAULT: "#e4a95c",
          glow: "#f1c67c",
        },

        /* LIGHT NEUTRAL TEXT */
        cream: {
          DEFAULT: "#f7efe6",
          dark: "#e7d9c8",
        },

        "warm-white": "#fbf8f3",

        /* SIDEBAR COLORS */
        sidebar: {
          DEFAULT: "#0b6b89",
          foreground: "#ffffff",
          primary: "#36a3ce",
          "primary-foreground": "#ffffff",
          accent: "#e4a95c",
          "accent-foreground": "#1a1a1a",
          border: "#0b6b89",
          ring: "#36a3ce",
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
         Shadows
      ---------------------------------- */
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
        card: "0 4px 14px rgba(0,0,0,0.12)",
        elevated: "0 8px 18px rgba(0,0,0,0.15)",
        glow: "0 0 20px rgba(228,169,92,0.4)", // gold glow
      },

      /* ---------------------------------
         Background Gradients
      ---------------------------------- */
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #36a3ce, #0b6b89)",
        "gradient-gold": "linear-gradient(135deg, #e4a95c, #f1c67c)",
        "gradient-warm": "linear-gradient(135deg, #f7efe6, #e7d9c8)",
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

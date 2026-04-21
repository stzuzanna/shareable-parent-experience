module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brandblueb-400": "var(--brandblueb-400)",
        "brandneutralsn-0": "var(--brandneutralsn-0)",
        "brandneutralsn-200": "var(--brandneutralsn-200)",
        "brandneutralsn-25": "var(--brandneutralsn-25)",
        "brandneutralsn-400": "var(--brandneutralsn-400)",
        "brandneutralsn-500": "var(--brandneutralsn-500)",
        "brandneutralsn-75": "var(--brandneutralsn-75)",
        error: "var(--error)",
        "famly-ui-backgroundspure-white":
          "var(--famly-ui-backgroundspure-white)",
        "famly-ui-neutralt80": "var(--famly-ui-neutralt80)",
        highlightred: "var(--highlightred)",
        "mfneutralsn-0": "var(--mfneutralsn-0)",
        "mfneutralsn-200": "var(--mfneutralsn-200)",
        "mfneutralsn-300": "var(--mfneutralsn-300)",
        "mfneutralsn-400": "var(--mfneutralsn-400)",
        "mfneutralsn-50": "var(--mfneutralsn-50)",
        "mfneutralsn-500": "var(--mfneutralsn-500)",
        "mforangeo-400": "var(--mforangeo-400)",
        "mfprimaryp-100": "var(--mfprimaryp-100)",
        "mfprimaryp-400": "var(--mfprimaryp-400)",
        "mfredr-400": "var(--mfredr-400)",
        "mfyellowy-100": "var(--mfyellowy-100)",
        "mfyellowy-400": "var(--mfyellowy-400)",
        "modern-famlyneutraln0": "var(--modern-famlyneutraln0)",
        "modern-famlyneutralsn75": "var(--modern-famlyneutralsn75)",
        "text-primary": "var(--text-primary)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
      },
      fontFamily: {
        "MF-body-text-body-emphasis":
          "var(--MF-body-text-body-emphasis-font-family)",
        "MF-body-text-body-small": "var(--MF-body-text-body-small-font-family)",
        "MF-body-text-body-small-emphasis":
          "var(--MF-body-text-body-small-emphasis-font-family)",
        "MF-body-text-micro-text": "var(--MF-body-text-micro-text-font-family)",
        "MF-headings-h4": "var(--MF-headings-h4-font-family)",
        "MF-headings-h6-emphasis": "var(--MF-headings-h6-emphasis-font-family)",
        "modern-famly-body-text-body":
          "var(--modern-famly-body-text-body-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        "elevation-elevation-1": "var(--elevation-elevation-1)",
        "elevation-elevation-4": "var(--elevation-elevation-4)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};

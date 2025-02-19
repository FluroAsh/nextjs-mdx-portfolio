import theme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        header: "var(--header-height)",
      },
      fontFamily: {
        firaSans: ["var(--font-fira-sans)", ...theme.fontFamily.sans],
        catamaran: ["var(--font-catamaran)", ...theme.fontFamily.sans],
        ...theme.fontFamily,
      },
      animation: {
        "rotate-conic-border":
          "conic-gradient 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "80ch", // 80 characters by default
            pre: false,
            figcaption: false,
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Theme Colors
        primary: "#BFE81C",
        secondary: "#B0C84E",
        white: "#FEFEFE",
        grey: "#AFAFAF",
        "grey-dark": "#454545",
      },
    },
  },
  plugins: [tailwindTypography],
} satisfies Config;

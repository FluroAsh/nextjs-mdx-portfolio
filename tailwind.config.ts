import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "80ch", // 80 characters by default
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
    boxShadow: {
      pre: "rgba(0, 0, 0, 0.5) -0.38px -0.5px 2px 0px, rgba(0, 0, 0, 0.1) 0.5px 0px 2px -1px",
    },
  },
  plugins: [tailwindTypography],
} satisfies Config;

// `core-web-vitals` already bundles the `next/typescript` config, so pulling in
// `eslint-config-next/typescript` as well would register the rules twice and
// report every problem twice over.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", ".contentlayer/**", ".claude/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;

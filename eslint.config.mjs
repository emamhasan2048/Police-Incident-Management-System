import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "next-env.d.ts"],
  },
  {
    files: [
      "config/**/*.js",
      "controllers/**/*.js",
      "middleware/**/*.js",
      "models/**/*.js",
      "routes/**/*.js",
      "server.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["public/js/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;

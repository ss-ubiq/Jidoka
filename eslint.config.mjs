// ESLint 9 flat config. eslint-config-next 15 still ships eslintrc-style configs,
// so FlatCompat bridges them; drop the bridge when that package goes flat-native.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  {
    // public/ holds two generated configurator pages (one is 9.4 MB) and 2,416
    // content-hashed images. Nothing in there is hand-written, so nothing is linted.
    ignores: [".next/**", "out/**", "build/**", "public/**", "next-env.d.ts", "coverage/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;

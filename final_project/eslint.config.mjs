import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended", eslintConfigPrettier],
    languageOptions: { globals: globals.browser },
    ignores: ["eslint.config.mjs", "package*.json"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    ignores: ["eslint.config.mjs", "package*.json"],
  },
]);

// @ts-check

import js from "@eslint/js";
// @ts-expect-error 型定義がないため
import { flatConfig as nextFlatConfig } from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import functionalPlugin from "eslint-plugin-functional";
// @ts-expect-error 型定義がないため
import importPlugin from "eslint-plugin-import";
// @ts-expect-error 型定義がないため
import jsxA11y from "eslint-plugin-jsx-a11y";
import storybook from "eslint-plugin-storybook";
// @ts-expect-error 型定義がないため
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: ["dist", "node_modules", "/out", "/.next"],
  },
  js.configs.recommended,
  nextFlatConfig.coreWebVitals,
  importPlugin.flatConfigs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.eslintRecommended,
  functionalPlugin.configs.noMutations,
  tailwind.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
  storybook.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },

    rules: {
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "index", "sibling", "object"],
          ],

          pathGroups: [
            {
              pattern: "*.css",

              patternOptions: {
                matchBase: true,
              },

              group: "unknown",
              position: "after",
            },
          ],

          "newlines-between": "always",

          alphabetize: {
            order: "asc",
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "import/named": 0,
      "import/no-unresolved": 0,
      "no-undef": 0,
      "no-unused-vars": 0,
      "no-var": 2,
      "object-shorthand": 2,
      "compat/compat": 0,
      "functional/prefer-immutable-types": 0,
      "functional/type-declaration-immutability": 0,
      "tailwindcss/classnames-order": [
        "error",
        {
          callees: ["classNames", "classnames"],
        },
      ],
    },
  },
);

module.exports = {
  root: true,
  ignorePatterns: ["/out", "/.next", "/node_modules"],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
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
            patternOptions: { matchBase: true },
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
    "import/named": 0,
    "import/no-unresolved": 0,
    "no-undef": 0,
    "no-unused-vars": 0,
    "no-var": 2,
    "compat/compat": 0,
  },
};

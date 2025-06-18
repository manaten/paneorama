export default {
  "*": "prettier --write --ignore-unknown",
  "*.{js,jsx,ts,tsx,mjs,vue}": "eslint --fix",
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
};

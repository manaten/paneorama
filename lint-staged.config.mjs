export default {
  "*": "prettier --write --ignore-unknown",
  "*.{js,jsx,ts,tsx,mjs}": "eslint --fix",
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
};

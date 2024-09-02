export default {
  "*": "prettier --write --ignore-unknown",
  "*.{cmd,html,json,md,sh,txt,xml,yml}": "eclint fix",
  "*.{js,jsx,ts,tsx,mjs,vue}": "eslint --fix",
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
};

import path from "path";

export default {
  "*": "prettier --write --ignore-unknown",
  "*.{js,jsx,ts,tsx,mjs}": (files) => [
    // @see https://github.com/lint-staged/lint-staged#integrate-with-nextjs
    `next lint --fix --file ${files.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`,
  ],
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
};

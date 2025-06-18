import type { StorybookConfig } from "@storybook/nextjs";

/* eslint functional/immutable-data:off */
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-onboarding"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    // see https://react-svgr.com/docs/next/
    const fileLoaderRule = config.module?.rules?.find(
      (rule) =>
        typeof rule === "object" &&
        rule?.test instanceof RegExp &&
        rule?.test?.test?.(".svg"),
    );

    if (typeof fileLoaderRule === "object" && fileLoaderRule) {
      config.module?.rules?.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          use: ["@svgr/webpack"],
        },
      );
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};
export default config;

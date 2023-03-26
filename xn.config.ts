import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  compile: "babel",
  cssMinify: "parcelCss",
  jsMinify: "esbuild",
  splitChunks: false,
  cache: true,
  webpackChain(config) {
    config.output.filename("content.js");
    config.devtool("eval");
    return config;
  },
});

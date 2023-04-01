import { defineConfig } from "father";

export default defineConfig({
  umd: {
    entry: {
      "src/background": {},
      "src/yapi": {},
      "src/domain": {},
    },
    output: "dist",
  },
  prebundle: {
    deps: [
      "react",
      "react-dom",
      "react-router-dom",
      "swr",
      "styled-components",
    ],
  },
});

// @ts-check
import { defineConfig } from "astro/config";
import { remarkTactic } from "./src/lib/tactic/plugin.ts";

export default defineConfig({
  site: "https://colchonero.cafe",
  trailingSlash: "never",
  build: { format: "directory" },
  markdown: {
    remarkPlugins: [remarkTactic],
  },
});
